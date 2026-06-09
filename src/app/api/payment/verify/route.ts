import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// Coin packages configuration (matches payment page)
const COIN_PACKAGES = [
  { id: 'starter', coins: 1500, price: 11 },
  { id: 'basic', coins: 2500, price: 22, bonus: 100 },
  { id: 'popular', coins: 3600, price: 33, bonus: 300 },
  { id: 'premium', coins: 4700, price: 44, bonus: 500 },
  { id: 'pro', coins: 5800, price: 55, bonus: 800 },
  { id: 'elite', coins: 9300, price: 88, bonus: 1500 },
  { id: 'mega', coins: 22000, price: 200, bonus: 4000 },
];

/**
 * Send Discord webhook notification for purchase
 */
async function sendDiscordNotification(purchaseData: {
  userId: string;
  userEmail: string | null;
  coins: number;
  timestamp: Date;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('⚠️ Discord webhook URL not configured, skipping notification');
    return;
  }

  try {
    // Get admin IDs for mentions (similar to Discord bot project)
    const adminIds = process.env.DISCORD_ADMIN_IDS?.split(',').map(id => id.trim()).filter(id => id) || [];
    const mentions = adminIds.length > 0 
      ? adminIds.map(id => `<@${id}>`).join(' ') 
      : '';
    
    // Create Discord embed with simplified format
    const embed = {
      title: '🛒 New Purchase',
      description: 'A new coin purchase has been completed!',
      color: 0x7B68EE, // Purple color
      fields: [
        {
          name: 'Service',
          value: 'Website',
          inline: false
        },
        {
          name: 'User ID',
          value: purchaseData.userId,
          inline: false
        },
        {
          name: 'User Email',
          value: purchaseData.userEmail || 'N/A',
          inline: false
        },
        {
          name: 'Description',
          value: `${purchaseData.coins} Coins Package`,
          inline: false
        }
      ],
      timestamp: purchaseData.timestamp.toISOString(),
      footer: {
        text: 'Scythcode Payment System'
      }
    };

    // Send to Discord webhook with admin mentions
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: mentions || undefined, // Ping admins if configured
        embeds: [embed]
      })
    });

    if (response.ok) {
      console.log('✅ Discord notification sent successfully' + (mentions ? ' with admin pings' : ''));
    } else {
      console.error('❌ Failed to send Discord notification:', response.status, await response.text());
    }
  } catch (error: any) {
    console.error('❌ Error sending Discord notification:', error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      coins,
      packageId,
      userEmail,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !coins) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Calculate amount based on coins
    const pkg = COIN_PACKAGES.find(p => p.coins === coins);
    const amount = pkg?.price || 0;

    // Payment verified - Update user coins in Firestore
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // User exists - increment coins
      await userRef.update({
        coins: FieldValue.increment(coins),
        updated_at: FieldValue.serverTimestamp(),
      });
    } else {
      // User doesn't exist - create with coins
      await userRef.set({
        coins: coins,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
      });
    }

    // Log transaction
    const transactionData = {
      user_id: userId,
      user_email: userEmail || null,
      type: 'coin_purchase',
      coins: coins,
      amount: amount,
      package_id: packageId || null,
      razorpay_order_id,
      razorpay_payment_id,
      status: 'completed',
      created_at: FieldValue.serverTimestamp(),
    };

    await adminDb.collection('transactions').add(transactionData);

    // Send Discord notification
    await sendDiscordNotification({
      userId,
      userEmail: userEmail || null,
      coins,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and coins added',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

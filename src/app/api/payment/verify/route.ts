import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { CodeGenerator } from '@/lib/codeGenerator';

const codeGenerator = new CodeGenerator();

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

    // Generate redemption code
    const redemptionCode = codeGenerator.generateCode();
    
    // Calculate expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save redemption code to Firebase
    await adminDb.collection('redemption_codes').add({
      code: redemptionCode,
      coins: coins,
      packageId: packageId || null,
      razorpay_order_id,
      razorpay_payment_id,
      user_email: userEmail || null,
      firebase_user_id: userId,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: expiresAt,
      isRedeemed: false,
      redeemedBy: null,
      redeemedAt: null,
      paymentProcessor: 'razorpay',
      paymentMethod: 'website',
      status: 'completed',
      verifiedAt: FieldValue.serverTimestamp(),
      source: 'website'
    });

    // Send Discord notification
    await sendDiscordNotification({
      userId,
      userEmail: userEmail || null,
      coins,
      redemptionCode,
      timestamp: new Date(),
    });

    // Send email with redemption code
    await sendRedemptionEmail({
      to: userEmail || '',
      username: userEmail?.split('@')[0] || 'User',
      userId,
      redemptionCode,
      coins,
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and redemption code generated',
      redemptionCode,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

/**
 * Send Discord webhook notification for purchase
 */
async function sendDiscordNotification(purchaseData: {
  userId: string;
  userEmail: string | null;
  coins: number;
  redemptionCode: string;
  timestamp: Date;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('⚠️ Discord webhook URL not configured, skipping notification');
    return;
  }

  try {
    const adminIds = process.env.DISCORD_ADMIN_IDS?.split(',').map(id => id.trim()).filter(id => id) || [];
    const mentions = adminIds.length > 0 ? adminIds.map(id => `<@${id}>`).join(' ') : '';
    
    const embed = {
      title: '🛒 New Purchase',
      description: 'A new coin purchase has been completed!',
      color: 0x7B68EE,
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
        },
        {
          name: 'Redemption Code',
          value: `\`${purchaseData.redemptionCode}\``,
          inline: false
        }
      ],
      timestamp: purchaseData.timestamp.toISOString(),
      footer: {
        text: 'Scythcode Payment System'
      }
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: mentions || undefined,
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

/**
 * Send redemption code via email
 */
async function sendRedemptionEmail(data: {
  to: string;
  username: string;
  userId: string;
  redemptionCode: string;
  coins: number;
  expiresAt: Date;
}) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Scythcode <noreply@scythcode.in>',
        to: [data.to],
        subject: 'Your Scythcode Purchase Confirmation',
        html: generateRedemptionCodeEmail(data),
      }),
    });

    if (response.ok) {
      console.log('✅ Redemption email sent to:', data.to);
    } else {
      console.error('❌ Failed to send email:', await response.text());
    }
  } catch (error: any) {
    console.error('❌ Error sending email:', error.message);
  }
}

function generateRedemptionCodeEmail(data: {
  username: string;
  userId: string;
  redemptionCode: string;
  coins: number;
  expiresAt: Date;
}) {
  const expirationDate = data.expiresAt.toLocaleDateString();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Scythcode Purchase</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .code-box { background: #fff; border: 2px dashed #0EA5E9; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
    .code { font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #0EA5E9; letter-spacing: 2px; }
    .info-box { background: #e8f4fd; border-left: 4px solid #0EA5E9; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏪 Scythcode</h1>
      <h2>Purchase Confirmation</h2>
    </div>
    <div class="content">
      <h3>Thank you for your purchase, ${data.username}!</h3>
      <p>Your payment has been successfully processed. Here are your purchase details:</p>
      
      <div class="info-box">
        <strong>📦 Purchase Details:</strong><br>
        • Coins: <strong>${data.coins}</strong><br>
        • Purchase Date: <strong>${new Date().toLocaleDateString()}</strong>
      </div>

      <div class="code-box">
        <h3>🎫 Your Redemption Code</h3>
        <div class="code">${data.redemptionCode}</div>
        <p><small>Keep this code safe! You'll need it to redeem your coins.</small></p>
      </div>

      <div class="info-box">
        <strong>⚠️ Important Information:</strong><br>
        • This code expires on: <strong>${expirationDate}</strong><br>
        • Use your code before it expires<br>
        • Each code can only be used once<br>
        • Contact support if you have any issues
      </div>

      <h3>How to Redeem Your Code:</h3>
      <ol>
        <li>Go to the Scythcode website</li>
        <li>Navigate to your dashboard</li>
        <li>Enter your redemption code: <code>${data.redemptionCode}</code></li>
        <li>Your ${data.coins} coins will be added to your account</li>
      </ol>

      <p>If you have any questions or need assistance, please contact our support team.</p>
    </div>
    <div class="footer">
      <p>This email was sent automatically by the Scythcode system.<br>
      Please do not reply to this email.</p>
      <p>&copy; ${new Date().getFullYear()} Scythcode. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
}

export const dynamic = 'force-dynamic';


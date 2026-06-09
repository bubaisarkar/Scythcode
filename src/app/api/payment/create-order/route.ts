import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, packageId, coins, userId, userEmail } = body;

    if (!amount || !currency || !packageId || !coins || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Razorpay credentials are set
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('Razorpay credentials not configured:', {
        keyIdExists: !!keyId,
        keySecretExists: !!keySecret,
        mode: process.env.RAZORPAY_MODE,
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment gateway not configured. Please contact support.' 
        },
        { status: 500 }
      );
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Create order
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency,
      receipt: `order_${packageId}_${Date.now()}`,
      notes: {
        packageId,
        coins,
        userId,
        userEmail,
      },
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

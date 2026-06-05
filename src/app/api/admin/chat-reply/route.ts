import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = 'K9#bV2!mQ8*zL5@xP1^rT';

/**
 * POST /api/admin/chat-reply
 * Admin endpoint to reply to live chat messages
 * Sends reply to Discord webhook
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Admin Chat Reply API Called ===');

    const body = await request.json();

    // Check password
    if (body.password !== ADMIN_PASSWORD) {
      console.log('❌ Invalid password attempt');
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid password',
        },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!body.userEmail || !body.replyMessage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing fields',
          message: 'User email and reply message are required',
        },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('Discord webhook URL not configured');
      return NextResponse.json(
        { success: false, message: 'Configuration error' },
        { status: 500 }
      );
    }

    // Create embed for admin reply
    const embed = {
      title: '💬 Admin Reply Sent',
      description: body.replyMessage,
      color: 0x10b981, // Green
      fields: [
        { name: '📧 To', value: body.userEmail, inline: true },
        { name: '👤 From', value: body.adminName || 'Admin', inline: true },
      ],
      footer: { text: 'Medusa Web Services - Admin Reply' },
      timestamp: new Date().toISOString(),
    };

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [embed],
        username: 'Admin Reply Bot',
      }),
    });

    if (!discordResponse.ok) {
      console.error('Discord webhook failed:', discordResponse.status);
      return NextResponse.json(
        { success: false, message: 'Failed to send reply' },
        { status: 500 }
      );
    }

    console.log('✅ Admin reply sent to Discord');

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully! User will be notified via email.',
    });
  } catch (error) {
    console.error('Admin chat reply error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/chat-reply
 * Returns API information
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'Admin Chat Reply API',
      methods: ['POST'],
      version: '1.0.0',
      note: 'Password required for access',
    },
    { status: 200 }
  );
}

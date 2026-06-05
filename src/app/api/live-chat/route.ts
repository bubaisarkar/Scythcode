import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Live Chat API Called ===');

    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Check rate limit (10 messages per 5 minutes)
    if (isRateLimited(ip, 10, 5 * 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many messages. Please slow down.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    console.log('Live chat data:', body);

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('Discord webhook URL not configured');
      return NextResponse.json(
        { success: false, message: 'Configuration error' },
        { status: 500 }
      );
    }

    let embed;

    if (body.type === 'user_joined') {
      // User joined the chat
      embed = {
        title: '👋 New User Joined Live Chat',
        description: `**${body.userName}** has started a live chat session`,
        color: 0x10b981, // Green
        fields: [
          { name: '👤 Name', value: body.userName, inline: true },
          { name: '📧 Email', value: body.userEmail, inline: true },
        ],
        footer: { text: 'Medusa Web Services - Live Chat' },
        timestamp: new Date().toISOString(),
      };
    } else if (body.type === 'message') {
      // User sent a message
      embed = {
        title: '💬 New Live Chat Message',
        description: body.message,
        color: 0x3b82f6, // Blue
        fields: [
          { name: '👤 From', value: body.userName, inline: true },
          { name: '📧 Email', value: body.userEmail, inline: true },
        ],
        footer: { text: 'Medusa Web Services - Live Chat' },
        timestamp: new Date().toISOString(),
      };
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid message type' },
        { status: 400 }
      );
    }

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [embed],
        username: 'Live Chat Bot',
      }),
    });

    if (!discordResponse.ok) {
      console.error('Discord webhook failed:', discordResponse.status);
      return NextResponse.json(
        { success: false, message: 'Failed to send message' },
        { status: 500 }
      );
    }

    console.log('✅ Live chat message sent to Discord');

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    console.error('Live chat error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}

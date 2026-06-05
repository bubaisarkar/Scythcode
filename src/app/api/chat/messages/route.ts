import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for chat messages (use Redis/Database in production)
const chatSessions: Map<string, any[]> = new Map();

/**
 * GET /api/chat/messages?sessionId=xxx
 * Get all messages for a chat session
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      );
    }

    const messages = chatSessions.get(sessionId) || [];

    return NextResponse.json({
      success: true,
      messages,
      sessionId,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/messages
 * Send a message to a chat session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message, sender, senderType } = body;

    if (!sessionId || !message || !sender || !senderType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create session
    if (!chatSessions.has(sessionId)) {
      chatSessions.set(sessionId, []);
    }

    const messages = chatSessions.get(sessionId)!;

    // Add new message
    const newMessage = {
      id: Date.now().toString(),
      message,
      sender,
      senderType, // 'user' | 'admin' | 'system'
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    // Send to Discord webhook for logging
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl && senderType !== 'system') {
      const embed = {
        title: senderType === 'admin' ? '👨‍💼 Admin Message' : '👤 User Message',
        description: message,
        color: senderType === 'admin' ? 0x10b981 : 0x3b82f6,
        fields: [
          { name: 'From', value: sender, inline: true },
          { name: 'Session', value: sessionId.substring(0, 8), inline: true },
        ],
        timestamp: new Date().toISOString(),
      };

      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [embed],
          username: 'Live Chat',
        }),
      }).catch(err => console.error('Discord webhook error:', err));
    }

    return NextResponse.json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

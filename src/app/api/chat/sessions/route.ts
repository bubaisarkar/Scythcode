import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for active sessions (use Redis/Database in production)
const activeSessions: Map<string, any> = new Map();

/**
 * GET /api/chat/sessions
 * Get all active chat sessions (for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    // Check admin password
    if (password !== 'K9#bV2!mQ8*zL5@xP1^rT') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessions = Array.from(activeSessions.values());

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get sessions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/sessions
 * Create a new chat session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, userEmail } = body;

    if (!userName || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'Name and email required' },
        { status: 400 }
      );
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session = {
      sessionId,
      userName,
      userEmail,
      startedAt: new Date().toISOString(),
      status: 'active',
      participants: [
        { name: userName, type: 'user', joinedAt: new Date().toISOString() }
      ],
    };

    activeSessions.set(sessionId, session);

    // Send to Discord
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      const embed = {
        title: '🟢 New Chat Session Started',
        color: 0x10b981,
        fields: [
          { name: '👤 User', value: userName, inline: true },
          { name: '📧 Email', value: userEmail, inline: true },
          { name: '🆔 Session ID', value: sessionId.substring(0, 16), inline: false },
        ],
        footer: { text: 'Join this chat from admin panel' },
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
      session,
    });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/chat/sessions
 * Join a chat session (for admin)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, adminName, password } = body;

    // Check admin password
    if (password !== 'K9#bV2!mQ8*zL5@xP1^rT') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!sessionId || !adminName) {
      return NextResponse.json(
        { success: false, error: 'Session ID and admin name required' },
        { status: 400 }
      );
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Add admin to participants
    session.participants.push({
      name: adminName,
      type: 'admin',
      joinedAt: new Date().toISOString(),
    });

    activeSessions.set(sessionId, session);

    return NextResponse.json({
      success: true,
      session,
      message: `${adminName} joined the chat`,
    });
  } catch (error) {
    console.error('Join session error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to join session' },
      { status: 500 }
    );
  }
}

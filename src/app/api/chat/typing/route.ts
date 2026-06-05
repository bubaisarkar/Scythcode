import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for typing status (use Redis in production)
const typingStatus: Map<string, { userName: string; userType: string; timestamp: number }> = new Map();

// Clean up old typing statuses (older than 5 seconds)
const cleanupOldTyping = () => {
  const now = Date.now();
  for (const [key, value] of typingStatus.entries()) {
    if (now - value.timestamp > 5000) {
      typingStatus.delete(key);
    }
  }
};

/**
 * GET /api/chat/typing?sessionId=xxx
 * Get typing status for a session
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

    cleanupOldTyping();

    const typing = typingStatus.get(sessionId);

    return NextResponse.json({
      success: true,
      isTyping: !!typing,
      typingUser: typing || null,
    });
  } catch (error) {
    console.error('Get typing status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get typing status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/typing
 * Update typing status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userName, userType, isTyping } = body;

    if (!sessionId || !userName || !userType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (isTyping) {
      typingStatus.set(sessionId, {
        userName,
        userType,
        timestamp: Date.now(),
      });
    } else {
      typingStatus.delete(sessionId);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Update typing status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update typing status' },
      { status: 500 }
    );
  }
}

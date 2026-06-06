import { NextRequest, NextResponse } from 'next/server';
import { ticketDbAdmin } from '@/lib/ticketDbAdmin';

// GET - Fetch messages for a ticket
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const messages = await ticketDbAdmin.getMessages(ticketId);

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Add message to ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, senderType, senderName, senderEmail, message } = body;

    if (!ticketId || !senderType || !senderName || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await ticketDbAdmin.addMessage({
      ticketId,
      senderType,
      senderName,
      senderEmail,
      message,
    });

    return NextResponse.json({
      success: true,
      message: { id: result.id },
    });
  } catch (error: any) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

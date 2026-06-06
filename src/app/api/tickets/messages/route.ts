import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/ticketDb';

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

    const messages = db.prepare(`
      SELECT * FROM ticket_messages 
      WHERE ticket_id = ? 
      ORDER BY created_at ASC
    `).all(ticketId);

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

    // Insert message
    const insertMessage = db.prepare(`
      INSERT INTO ticket_messages (ticket_id, sender_type, sender_name, sender_email, message)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insertMessage.run(ticketId, senderType, senderName, senderEmail, message);

    // Update ticket updated_at timestamp
    db.prepare('UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(ticketId);

    // Fetch the created message
    const createdMessage = db.prepare('SELECT * FROM ticket_messages WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json({
      success: true,
      message: createdMessage,
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

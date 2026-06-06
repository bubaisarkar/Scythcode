import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/ticketDb';

// Generate unique ticket number
function generateTicketNumber(): string {
  const prefix = 'SCT';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

// GET - Fetch tickets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const ticketNumber = searchParams.get('ticketNumber');
    const status = searchParams.get('status');
    const isAdmin = searchParams.get('admin') === 'true';

    let query = 'SELECT * FROM tickets';
    let params: any[] = [];
    let conditions: string[] = [];

    if (ticketNumber) {
      conditions.push('ticket_number = ?');
      params.push(ticketNumber);
    } else if (userId && !isAdmin) {
      conditions.push('user_id = ?');
      params.push(userId);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const tickets = db.prepare(query).all(...params);

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userEmail, userName, subject, category, priority, message } = body;

    if (!userId || !userEmail || !userName || !subject || !category || !priority || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ticketNumber = generateTicketNumber();

    // Create ticket
    const insertTicket = db.prepare(`
      INSERT INTO tickets (ticket_number, user_id, user_email, user_name, subject, category, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'open')
    `);

    const result = insertTicket.run(ticketNumber, userId, userEmail, userName, subject, category, priority);
    const ticketId = result.lastInsertRowid;

    // Add initial message
    const insertMessage = db.prepare(`
      INSERT INTO ticket_messages (ticket_id, sender_type, sender_name, sender_email, message)
      VALUES (?, 'user', ?, ?, ?)
    `);

    insertMessage.run(ticketId, userName, userEmail, message);

    // Fetch the created ticket
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Ticket created successfully',
    });
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update ticket status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, status, closedBy } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let query = 'UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP';
    const params: any[] = [status];

    if (status === 'closed') {
      query += ', closed_at = CURRENT_TIMESTAMP';
    }

    query += ' WHERE id = ?';
    params.push(ticketId);

    db.prepare(query).run(...params);

    // Add system message
    if (closedBy) {
      const insertMessage = db.prepare(`
        INSERT INTO ticket_messages (ticket_id, sender_type, sender_name, message)
        VALUES (?, 'system', 'System', ?)
      `);
      insertMessage.run(ticketId, `Ticket ${status} by ${closedBy}`);
    }

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

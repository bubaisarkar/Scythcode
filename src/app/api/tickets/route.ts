import { NextRequest, NextResponse } from 'next/server';
import { ticketDbAdmin } from '@/lib/ticketDbAdmin';

// GET - Fetch tickets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const ticketNumber = searchParams.get('ticketNumber');
    const status = searchParams.get('status');
    const isAdmin = searchParams.get('admin') === 'true';

    const filters: any = {};

    if (ticketNumber) {
      filters.ticketNumber = ticketNumber;
    } else if (userId && !isAdmin) {
      filters.userId = userId;
    }

    if (status) {
      filters.status = status;
    }

    const tickets = await ticketDbAdmin.getTickets(filters);

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

    const result = await ticketDbAdmin.createTicket({
      userId,
      userEmail,
      userName,
      subject,
      category,
      priority,
      initialMessage: message,
    });

    const ticket = await ticketDbAdmin.getTicketById(result.id);

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

    const ticket = await ticketDbAdmin.updateTicketStatus(ticketId, status, closedBy);

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

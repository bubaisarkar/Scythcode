// Ticket Database using Firebase Admin SDK (Server-side only - bypasses security rules)
import { adminDb } from './firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// Collections
const TICKETS_COLLECTION = 'tickets';
const MESSAGES_COLLECTION = 'ticket_messages';

// Generate unique ticket number
export function generateTicketNumber(): string {
  const prefix = 'SCT';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

// Ticket operations using Admin SDK
export const ticketDbAdmin = {
  // Create a new ticket
  async createTicket(ticketData: {
    userId: string;
    userEmail: string;
    userName: string;
    subject: string;
    category: string;
    priority: string;
    initialMessage: string;
  }) {
    const ticketNumber = generateTicketNumber();
    
    const ticketRef = await adminDb.collection(TICKETS_COLLECTION).add({
      ticket_number: ticketNumber,
      user_id: ticketData.userId,
      user_email: ticketData.userEmail,
      user_name: ticketData.userName,
      subject: ticketData.subject,
      category: ticketData.category,
      priority: ticketData.priority,
      status: 'open',
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
      closed_at: null,
    });

    // Add initial message
    await adminDb.collection(MESSAGES_COLLECTION).add({
      ticket_id: ticketRef.id,
      sender_type: 'user',
      sender_name: ticketData.userName,
      sender_email: ticketData.userEmail,
      message: ticketData.initialMessage,
      created_at: FieldValue.serverTimestamp(),
    });

    return { id: ticketRef.id, ticket_number: ticketNumber };
  },

  // Get all tickets (with optional filters)
  async getTickets(filters?: {
    userId?: string;
    status?: string;
    ticketNumber?: string;
  }) {
    let query: any = adminDb.collection(TICKETS_COLLECTION).orderBy('created_at', 'desc');

    if (filters?.userId) {
      query = adminDb.collection(TICKETS_COLLECTION)
        .where('user_id', '==', filters.userId)
        .orderBy('created_at', 'desc');
    }

    if (filters?.status && filters?.userId) {
      query = adminDb.collection(TICKETS_COLLECTION)
        .where('user_id', '==', filters.userId)
        .where('status', '==', filters.status)
        .orderBy('created_at', 'desc');
    } else if (filters?.status) {
      query = adminDb.collection(TICKETS_COLLECTION)
        .where('status', '==', filters.status)
        .orderBy('created_at', 'desc');
    }

    if (filters?.ticketNumber) {
      query = adminDb.collection(TICKETS_COLLECTION)
        .where('ticket_number', '==', filters.ticketNumber);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      closed_at: doc.data().closed_at?.toDate?.()?.toISOString() || null,
    }));
  },

  // Get a single ticket by ID
  async getTicketById(ticketId: string) {
    const docRef = adminDb.collection(TICKETS_COLLECTION).doc(ticketId);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      created_at: data?.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: data?.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      closed_at: data?.closed_at?.toDate?.()?.toISOString() || null,
    };
  },

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: string, closedBy?: string) {
    const docRef = adminDb.collection(TICKETS_COLLECTION).doc(ticketId);
    
    const updateData: any = {
      status,
      updated_at: FieldValue.serverTimestamp(),
    };

    if (status === 'closed') {
      updateData.closed_at = FieldValue.serverTimestamp();
    }

    await docRef.update(updateData);

    // Add system message
    if (closedBy) {
      await adminDb.collection(MESSAGES_COLLECTION).add({
        ticket_id: ticketId,
        sender_type: 'system',
        sender_name: 'System',
        message: `Ticket ${status} by ${closedBy}`,
        created_at: FieldValue.serverTimestamp(),
      });
    }

    return await this.getTicketById(ticketId);
  },

  // Get messages for a ticket
  async getMessages(ticketId: string) {
    const snapshot = await adminDb.collection(MESSAGES_COLLECTION)
      .where('ticket_id', '==', ticketId)
      .orderBy('created_at', 'asc')
      .get();

    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
  },

  // Add a message to a ticket
  async addMessage(messageData: {
    ticketId: string;
    senderType: string;
    senderName: string;
    senderEmail?: string;
    message: string;
  }) {
    const messageRef = await adminDb.collection(MESSAGES_COLLECTION).add({
      ticket_id: messageData.ticketId,
      sender_type: messageData.senderType,
      sender_name: messageData.senderName,
      sender_email: messageData.senderEmail || null,
      message: messageData.message,
      created_at: FieldValue.serverTimestamp(),
    });

    // Update ticket's updated_at timestamp
    const ticketRef = adminDb.collection(TICKETS_COLLECTION).doc(messageData.ticketId);
    await ticketRef.update({
      updated_at: FieldValue.serverTimestamp(),
    });

    return { id: messageRef.id };
  },
};

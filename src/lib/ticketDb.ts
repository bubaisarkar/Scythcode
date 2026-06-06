// Ticket Database using Firebase Firestore (Vercel-compatible)
import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

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

// Ticket operations
export const ticketDb = {
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
    
    const ticketRef = await addDoc(collection(db, TICKETS_COLLECTION), {
      ticket_number: ticketNumber,
      user_id: ticketData.userId,
      user_email: ticketData.userEmail,
      user_name: ticketData.userName,
      subject: ticketData.subject,
      category: ticketData.category,
      priority: ticketData.priority,
      status: 'open',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      closed_at: null,
    });

    // Add initial message
    await addDoc(collection(db, MESSAGES_COLLECTION), {
      ticket_id: ticketRef.id,
      sender_type: 'user',
      sender_name: ticketData.userName,
      sender_email: ticketData.userEmail,
      message: ticketData.initialMessage,
      created_at: serverTimestamp(),
    });

    return { id: ticketRef.id, ticket_number: ticketNumber };
  },

  // Get all tickets (with optional filters)
  async getTickets(filters?: {
    userId?: string;
    status?: string;
    ticketNumber?: string;
  }) {
    let q = query(collection(db, TICKETS_COLLECTION), orderBy('created_at', 'desc'));

    if (filters?.userId) {
      q = query(
        collection(db, TICKETS_COLLECTION),
        where('user_id', '==', filters.userId),
        orderBy('created_at', 'desc')
      );
    }

    if (filters?.status) {
      q = query(
        collection(db, TICKETS_COLLECTION),
        where('status', '==', filters.status),
        orderBy('created_at', 'desc')
      );
    }

    if (filters?.ticketNumber) {
      q = query(
        collection(db, TICKETS_COLLECTION),
        where('ticket_number', '==', filters.ticketNumber)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
  },

  // Get a single ticket by ID
  async getTicketById(ticketId: string) {
    const docRef = doc(db, TICKETS_COLLECTION, ticketId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      created_at: docSnap.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: docSnap.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
  },

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: string, closedBy?: string) {
    const docRef = doc(db, TICKETS_COLLECTION, ticketId);
    
    const updateData: any = {
      status,
      updated_at: serverTimestamp(),
    };

    if (status === 'closed') {
      updateData.closed_at = serverTimestamp();
    }

    await updateDoc(docRef, updateData);

    // Add system message
    if (closedBy) {
      await addDoc(collection(db, MESSAGES_COLLECTION), {
        ticket_id: ticketId,
        sender_type: 'system',
        sender_name: 'System',
        message: `Ticket ${status} by ${closedBy}`,
        created_at: serverTimestamp(),
      });
    }

    return await this.getTicketById(ticketId);
  },

  // Get messages for a ticket
  async getMessages(ticketId: string) {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('ticket_id', '==', ticketId),
      orderBy('created_at', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
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
    const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
      ticket_id: messageData.ticketId,
      sender_type: messageData.senderType,
      sender_name: messageData.senderName,
      sender_email: messageData.senderEmail || null,
      message: messageData.message,
      created_at: serverTimestamp(),
    });

    // Update ticket's updated_at timestamp
    const ticketRef = doc(db, TICKETS_COLLECTION, messageData.ticketId);
    await updateDoc(ticketRef, {
      updated_at: serverTimestamp(),
    });

    return { id: messageRef.id };
  },
};

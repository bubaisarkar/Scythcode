// Firebase Admin SDK Configuration (Server-side only)
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
  try {
    // Check if we have the required credentials
    const hasCredentials = process.env.FIREBASE_SERVICE_ACCOUNT || 
      (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);

    if (hasCredentials) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : {
            projectId: process.env.FIREBASE_PROJECT_ID || 'scythcode',
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
            // Handle both \\n and \n in private key
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
          };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        projectId: serviceAccount.projectId,
      });
      
      console.log('✅ Firebase Admin SDK initialized successfully');
    } else {
      // During build time, initialize with minimal config
      console.warn('⚠️ Firebase Admin SDK credentials not found. Using mock initialization for build.');
      admin.initializeApp({
        projectId: 'scythcode',
      });
    }
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization error:', error);
    // Initialize with minimal config to prevent app crashes
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: 'scythcode',
      });
    }
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;

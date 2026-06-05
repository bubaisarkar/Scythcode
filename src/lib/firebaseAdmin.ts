// Firebase Admin SDK Configuration (Server-side only)
import * as admin from 'firebase-admin';
import serviceAccount from '../../scythcode-firebase-adminsdk-fbsvc-ee03affc4a.json';

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: 'scythcode',
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;

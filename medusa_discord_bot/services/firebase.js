const admin = require('firebase-admin');

class FirebaseService {
    constructor() {
        this.db = null;
        this.initialized = false;
        this.initializeFirebase();
    }

    /**
     * Initialize Firebase Admin SDK
     */
    initializeFirebase() {
        try {
            // Check if Firebase is already initialized
            if (admin.apps.length === 0) {
                // Initialize with service account (you'll need to add the service account key)
                const serviceAccount = {
                    type: "service_account",
                    project_id: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
                    private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID || process.env.FIREBASE_PRIVATE_KEY_ID,
                    private_key: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, '\n'),
                    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL,
                    client_id: process.env.FIREBASE_ADMIN_CLIENT_ID || process.env.FIREBASE_CLIENT_ID,
                    auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI || process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
                    token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI || process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token"
                };

                // Only initialize if we have the required credentials
                if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        projectId: serviceAccount.project_id
                    });

                    this.db = admin.firestore();
                    this.initialized = true;
                    console.log('✅ Firebase Admin SDK initialized successfully');
                } else {
                    console.warn('⚠️ Firebase credentials incomplete, using mock mode');
                    console.warn('Missing:', {
                        project_id: !serviceAccount.project_id,
                        private_key: !serviceAccount.private_key,
                        client_email: !serviceAccount.client_email
                    });
                    this.initializeMockMode();
                }
            } else {
                // Use existing Firebase app
                this.db = admin.firestore();
                this.initialized = true;
                console.log('✅ Using existing Firebase Admin SDK instance');
            }
        } catch (error) {
            console.error('❌ Failed to initialize Firebase:', error);
            console.warn('⚠️ Falling back to mock mode');
            this.initializeMockMode();
        }
    }

    /**
     * Initialize mock mode for development/testing
     */
    initializeMockMode() {
        this.mockData = new Map();
        this.initialized = false;
        console.log('🧪 Firebase mock mode initialized');
    }

    /**
     * Save redemption code to Firebase
     */
    async saveRedemptionCode(data) {
        const {
            code,
            coins,
            packageId,
            orderId,
            payerId,
            email,
            amount,
            currency = 'USD',
            userId,
            username,
            captureId,
            expiresAt
        } = data;

        try {
            if (this.initialized && this.db) {
                // Save to Firebase
                const docRef = await this.db.collection('redemption_codes').add({
                    code: code,
                    coins: coins,
                    packageId: packageId,
                    orderID: orderId,
                    payerID: payerId,
                    email: email || null,
                    amount: amount,
                    currency: currency,
                    discordUserId: userId,
                    discordUsername: username,
                    createdAt: admin.firestore.Timestamp.now(),
                    expiresAt: admin.firestore.Timestamp.fromDate(new Date(expiresAt)),
                    isRedeemed: false,
                    paymentProcessor: 'paypal',
                    paymentMethod: 'discord-bot',
                    captureId: captureId,
                    status: 'completed',
                    verifiedAt: admin.firestore.Timestamp.now(),
                    source: 'discord-bot'
                });

                console.log(`✅ Redemption code saved to Firebase: ${docRef.id}`);
                return {
                    success: true,
                    documentId: docRef.id
                };
            } else {
                // Mock mode - save to memory
                const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
                this.mockData.set(mockId, {
                    ...data,
                    createdAt: new Date(),
                    expiresAt: new Date(expiresAt),
                    isRedeemed: false,
                    status: 'completed'
                });

                console.log(`🧪 Redemption code saved to mock storage: ${mockId}`);
                return {
                    success: true,
                    documentId: mockId,
                    mock: true
                };
            }
        } catch (error) {
            console.error('❌ Error saving redemption code:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Check if redemption code exists
     */
    async checkRedemptionCode(code) {
        try {
            if (this.initialized && this.db) {
                const snapshot = await this.db.collection('redemption_codes')
                    .where('code', '==', code)
                    .limit(1)
                    .get();

                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    const data = doc.data();
                    
                    return {
                        exists: true,
                        data: {
                            ...data,
                            id: doc.id,
                            createdAt: data.createdAt?.toDate(),
                            expiresAt: data.expiresAt?.toDate()
                        }
                    };
                } else {
                    return { exists: false };
                }
            } else {
                // Mock mode
                for (const [id, data] of this.mockData.entries()) {
                    if (data.code === code) {
                        return {
                            exists: true,
                            data: { ...data, id },
                            mock: true
                        };
                    }
                }
                return { exists: false, mock: true };
            }
        } catch (error) {
            console.error('❌ Error checking redemption code:', error);
            return {
                exists: false,
                error: error.message
            };
        }
    }

    /**
     * Mark redemption code as used
     */
    async markCodeAsRedeemed(code, redeemedBy) {
        try {
            if (this.initialized && this.db) {
                const snapshot = await this.db.collection('redemption_codes')
                    .where('code', '==', code)
                    .limit(1)
                    .get();

                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    await doc.ref.update({
                        isRedeemed: true,
                        redeemedAt: admin.firestore.Timestamp.now(),
                        redeemedBy: redeemedBy
                    });

                    console.log(`✅ Redemption code marked as used: ${code}`);
                    return { success: true };
                } else {
                    return { success: false, error: 'Code not found' };
                }
            } else {
                // Mock mode
                for (const [id, data] of this.mockData.entries()) {
                    if (data.code === code) {
                        data.isRedeemed = true;
                        data.redeemedAt = new Date();
                        data.redeemedBy = redeemedBy;
                        
                        console.log(`🧪 Mock redemption code marked as used: ${code}`);
                        return { success: true, mock: true };
                    }
                }
                return { success: false, error: 'Code not found', mock: true };
            }
        } catch (error) {
            console.error('❌ Error marking code as redeemed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get redemption codes by user
     */
    async getRedemptionCodesByUser(userId) {
        try {
            if (this.initialized && this.db) {
                const snapshot = await this.db.collection('redemption_codes')
                    .where('discordUserId', '==', userId)
                    .orderBy('createdAt', 'desc')
                    .get();

                const codes = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    codes.push({
                        ...data,
                        id: doc.id,
                        createdAt: data.createdAt?.toDate(),
                        expiresAt: data.expiresAt?.toDate(),
                        redeemedAt: data.redeemedAt?.toDate()
                    });
                });

                return {
                    success: true,
                    codes: codes
                };
            } else {
                // Mock mode
                const codes = [];
                for (const [id, data] of this.mockData.entries()) {
                    if (data.userId === userId) {
                        codes.push({ ...data, id });
                    }
                }
                
                codes.sort((a, b) => b.createdAt - a.createdAt);
                
                return {
                    success: true,
                    codes: codes,
                    mock: true
                };
            }
        } catch (error) {
            console.error('❌ Error getting redemption codes by user:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Save transaction log
     */
    async saveTransactionLog(data) {
        try {
            if (this.initialized && this.db) {
                const docRef = await this.db.collection('transaction_logs').add({
                    ...data,
                    timestamp: admin.firestore.Timestamp.now(),
                    source: 'discord-bot'
                });

                return {
                    success: true,
                    documentId: docRef.id
                };
            } else {
                // Mock mode
                const mockId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
                console.log(`🧪 Transaction log saved to mock storage: ${mockId}`);
                
                return {
                    success: true,
                    documentId: mockId,
                    mock: true
                };
            }
        } catch (error) {
            console.error('❌ Error saving transaction log:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get statistics
     */
    async getStatistics() {
        try {
            if (this.initialized && this.db) {
                const codesSnapshot = await this.db.collection('redemption_codes').get();
                const redeemedSnapshot = await this.db.collection('redemption_codes')
                    .where('isRedeemed', '==', true)
                    .get();

                return {
                    success: true,
                    stats: {
                        totalCodes: codesSnapshot.size,
                        redeemedCodes: redeemedSnapshot.size,
                        pendingCodes: codesSnapshot.size - redeemedSnapshot.size
                    }
                };
            } else {
                // Mock mode
                const totalCodes = this.mockData.size;
                let redeemedCodes = 0;
                
                for (const data of this.mockData.values()) {
                    if (data.isRedeemed) {
                        redeemedCodes++;
                    }
                }

                return {
                    success: true,
                    stats: {
                        totalCodes: totalCodes,
                        redeemedCodes: redeemedCodes,
                        pendingCodes: totalCodes - redeemedCodes
                    },
                    mock: true
                };
            }
        } catch (error) {
            console.error('❌ Error getting statistics:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Clean up expired codes
     */
    async cleanupExpiredCodes() {
        try {
            if (this.initialized && this.db) {
                const now = admin.firestore.Timestamp.now();
                const expiredSnapshot = await this.db.collection('redemption_codes')
                    .where('expiresAt', '<', now)
                    .where('isRedeemed', '==', false)
                    .get();

                const batch = this.db.batch();
                let count = 0;

                expiredSnapshot.forEach(doc => {
                    batch.update(doc.ref, { status: 'expired' });
                    count++;
                });

                if (count > 0) {
                    await batch.commit();
                    console.log(`🧹 Marked ${count} expired codes`);
                }

                return {
                    success: true,
                    expiredCount: count
                };
            } else {
                // Mock mode
                const now = new Date();
                let count = 0;

                for (const data of this.mockData.values()) {
                    if (data.expiresAt < now && !data.isRedeemed) {
                        data.status = 'expired';
                        count++;
                    }
                }

                console.log(`🧪 Mock: Marked ${count} expired codes`);
                return {
                    success: true,
                    expiredCount: count,
                    mock: true
                };
            }
        } catch (error) {
            console.error('❌ Error cleaning up expired codes:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Fetch all redemption codes
     */
    async fetchAllRedemptionCodes() {
        try {
            if (this.initialized && this.db) {
                const snapshot = await this.db.collection('redemption_codes').get();
                
                const codes = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    codes.push({
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate?.() || data.createdAt,
                        expiresAt: data.expiresAt?.toDate?.() || data.expiresAt
                    });
                });
                
                console.log(`✅ Fetched ${codes.length} redemption codes from Firebase`);
                return codes;
            } else {
                // Mock mode
                const codes = [];
                for (const [id, data] of this.mockData.entries()) {
                    codes.push({
                        id: id,
                        ...data
                    });
                }
                
                console.log(`🧪 Fetched ${codes.length} redemption codes from mock storage`);
                return codes;
            }
        } catch (error) {
            console.error('❌ Error fetching all redemption codes:', error);
            return [];
        }
    }

    /**
     * Test Firebase connection
     */
    async testConnection() {
        try {
            if (this.initialized && this.db) {
                // Try to read from a collection
                await this.db.collection('test').limit(1).get();
                console.log('✅ Firebase connection test successful');
                return {
                    success: true,
                    message: 'Firebase connection is working'
                };
            } else {
                console.log('🧪 Firebase mock mode active');
                return {
                    success: true,
                    message: 'Firebase mock mode is active',
                    mock: true
                };
            }
        } catch (error) {
            console.error('❌ Firebase connection test failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get connection status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            hasDatabase: !!this.db,
            mode: this.initialized ? 'firebase' : 'mock',
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID
        };
    }
}

module.exports = FirebaseService;

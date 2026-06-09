// Node.js 18+ has built-in fetch support

class PayPalService {
    constructor() {
        // PayPal configuration based on environment
        this.mode = process.env.PAYPAL_MODE || 'sandbox';
        this.clientId = process.env.PAYPAL_CLIENT_ID;
        this.clientSecret = process.env.PAYPAL_CLIENT_SECRET;
        
        // Set API base URL based on mode
        this.apiBase = this.mode === 'production' 
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
            
        console.log(`🔧 PayPal Service initialized in ${this.mode} mode`);
        console.log(`🌐 API Base: ${this.apiBase}`);
        
        if (!this.clientId || !this.clientSecret) {
            console.error('❌ PayPal credentials not found in environment variables');
        }
    }

    /**
     * Get PayPal access token for API requests
     */
    async getAccessToken() {
        try {
            const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            
            const response = await fetch(`${this.apiBase}/v1/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${auth}`
                },
                body: 'grant_type=client_credentials'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(`PayPal auth failed: ${data.error_description || data.error}`);
            }
            
            return data.access_token;
        } catch (error) {
            console.error('❌ Error getting PayPal access token:', error);
            throw error;
        }
    }

    /**
     * Create a PayPal order for the specified amount
     */
    async createOrder(amount, packageId, userInfo = {}) {
        try {
            const accessToken = await this.getAccessToken();
            
            // Validate amount
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount) || numAmount <= 0) {
                return {
                    success: false,
                    message: 'Invalid amount'
                };
            }

            // Create user info string for logs
            const userLogInfo = userInfo.userId ? ` - <@${userInfo.userId}> (${userInfo.username || 'Unknown'})` : '';

            // Create order payload
            const orderPayload = {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        reference_id: packageId || `coins-${numAmount}`,
                        amount: {
                            currency_code: 'USD',
                            value: numAmount.toFixed(2)
                        },
                        description: `Package ${packageId}`
                    }
                ],
                application_context: {
                    brand_name: 'Game store',
                    landing_page: 'NO_PREFERENCE',
                    user_action: 'PAY_NOW',
                    shipping_preference: 'NO_SHIPPING',
                    return_url: process.env.PAYPAL_RETURN_URL || 'https://medusastore-ten.vercel.app/',
                    cancel_url: process.env.PAYPAL_RETURN_URL || 'https://medusastore-ten.vercel.app/'
                }
            };

            // Call PayPal API to create order
            const response = await fetch(`${this.apiBase}/v2/checkout/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(orderPayload)
            });

            const order = await response.json();

            if (order.id) {
                console.log(`✅ PayPal order created: ${order.id} for $${numAmount}${userLogInfo}`);
                return {
                    success: true,
                    id: order.id,
                    links: order.links,
                    status: order.status
                };
            } else {
                console.error(`❌ PayPal create order error${userLogInfo}:`, order);
                
                // Provide detailed error information
                const errorMessage = order.message || 'Failed to create PayPal order';
                let userMessage = errorMessage;
                
                if (order.name === 'AUTHENTICATION_FAILURE') {
                    userMessage = 'PayPal authentication failed - check credentials';
                } else if (order.name === 'INVALID_REQUEST') {
                    userMessage = 'Invalid PayPal request - check amount and currency';
                }
                
                return {
                    success: false,
                    message: userMessage,
                    details: order.details || [],
                    mode: this.mode
                };
            }
        } catch (error) {
            console.error('❌ Error creating PayPal order:', error);
            return {
                success: false,
                message: error.message || 'An error occurred creating the order'
            };
        }
    }

    /**
     * Capture a PayPal order (complete the payment)
     */
    async captureOrder(orderId) {
        try {
            const accessToken = await this.getAccessToken();

            // First verify the order exists and is approved
            const orderResponse = await fetch(`${this.apiBase}/v2/checkout/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!orderResponse.ok) {
                return {
                    success: false,
                    message: 'Order verification failed'
                };
            }

            const orderData = await orderResponse.json();

            if (orderData.status !== 'APPROVED') {
                return {
                    success: false,
                    message: `Order not approved. Status: ${orderData.status}`
                };
            }

            // Capture the payment
            const captureResponse = await fetch(`${this.apiBase}/v2/checkout/orders/${orderId}/capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({})
            });

            const captureData = await captureResponse.json();

            if (captureData.status === 'COMPLETED') {
                const capture = captureData.purchase_units[0]?.payments?.captures[0];
                
                console.log(`✅ PayPal payment captured: ${capture?.id} for $${capture?.amount?.value}`);
                
                return {
                    success: true,
                    captureId: capture?.id,
                    amount: parseFloat(capture?.amount?.value || '0'),
                    currency: capture?.amount?.currency_code || 'USD',
                    status: captureData.status,
                    payerEmail: captureData.payer?.email_address,
                    payerId: captureData.payer?.payer_id
                };
            } else {
                console.error('❌ PayPal capture failed:', captureData);
                return {
                    success: false,
                    message: captureData.message || 'Failed to capture payment',
                    details: captureData.details || []
                };
            }
        } catch (error) {
            console.error('❌ Error capturing PayPal payment:', error);
            return {
                success: false,
                message: error.message || 'An error occurred capturing the payment'
            };
        }
    }

    /**
     * Get order details
     */
    async getOrderDetails(orderId) {
        try {
            const accessToken = await this.getAccessToken();

            const response = await fetch(`${this.apiBase}/v2/checkout/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                return {
                    success: false,
                    message: 'Failed to get order details'
                };
            }

            const orderData = await response.json();
            
            return {
                success: true,
                order: orderData
            };
        } catch (error) {
            console.error('❌ Error getting order details:', error);
            return {
                success: false,
                message: error.message || 'An error occurred getting order details'
            };
        }
    }

    /**
     * Verify webhook signature (for production use)
     */
    async verifyWebhookSignature(headers, body, webhookId) {
        try {
            const accessToken = await this.getAccessToken();

            const verifyPayload = {
                auth_algo: headers['paypal-auth-algo'],
                cert_id: headers['paypal-cert-id'],
                transmission_id: headers['paypal-transmission-id'],
                transmission_sig: headers['paypal-transmission-sig'],
                transmission_time: headers['paypal-transmission-time'],
                webhook_id: webhookId,
                webhook_event: body
            };

            const response = await fetch(`${this.apiBase}/v1/notifications/verify-webhook-signature`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(verifyPayload)
            });

            const result = await response.json();
            
            return {
                success: response.ok,
                verified: result.verification_status === 'SUCCESS'
            };
        } catch (error) {
            console.error('❌ Error verifying webhook signature:', error);
            return {
                success: false,
                verified: false
            };
        }
    }

    /**
     * Get order details from PayPal
     */
    async getOrderDetails(orderId) {
        try {
            const accessToken = await this.getAccessToken();

            const response = await fetch(`${this.apiBase}/v2/checkout/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const orderData = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    status: orderData.status,
                    id: orderData.id,
                    amount: orderData.purchase_units[0]?.amount?.value,
                    currency: orderData.purchase_units[0]?.amount?.currency_code,
                    payer: orderData.payer,
                    orderData: orderData
                };
            } else {
                return {
                    success: false,
                    message: orderData.message || 'Failed to get order details'
                };
            }
        } catch (error) {
            console.error('❌ Error getting order details:', error);
            return {
                success: false,
                message: error.message || 'Error retrieving order'
            };
        }
    }

    /**
     * Test PayPal configuration
     */
    async testConfiguration() {
        try {
            console.log('🧪 Testing PayPal configuration...');
            
            const accessToken = await this.getAccessToken();
            
            if (accessToken) {
                console.log('✅ PayPal configuration test successful');
                return {
                    success: true,
                    mode: this.mode,
                    message: `PayPal is correctly configured in ${this.mode} mode`
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to get access token'
                };
            }
        } catch (error) {
            console.error('❌ PayPal configuration test failed:', error);
            return {
                success: false,
                message: error.message || 'Configuration test failed'
            };
        }
    }
}

module.exports = PayPalService;

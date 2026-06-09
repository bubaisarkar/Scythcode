const express = require('express');
const router = express.Router();

/**
 * PayPal success page - handles successful payments
 */
router.get('/success', async (req, res) => {
    const { token, PayerID } = req.query;
    
    try {
        // Log the successful return
        console.log(`✅ PayPal success callback - Token: ${token}, PayerID: ${PayerID}`);
        
        // Process the payment immediately
        if (token && PayerID) {
            // Import the required services
            const PayPalService = require('../services/paypal');
            const CodeGenerator = require('../services/codeGenerator');
            const EmailService = require('../services/email');
            const FirebaseService = require('../services/firebase');
            
            const paypalService = new PayPalService();
            const codeGenerator = new CodeGenerator();
            const emailService = new EmailService();
            const firebaseService = new FirebaseService();
            
            // Get the pending transaction (we'll need to find it by order ID)
            const pendingTransactions = global.pendingTransactions || new Map();
            let transaction = pendingTransactions.get(token);
            
            if (transaction) {
                try {
                    // Capture the payment
                    const captureResult = await paypalService.captureOrder(token);
                    
                    if (captureResult.success) {
                        // Process the successful payment
                        const { processPaymentSuccess } = require('../utils/paymentProcessor');
                        await processPaymentSuccess(transaction, captureResult, {
                            paypalService,
                            codeGenerator,
                            emailService,
                            firebaseService
                        }, global.discordClient);
                        console.log(`✅ Payment processed successfully for order: ${token}`);
                    } else {
                        console.error(`❌ Payment capture failed for order: ${token}`);
                    }
                } catch (error) {
                    console.error(`❌ Error processing payment for order: ${token}`, error);
                }
            } else {
                console.log(`⚠️ No pending transaction found for order: ${token}`);
            }
        }
        
        // Create a simple success page that communicates back to Discord
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Successful - Medusa Store</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .container {
                    background: white;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }
                .success-icon {
                    font-size: 64px;
                    color: #28a745;
                    margin-bottom: 20px;
                }
                .title {
                    color: #333;
                    margin-bottom: 20px;
                    font-size: 28px;
                }
                .message {
                    color: #666;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                .loading {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 10px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .close-btn {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 20px;
                }
                .close-btn:hover {
                    background: #5a6fd8;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="success-icon">✅</div>
                <h1 class="title">Payment Successful!</h1>
                <div class="message">
                    <p>Your payment has been processed successfully.</p>
                    <p><span class="loading"></span>Processing your redemption code...</p>
                    <p><small>You will receive your redemption code via Discord DM shortly.</small></p>
                </div>
                <button class="close-btn" onclick="closeWindow()">Close Window</button>
            </div>
            
            <script>
                // Notify parent window if this is in a popup
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'PAYPAL_PAYMENT_COMPLETE',
                        token: '${token}',
                        payerId: '${PayerID}'
                    }, '*');
                }
                
                function closeWindow() {
                    if (window.opener) {
                        window.close();
                    } else {
                        window.history.back();
                    }
                }
                
                // Auto-close after 10 seconds if in popup
                if (window.opener) {
                    setTimeout(() => {
                        window.close();
                    }, 10000);
                }
            </script>
        </body>
        </html>
        `;
        
        res.send(html);
    } catch (error) {
        console.error('❌ Error in PayPal success handler:', error);
        res.status(500).send('Error processing payment success');
    }
});

/**
 * PayPal cancel page - handles cancelled payments
 */
router.get('/cancel', async (req, res) => {
    const { token } = req.query;
    
    try {
        console.log(`❌ PayPal payment cancelled - Token: ${token}`);
        
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Cancelled - Medusa Store</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .container {
                    background: white;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }
                .cancel-icon {
                    font-size: 64px;
                    color: #dc3545;
                    margin-bottom: 20px;
                }
                .title {
                    color: #333;
                    margin-bottom: 20px;
                    font-size: 28px;
                }
                .message {
                    color: #666;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                .close-btn {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 20px;
                }
                .close-btn:hover {
                    background: #c82333;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="cancel-icon">❌</div>
                <h1 class="title">Payment Cancelled</h1>
                <div class="message">
                    <p>Your payment was cancelled.</p>
                    <p>No charges were made to your account.</p>
                    <p><small>You can try again anytime by using the /store command in Discord.</small></p>
                </div>
                <button class="close-btn" onclick="closeWindow()">Close Window</button>
            </div>
            
            <script>
                // Notify parent window if this is in a popup
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'PAYPAL_PAYMENT_CANCELLED',
                        token: '${token}'
                    }, '*');
                }
                
                function closeWindow() {
                    if (window.opener) {
                        window.close();
                    } else {
                        window.history.back();
                    }
                }
                
                // Auto-close after 5 seconds if in popup
                if (window.opener) {
                    setTimeout(() => {
                        window.close();
                    }, 5000);
                }
            </script>
        </body>
        </html>
        `;
        
        res.send(html);
    } catch (error) {
        console.error('❌ Error in PayPal cancel handler:', error);
        res.status(500).send('Error processing payment cancellation');
    }
});

/**
 * PayPal bridge page - for popup communication
 */
router.get('/bridge', async (req, res) => {
    const { token, PayerID, cancelled } = req.query;
    
    try {
        if (cancelled) {
            // Handle cancellation
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Payment Cancelled</title>
            </head>
            <body>
                <script>
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'PAYPAL_PAYMENT_CANCELLED',
                            token: '${token}'
                        }, '*');
                        window.close();
                    }
                </script>
                <p>Payment cancelled. This window will close automatically.</p>
            </body>
            </html>
            `;
            res.send(html);
        } else if (token && PayerID) {
            // Handle successful payment
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Payment Processing</title>
            </head>
            <body>
                <script>
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'PAYPAL_PAYMENT_COMPLETE',
                            token: '${token}',
                            payerId: '${PayerID}'
                        }, '*');
                        window.close();
                    }
                </script>
                <p>Payment successful! Processing your order...</p>
            </body>
            </html>
            `;
            res.send(html);
        } else {
            res.status(400).send('Invalid payment parameters');
        }
    } catch (error) {
        console.error('❌ Error in PayPal bridge handler:', error);
        res.status(500).send('Error processing payment bridge');
    }
});

/**
 * Manual payment processing endpoint (ADMIN ONLY)
 */
router.post('/process-manual', async (req, res) => {
    try {
        // AUTHENTICATION: Check for admin secret key
        const authHeader = req.headers['authorization'];
        const adminSecret = process.env.ADMIN_SECRET_KEY;
        
        if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
            console.warn('⚠️ Unauthorized manual processing attempt');
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        
        const { orderId, userId, username, packageId } = req.body;
        
        // INPUT VALIDATION
        if (!orderId || !userId || !username || !packageId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: orderId, userId, username, packageId'
            });
        }
        
        // Validate orderId format
        if (typeof orderId !== 'string' || orderId.length < 5 || orderId.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Invalid orderId format'
            });
        }
        
        // Validate userId (Discord snowflake)
        if (!/^\d{17,19}$/.test(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid userId format'
            });
        }
        
        // Validate username
        if (typeof username !== 'string' || username.length < 1 || username.length > 32) {
            return res.status(400).json({
                success: false,
                message: 'Invalid username format'
            });
        }
        
        // Validate packageId
        const validPackageIds = ['package_1000', 'package_2000', 'package_3200', 'package_8500'];
        if (!validPackageIds.includes(packageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid packageId'
            });
        }

        // Import services
        const PayPalService = require('../services/paypal');
        const CodeGenerator = require('../services/codeGenerator');
        const EmailService = require('../services/email');
        const FirebaseService = require('../services/firebase');
        const { processPaymentSuccess } = require('../utils/paymentProcessor');
        
        const paypalService = new PayPalService();
        const codeGenerator = new CodeGenerator();
        const emailService = new EmailService();
        const firebaseService = new FirebaseService();

        // Find package data
        const COIN_PACKAGES = [
            { id: 'package_1000', coins: 1000, price: 11, emoji: '🪙' },
            { id: 'package_2000', coins: 2000, price: 22, emoji: '💰' },
            { id: 'package_3200', coins: 3200, price: 33, emoji: '💎' },
            { id: 'package_8500', coins: 8500, price: 88, emoji: '👑' }
        ];
        
        const packageData = COIN_PACKAGES.find(pkg => pkg.id === packageId);
        if (!packageData) {
            return res.status(400).json({
                success: false,
                message: 'Invalid package ID'
            });
        }

        // Create transaction object
        const transaction = {
            userId: userId,
            username: username,
            packageId: packageId,
            package: packageData,
            orderId: orderId,
            createdAt: new Date(),
            guildId: null,
            channelId: null
        };

        // Create mock capture result
        const captureResult = {
            success: true,
            captureId: `manual-${orderId}`,
            amount: packageData.price,
            currency: 'USD',
            payerId: 'MANUAL_PROCESS',
            payerEmail: process.env.ADMIN_EMAIL
        };

        // Process the payment
        const result = await processPaymentSuccess(transaction, captureResult, {
            paypalService,
            codeGenerator,
            emailService,
            firebaseService
        }, global.discordClient);

        if (result.success) {
            console.log(`✅ Manual payment processing completed for ${username}`);
            res.json({
                success: true,
                message: 'Payment processed successfully',
                redemptionCode: result.redemptionCode,
                coins: result.coins
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Payment processing failed',
                error: result.error
            });
        }

    } catch (error) {
        console.error('❌ Error in manual payment processing:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;

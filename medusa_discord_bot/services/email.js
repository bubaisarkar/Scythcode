class EmailService {
    constructor() {
        console.log('📧 Email service initialized (logging mode)');
    }

    /**
     * Send redemption code email
     */
    async sendRedemptionCode(options) {
        const {
            to,
            username,
            userId,
            redemptionCode,
            coins,
            amount,
            expiresAt
        } = options;

        try {
            // Log email details instead of sending
            console.log('\n📧 ===== EMAIL NOTIFICATION =====');
            console.log(`To: ${to || 'N/A'}`);
            console.log(`Subject: Your Medusa Store Purchase Confirmation`);
            console.log(`\n--- Email Content ---`);
            console.log(`Username: ${username}`);
            console.log(`User ID: ${userId}`);
            console.log(`Redemption Code: ${redemptionCode}`);
            console.log(`Coins: ${coins}`);
            console.log(`Amount: $${amount}`);
            console.log(`Expires: ${new Date(expiresAt).toLocaleDateString()}`);
            console.log('================================\n');

            return {
                success: true,
                messageId: 'logged-' + Date.now()
            };
        } catch (error) {
            console.error('❌ Failed to log redemption code email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send payment failure notification
     */
    async sendPaymentFailureNotification(options) {
        const {
            to,
            username,
            userId,
            packageInfo,
            reason,
            orderId
        } = options;

        try {
            console.log('\n⚠️ ===== PAYMENT FAILURE NOTIFICATION =====');
            console.log(`To: ${to || 'N/A'}`);
            console.log(`Subject: Payment Issue - Medusa Store`);
            console.log(`\n--- Details ---`);
            console.log(`Username: ${username}`);
            console.log(`User ID: ${userId}`);
            console.log(`Package: ${packageInfo.coins} coins ($${packageInfo.price})`);
            console.log(`Order ID: ${orderId}`);
            console.log(`Reason: ${reason}`);
            console.log('==========================================\n');

            return {
                success: true,
                messageId: 'logged-' + Date.now()
            };
        } catch (error) {
            console.error('❌ Failed to log payment failure notification:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send admin notification
     */
    async sendAdminNotification(options) {
        const {
            subject,
            message,
            data = {}
        } = options;

        try {
            console.log('\n🔔 ===== ADMIN NOTIFICATION =====');
            console.log(`To: Admin (${process.env.ADMIN_EMAIL || 'N/A'})`);
            console.log(`Subject: [Medusa Store Bot] ${subject}`);
            console.log(`\n--- Message ---`);
            console.log(message);
            if (Object.keys(data).length > 0) {
                console.log(`\n--- Additional Data ---`);
                console.log(JSON.stringify(data, null, 2));
            }
            console.log('================================\n');

            return {
                success: true,
                messageId: 'logged-' + Date.now()
            };
        } catch (error) {
            console.error('❌ Failed to log admin notification:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate HTML email for redemption code
     */
    generateRedemptionCodeEmail(data) {
        const { username, userId, redemptionCode, coins, amount, expiresAt } = data;
        const expirationDate = new Date(expiresAt).toLocaleDateString();

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Medusa Store Purchase</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .code-box { background: #fff; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
                .code { font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
                .info-box { background: #e8f4fd; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏪 Medusa Store</h1>
                    <h2>Purchase Confirmation</h2>
                </div>
                <div class="content">
                    <h3>Thank you for your purchase, ${username}!</h3>
                    <p>Your payment has been successfully processed. Here are your purchase details:</p>
                    
                    <div class="info-box">
                        <strong>📦 Purchase Details:</strong><br>
                        • Coins: <strong>${coins}</strong><br>
                        • Amount Paid: <strong>$${amount}</strong><br>
                        • Discord User: <strong>${username}</strong> (${userId})<br>
                        • Purchase Date: <strong>${new Date().toLocaleDateString()}</strong>
                    </div>

                    <div class="code-box">
                        <h3>🎫 Your Redemption Code</h3>
                        <div class="code">${redemptionCode}</div>
                        <p><small>Keep this code safe! You'll need it to redeem your coins.</small></p>
                    </div>

                    <div class="info-box">
                        <strong>⚠️ Important Information:</strong><br>
                        • This code expires on: <strong>${expirationDate}</strong><br>
                        • Use your code before it expires<br>
                        • Each code can only be used once<br>
                        • Contact support if you have any issues
                    </div>

                    <h3>How to Redeem Your Code:</h3>
                    <ol>
                        <li>Go to the Medusa Store website or Discord server</li>
                        <li>Navigate to the redemption section</li>
                        <li>Enter your redemption code: <code>${redemptionCode}</code></li>
                        <li>Your ${coins} coins will be added to your account</li>
                    </ol>

                    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                </div>
                <div class="footer">
                    <p>This email was sent automatically by the Medusa Store system.<br>
                    Please do not reply to this email.</p>
                    <p>&copy; ${new Date().getFullYear()} Medusa Store. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Generate plain text email for redemption code
     */
    generateRedemptionCodeText(data) {
        const { username, redemptionCode, coins, amount, expiresAt } = data;
        const expirationDate = new Date(expiresAt).toLocaleDateString();

        return `
MEDUSA STORE - Purchase Confirmation

Thank you for your purchase, ${username}!

Your payment has been successfully processed.

Purchase Details:
- Coins: ${coins}
- Amount Paid: $${amount}
- Purchase Date: ${new Date().toLocaleDateString()}

Your Redemption Code: ${redemptionCode}

IMPORTANT:
- This code expires on: ${expirationDate}
- Use your code before it expires
- Each code can only be used once
- Contact support if you have any issues

How to Redeem:
1. Go to the Medusa Store website or Discord server
2. Navigate to the redemption section
3. Enter your redemption code: ${redemptionCode}
4. Your ${coins} coins will be added to your account

If you have any questions, please contact our support team.

© ${new Date().getFullYear()} Medusa Store. All rights reserved.
        `.trim();
    }

    /**
     * Generate HTML email for payment failure
     */
    generatePaymentFailureEmail(data) {
        const { username, userId, packageInfo, reason, orderId } = data;

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Issue - Medusa Store</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .error-box { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; margin: 20px 0; border-radius: 5px; }
                .info-box { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; margin: 20px 0; border-radius: 5px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⚠️ Payment Issue</h1>
                    <h2>Medusa Store</h2>
                </div>
                <div class="content">
                    <h3>Hello ${username},</h3>
                    <p>We encountered an issue processing your payment for the Medusa Store.</p>
                    
                    <div class="error-box">
                        <strong>Issue Details:</strong><br>
                        ${reason}
                    </div>

                    <div class="info-box">
                        <strong>Order Information:</strong><br>
                        • Package: ${packageInfo.coins} coins ($${packageInfo.price})<br>
                        • Order ID: ${orderId}<br>
                        • User: ${username} (${userId})<br>
                        • Date: ${new Date().toLocaleDateString()}
                    </div>

                    <h3>What to do next:</h3>
                    <ul>
                        <li>Try making the purchase again</li>
                        <li>Check that your PayPal account has sufficient funds</li>
                        <li>Ensure your payment method is valid</li>
                        <li>Contact our support team if the issue persists</li>
                    </ul>

                    <p>We apologize for any inconvenience. Our team is here to help if you need assistance.</p>
                </div>
                <div class="footer">
                    <p>This email was sent automatically by the Medusa Store system.<br>
                    Please do not reply to this email.</p>
                    <p>&copy; ${new Date().getFullYear()} Medusa Store. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Generate HTML email for admin notifications
     */
    generateAdminNotificationEmail(data) {
        const { message, data: notificationData } = data;

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Notification - Medusa Store Bot</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
                .data-box { background: #e9ecef; border: 1px solid #dee2e6; padding: 15px; margin: 15px 0; border-radius: 5px; font-family: monospace; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🤖 Medusa Store Bot</h2>
                    <p>Admin Notification</p>
                </div>
                <div class="content">
                    <h3>Notification Details:</h3>
                    <p>${message}</p>
                    
                    ${Object.keys(notificationData).length > 0 ? `
                    <h4>Additional Data:</h4>
                    <div class="data-box">
                        <pre>${JSON.stringify(notificationData, null, 2)}</pre>
                    </div>
                    ` : ''}
                    
                    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                </div>
                <div class="footer">
                    <p>This is an automated notification from the Medusa Store Discord Bot.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Test email configuration
     */
    async testEmailConfiguration() {
        try {
            console.log('✅ Email service is in logging mode - no actual emails will be sent');
            return {
                success: true,
                messageId: 'test-logged'
            };
        } catch (error) {
            console.error('❌ Email configuration test failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = EmailService;

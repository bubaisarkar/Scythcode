// Manual payment processing script for successful PayPal payments
const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const PayPalService = require('./services/paypal');
const CodeGenerator = require('./services/codeGenerator');
const EmailService = require('./services/email');
const FirebaseService = require('./services/firebase');
const { processPaymentSuccess } = require('./utils/paymentProcessor');

// Load environment variables
dotenv.config();

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

// Initialize services
const paypalService = new PayPalService();
const codeGenerator = new CodeGenerator();
const emailService = new EmailService();
const firebaseService = new FirebaseService();

// Manual processing function
async function processManualPayment(orderId, userId, username, packageData) {
    try {
        console.log(`🔄 Processing manual payment for order: ${orderId}`);
        
        // Create a mock transaction object
        const transaction = {
            userId: userId,
            username: username,
            packageId: packageData.id,
            package: packageData,
            orderId: orderId,
            createdAt: new Date(),
            guildId: null,
            channelId: null
        };

        // Try to get order details from PayPal
        const orderDetails = await paypalService.getOrderDetails(orderId);
        
        if (orderDetails.success) {
            console.log(`✅ Order details retrieved for ${orderId}`);
            
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
            }, client);

            if (result.success) {
                console.log(`✅ Manual payment processing completed!`);
                console.log(`🎫 Redemption Code: ${result.redemptionCode}`);
                console.log(`🪙 Coins: ${result.coins}`);
                
                // Try to send DM to user
                try {
                    const user = await client.users.fetch(userId);
                    if (user) {
                        await user.send(`🎉 **Payment Processed Successfully!**\n\n🎫 **Redemption Code:** \`${result.redemptionCode}\`\n🪙 **Coins:** ${result.coins}\n💰 **Amount:** $${packageData.price}\n\n*Your payment has been manually processed. Sorry for the delay!*`);
                        console.log(`✅ Sent DM to user ${username}`);
                    }
                } catch (dmError) {
                    console.error(`❌ Could not send DM:`, dmError);
                }
                
            } else {
                console.error(`❌ Manual payment processing failed:`, result.error);
            }
        } else {
            console.error(`❌ Could not retrieve order details:`, orderDetails.message);
        }

    } catch (error) {
        console.error('❌ Error in manual processing:', error);
    }
}

// Main execution
async function main() {
    try {
        // Login to Discord
        await client.login(process.env.DISCORD_TOKEN);
        console.log(`✅ Discord client logged in`);

        // Process the specific payment
        const orderId = '0C117249YR305480H';
        const userId = '1429354301574090826'; // Replace with actual user ID
        const username = 'User'; // Replace with actual username
        const packageData = { id: 'package_1000', coins: 1000, price: 11, emoji: '🪙' };

        await processManualPayment(orderId, userId, username, packageData);

        // Disconnect after processing
        setTimeout(() => {
            client.destroy();
            console.log('🛑 Manual processing completed, disconnecting...');
            process.exit(0);
        }, 5000);

    } catch (error) {
        console.error('❌ Error in main execution:', error);
        process.exit(1);
    }
}

// Run the script
main();

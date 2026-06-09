const { EmbedBuilder } = require('discord.js');

/**
 * Send notifications to all admins about a new purchase
 */
async function sendAdminNotifications(client, purchaseData) {
    if (!client) {
        console.log('⚠️ Client not available, skipping admin notifications');
        return;
    }

    const adminChannelId = process.env.ADMIN_CHANNEL_ID;
    const adminIds = process.env.ADMIN_IDS?.split(',').map(id => id.trim()).filter(id => id);
    
    if (!adminChannelId) {
        console.log('⚠️ No admin channel configured, skipping admin notifications');
        return;
    }

    const adminEmbed = new EmbedBuilder()
        .setTitle('🛒 New Purchase')
        .setDescription('A new purchase has been completed!')
        .addFields([
            { name: '👤 Customer', value: `<@${purchaseData.userId}> (${purchaseData.username})`, inline: true },
            { name: '📦 Package', value: `Package ${purchaseData.packageId}`, inline: true },
            { name: '🪙 Coins', value: `${purchaseData.coins}`, inline: true },
            { name: '💰 Amount', value: `$${purchaseData.amount}`, inline: true },
            { name: '🎫 Code', value: `\`${purchaseData.redemptionCode}\``, inline: false },
            { name: '🆔 Order ID', value: `\`${purchaseData.orderId}\``, inline: false },
            { name: '⏰ Expires', value: `<t:${Math.floor(purchaseData.expiresAt.getTime() / 1000)}:R>`, inline: true }
        ])
        .setColor(0x7B68EE)
        .setTimestamp();

    try {
        const channel = await client.channels.fetch(adminChannelId);
        if (channel) {
            // Create mention string for all admins
            const mentions = adminIds && adminIds.length > 0 
                ? adminIds.map(id => `<@${id}>`).join(' ')
                : '';
            
            await channel.send({
                content: mentions || 'New purchase notification',
                embeds: [adminEmbed]
            });
            console.log(`✅ Sent purchase notification to admin channel ${adminChannelId}`);
        }
    } catch (error) {
        console.error(`❌ Failed to send notification to admin channel:`, error.message);
    }
}

/**
 * Process successful payment and send redemption code
 */
async function processPaymentSuccess(transaction, paymentData, services, client) {
    try {
        const { codeGenerator, emailService, firebaseService } = services;
        
        // INPUT VALIDATION: Validate transaction data
        if (!transaction || !transaction.userId || !transaction.package) {
            throw new Error('Invalid transaction data');
        }
        
        if (!transaction.package.coins || !transaction.package.price) {
            throw new Error('Invalid package data');
        }
        
        if (!paymentData || !paymentData.captureId) {
            throw new Error('Invalid payment data');
        }
        
        // Validate amounts match
        if (paymentData.amount && Math.abs(paymentData.amount - transaction.package.price) > 0.01) {
            console.error(`⚠️ Amount mismatch: expected ${transaction.package.price}, got ${paymentData.amount}`);
            throw new Error('Payment amount mismatch');
        }
        
        // Generate redemption code
        const redemptionCode = codeGenerator.generateCode();
        
        // Calculate expiration (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Save to Firebase
        await firebaseService.saveRedemptionCode({
            code: redemptionCode,
            coins: transaction.package.coins,
            packageId: transaction.packageId,
            orderId: transaction.orderId,
            payerId: paymentData.payerId,
            email: paymentData.payerEmail,
            amount: transaction.package.price,
            currency: paymentData.currency || 'USD',
            userId: transaction.userId,
            username: transaction.username,
            captureId: paymentData.captureId,
            expiresAt: expiresAt
        });

        // Get user (if client is available)
        let user = null;
        if (client) {
            try {
                user = await client.users.fetch(transaction.userId);
            } catch (error) {
                console.error(`❌ Could not find user: ${transaction.userId}`, error);
            }
        }

        // Create success embed
        const successEmbed = new EmbedBuilder()
            .setTitle('✅ Payment Successful!')
            .setDescription(`Thank you for your purchase!`)
            .addFields([
                { name: '🪙 Coins Purchased', value: `${transaction.package.coins}`, inline: true },
                { name: '💰 Amount Paid', value: `$${transaction.package.price}`, inline: true },
                { name: '🎫 Redemption Code', value: `\`${redemptionCode}\``, inline: false },
                { name: '⏰ Expires', value: `<t:${Math.floor(expiresAt.getTime() / 1000)}:R>`, inline: true }
            ])
            .setColor(0x00C851)
            .setFooter({ text: 'Keep your redemption code safe!' })
            .setTimestamp();

        // Send DM to user if possible
        if (user) {
            try {
                await user.send({ embeds: [successEmbed] });
                console.log(`✅ Sent redemption code to ${user.username} via DM`);
            } catch (dmError) {
                console.error(`❌ Could not send DM to ${user.username}:`, dmError);
                
                // Try to send in the original channel if DM fails and client is available
                if (client && transaction.channelId) {
                    try {
                        const channel = await client.channels.fetch(transaction.channelId);
                        if (channel) {
                            await channel.send({
                                content: `<@${transaction.userId}> Your payment was successful! (DM failed)`,
                                embeds: [successEmbed]
                            });
                            console.log(`✅ Sent redemption code to channel ${transaction.channelId}`);
                        }
                    } catch (channelError) {
                        console.error('❌ Could not send to channel either:', channelError);
                    }
                }
            }
        }

        // Send admin notifications
        await sendAdminNotifications(client, {
            username: transaction.username,
            userId: transaction.userId,
            packageId: transaction.packageId,
            coins: transaction.package.coins,
            amount: transaction.package.price,
            redemptionCode: redemptionCode,
            orderId: transaction.orderId,
            expiresAt: expiresAt
        });

        // Track sale in sales tracker
        if (global.salesTracker) {
            await global.salesTracker.addSale(
                transaction.package.price,
                transaction.packageId,
                transaction.username
            );
        }

        // Log email notification (no actual email sent)
        try {
            await emailService.sendRedemptionCode({
                to: paymentData.payerEmail || process.env.ADMIN_EMAIL,
                username: transaction.username,
                userId: transaction.userId,
                redemptionCode: redemptionCode,
                coins: transaction.package.coins,
                amount: transaction.package.price,
                expiresAt: expiresAt
            });
            console.log(`📧 Logged email notification for ${transaction.username} (no actual email sent)`);
        } catch (emailError) {
            console.error('❌ Failed to send email notification:', emailError);
            
            // Send backup email to admin
            try {
                await emailService.sendAdminNotification({
                    subject: `Payment Processed - Code Delivery Failed`,
                    message: `Payment was processed but code delivery failed for user ${transaction.username}`,
                    data: {
                        userId: transaction.userId,
                        username: transaction.username,
                        redemptionCode: redemptionCode,
                        coins: transaction.package.coins,
                        amount: transaction.package.price,
                        orderId: transaction.orderId,
                        error: emailError.message
                    }
                });
            } catch (adminEmailError) {
                console.error('❌ Failed to send admin notification:', adminEmailError);
            }
        }

        // Clean up pending transaction
        const pendingTransactions = global.pendingTransactions;
        if (pendingTransactions) {
            pendingTransactions.delete(transaction.orderId);
        }
        
        console.log(`✅ Successfully processed payment for ${transaction.username} - Code: ${redemptionCode}`);
        
        return {
            success: true,
            redemptionCode: redemptionCode,
            coins: transaction.package.coins
        };

    } catch (error) {
        console.error('❌ Error processing successful payment:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    processPaymentSuccess
};

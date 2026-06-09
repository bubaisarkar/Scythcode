const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const dotenv = require('dotenv');
const PayPalService = require('./services/paypal');
const PaymentMonitor = require('./services/paymentMonitor');
const CodeGenerator = require('./services/codeGenerator');
const EmailService = require('./services/email');
const FirebaseService = require('./services/firebase');
const LoggerService = require('./services/logger');
const SalesTracker = require('./services/salesTracker');
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

// Store pending transactions
const pendingTransactions = new Map();
// Make it globally accessible for PayPal routes
global.pendingTransactions = pendingTransactions;
global.discordClient = client;

// Coin packages configuration
const COIN_PACKAGES = [
    { id: 1, coins: 1000, price: 11, emoji: '🪙' },
    { id: 2, coins: 2000, price: 22, emoji: '💰' },
    { id: 3, coins: 3200, price: 33, emoji: '💎' },
    { id: 4, coins: 8500, price: 88, emoji: '👑' }
];

// Initialize services
const paypalService = new PayPalService();
const paymentMonitor = new PaymentMonitor(paypalService);
const codeGenerator = new CodeGenerator();
const emailService = new EmailService();
const firebaseService = new FirebaseService();

// Discord bot ready event
client.once(Events.ClientReady, () => {
    console.log(`✅ Discord bot logged in as ${client.user.tag}`);
    console.log(`🔗 Bot is ready and connected to Discord!`);
    
    // Initialize logger service
    const logger = new LoggerService(client);
    global.logger = logger;
    
    // Initialize sales tracker
    const salesTracker = new SalesTracker(client);
    global.salesTracker = salesTracker;
    
    // Export firebase service globally
    global.firebaseService = firebaseService;
    
    // Hook console methods to send logs to Discord
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = function(...args) {
        const message = args.map(arg => 
            typeof arg === 'string' ? arg : JSON.stringify(arg)
        ).join(' ');
        originalLog(...args);
        if (logger) {
            logger.addLog('LOG', message);
        }
    };
    
    console.error = function(...args) {
        const message = args.map(arg => 
            typeof arg === 'string' ? arg : JSON.stringify(arg)
        ).join(' ');
        originalError(...args);
        if (logger) {
            logger.addLog('ERROR', message);
        }
    };
    
    console.warn = function(...args) {
        const message = args.map(arg => 
            typeof arg === 'string' ? arg : JSON.stringify(arg)
        ).join(' ');
        originalWarn(...args);
        if (logger) {
            logger.addLog('WARN', message);
        }
    };
    
    // Clear any old monitored orders from previous sessions
    paymentMonitor.clearAll();
});

// Handle slash commands and interactions
client.on(Events.InteractionCreate, async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommand(interaction);
        } else if (interaction.isButton()) {
            await handleButtonInteraction(interaction);
        }
    } catch (error) {
        console.error('❌ Error handling interaction:', error);
        // Try to respond if possible
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ An error occurred. Please try again.',
                    ephemeral: true
                });
            } else if (interaction.deferred) {
                await interaction.editReply({
                    content: '❌ An error occurred. Please try again.',
                    ephemeral: true
                });
            }
        } catch (replyError) {
            console.error('❌ Could not send error message:', replyError.message);
        }
    }
});

// Handle text commands
client.on(Events.MessageCreate, async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;
    
    // Check for !start command
    if (message.content === '!start') {
        // INPUT VALIDATION: Check if user is admin
        const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim()).filter(id => id);
        
        if (!adminIds || adminIds.length === 0) {
            return message.reply('❌ Admin IDs not configured.');
        }
        
        if (!adminIds.includes(message.author.id)) {
            console.warn(`⚠️ Unauthorized !start attempt by ${message.author.tag} (${message.author.id})`);
            return message.reply('❌ You do not have permission to use this command.');
        }
        
        const started = await global.salesTracker?.start(global.firebaseService);
        
        if (started) {
            await message.reply({
                content: '✅ Sales tracking started! The dashboard will be updated with each sale.',
                flags: 64 // Ephemeral
            });
            console.log(`🚀 Sales tracker started by ${message.author.tag}`);
        } else {
            await message.reply({
                content: '❌ Failed to start sales tracking.',
                flags: 64
            });
        }
        return;
    }
    
    // Check for !stop command
    if (message.content === '!stop') {
        // INPUT VALIDATION: Check if user is admin
        const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim()).filter(id => id);
        
        if (!adminIds || adminIds.length === 0) {
            return message.reply('❌ Admin IDs not configured.');
        }
        
        if (!adminIds.includes(message.author.id)) {
            console.warn(`⚠️ Unauthorized !stop attempt by ${message.author.tag} (${message.author.id})`);
            return message.reply('❌ You do not have permission to use this command.');
        }
        
        const stopped = await global.salesTracker?.stop();
        
        if (stopped) {
            await message.reply({
                content: '🛑 Sales tracking stopped.',
                flags: 64
            });
            console.log(`⏹️ Sales tracker stopped by ${message.author.tag}`);
        } else {
            await message.reply({
                content: '❌ Sales tracking is not active.',
                flags: 64
            });
        }
        return;
    }
    
    // Check for !sales command to view data
    if (message.content === '!sales') {
        const data = global.salesTracker?.getSalesData();
        
        if (!data) {
            return message.reply('❌ Sales tracker not initialized.');
        }
        
        const embed = new EmbedBuilder()
            .setTitle('📊 Sales Data')
            .setColor('#00AA00')
            .addFields(
                { name: 'Date (GMT+5:30)', value: data.date, inline: true },
                { name: 'Total Sales', value: `$${data.totalAmount.toFixed(2)}`, inline: true },
                { name: 'Transactions', value: `${data.transactionCount}`, inline: true },
                { name: 'Active', value: data.isActive ? '🟢 Yes' : '🔴 No', inline: true }
            )
            .setFooter({ text: `Last Updated: ${data.lastUpdate}` });
        
        await message.reply({ embeds: [embed] });
        return;
    }
    
    // Check for !test command (admin only)
    if (message.content === '!test') {
        // INPUT VALIDATION: Check if user is admin
        const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim()).filter(id => id);
        
        if (!adminIds || adminIds.length === 0 || !adminIds.includes(message.author.id)) {
            // Silently ignore if not admin
            console.warn(`⚠️ Unauthorized !test attempt by ${message.author.tag} (${message.author.id})`);
            return;
        }
        
        try {
            // Generate test redemption code
            const redemptionCode = codeGenerator.generateCode();
            
            // Calculate expiration (7 days from now)
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            
            // Test transaction data
            const testTransaction = {
                userId: message.author.id,
                username: message.author.username,
                packageId: 'test',
                package: {
                    coins: 1000,
                    price: 1
                },
                orderId: `TEST-${Date.now()}`,
                createdAt: new Date(),
                guildId: message.guildId,
                channelId: message.channelId
            };
            
            // Save to Firebase
            await firebaseService.saveRedemptionCode({
                code: redemptionCode,
                coins: 1000,
                packageId: 'test',
                orderId: testTransaction.orderId,
                payerId: 'TEST_PAYER',
                email: 'test@example.com',
                amount: 1,
                currency: 'USD',
                userId: message.author.id,
                username: message.author.username,
                captureId: `TEST_CAPTURE_${Date.now()}`,
                expiresAt: expiresAt
            });
            
            // Create success embed
            const successEmbed = new EmbedBuilder()
                .setTitle('✅ Test Payment Successful!')
                .setDescription(`This is a test transaction.`)
                .addFields([
                    { name: '🪙 Coins Purchased', value: `1000`, inline: true },
                    { name: '💰 Amount Paid', value: `$1`, inline: true },
                    { name: '🎫 Redemption Code', value: `\`${redemptionCode}\``, inline: false },
                    { name: '⏰ Expires', value: `<t:${Math.floor(expiresAt.getTime() / 1000)}:R>`, inline: true }
                ])
                .setColor(0x00C851)
                .setFooter({ text: 'Test transaction - Keep your redemption code safe!' })
                .setTimestamp();
            
            // Send DM to admin
            try {
                await message.author.send({ embeds: [successEmbed] });
                console.log(`✅ Sent test redemption code to ${message.author.username} via DM`);
            } catch (dmError) {
                console.error(`❌ Could not send DM to ${message.author.username}:`, dmError);
                await message.reply({ embeds: [successEmbed] });
            }
            
            // Send admin notification
            const adminChannelId = process.env.ADMIN_CHANNEL_ID;
            if (adminChannelId) {
                try {
                    const channel = await client.channels.fetch(adminChannelId);
                    if (channel) {
                        const adminEmbed = new EmbedBuilder()
                            .setTitle('🧪 Test Purchase')
                            .setDescription('A test purchase has been completed!')
                            .addFields([
                                { name: '👤 Customer', value: `<@${message.author.id}> (${message.author.username})`, inline: true },
                                { name: '📦 Package', value: `Test Package`, inline: true },
                                { name: '🪙 Coins', value: `1000`, inline: true },
                                { name: '💰 Amount', value: `$1`, inline: true },
                                { name: '🎫 Code', value: `\`${redemptionCode}\``, inline: false },
                                { name: '🆔 Order ID', value: `\`${testTransaction.orderId}\``, inline: false },
                                { name: '⏰ Expires', value: `<t:${Math.floor(expiresAt.getTime() / 1000)}:R>`, inline: true }
                            ])
                            .setColor(0xFFAA00)
                            .setTimestamp();
                        
                        await channel.send({ embeds: [adminEmbed] });
                        console.log(`✅ Sent test purchase notification to admin channel`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to send notification to admin channel:`, error.message);
                }
            }
            
            // Track test sale in sales tracker
            if (global.salesTracker) {
                await global.salesTracker.addSale(1, 'test', message.author.username);
            }
            
            console.log(`✅ Test transaction completed for ${message.author.username} - Code: ${redemptionCode}`);
            
        } catch (error) {
            console.error('❌ Error processing test transaction:', error);
            await message.reply('❌ Failed to process test transaction.');
        }
        
        return;
    }
});

// Handle slash commands
async function handleSlashCommand(interaction) {
    const { commandName } = interaction;

    if (commandName === 'setup') {
        // Check if user has Administrator permission
        if (!interaction.memberPermissions.has('Administrator')) {
            await interaction.reply({
                content: '❌ You need Administrator permission to use this command.',
                ephemeral: true
            });
            return;
        }
        
        await showStoreEmbed(interaction);
    }
}

// Show the main store embed with coin packages
async function showStoreEmbed(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('🏪 Myth Store')
        .setDescription('Select a package below to begin your purchase.')
        .setColor(0x7B68EE)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png?20150315064712') // Replace with actual logo
        .addFields(
            COIN_PACKAGES.map(pkg => ({
                name: `${pkg.emoji} ${pkg.coins} Coins`,
                value: `$${pkg.price}`,
                inline: true
            }))
        )
        .setFooter({ 
            text: 'This panel is always active. Transactions are processed securely via PayPal.' 
        })
        .setTimestamp();

    // Create buttons for each package
    const buttons = COIN_PACKAGES.map(pkg => 
        new ButtonBuilder()
            .setCustomId(`buy_${pkg.id}`)
            .setLabel(`${pkg.coins} coins - $${pkg.price}`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(pkg.emoji)
    );

    // Split buttons into rows (max 5 per row)
    const rows = [];
    for (let i = 0; i < buttons.length; i += 5) {
        const row = new ActionRowBuilder().addComponents(buttons.slice(i, i + 5));
        rows.push(row);
    }

    // Send as a new message in the channel instead of replying
    await interaction.channel.send({
        embeds: [embed],
        components: rows
    });

    // Reply ephemerally to confirm setup
    await interaction.reply({
        content: '✅ Store setup complete! Users can now purchase coins using the buttons above.',
        ephemeral: true
    });
}

// Rate limiting for button interactions
const userCooldowns = new Map();
const COOLDOWN_MS = 5000; // 5 seconds between purchases

// Handle button interactions
async function handleButtonInteraction(interaction) {
    if (interaction.customId.startsWith('buy_')) {
        // RATE LIMITING: Check cooldown
        const userId = interaction.user.id;
        const now = Date.now();
        const cooldownEnd = userCooldowns.get(userId);
        
        if (cooldownEnd && now < cooldownEnd) {
            const remainingSeconds = Math.ceil((cooldownEnd - now) / 1000);
            await interaction.reply({
                content: `⏱️ Please wait ${remainingSeconds} seconds before making another purchase.`,
                ephemeral: true
            });
            return;
        }
        
        // Set cooldown
        userCooldowns.set(userId, now + COOLDOWN_MS);
        
        await handlePurchase(interaction);
    } else if (interaction.customId.startsWith('confirm_')) {
        await handlePaymentConfirmation(interaction);
    }
}

// Handle purchase button clicks
async function handlePurchase(interaction) {
    // Defer immediately to prevent timeout
    await interaction.deferReply({ ephemeral: true });
    
    // INPUT VALIDATION: Validate package ID
    const packageIdStr = interaction.customId.replace('buy_', '');
    const packageId = parseInt(packageIdStr, 10);
    
    if (isNaN(packageId) || packageId < 1 || packageId > 4) {
        await interaction.editReply({
            content: '❌ Invalid package selected.',
            ephemeral: true
        });
        return;
    }
    
    const package = COIN_PACKAGES.find(pkg => pkg.id === packageId);
    
    if (!package) {
        await interaction.editReply({
            content: '❌ Invalid package selected.',
            ephemeral: true
        });
        return;
    }
    
    // Validate user
    if (!interaction.user || !interaction.user.id) {
        await interaction.editReply({
            content: '❌ Unable to identify user.',
            ephemeral: true
        });
        return;
    }

    try {
        // Create PayPal order
        const paypalOrder = await paypalService.createOrder(
            package.price, 
            packageId,
            {
                userId: interaction.user.id,
                username: interaction.user.username
            }
        );
        
        if (!paypalOrder.success) {
            await interaction.editReply({
                content: `❌ Failed to create payment order: ${paypalOrder.message}`,
                ephemeral: true
            });
            return;
        }

        // Store transaction data
        const transactionId = paypalOrder.id;
        pendingTransactions.set(transactionId, {
            userId: interaction.user.id,
            username: interaction.user.username,
            packageId: packageId,
            package: package,
            orderId: paypalOrder.id,
            createdAt: new Date(),
            guildId: interaction.guildId,
            channelId: interaction.channelId
        });

        // Get PayPal approval URL
        const approvalUrl = paypalOrder.links.find(link => link.rel === 'approve')?.href;

        if (!approvalUrl) {
            await interaction.editReply({
                content: '❌ Failed to get PayPal payment URL.',
                ephemeral: true
            });
            return;
        }

        // Create payment embed
        const paymentEmbed = new EmbedBuilder()
            .setTitle('💳 Complete Your Purchase')
            .setDescription(`**Package:** ${package.coins} coins\n**Price:** $${package.price}\n\nClick the button below to complete your payment via PayPal.`)
            .setColor(0x00C851)
            .setFooter({ text: 'Payment expires in 15 minutes' })
            .setTimestamp();

        const paymentButton = new ButtonBuilder()
            .setLabel('Pay with PayPal')
            .setStyle(ButtonStyle.Link)
            .setURL(approvalUrl)
            .setEmoji('💳');

        const row = new ActionRowBuilder().addComponents(paymentButton);

        await interaction.editReply({
            embeds: [paymentEmbed],
            components: [row]
        });

        // Start monitoring the payment (no webhooks needed!)
        await paymentMonitor.monitorOrder(
            transactionId,
            pendingTransactions.get(transactionId),
            // Success callback
            async (transaction, paymentData) => {
                await processPaymentSuccess(transaction, paymentData, {
                    paypalService,
                    codeGenerator,
                    emailService,
                    firebaseService
                }, client);
                pendingTransactions.delete(transactionId);
            },
            // Failure callback
            async (transaction, reason) => {
                console.log(`❌ Payment failed for ${transaction.username}: ${reason}`);
                pendingTransactions.delete(transactionId);
            }
        );

    } catch (error) {
        console.error('Error creating purchase:', error);
        await interaction.editReply({
            content: '❌ An error occurred while creating your purchase. Please try again.',
            ephemeral: true
        });
    }
}

// Register slash commands
async function registerCommands() {
    const commands = [
        {
            name: 'setup',
            description: 'Setup the Medusa Store with coin packages in this channel',
            default_member_permissions: '8' // Administrator permission only
        }
    ];

    try {
        console.log('🔄 Registering slash commands...');
        
        const rest = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v10');
        
        const restClient = new rest.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        await restClient.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commands }
        );
        
        console.log('✅ Successfully registered slash commands');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}

// Start the bot (no server needed!)
async function start() {
    try {
        console.log('🚀 Starting Discord bot...');
        console.log('✅ No server/domain required - using PayPal polling!');

        // Register commands
        await registerCommands();

        // Login to Discord
        await client.login(process.env.DISCORD_TOKEN);
        
    } catch (error) {
        console.error('❌ Failed to start bot:', error);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down bot...');
    
    // Flush any remaining logs
    if (global.logger) {
        await global.logger.flush();
    }
    
    client.destroy();
    process.exit(0);
});

// Start the application
start();

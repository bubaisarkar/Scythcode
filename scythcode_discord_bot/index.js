const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config();

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token"
    }),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

const db = admin.firestore();

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

// Coin packages
const COIN_PACKAGES = [
  { id: 'starter', coins: 1500, price: 11, emoji: '🪙' },
  { id: 'basic', coins: 2500, price: 22, bonus: 100, emoji: '💰' },
  { id: 'popular', coins: 3600, price: 33, popular: true, bonus: 300, badge: 'MOST POPULAR', emoji: '💎' },
  { id: 'premium', coins: 4700, price: 44, bonus: 500, emoji: '👑' },
  { id: 'pro', coins: 5800, price: 55, bonus: 800, badge: 'BEST VALUE', emoji: '⭐' },
  { id: 'elite', coins: 9300, price: 88, bonus: 1500, emoji: '💸' },
  { id: 'mega', coins: 22000, price: 200, bonus: 4000, badge: 'ULTIMATE', emoji: '🔥' },
];

client.once(Events.ClientReady, async () => {
  console.log(`✅ Discord bot logged in as ${client.user.tag}`);
  
  // Register slash commands
  await registerCommands();
  
  // Listen for new redemption codes
  listenForRedemptionCodes();
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
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: '❌ An error occurred. Please try again.',
        ephemeral: true
      });
    }
  }
});

// Handle slash commands
async function handleSlashCommand(interaction) {
  const { commandName } = interaction;

  if (commandName === 'setup') {
    if (!interaction.memberPermissions.has('Administrator')) {
      await interaction.reply({
        content: '❌ You need Administrator permission to use this command.',
        ephemeral: true
      });
      return;
    }
    
    await showStoreEmbed(interaction);
  } else if (commandName === 'redeem') {
    const code = interaction.options.getString('code');
    await handleRedeemCode(interaction, code);
  }
}

// Show the main store embed
async function showStoreEmbed(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('🏪 Scythcode Store')
    .setDescription('Select a package below to purchase coins.\n\nClick the button to visit our payment page.')
    .setColor(0x0EA5E9)
    .addFields(
      COIN_PACKAGES.map(pkg => ({
        name: `${pkg.emoji} ${pkg.coins} Coins ${pkg.badge ? `(${pkg.badge})` : ''}`,
        value: `$${pkg.price}${pkg.bonus ? ` - Bonus: +${pkg.bonus} coins!` : ''}`,
        inline: true
      }))
    )
    .setFooter({ 
      text: 'Secure payments via Razorpay • Instant delivery' 
    })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('💳 Visit Payment Page')
      .setStyle(ButtonStyle.Link)
      .setURL('https://scythcode.in/payment'),
    new ButtonBuilder()
      .setCustomId('check_code')
      .setLabel('🎫 I have a code')
      .setStyle(ButtonStyle.Success)
  );

  await interaction.channel.send({
    embeds: [embed],
    components: [row]
  });

  await interaction.reply({
    content: '✅ Store setup complete! Users can now purchase coins.',
    ephemeral: true
  });
}

// Handle button interactions
async function handleButtonInteraction(interaction) {
  if (interaction.customId === 'check_code') {
    const embed = new EmbedBuilder()
      .setTitle('🎫 Redeem Your Code')
      .setDescription('Use the `/redeem` command with your redemption code.\n\nExample: `/redeem code:XXXX-XXXX-XXXX-XXXX`')
      .setColor(0x00C851);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
}

// Handle redemption
async function handleRedeemCode(interaction, code) {
  await interaction.deferReply({ ephemeral: true });

  try {
    // Find redemption code
    const snapshot = await db.collection('redemption_codes')
      .where('code', '==', code.toUpperCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      await interaction.editReply({
        content: '❌ Invalid redemption code. Please check and try again.',
        ephemeral: true
      });
      return;
    }

    const doc = snapshot.docs[0];
    const codeData = doc.data();

    // Check if already redeemed
    if (codeData.isRedeemed) {
      await interaction.editReply({
        content: '❌ This code has already been redeemed.',
        ephemeral: true
      });
      return;
    }

    // Check if expired
    const expiresAt = codeData.expiresAt.toDate();
    if (expiresAt < new Date()) {
      await interaction.editReply({
        content: '❌ This code has expired.',
        ephemeral: true
      });
      return;
    }

    // Link Discord account with Firebase user if needed
    const userId = interaction.user.id;
    const userEmail = codeData.user_email;
    const firebaseUserId = codeData.firebase_user_id;
    const coins = codeData.coins;

    // Update user coins in Firebase
    const userRef = db.collection('users').doc(firebaseUserId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      await userRef.update({
        coins: admin.firestore.FieldValue.increment(coins),
        discord_id: userId,
        discord_username: interaction.user.username,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await userRef.set({
        coins: coins,
        discord_id: userId,
        discord_username: interaction.user.username,
        email: userEmail,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Mark code as redeemed
    await doc.ref.update({
      isRedeemed: true,
      redeemedBy: userId,
      redeemedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send success message
    const successEmbed = new EmbedBuilder()
      .setTitle('✅ Code Redeemed Successfully!')
      .setDescription(`You have received **${coins} coins**!`)
      .addFields([
        { name: '🪙 Coins Added', value: `${coins}`, inline: true },
        { name: '📅 Redeemed On', value: new Date().toLocaleDateString(), inline: true }
      ])
      .setColor(0x00C851)
      .setTimestamp();

    await interaction.editReply({
      embeds: [successEmbed],
      ephemeral: true
    });

    console.log(`✅ ${interaction.user.username} redeemed ${coins} coins with code ${code}`);

  } catch (error) {
    console.error('Error redeeming code:', error);
    await interaction.editReply({
      content: '❌ An error occurred while redeeming your code. Please try again later.',
      ephemeral: true
    });
  }
}

// Listen for new redemption codes from website purchases
function listenForRedemptionCodes() {
  db.collection('redemption_codes')
    .where('source', '==', 'website')
    .where('isRedeemed', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .onSnapshot(async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const codeData = change.doc.data();
          
          // Only send DM for new codes (within last 5 minutes)
          const createdAt = codeData.createdAt?.toDate() || new Date();
          const now = new Date();
          const diffMinutes = (now - createdAt) / 1000 / 60;
          
          if (diffMinutes > 5) return; // Skip old codes
          
          // Try to find user by Firebase UID or email
          const firebaseUserId = codeData.firebase_user_id;
          const userEmail = codeData.user_email;
          
          // Check if user has Discord linked
          const userDoc = await db.collection('users').doc(firebaseUserId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const discordId = userData.discord_id;
            
            if (discordId) {
              await sendRedemptionCodeDM(discordId, codeData);
            }
          }
        }
      });
    });
}

// Send redemption code via DM
async function sendRedemptionCodeDM(discordUserId, codeData) {
  try {
    const user = await client.users.fetch(discordUserId);
    
    const expiresAt = codeData.expiresAt.toDate();
    
    const embed = new EmbedBuilder()
      .setTitle('✅ Payment Successful!')
      .setDescription(`Thank you for your purchase on Scythcode!`)
      .addFields([
        { name: '🪙 Coins Purchased', value: `${codeData.coins}`, inline: true },
        { name: '🎫 Redemption Code', value: `\`${codeData.code}\``, inline: false },
        { name: '⏰ Expires', value: `<t:${Math.floor(expiresAt.getTime() / 1000)}:R>`, inline: true }
      ])
      .setColor(0x00C851)
      .setFooter({ text: 'Use /redeem to claim your coins!' })
      .setTimestamp();

    await user.send({ embeds: [embed] });
    console.log(`✅ Sent redemption code to ${user.username} via DM`);
  } catch (error) {
    console.error(`❌ Could not send DM to user ${discordUserId}:`, error.message);
  }
}

// Register slash commands
async function registerCommands() {
  const commands = [
    {
      name: 'setup',
      description: 'Setup the Scythcode Store with coin packages in this channel',
      default_member_permissions: '8'
    },
    {
      name: 'redeem',
      description: 'Redeem your coin purchase code',
      options: [
        {
          name: 'code',
          description: 'Your redemption code (XXXX-XXXX-XXXX-XXXX)',
          type: 3, // STRING
          required: true
        }
      ]
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

// Start the bot
async function start() {
  try {
    console.log('🚀 Starting Scythcode Discord bot...');
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('🛑 Shutting down bot...');
  client.destroy();
  process.exit(0);
});

start();

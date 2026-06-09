const { EmbedBuilder } = require('discord.js');

class SalesTracker {
    constructor(client) {
        this.client = client;
        this.viewDataChannelId = process.env.VIEW_DATA_CHANNEL_ID;
        this.messageId = null;
        this.isActive = false;
        
        // Sales tracking data (GMT+5:30 based)
        this.dailySales = [];
        this.totalAmount = 0;
        this.currentDate = this.getTodayGMT530();
        
        console.log(`📊 Sales Tracker initialized - View Data Channel: ${this.viewDataChannelId}`);
    }

    /**
     * Get current date in GMT+5:30 timezone (YYYY-MM-DD format)
     */
    getTodayGMT530() {
        const now = new Date();
        // Convert to GMT+5:30 (IST)
        const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        return istTime.toISOString().split('T')[0];
    }

    /**
     * Format time to GMT+5:30
     */
    formatTimeGMT530(date = new Date()) {
        const istTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
        return istTime.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kolkata'
        });
    }

    /**
     * Load sales data from Firebase for today
     */
    async loadFromFirebase(firebaseService) {
        try {
            const today = this.getTodayGMT530();
            console.log(`📥 Loading sales data from Firebase for ${today}...`);
            
            // Fetch all redemption codes from Firebase
            const codes = await firebaseService.fetchAllRedemptionCodes();
            
            if (!codes || codes.length === 0) {
                console.log('ℹ️ No existing sales found in Firebase');
                return;
            }
            
            // Filter codes for today and sum them
            let loadedCount = 0;
            let loadedAmount = 0;
            
            codes.forEach(code => {
                // Check if code was created today (GMT+5:30)
                const codeDate = code.createdAt ? new Date(code.createdAt) : null;
                if (!codeDate) return;
                
                const istTime = new Date(codeDate.getTime() + (5.5 * 60 * 60 * 1000));
                const codeDay = istTime.toISOString().split('T')[0];
                
                if (codeDay === today) {
                    loadedAmount += parseFloat(code.amount) || 0;
                    loadedCount++;
                    
                    // Add to sales tracking
                    this.dailySales.push({
                        timestamp: this.formatTimeGMT530(codeDate),
                        amount: parseFloat(code.amount) || 0,
                        packageId: code.packageId || 'unknown',
                        username: code.username || 'Unknown'
                    });
                }
            });
            
            this.totalAmount = loadedAmount;
            console.log(`✅ Loaded ${loadedCount} sales from Firebase - Total: $${loadedAmount.toFixed(2)}`);
            
        } catch (error) {
            console.error('❌ Error loading sales from Firebase:', error.message);
        }
    }

    /**
     * Add a sale and update embed
     */
    async addSale(amount, packageId, username) {
        // Check if we need to reset (new day in GMT+5:30)
        const today = this.getTodayGMT530();
        if (today !== this.currentDate) {
            console.log(`🔄 Sales reset - new day in GMT+5:30`);
            this.dailySales = [];
            this.totalAmount = 0;
            this.currentDate = today;
        }

        // Add sale
        const sale = {
            timestamp: this.formatTimeGMT530(),
            amount: amount,
            packageId: packageId,
            username: username
        };

        this.dailySales.push(sale);
        this.totalAmount += amount;

        // Update embed if active
        if (this.isActive && this.messageId) {
            await this.updateEmbed();
        }

        console.log(`💰 Sale tracked: $${amount} by ${username} (Total: $${this.totalAmount})`);
    }

    /**
     * Create sales embed
     */
    createEmbed() {
        const embed = new EmbedBuilder()
            .setTitle('📊 Daily Sales Dashboard')
            .setColor('#FFD700')
            .setDescription(`Sales Data for ${this.currentDate} (GMT+5:30)`)
            .addFields(
                {
                    name: '💵 Total Sales Today',
                    value: `$${this.totalAmount.toFixed(2)}`,
                    inline: false
                },
                {
                    name: '🛍️ Total Transactions',
                    value: `${this.dailySales.length}`,
                    inline: true
                },
                {
                    name: '📈 Average Sale',
                    value: this.dailySales.length > 0 
                        ? `$${(this.totalAmount / this.dailySales.length).toFixed(2)}`
                        : `$0.00`,
                    inline: true
                }
            );

        // Add last 5 sales
        if (this.dailySales.length > 0) {
            const lastSales = this.dailySales.slice(-5).reverse();
            const salesList = lastSales
                .map(sale => `\`${sale.timestamp}\` → **$${sale.amount.toFixed(2)}** (${sale.username})`)
                .join('\n');
            
            embed.addFields({
                name: '📝 Recent Sales',
                value: salesList,
                inline: false
            });
        }

        embed.setFooter({
            text: `Last Updated: ${this.formatTimeGMT530()}`,
            iconURL: 'https://cdn-icons-png.flaticon.com/512/3143/3143615.png'
        });

        return embed;
    }

    /**
     * Start tracking (create or fetch embed message)
     */
    async start(firebaseService = null) {
        if (this.isActive) {
            console.log('⚠️ Sales tracker already active');
            return false;
        }

        try {
            // Load existing data from Firebase first (only once)
            if (firebaseService) {
                await this.loadFromFirebase(firebaseService);
            }

            const channel = await this.client.channels.fetch(this.viewDataChannelId).catch(() => null);
            
            if (!channel) {
                console.error('❌ View Data channel not found');
                return false;
            }

            // Create initial embed message with loaded data
            const embed = this.createEmbed();
            const message = await channel.send({ embeds: [embed] }).catch(err => {
                console.error('❌ Failed to send embed:', err.message);
                return null;
            });

            if (message) {
                this.messageId = message.id;
                this.isActive = true;
                console.log(`✅ Sales tracker started - Message ID: ${this.messageId}`);
                return true;
            }

            return false;

        } catch (error) {
            console.error('❌ Error starting sales tracker:', error.message);
            return false;
        }
    }

    /**
     * Update embed message
     */
    async updateEmbed() {
        if (!this.isActive || !this.messageId) {
            console.log('⚠️ Sales tracker not active or no message ID');
            return false;
        }

        try {
            const channel = await this.client.channels.fetch(this.viewDataChannelId).catch(() => null);
            
            if (!channel) {
                console.error('❌ View Data channel not found');
                return false;
            }

            const message = await channel.messages.fetch(this.messageId).catch(() => null);
            
            if (!message) {
                console.error('❌ Embed message not found');
                return false;
            }

            const embed = this.createEmbed();
            await message.edit({ embeds: [embed] }).catch(err => {
                console.error('❌ Failed to update embed:', err.message);
            });

            return true;

        } catch (error) {
            console.error('❌ Error updating embed:', error.message);
            return false;
        }
    }

    /**
     * Stop tracking
     */
    async stop() {
        if (!this.isActive) {
            console.log('⚠️ Sales tracker not active');
            return false;
        }

        this.isActive = false;
        this.messageId = null;
        console.log('🛑 Sales tracker stopped');
        return true;
    }

    /**
     * Get current sales data
     */
    getSalesData() {
        return {
            date: this.currentDate,
            totalAmount: this.totalAmount,
            transactionCount: this.dailySales.length,
            lastUpdate: this.formatTimeGMT530(),
            isActive: this.isActive,
            recentSales: this.dailySales.slice(-10)
        };
    }
}

module.exports = SalesTracker;

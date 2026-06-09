const { EmbedBuilder } = require('discord.js');

class LoggerService {
    constructor(client) {
        this.client = client;
        this.logChannelId = process.env.LOG_CHANNEL_ID;
        this.logQueue = [];
        this.isSending = false;
        this.maxLogsPerMessage = 15; // Max logs to batch before sending
        this.sendInterval = 2000; // Send logs every 2 seconds
        
        if (this.logChannelId) {
            console.log(`📝 Logger service initialized - sending logs to channel ${this.logChannelId}`);
            this.startLogProcessor();
        }
    }

    /**
     * Format log message with timestamp
     */
    formatLog(level, message) {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const levelEmoji = {
            'LOG': 'ℹ️',
            'WARN': '⚠️',
            'ERROR': '❌'
        }[level] || 'ℹ️';
        
        return `${levelEmoji} **[${timestamp}]** \`${level}\` ${message}`;
    }

    /**
     * Add log to queue
     */
    addLog(level, message) {
        if (!this.logChannelId) return;
        
        // Convert message to string if it's an object
        const logMessage = typeof message === 'string' 
            ? message 
            : JSON.stringify(message, null, 2);
        
        // Truncate very long messages
        const truncated = logMessage.length > 1900 
            ? logMessage.substring(0, 1897) + '...' 
            : logMessage;
        
        this.logQueue.push({
            level,
            message: truncated,
            formatted: this.formatLog(level, truncated)
        });

        // Send immediately if queue is getting large
        if (this.logQueue.length >= this.maxLogsPerMessage) {
            this.sendLogs();
        }
    }

    /**
     * Process and send queued logs
     */
    async sendLogs() {
        if (this.isSending || this.logQueue.length === 0) return;
        
        this.isSending = true;
        
        try {
            const channel = await this.client.channels.fetch(this.logChannelId).catch(() => null);
            
            if (!channel) {
                console.error('❌ Log channel not found');
                this.isSending = false;
                return;
            }

            // Get logs to send (limit to avoid message length)
            const logsToSend = [];
            let messageLength = 0;
            
            while (this.logQueue.length > 0 && messageLength < 1800) {
                const log = this.logQueue.shift();
                messageLength += log.formatted.length + 2; // +2 for newline
                
                if (messageLength > 1800) {
                    // Put it back if it exceeds limit
                    this.logQueue.unshift(log);
                    break;
                }
                
                logsToSend.push(log.formatted);
            }

            if (logsToSend.length === 0) {
                this.isSending = false;
                return;
            }

            // Send logs as code block
            const content = logsToSend.join('\n');
            
            if (content.length > 2000) {
                // Split into multiple messages if needed
                for (let i = 0; i < content.length; i += 1900) {
                    await channel.send({
                        content: content.substring(i, i + 1900),
                        allowedMentions: { parse: [] }
                    }).catch(err => {
                        console.error('Failed to send log:', err.message);
                    });
                }
            } else {
                await channel.send({
                    content: content,
                    allowedMentions: { parse: [] }
                }).catch(err => {
                    console.error('Failed to send log:', err.message);
                });
            }

        } catch (error) {
            console.error('💥 Error sending logs to Discord:', error.message);
        } finally {
            this.isSending = false;
        }
    }

    /**
     * Start periodic log processor
     */
    startLogProcessor() {
        setInterval(() => {
            if (this.logQueue.length > 0) {
                this.sendLogs();
            }
        }, this.sendInterval);
    }

    /**
     * Flush all remaining logs
     */
    async flush() {
        while (this.logQueue.length > 0) {
            await this.sendLogs();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

module.exports = LoggerService;

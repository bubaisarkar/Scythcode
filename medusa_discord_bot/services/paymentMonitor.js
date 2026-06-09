/**
 * Payment Monitor Service
 * Polls PayPal orders to check payment status without needing webhooks
 */

class PaymentMonitor {
    constructor(paypalService) {
        this.paypalService = paypalService;
        this.monitoredOrders = new Map();
        this.pollInterval = 10000; // Check every 10 seconds
        this.maxAttempts = 90; // Monitor for 15 minutes (90 * 10 seconds)
    }

    /**
     * Start monitoring a PayPal order
     */
    async monitorOrder(orderId, transaction, onSuccess, onFailure) {
        // Check if already monitoring this order
        if (this.monitoredOrders.has(orderId)) {
            const userInfo = transaction.userId ? ` - <@${transaction.userId}> (${transaction.username || 'Unknown'})` : '';
            console.log(`⚠️ Order ${orderId} is already being monitored - skipping duplicate${userInfo}`);
            return;
        }

        const userInfo = transaction.userId ? ` - <@${transaction.userId}> (${transaction.username || 'Unknown'})` : '';
        console.log(`👀 Starting to monitor order: ${orderId}${userInfo}`);
        
        const monitorData = {
            orderId,
            transaction,
            onSuccess,
            onFailure,
            attempts: 0,
            startTime: Date.now()
        };

        this.monitoredOrders.set(orderId, monitorData);
        this.checkOrderStatus(orderId);
    }

    /**
     * Check order status recursively
     */
    async checkOrderStatus(orderId) {
        const monitorData = this.monitoredOrders.get(orderId);
        
        if (!monitorData) {
            console.log(`⚠️ Order ${orderId} no longer being monitored`);
            return;
        }

        monitorData.attempts++;
        const userInfo = monitorData.transaction.userId ? ` - <@${monitorData.transaction.userId}> (${monitorData.transaction.username || 'Unknown'})` : '';

        try {
            // Get order details from PayPal
            const orderDetails = await this.paypalService.getOrderDetails(orderId);

            if (orderDetails.success) {
                const status = orderDetails.status;
                
                console.log(`📊 Order ${orderId} status: ${status} (attempt ${monitorData.attempts})${userInfo}`);

                if (status === 'COMPLETED' || status === 'APPROVED') {
                    // Payment successful!
                    console.log(`✅ Payment detected for order: ${orderId}${userInfo}`);
                    console.log(`🛑 Stopping monitor for order: ${orderId}${userInfo}`);
                    
                    // Stop monitoring FIRST to prevent duplicate processing
                    this.monitoredOrders.delete(orderId);
                    
                    // Capture the payment if it's only approved
                    if (status === 'APPROVED') {
                        const captureResult = await this.paypalService.captureOrder(orderId);
                        if (captureResult.success) {
                            await monitorData.onSuccess(monitorData.transaction, captureResult);
                        } else {
                            await monitorData.onFailure(monitorData.transaction, 'Failed to capture payment');
                        }
                    } else {
                        // Already completed
                        await monitorData.onSuccess(monitorData.transaction, orderDetails);
                    }
                    
                    return;
                }
                
                if (status === 'VOIDED' || status === 'CANCELLED') {
                    // Payment cancelled
                    console.log(`❌ Payment cancelled for order: ${orderId}${userInfo}`);
                    await monitorData.onFailure(monitorData.transaction, 'Payment was cancelled');
                    this.monitoredOrders.delete(orderId);
                    return;
                }
            }

            // Check if we should continue monitoring
            if (monitorData.attempts >= this.maxAttempts) {
                console.log(`⏱️ Monitoring timeout for order: ${orderId}${userInfo}`);
                await monitorData.onFailure(monitorData.transaction, 'Payment timeout - order expired');
                this.monitoredOrders.delete(orderId);
                return;
            }

            // Continue monitoring
            setTimeout(() => {
                this.checkOrderStatus(orderId);
            }, this.pollInterval);

        } catch (error) {
            const userInfo = monitorData.transaction.userId ? ` - <@${monitorData.transaction.userId}> (${monitorData.transaction.username || 'Unknown'})` : '';
            console.error(`❌ Error checking order ${orderId}${userInfo}:`, error);
            
            // Retry unless max attempts reached
            if (monitorData.attempts < this.maxAttempts) {
                setTimeout(() => {
                    this.checkOrderStatus(orderId);
                }, this.pollInterval);
            } else {
                await monitorData.onFailure(monitorData.transaction, 'Monitoring error: ' + error.message);
                this.monitoredOrders.delete(orderId);
            }
        }
    }

    /**
     * Stop monitoring an order
     */
    stopMonitoring(orderId) {
        const monitorData = this.monitoredOrders.get(orderId);
        if (monitorData) {
            const userInfo = monitorData.transaction.userId ? ` - <@${monitorData.transaction.userId}> (${monitorData.transaction.username || 'Unknown'})` : '';
            console.log(`🛑 Stopped monitoring order: ${orderId}${userInfo}`);
            this.monitoredOrders.delete(orderId);
            return true;
        }
        return false;
    }

    /**
     * Get monitoring status
     */
    getMonitoringStatus() {
        return {
            activeOrders: this.monitoredOrders.size,
            orders: Array.from(this.monitoredOrders.keys())
        };
    }

    /**
     * Clear all monitored orders (useful on bot restart)
     */
    clearAll() {
        const count = this.monitoredOrders.size;
        if (count > 0) {
            console.log(`🧹 Clearing ${count} old monitored orders`);
            this.monitoredOrders.clear();
        }
        return count;
    }
}

module.exports = PaymentMonitor;

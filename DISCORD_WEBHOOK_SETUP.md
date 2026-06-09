# Discord Webhook Setup for Purchase Notifications

This guide explains how to set up Discord webhook notifications for coin purchases on Scythcode.

## Overview

When a user completes a coin purchase through Razorpay, the system will automatically send a notification to your Discord channel with:
- Customer information (email and user ID)
- Package details
- Coins purchased
- Amount paid
- Order and payment IDs
- Timestamp

## Setup Instructions

### 1. Create a Discord Webhook

1. Open your Discord server
2. Go to **Server Settings** > **Integrations** > **Webhooks**
3. Click **New Webhook** or **Create Webhook**
4. Configure the webhook:
   - **Name**: Scythcode Purchases (or any name you prefer)
   - **Channel**: Select the channel where you want notifications
   - **Avatar**: Optional - upload a custom icon
5. Click **Copy Webhook URL**

### 2. Add Webhook URL to Environment Variables

Add the webhook URL and optionally admin IDs to your `.env.local` file:

```bash
# Discord webhook URL (required)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Discord admin user IDs to ping on purchases (optional)
# Comma-separated list, e.g., 123456789012345678,987654321098765432
DISCORD_ADMIN_IDS=YOUR_DISCORD_USER_ID,ANOTHER_ADMIN_ID
```

**How to get your Discord User ID:**
1. Open Discord settings
2. Go to **Advanced** (under App Settings)
3. Enable **Developer Mode**
4. Right-click your username anywhere in Discord
5. Click **Copy User ID**
6. Paste it into the `DISCORD_ADMIN_IDS` variable

**Important**: Never commit this URL to Git! It's already listed in `.gitignore` for protection.

### 3. Deploy to Production

If using Vercel:

1. Go to your project on Vercel dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add `DISCORD_WEBHOOK_URL` with your webhook URL
4. Add `DISCORD_ADMIN_IDS` with comma-separated Discord user IDs (optional)
5. Redeploy your application

## Notification Format

Each purchase notification includes a rich embed with **optional admin pings**:

**If admin IDs configured:**
```
@YourName @AnotherAdmin

🛒 New Purchase
A new coin purchase has been completed!

👤 Customer: user@example.com
📦 Package: Popular
🪙 Coins: 3600
💰 Amount: $33
🆔 Order ID: order_xxxxxxxxxxxxx
💳 Payment ID: pay_xxxxxxxxxxxxx
⏰ Timestamp: Tuesday, June 9, 2026 at 10:30 AM
```

## Testing

### Get Admin Mentions Working

1. **Enable Developer Mode in Discord**:
   - User Settings → Advanced → Enable Developer Mode

2. **Get Your Discord User ID**:
   - Right-click your username in Discord
   - Click "Copy User ID"
   - Should look like: `123456789012345678`

3. **Add to Environment Variables**:
   ```bash
   DISCORD_ADMIN_IDS=123456789012345678
   ```
   
   For multiple admins (comma-separated):
   ```bash
   DISCORD_ADMIN_IDS=123456789012345678,987654321098765432
   ```

4. **Restart Development Server**:
   ```bash
   npm run dev
   ```

### Test with Sandbox Payment

1. Make a test purchase using Razorpay sandbox credentials
2. Use test card: `4111 1111 1111 1111`, CVV: `123`, Expiry: any future date
3. Complete the payment
4. Check your Discord channel for the notification

### Disable Notifications

To disable Discord notifications:
- Remove or comment out `DISCORD_WEBHOOK_URL` from your environment variables
- The system will log a message and continue without sending notifications

## Implementation Details

The Discord webhook integration is implemented in:
- **File**: `src/app/api/payment/verify/route.ts`
- **Function**: `sendDiscordNotification()`

The system uses the Discord Webhook API to send formatted embeds similar to the Discord bot project structure.

## Troubleshooting

### Notifications not appearing

1. **Check webhook URL**: Make sure it's correctly set in environment variables
2. **Verify webhook is active**: Go to Discord webhook settings and ensure it's not deleted
3. **Check console logs**: Look for webhook-related error messages
4. **Test webhook manually**: Use a tool like Postman to send a test message

### Webhook rate limits

Discord webhooks have rate limits:
- **5 requests per 2 seconds** per webhook
- If exceeded, requests will be delayed or rejected

The current implementation doesn't have rate limiting protection since typical purchase volume is low. If you experience high volume, consider implementing a queue system.

## Security Notes

- ✅ Webhook URL is private - never share it publicly
- ✅ The URL is already in `.gitignore` to prevent accidental commits
- ✅ Notifications are sent AFTER payment verification
- ✅ All payment data is validated before sending notifications

## Related Files

- `src/app/api/payment/verify/route.ts` - Payment verification and webhook sending
- `src/app/payment/page.tsx` - Payment page with package selection
- `D:\medusa\medusa_discord_bot\index.js` - Reference Discord bot implementation
- `.env.local.example` - Environment variables template

## Questions?

If you need help setting up Discord webhooks:
1. Check Discord's official documentation: https://discord.com/developers/docs/resources/webhook
2. Review the Discord bot project for reference: `D:\medusa\medusa_discord_bot`

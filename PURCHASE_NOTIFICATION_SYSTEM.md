# Purchase Notification System

## Overview

The Scythcode website now has an automated purchase notification system that mirrors the Discord bot project implementation. When a user completes a coin purchase, the system automatically:

1. ✅ Verifies the Razorpay payment
2. ✅ Updates user coins in Firebase
3. ✅ Logs transaction in Firestore
4. ✅ Sends rich Discord webhook notification

## Implementation Summary

### Files Modified

1. **`src/app/api/payment/verify/route.ts`**
   - Added `sendDiscordNotification()` function
   - Sends rich embed to Discord webhook after successful payment
   - Includes all purchase details (user, package, coins, amount, IDs, timestamp)
   - Handles missing webhook URL gracefully (logs warning, continues processing)

2. **`src/app/payment/page.tsx`**
   - Updated payment verification call to include `packageId` and `userEmail`
   - These fields are used for Discord notifications and transaction logging

3. **`.env.local.example`**
   - Added `DISCORD_WEBHOOK_URL` configuration example
   - Documented how to get webhook URL from Discord

4. **`DISCORD_WEBHOOK_SETUP.md`** (NEW)
   - Complete setup guide for Discord webhooks
   - Testing instructions
   - Troubleshooting tips

## Discord Notification Format

```
🛒 New Purchase
A new coin purchase has been completed!

👤 Customer: user@example.com (or user ID if no email)
📦 Package: Starter/Basic/Popular/Premium/Pro/Elite/Mega
🪙 Coins: [amount]
💰 Amount: $[price]
🆔 Order ID: `order_xxxxxxxxxxxxx`
💳 Payment ID: `pay_xxxxxxxxxxxxx`
⏰ Timestamp: [Discord timestamp format]
```

## Coin Packages

The system includes 7 coin packages:

| Package | Coins | Price | Bonus | Badge |
|---------|-------|-------|-------|-------|
| Starter | 1,500 | $11 | - | - |
| Basic | 2,500 | $22 | +100 | - |
| Popular | 3,600 | $33 | +300 | MOST POPULAR |
| Premium | 4,700 | $44 | +500 | - |
| Pro | 5,800 | $55 | +800 | BEST VALUE |
| Elite | 9,300 | $88 | +1,500 | - |
| Mega | 22,000 | $200 | +4,000 | ULTIMATE |

## How It Works

### Purchase Flow

```
User selects package
    ↓
Razorpay payment initiated
    ↓
User completes payment
    ↓
Payment verification (signature check)
    ↓
Update user coins in Firebase
    ↓
Log transaction in Firestore
    ↓
Send Discord webhook notification
    ↓
Success response to user
```

### Data Stored in Firebase

**Users Collection** (`users/{userId}`):
- `coins`: Total coins balance (incremented)
- `updated_at`: Timestamp
- `created_at`: Timestamp (if new user)

**Transactions Collection** (`transactions/{transactionId}`):
- `user_id`: Firebase Auth UID
- `user_email`: User's email address
- `type`: "coin_purchase"
- `coins`: Number of coins purchased
- `amount`: Dollar amount paid
- `package_id`: Package identifier (starter, basic, popular, etc.)
- `razorpay_order_id`: Razorpay order ID
- `razorpay_payment_id`: Razorpay payment ID
- `status`: "completed"
- `created_at`: Server timestamp

## Setup Instructions

### 1. Configure Discord Webhook

Create a webhook in your Discord server and add to `.env.local`:

```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

See `DISCORD_WEBHOOK_SETUP.md` for detailed instructions.

### 2. Verify Razorpay Configuration

Ensure these are set in `.env.local`:

```bash
RAZORPAY_KEY_ID=rzp_test_SzYuBDKYMlGfnU
RAZORPAY_KEY_SECRET=LQJWva7x1Gsr36DwUCtN23OA
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_SzYuBDKYMlGfnU
RAZORPAY_MODE=sandbox
```

### 3. Test the System

1. Navigate to `/payment` page
2. Login with Firebase Auth
3. Select a coin package
4. Use test card: `4111 1111 1111 1111`, CVV: `123`
5. Complete payment
6. Check Discord channel for notification
7. Verify coins added in dashboard

## Comparison with Discord Bot Project

| Feature | Discord Bot | Website |
|---------|------------|---------|
| Payment Gateway | PayPal | Razorpay |
| User Auth | Discord User ID | Firebase Auth |
| Code System | Redemption codes | Direct coin add |
| Notifications | Discord DM + Admin channel | Discord webhook only |
| Database | Firestore | Firestore |
| Monitoring | Polling | Webhook verification |

## Security Features

- ✅ Payment signature verification (Razorpay HMAC SHA-256)
- ✅ Firebase security rules for users and transactions
- ✅ Admin SDK for server-side Firestore operations
- ✅ Webhook URL kept secret (not committed to Git)
- ✅ Amount validation against package prices
- ✅ Transaction logging for audit trail

## Testing

### Sandbox Testing (Current)

Use Razorpay test credentials:
- **Key ID**: `rzp_test_SzYuBDKYMlGfnU`
- **Secret**: `LQJWva7x1Gsr36DwUCtN23OA`
- **Test Card**: `4111 1111 1111 1111`
- **CVV**: `123`
- **Expiry**: Any future date

### Production Deployment

To switch to production:

1. Update `.env.local` with live Razorpay credentials
2. Set `RAZORPAY_MODE=production`
3. Add Discord webhook URL
4. Deploy to Vercel with environment variables
5. Test with real payment (small amount first!)

## Troubleshooting

### Discord notifications not sent

- Check `DISCORD_WEBHOOK_URL` is set correctly
- Verify webhook exists in Discord server
- Check server logs for error messages
- Test webhook with curl or Postman

### Payment verification failed

- Verify Razorpay credentials match (test vs live)
- Check signature generation using correct secret
- Ensure all required fields are sent from frontend

### Coins not added

- Check Firebase Admin SDK credentials
- Verify Firestore security rules allow admin writes
- Check server logs for Firebase errors

## Related Documentation

- `RAZORPAY_SETUP.md` - Razorpay payment gateway setup
- `DISCORD_WEBHOOK_SETUP.md` - Discord webhook configuration
- `FIRESTORE_SECURITY.md` - Firebase security rules
- `FIREBASE_ADMIN_SETUP.md` - Firebase Admin SDK setup

## Future Enhancements

Possible improvements:
- Email notifications for purchases
- Purchase history page in dashboard
- Refund processing system
- Webhook retry mechanism for failed Discord sends
- Admin dashboard for viewing all transactions
- Analytics and reporting

## Notes

- Discord webhook is **optional** - system works without it
- Notifications are sent **after** payment verification
- Transaction logging happens before webhook (ensures audit trail)
- System matches Discord bot project structure and naming conventions
- Ready for production deployment

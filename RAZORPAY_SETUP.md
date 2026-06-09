# Razorpay Payment Integration Setup Guide

## 🎯 Overview

The payment page (`/payment`) allows users to purchase coin packages using Razorpay payment gateway. The page is **not publicly accessible** and users must be logged in.

## 💰 Coin Packages

| Package | Coins | Price | Bonus | Special |
|---------|-------|-------|-------|---------|
| Starter | 1,500 | $11 | - | - |
| Basic | 2,500 | $22 | +100 | - |
| Popular | 3,600 | $33 | +300 | ⭐ Best Value |
| Premium | 4,700 | $44 | +500 | - |
| Pro | 5,800 | $55 | +800 | - |
| Elite | 9,300 | $88 | +1,500 | 💎 60% Bonus |
| Mega | 22,000 | $200 | +4,000 | 🚀 Biggest Deal |

## 🔧 Razorpay Setup

### Step 1: Create Razorpay Account

1. Go to https://dashboard.razorpay.com/signup
2. Sign up with your email
3. Complete KYC (required for live payments)
4. Verify your account

### Step 2: Get API Keys

#### For Testing (Sandbox Mode):

1. Go to https://dashboard.razorpay.com/app/keys
2. Switch to **"Test Mode"** (toggle at top)
3. Copy your **Test Key ID** (starts with `rzp_test_`)
4. Click **"Generate Secret"** or reveal existing secret
5. Copy your **Test Key Secret**

#### For Production (Live Mode):

1. Complete KYC verification first
2. Switch to **"Live Mode"**
3. Copy your **Live Key ID** (starts with `rzp_live_`)
4. Copy your **Live Key Secret**

### Step 3: Add to Environment Variables

#### Local Development (.env.local):

```env
# Razorpay Test Keys (for development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_MODE=sandbox
```

#### Production (Vercel):

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `RAZORPAY_KEY_ID` | `rzp_live_xxxxxxxxxx` | Production |
| `RAZORPAY_KEY_SECRET` | `your_live_secret` | Production |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_xxxxxxxxxx` | Production |
| `RAZORPAY_MODE` | `production` | Production |

For Preview/Development on Vercel, use test keys:

| Key | Value | Environment |
|-----|-------|-------------|
| `RAZORPAY_KEY_ID` | `rzp_test_xxxxxxxxxx` | Preview, Development |
| `RAZORPAY_KEY_SECRET` | `your_test_secret` | Preview, Development |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_xxxxxxxxxx` | Preview, Development |
| `RAZORPAY_MODE` | `sandbox` | Preview, Development |

## 🧪 Testing Payments

### Test Card Numbers:

Use these test cards in sandbox mode (they won't charge real money):

#### Successful Payments:
- **Card:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **OTP:** 1234 (for 3D Secure)

#### Failed Payments:
- **Card:** 4000 0000 0000 0002 (Declined)
- **Card:** 4000 0000 0000 0010 (Insufficient funds)

### Test UPI:
- **UPI ID:** success@razorpay
- **UPI ID:** failure@razorpay (for failed payment)

### Test Wallets:
- All wallets work in test mode

## 🔒 Security Features

### Payment Verification:
1. **Order Creation:** Backend creates Razorpay order
2. **Client Payment:** User completes payment on Razorpay
3. **Signature Verification:** Backend verifies payment signature
4. **Coin Credit:** Coins added only after verification

### Anti-Payload Protection:
- All amounts validated on backend
- Signature verification prevents tampering
- Transaction logging for audit trail
- User authentication required

### Data Stored in Firestore:

#### users collection:
```javascript
{
  coins: number,
  created_at: timestamp,
  updated_at: timestamp
}
```

#### transactions collection:
```javascript
{
  user_id: string,
  type: 'coin_purchase',
  coins: number,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  status: 'completed',
  created_at: timestamp
}
```

## 📱 Page Features

### Animations:
- ✨ Rotating coins
- 🎭 Hover effects on packages
- 🌟 Smooth transitions
- 🎨 Gradient backgrounds

### Mobile Responsive:
- Grid layout adapts to screen size
- Touch-friendly buttons
- Optimized for all devices
- Smooth scrolling

### User Experience:
- Clear pricing display
- Bonus coins highlighted
- Popular package badge
- Trust badges (secure, instant, encrypted)
- Loading states
- Success confirmation

## 🚀 Accessing the Payment Page

### URL:
- Local: http://localhost:3000/payment
- Production: https://scythcode.in/payment

### Requirements:
- User must be logged in (Firebase Auth)
- Redirects to /auth if not authenticated

### Navigation:
The page is **not linked** in the main navigation (as requested). Users can access it by:
- Direct URL
- Dashboard quick action (you can add this later)
- Profile page link (you can add this later)

## 🔄 Payment Flow

1. **User clicks "Buy Now"** on a package
2. **Order created** on backend with Razorpay
3. **Razorpay checkout** opens (modal)
4. **User completes** payment
5. **Backend verifies** signature
6. **Coins added** to user account in Firestore
7. **Success message** shown
8. **Redirects** to dashboard after 3 seconds

## 📊 Webhook Setup (Optional but Recommended)

For production, set up webhooks for payment notifications:

1. Go to https://dashboard.razorpay.com/app/webhooks
2. Click "Add New Webhook"
3. URL: `https://scythcode.in/api/payment/webhook`
4. Select events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
5. Copy webhook secret
6. Add to environment variables:
   ```env
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

(Note: Webhook route needs to be created for this feature)

## 🐛 Troubleshooting

### "Razorpay is not defined" error:
- Check that Razorpay script is loaded
- Ensure `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Restart dev server after adding env vars

### Payment fails immediately:
- Verify API keys are correct
- Check if test mode keys match `RAZORPAY_MODE=sandbox`
- Check browser console for errors

### Coins not added after payment:
- Check Firestore security rules allow writes
- Verify Firebase Admin SDK is initialized
- Check transaction logs in Firestore

### Production payments not working:
- Ensure KYC is completed on Razorpay
- Use live mode keys (rzp_live_)
- Set `RAZORPAY_MODE=production`
- Check Razorpay dashboard for errors

## 📝 Currency Support

Currently configured for **USD ($)**. To change currency:

1. Update packages in `src/app/payment/page.tsx`
2. Change currency in API: `create-order/route.ts`
3. Razorpay supports: INR, USD, EUR, GBP, AUD, SGD, AED, and more

## 💡 Tips

- **Test thoroughly** in sandbox mode before going live
- **Monitor transactions** in Razorpay dashboard
- **Set up webhooks** for real-time updates
- **Complete KYC** before accepting live payments
- **Keep secrets secure** - never commit to Git
- **Use HTTPS** in production (Razorpay requires it)

## ✅ Checklist

### Local Setup:
- [ ] Created Razorpay account
- [ ] Got test API keys
- [ ] Added keys to `.env.local`
- [ ] Restarted dev server
- [ ] Tested payment with test card
- [ ] Verified coins added in Firestore

### Production Setup:
- [ ] Completed KYC on Razorpay
- [ ] Got live API keys
- [ ] Added keys to Vercel environment variables
- [ ] Set `RAZORPAY_MODE=production`
- [ ] Redeployed on Vercel
- [ ] Tested with real payment (small amount)
- [ ] Set up webhooks (optional)
- [ ] Monitored first transactions

## 🎨 Customization

To customize the payment page:

### Change Colors:
Edit gradient colors in `src/app/payment/page.tsx`

### Add/Remove Packages:
Modify the `packages` array

### Change Bonus Amounts:
Update `bonus` values in packages

### Modify Features:
Edit the features list in each package card

---

**Support:**
- Razorpay Docs: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/

**Payment Page:** `/payment` (requires authentication)

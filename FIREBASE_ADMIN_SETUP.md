# Firebase Admin SDK Setup Guide

## 🔑 Getting Firebase Admin Credentials

The ticket system needs Firebase Admin SDK credentials to work. Follow these steps:

### Step 1: Generate Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **scythcode**
3. Click the **⚙️ gear icon** (Settings) in the top left
4. Click **"Project settings"**
5. Click the **"Service accounts"** tab
6. Click **"Generate new private key"** button
7. Click **"Generate key"** in the popup
8. A JSON file will download: `scythcode-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`

**⚠️ IMPORTANT:** This file contains sensitive credentials. Never commit it to Git!

### Step 2: Set Up Local Environment (.env.local)

You already have the file `D:\medusa\scythcode-firebase-adminsdk-fbsvc-ee03affc4a.json`. 

Open it and copy the values to your `.env.local` file:

#### Create/Edit `D:\medusa\.env.local`:

```env
# Firebase Client Configuration (already set)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA4LKWgTT1GbKO0L659-FkiupAnSoMj8JA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=scythcode.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=scythcode
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=scythcode.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=638789165294
NEXT_PUBLIC_FIREBASE_APP_ID=1:638789165294:web:c972f6433c9880bdc913ff

# Firebase Admin SDK Credentials
FIREBASE_PROJECT_ID=scythcode
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@scythcode.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

**How to get the values from your JSON file:**

1. Open `D:\medusa\scythcode-firebase-adminsdk-fbsvc-ee03affc4a.json`
2. Copy these values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \n characters)

**Example private_key format:**
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0...\n-----END PRIVATE KEY-----\n"
```

### Step 3: Set Up Vercel Environment Variables

For your deployed site to work, add these same variables to Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Scythcode** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar
5. Add these three variables:

| Name | Value | Environment |
|------|-------|-------------|
| `FIREBASE_PROJECT_ID` | `scythcode` | Production, Preview, Development |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-xxxxx@scythcode.iam.gserviceaccount.com` | Production, Preview, Development |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | Production, Preview, Development |

**⚠️ Important for FIREBASE_PRIVATE_KEY on Vercel:**
- Copy the entire private_key value from your JSON file
- Include the quotes
- Keep the `\n` characters (they represent line breaks)
- Example: `"-----BEGIN PRIVATE KEY-----\nMIIEvgIB...\n-----END PRIVATE KEY-----\n"`

6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click the **"..."** menu on the latest deployment
9. Click **"Redeploy"** to apply the new environment variables

### Step 4: Verify Setup

#### Local Development:
```bash
# Restart your dev server
npm run dev
```

Then test creating a ticket at `http://localhost:3000/tickets/create`

#### Production:
After redeploying on Vercel, test creating a ticket on your live site.

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env.local` in `.gitignore` (already done)
- Use environment variables on Vercel
- Store service account JSON file securely
- Rotate keys if compromised

### ❌ DON'T:
- Commit `.env.local` to Git
- Commit service account JSON to Git
- Share credentials publicly
- Hardcode credentials in code
- Use same credentials for multiple projects

---

## 🐛 Troubleshooting

### Error: "Could not load the default credentials"

**Cause:** Environment variables not set or formatted incorrectly.

**Solution:**
1. Check `.env.local` exists in project root
2. Verify all three variables are set (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY)
3. Ensure PRIVATE_KEY includes quotes and \n characters
4. Restart dev server after changing .env.local

### Error: "PERMISSION_DENIED" in Firestore

**Cause:** Security rules not applied or Admin SDK not properly initialized.

**Solution:**
1. Apply security rules from `firestore.rules` in Firebase Console
2. Verify environment variables are set correctly
3. Check that API routes are using `ticketDbAdmin` not `ticketDb`

### Error: "Invalid service account"

**Cause:** Wrong credentials or expired service account.

**Solution:**
1. Re-download service account JSON from Firebase Console
2. Copy values again to `.env.local`
3. Ensure project_id matches your Firebase project

### Environment variables not working on Vercel

**Cause:** Variables not set or deployment not redeployed.

**Solution:**
1. Verify variables are set in Vercel Dashboard → Settings → Environment Variables
2. Ensure variables are enabled for "Production" environment
3. Redeploy the project after adding variables

---

## 📝 Quick Reference

### Local Development:
File: `D:\medusa\.env.local`
```env
FIREBASE_PROJECT_ID=scythcode
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@scythcode.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Vercel Production:
Dashboard → Settings → Environment Variables
- Add the same 3 variables
- Select "Production, Preview, Development"
- Redeploy after saving

---

## 🎯 Alternative: Using Full JSON

Instead of individual fields, you can use the entire service account JSON as one variable:

### .env.local:
```env
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"scythcode","private_key_id":"xxx","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@scythcode.iam.gserviceaccount.com","client_id":"xxx",...}'
```

**Note:** The current `firebaseAdmin.ts` already supports both methods. Use whichever is easier for you.

---

## ✅ Checklist

- [ ] Downloaded service account JSON from Firebase Console
- [ ] Created `.env.local` in project root
- [ ] Added FIREBASE_PROJECT_ID to .env.local
- [ ] Added FIREBASE_CLIENT_EMAIL to .env.local
- [ ] Added FIREBASE_PRIVATE_KEY to .env.local (with quotes and \n)
- [ ] Restarted development server
- [ ] Tested ticket creation locally
- [ ] Added same 3 variables to Vercel Dashboard
- [ ] Redeployed project on Vercel
- [ ] Tested ticket creation on production

Once all checkboxes are completed, your ticket system will work! 🚀

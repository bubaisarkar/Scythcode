# ✅ Local Setup Complete! Next Steps

## What's Been Done ✓

1. ✅ **Firebase Admin credentials added to `.env.local`**
2. ✅ **Documentation created** (`FIREBASE_ADMIN_SETUP.md`)
3. ✅ **Code pushed to GitHub**

## 🚀 Test Locally (Right Now!)

### 1. Restart Your Development Server

**Stop the server** (press Ctrl+C in your terminal if it's running)

Then restart:
```bash
npm run dev
```

### 2. Test Creating a Ticket

1. Open: http://localhost:3000/tickets/create
2. Fill out the form
3. Click "Create Ticket"
4. Should see success message with ticket number!

**If it works locally, proceed to Vercel setup below. If not, let me know the error.**

---

## ☁️ Vercel Setup (For Production)

Your local site now works, but Vercel needs the same credentials.

### Step 1: Add Environment Variables to Vercel

1. Go to: https://vercel.com/dashboard
2. Click your **Scythcode** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left sidebar
5. Add these **3 variables**:

#### Variable 1:
- **Name:** `FIREBASE_PROJECT_ID`
- **Value:** `scythcode`
- **Environment:** Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 2:
- **Name:** `FIREBASE_CLIENT_EMAIL`
- **Value:** `firebase-adminsdk-fbsvc@scythcode.iam.gserviceaccount.com`
- **Environment:** Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 3:
- **Name:** `FIREBASE_PRIVATE_KEY`
- **Value:** Copy this EXACT text (including quotes):
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmNtq9XPBHTnOl\nDTNIY1Us51L/VtasbnbiInItZB+ufDnuuCo7sPWNfXB8Bpl7caXDbCTmBLFgfj2e\nxJY1UzDfeqr4KFjBHilTZCKrrRwuzvuQn6yiYv3J0wfbiyXr3sciEw3MHqjJm621\nwFswF/eLCYUeGqPfZhOQ2KVMLxkOaqzSSz7UOTwc0JdyndCT8drVeEAhfSgW6drv\nXIhFgooj0n/Yn/ZxC4UVV7In9O2o9FUVIxaBreSr5Sa7YINkoufrXVXSMqOedN5y\nobwLVaFQh+4yG1OJKnnx5hPuKwtIhwfawiLBix0GsVu3oALq1n0iB76tOiDZH5JX\n6NylGOJZAgMBAAECggEAB6/QFDjTmItIGDEmQX9ChaXvCzBMvkMKNsa0CWWw0g9x\nrcNmRJttnQ0DjODQlp+4tEhwjmis0VMVQ3NA+myt/Rp9r1CiW3qrG5hXwsu/MBT8\nwlaivmHImIhXZoT8DHlMM/G1+M4kLSqzcQ0udRNurHHqGOx6I/njBsGrfKdNnS0p\nBIJMa0BwqrzyI2n5jB+arQDeZuMQnQV76UjvUUIo2SZlWf8WQVWop4xsFc/ICxBl\nzAYQay8TTgv+FlMZS7qe5WSh126rD5YGazfN/klObcBigdfVUYkRfIoFN2VgOaF6\nDn+mTJ98eDckNA7efAFtSScAS0OsNcyOKyxes9gKuQKBgQDT040ntYuQSnu0Cjzz\nBe9HRWdc1r2m3FUohqAbcz3uBRO98zO4VbIzc5Rpm+1mHQzxtV0rDQsah2+DHtec\n4CrIyWyF+B1tBERdMooPMayeZjIJN9IH+gAF1nlJSoQm/pin/7blYAPJHlu28xFD\nMNTLgfZWfINBpuWrfKJUXZH/PQKBgQDI4Ee7g1g90ZqnJ1SipWFK/3/+6y2wjNsX\nHHZ+ShHdiljoA1711uIODmgiVbrDSmC/j3rDwAWHyN/FvJ2nl2HljeYfD4xsJVay\nY3qGHYCwcbwlWV2KAROlZcgs6FQT0/yQFl0BTZzqNeDZYwlRhi49HOW+NbNayQfN\ndJc4n+1hTQKBgArGqlmozK7MezqPgsZCOQgBKd75NbC1aMelAaQj2rSvIW/6XVk1\nUtl3OcednRgixjPNrC2yfiwdU7jx6roaVVLdnF28X5LaMrgjCA750fRE8qqxYkfx\nmeqyHH10AwEQ1qdFRQKqPccPek72Upx+cXTg6a1ArFS8rtZogsGT+QdpAoGBAJAB\nsYstOyp+RJfGq3c6hohkqNcQtJ2YLUzhO9WHtk0TbG9QU1h852xaSa8rtItim/9Y\nlhMVayGQEVRJxuApt6YA11O3Kt0w23lhtanGJsbXkqFX8qYH5ZSyZhJDsFrSo4KM\ndbqEcJS7cWmHBVwrjKSFPfLhvqW77tsM1YhjpqMVAoGADw/lZuP6/8Yi/aNw4Jmg\ntLm0GYKVQ1QIFkcVvoocM/8/R88W4nOw/Yeso7aTSyE03QvQ6XucA3UFrOQFEUf4\nWWWKWytIHgxplqthuROsYFvr/jauyVPFIttQTY4OGWBVSx8osg9rB8PaNL2HHrPu\nW8wbTY2LntDT+UaZtMYimD4=\n-----END PRIVATE KEY-----\n"
```
- **Environment:** Select all (Production, Preview, Development)
- Click **"Save"**

⚠️ **IMPORTANT:** Copy the entire value including the quotes and \n characters exactly as shown above!

### Step 2: Redeploy on Vercel

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (~2 minutes)

### Step 3: Test on Production

Visit your live site and create a ticket!

---

## 🔒 Apply Firestore Security Rules

Your database is currently open. Secure it now:

1. Go to: https://console.firebase.google.com/
2. Select **scythcode** project
3. Click **"Firestore Database"** in left sidebar
4. Click **"Rules"** tab
5. **Copy all content from `firestore.rules` file**
6. **Paste** into the editor (replace everything)
7. Click **"Publish"**

**The rules in `firestore.rules` prevent:**
- ✅ Unauthorized access
- ✅ Payload attacks
- ✅ Data tampering
- ✅ Cross-user data leaks

---

## 📋 Final Checklist

### Local Development ✓
- [x] Added Firebase credentials to `.env.local`
- [ ] Restarted dev server (`npm run dev`)
- [ ] Tested ticket creation at http://localhost:3000/tickets/create
- [ ] Verified ticket appears in Firebase Console

### Vercel Production
- [ ] Added `FIREBASE_PROJECT_ID` to Vercel
- [ ] Added `FIREBASE_CLIENT_EMAIL` to Vercel
- [ ] Added `FIREBASE_PRIVATE_KEY` to Vercel (with quotes and \n)
- [ ] Redeployed project
- [ ] Tested ticket creation on live site

### Firebase Security
- [ ] Applied security rules from `firestore.rules`
- [ ] Verified rules in Firebase Console → Firestore → Rules

---

## 🎯 Quick Links

- **Local Dev:** http://localhost:3000
- **Create Ticket (Local):** http://localhost:3000/tickets/create
- **My Tickets (Local):** http://localhost:3000/tickets
- **Admin Panel (Local):** http://localhost:3000/admin/tickets
- **Firebase Console:** https://console.firebase.google.com/project/scythcode
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## 🐛 Troubleshooting

### "Could not load credentials" error
- Restart dev server after updating `.env.local`
- Verify `.env.local` is in project root (`D:\medusa\.env.local`)
- Check that PRIVATE_KEY has quotes and \n characters

### "PERMISSION_DENIED" error
- Apply security rules from `firestore.rules` in Firebase Console
- Make sure user is logged in
- Check that API routes use `ticketDbAdmin` (already fixed)

### Vercel deployment fails
- Check that all 3 environment variables are set
- Verify PRIVATE_KEY is copied exactly (including quotes and \n)
- Try redeploying after variables are saved

---

## 🚨 Important Security Notes

1. **Never commit `.env.local`** to Git (already in .gitignore)
2. **Never commit the service account JSON** to Git (already in .gitignore)
3. **Keep the private key secret** - it gives full database access
4. **Apply Firestore security rules** - they protect user data

---

## ✅ All Done?

Once all checkboxes are complete, your ticket system will be fully functional locally and on Vercel! 🎉

Need help? Check the detailed guides:
- `FIREBASE_ADMIN_SETUP.md` - Complete setup guide
- `FIRESTORE_SECURITY.md` - Security rules explained
- `FIRESTORE_SETUP.md` - Firestore initial setup

---

**Admin Password (for reference):** `K9#bV2!mQ8*zL5@xP1^rT`

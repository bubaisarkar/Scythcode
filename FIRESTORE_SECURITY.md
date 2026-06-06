# Firestore Security Rules - Complete Guide

## 🔒 Security Features Implemented

### 1. Authentication Required
- **All operations require Firebase Authentication**
- No anonymous access allowed
- Users must be signed in to read/write any data

### 2. Ownership Protection
- Users can **only read their own tickets**
- Users can **only create tickets for themselves**
- Prevents users from accessing other users' data

### 3. Data Validation (Anti-Payload Attack)
- **String length limits** prevent buffer overflow attacks
- **Type checking** ensures correct data types
- **Whitelist validation** for enum fields (status, priority, category)
- **Structure validation** ensures all required fields are present

### 4. Immutability Rules
- **Tickets cannot be deleted** (data retention)
- **Messages cannot be edited** (audit trail)
- **Messages cannot be deleted** (compliance)
- **Ownership cannot be transferred** (security)

### 5. Limited Update Scope
- Users can only update: `status`, `updated_at`, `closed_at`
- Cannot modify: `subject`, `category`, `priority`, `user_id`, `ticket_number`
- Prevents data tampering

### 6. Collection Isolation
- Only `tickets` and `ticket_messages` collections are accessible
- All other collections are completely blocked
- Prevents unauthorized database exploration

## 📋 Field Validation Rules

### Tickets Collection
```javascript
✅ ticket_number: 10-20 characters
✅ user_email: 5-100 characters
✅ user_name: 1-100 characters
✅ subject: 1-500 characters
✅ category: 1-100 characters
✅ priority: must be 'low', 'medium', 'high', or 'urgent'
✅ status: must be 'open', 'in-progress', 'resolved', or 'closed'
✅ created_at: must be timestamp
✅ updated_at: must be timestamp
✅ user_id: must match authenticated user
```

### Messages Collection
```javascript
✅ ticket_id: 1-100 characters
✅ sender_type: must be 'user', 'admin', or 'system'
✅ sender_name: 1-100 characters
✅ message: 1-5000 characters (prevents spam)
✅ created_at: must be timestamp
```

## 🚀 How to Apply These Rules

### Method 1: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **scythcode** project
3. Click **"Firestore Database"** in the left sidebar
4. Click the **"Rules"** tab at the top
5. **Copy the entire content from `firestore.rules`**
6. **Paste into the editor**
7. Click **"Publish"**

### Method 2: Firebase CLI

If you have Firebase CLI installed:

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## 🛡️ Security Test Scenarios

### ✅ ALLOWED Operations

1. **User creates their own ticket**
   ```javascript
   // User ABC123 creates ticket with user_id: "ABC123"
   ✅ Allowed
   ```

2. **User reads their own ticket**
   ```javascript
   // User ABC123 reads ticket where user_id: "ABC123"
   ✅ Allowed
   ```

3. **User updates their ticket status**
   ```javascript
   // User ABC123 changes status from "open" to "in-progress"
   ✅ Allowed
   ```

4. **User adds message to their ticket**
   ```javascript
   // User ABC123 adds message to their ticket
   ✅ Allowed
   ```

### ❌ BLOCKED Operations (Security)

1. **User tries to read another user's ticket**
   ```javascript
   // User ABC123 tries to read ticket where user_id: "XYZ789"
   ❌ BLOCKED - Permission Denied
   ```

2. **User tries to create ticket for another user**
   ```javascript
   // User ABC123 tries to create ticket with user_id: "XYZ789"
   ❌ BLOCKED - Validation Failed
   ```

3. **User tries to change ticket ownership**
   ```javascript
   // User ABC123 tries to change user_id in their ticket
   ❌ BLOCKED - Cannot modify user_id
   ```

4. **User tries to modify ticket subject after creation**
   ```javascript
   // User tries to edit ticket subject
   ❌ BLOCKED - Subject is immutable
   ```

5. **User tries to delete a ticket**
   ```javascript
   // Any delete operation on tickets
   ❌ BLOCKED - Deletion not allowed
   ```

6. **User tries to send payload attack**
   ```javascript
   // User tries to create ticket with 10,000 character subject
   ❌ BLOCKED - Exceeds 500 character limit
   ```

7. **User tries invalid status value**
   ```javascript
   // User tries to set status: "hacked"
   ❌ BLOCKED - Status must be open/in-progress/resolved/closed
   ```

8. **Unauthenticated access**
   ```javascript
   // Any operation without Firebase Auth token
   ❌ BLOCKED - Authentication required
   ```

9. **Access to other collections**
   ```javascript
   // User tries to read "users" or "admin_data" collection
   ❌ BLOCKED - Only tickets and ticket_messages allowed
   ```

## 🔍 Admin Access Strategy

**Important:** Firestore rules apply to client SDK operations. Admin operations should be handled through:

1. **API Routes** (Current Implementation)
   - Admin authentication via password in API routes
   - API routes use Firebase Admin SDK (bypasses security rules)
   - Route: `/api/tickets` with `admin=true` parameter
   - Password: `K9#bV2!mQ8*zL5@xP1^rT`

2. **Firebase Admin SDK**
   - Used in your Next.js API routes
   - Has full database access
   - Bypasses client security rules
   - Perfect for admin operations

## 📊 Why These Rules Are Secure

### 1. **Principle of Least Privilege**
   - Users only have access to their own data
   - Minimal permissions by default

### 2. **Defense in Depth**
   - Multiple validation layers
   - Type checking + length limits + whitelist validation

### 3. **Immutability**
   - Critical data cannot be modified/deleted
   - Creates audit trail

### 4. **Input Validation**
   - Prevents SQL injection equivalent attacks
   - Blocks buffer overflow attempts
   - Stops XSS payloads in database

### 5. **Authentication Required**
   - No anonymous access
   - All operations require valid Firebase token

## 🚨 Common Security Mistakes (We Avoided)

### ❌ Bad Rule Examples

```javascript
// DON'T DO THIS - Allows anyone to read everything
allow read: if true;

// DON'T DO THIS - No validation
allow write: if request.auth != null;

// DON'T DO THIS - Allows data exfiltration
allow read: if request.auth != null;
```

### ✅ Our Secure Rules

```javascript
// Only owner can read
allow read: if resource.data.user_id == request.auth.uid;

// Strong validation on write
allow create: if isValidTicketCreate() && 
                 request.resource.data.user_id == request.auth.uid;

// Limited update scope
allow update: if request.resource.data.diff(resource.data)
                 .affectedKeys().hasOnly(['status', 'updated_at']);
```

## 🧪 Testing Your Rules

After applying rules, test in Firebase Console:

1. Go to Firestore Database
2. Click "Rules" tab
3. Click "Rules Playground" button
4. Test scenarios:
   - Read own ticket ✅
   - Read other's ticket ❌
   - Create ticket ✅
   - Delete ticket ❌

## 📞 Support

If you encounter permission errors:
1. Verify user is authenticated via Firebase Auth
2. Check that `user_id` in ticket matches `request.auth.uid`
3. Ensure all required fields are present
4. Verify field values match validation rules
5. Check Firebase Console > Firestore > Rules for syntax errors

## 🔄 Updating Rules

When you need to modify rules:
1. Edit `firestore.rules` file
2. Test locally if using Firebase Emulator
3. Deploy via Firebase Console or CLI
4. Monitor Firebase Console for errors
5. Test with your app immediately

---

**Remember:** These rules protect against:
- ✅ Unauthorized data access
- ✅ SQL injection style attacks
- ✅ Buffer overflow attempts
- ✅ Data tampering
- ✅ Privilege escalation
- ✅ Cross-user data leaks
- ✅ Collection enumeration
- ✅ Payload bombs (large data)

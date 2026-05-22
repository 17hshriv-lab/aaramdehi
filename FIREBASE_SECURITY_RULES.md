# Firebase Security Rules - Realtime Database

Firebase Console mein jaakar **Realtime Database** tab mein **Rules** section mein ye rules set karna zaroori hai.

## Important: Development vs Production

### 🔴 DEVELOPMENT ONLY (Testing ke liye)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **WARNING**: Yeh sirf development mein use karein! Production mein alag rules lagane zaroori hain.

---

## ✅ PRODUCTION RULES (Secure)

```json
{
  "rules": {
    // Public products (sab dekh sakte hain)
    "products": {
      ".read": true, // Everyone can read products
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'ADMIN'", // Only admins can write products
      ".validate": "newData.hasChildren(['name', 'category', 'price'])"
    },

    // User data (khud ka data dekh sakte hain)
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'ADMIN'", // User can read their own data, or admin can read all
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['name', 'email'])"
      }
    },

    // Orders (khud ke orders dekh sakte hain)
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$orderId": {
        ".read": "data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'ADMIN'", // User can read their own orders, or admin can read all
        ".write": "data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'ADMIN'" // User can write their own orders (e.g., status updates), or admin can write all
      }
    },

    // Categories (public read, admin write)
    "categories": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'ADMIN'" // Only admins can write categories
    },

    // Banners (public read, admin write)
    "banners": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'ADMIN'" // Only admins can write banners
    },

    // Coupons (public read, admin write)
    "coupons": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'ADMIN'" // Only admins can write coupons
    },

    // Payments (user dekh sakta hai apna, admin dekh sakta hai sab)
    "payments": {
      ".read": "auth != null",
      "$paymentId": {
        ".read": "data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'ADMIN'", // User can read their own payments, or admin can read all
        ".write": "root.child('users').child(auth.uid).child('role').val() === 'ADMIN'" // Only admins can write payments
      }
    },

    // Wishlists (private)
    "wishlists": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },

    // Reviews (public read, authenticated write)
    "reviews": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

---

## 📝 Rules Explanation

### `.read` - Read Access
```json
".read": true              // Sab pad sakte hain (public)
".read": "auth != null"    // Sirf logged-in users pad sakte hain
".read": "$uid === auth.uid"  // Sirf khud apna data pad sakte hain
```

### `.write` - Write Access
```json
".write": true             // Sab likha sakte hain (UNSAFE!)
".write": "auth != null"   // Sirf logged-in users likha sakte hain
".write": "$uid === auth.uid"  // Sirf khud likha sakte hain
".write": "root.child('users').child(auth.uid).child('role').val() === 'ADMIN'"  // Sirf admin
```

### `.validate` - Data Validation
```json
".validate": "newData.hasChildren(['name', 'email'])"  // Required fields
".validate": "newData.isString() && newData.val().length > 0"  // String validation
".validate": "newData.isNumber() && newData.val() > 0"  // Number validation
```

---

## 🔧 How to Set Rules in Firebase Console

1. **Firebase Console** → Select project `aaramdehi-91f82`
2. **Build** → **Realtime Database**
3. **Rules** tab par click karein
4. Upar wale JSON code ko copy-paste karein
5. **Publish** button press karein

---

## 🚨 Important Security Points

### ❌ DO NOT DO THIS
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
Yeh production mein **open hai sab ke liye!** Koi bhi data delete kar sakta hai!

### ✅ DO THIS INSTEAD
```json
{
  "rules": {
    "products": {
      ".read": true,  // Sab dekh sakte hain
      ".write": "root.child('users').child(auth.uid).child('isAdmin').val() === true"  // Sirf admin likha sakta hai
    }
  }
}
```

---

## 🔐 Server-Side Rules (Node.js mein Admin SDK)

**Important**: Server-side admin code har rule ko bypass kar sakta hai! Isliye admin SDK se likhne se woh rules apply nahi hote.

```javascript
// server/config/db.js mein admin.database() use kar rahe ho
// Yeh har rule bypass kar sakta hai kyunki server-side code hai

// Isliye iska matlab:
// - Frontend client-side rules follow karega
// - Backend (server) rules bypass kar sakta hai (admin ke liye safe hai)
// - Frontend direct Firebase access se avoid karo
```

---

## 🎯 Rule Strategy for Aaramdehi Project

### 1. **Public Collections** (Read: true, Write: Admin only)
- `products` - Everyone dekh sakta hai, admin likha sakta hai
- `categories` - Public read, admin write
- `banners` - Public read, admin write
- `coupons` - Public read, admin write

### 2. **Private User Collections** (Read/Write: Self or Admin)
- `users` - User apna data dekh/edit kar sakta hai, admin sab dekh sakta hai
- `wishlists` - Sirf khud dekh/edit kar sakta hai
- `addresses` - Sirf khud dekh/edit kar sakta hai

### 3. **Order Collections** (Read/Write: Creator or Admin)
- `orders` - User apne orders dekh sakta hai, admin sab dekh sakta hai
- `payments` - User apne payments dekh sakta hai, admin sab

### 4. **Mixed Collections** (Public Read, Authenticated Write)
- `reviews` - Sab dekh sakte hain, but likha sirf logged-in users kar sakte hain

---

## 🔄 Testing Rules

### Test 1: Unauthenticated User
```
- Should access: products, categories, banners, coupons, reviews (read-only)
- Should NOT access: users, wishlists, orders, payments
```

### Test 2: Authenticated User
```
- Should access: All public data + own private data
- Should NOT access: Other users' private data
- Should NOT modify: Public collections (unless admin)
```

### Test 3: Admin User
```
- Should access: Everything
- Should modify: All collections
```

---

## 🛠️ Debugging Rules

Agar permission denied error aaye:

1. **Check if user is authenticated**
   ```javascript
   console.log('Auth UID:', auth.uid);  // Should have value
   ```

2. **Check user's admin status**
   ```javascript
   // Firebase Console mein users collection mein check karo
   // users → {userId} → isAdmin: true
   ```

3. **Check rule syntax**
   - JSON valid hai?
   - Quotes sahi hain?
   - Brackets match kar rahe hain?

4. **Simulate in Rules Playground**
   - Firebase Console mein Rules tab mein "Simulator" option hai
   - Wahan test kar sakta hai

---

## 📊 Rules Checklist

- [ ] Development rules temporary basis par lagaye
- [ ] Production rules clearly defined
- [ ] Admin verification logic in rules
- [ ] User ID checks for private data
- [ ] Validation for required fields
- [ ] Tested with different user types
- [ ] Rate limiting considered (separate Firebase feature)
- [ ] Backup rules documented

---

## 🔗 Related Files

- **db.js**: `server/config/db.js` - Database access logic
- **Auth Middleware**: `server/middleware/auth.middleware.js` - User authentication
- **Vercel Setup**: `VERCEL_DEPLOYMENT_GUIDE.md` - Environment variables

---

## 📌 Summary

**Development**: Read/Write dono true (testing ke liye)
**Production**: Proper authentication aur authorization rules
**Admin SDK**: Server-side code rules bypass kar sakta hai (safe)
**Frontend**: Rules follow karna zaroori hai

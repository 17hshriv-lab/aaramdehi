# Firebase Migration - Quick Reference

## 🚀 Quick Start (First Time Setup)

### 1. Get Your Service Account Key
```bash
# 1. Visit Firebase Console
https://console.firebase.google.com/

# 2. Select: aaramdehi-91f82 project
# 3. Go to: ⚙️ Project Settings → Service Accounts
# 4. Click: "Generate New Private Key"
# 5. Save JSON file to: server/config/serviceAccountKey.json
```

### 2. Verify Installation
```bash
cd server
npm list firebase-admin
# ✅ Should show: firebase-admin@13.9.0
```

### 3. Test Connection
```bash
npm run dev
# ✅ Should start without errors about Firebase
```

### 4. Check Firebase Console
- Go to https://console.firebase.google.com/project/aaramdehi-91f82/database
- Select "Realtime Database" tab
- You should see your data collections appearing as you migrate

---

## 🔄 Migration Reference Table

### Convert Mongoose to Firebase

| Task | Mongoose | Firebase |
|------|----------|----------|
| **Import** | `const Model = require('./model')` | `const { findAll, create, updateById, deleteById } = require('../config/db')` |
| **Get All** | `Model.find()` | `findAll('collectionName')` |
| **Get One** | `Model.findById(id)` | `findById('collectionName', id)` |
| **Search** | `Model.find({field: value})` | `findByQuery('collectionName', 'field', value)` |
| **Create** | `new Model(data).save()` | `create('collectionName', data)` |
| **Update** | `Model.findByIdAndUpdate(id, data)` | `updateById('collectionName', id, data)` |
| **Delete** | `Model.findByIdAndDelete(id)` | `deleteById('collectionName', id)` |
| **Delete Many** | `Model.deleteMany({...})` | `deleteMany('collectionName', [ids])` |

---

## 📝 Copy-Paste Controller Template

Replace this in your controllers:

```javascript
// ❌ REMOVE THIS
import ProductModel from "../models/product.model.js";

// ✅ ADD THIS
import { findAll, findById, findByQuery, create, updateById, deleteById } from "../config/db.js";
const COLLECTION = 'products'; // Change to your collection name

// ✅ Convert each function (example):
export const getAllProducts = async (req, res) => {
    try {
        const products = await findAll(COLLECTION); // ← Only change needed!
        return res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await findById(COLLECTION, id); // ← Only change needed!
        if (!product) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = await create(COLLECTION, req.body); // ← Only change needed!
        return res.status(201).json({ success: true, message: "Created", data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await updateById(COLLECTION, id, req.body); // ← Only change needed!
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteById(COLLECTION, id); // ← Only change needed!
        return res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
```

---

## 🖼️ Cloudinary URLs - How They Work

Your existing Cloudinary URLs work **exactly the same** - no changes needed!

```javascript
// ✅ This still works perfectly
const product = await create('products', {
    name: "Laptop",
    imageUrl: "https://res.cloudinary.com/dh3ayjpxo/image/upload/v1234567890/img.jpg",
    images: [
        { url: "https://res.cloudinary.com/dh3ayjpxo/image/upload/v1234567890/img1.jpg", alt: "Front" },
        { url: "https://res.cloudinary.com/dh3ayjpxo/image/upload/v1234567890/img2.jpg", alt: "Back" }
    ]
});

// ✅ Frontend can still access:
// product.imageUrl
// product.images[0].url
// etc.
```

---

## 🧪 Test Commands

### Test via cURL

```bash
# GET all products
curl http://localhost:3000/api/products

# GET single product (replace {id} with actual Firebase key)
curl http://localhost:3000/api/products/{id}

# POST create product
curl -X POST http://localhost:3000/api/products/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 999,
    "imageUrl": "https://res.cloudinary.com/..."
  }'

# PUT update product
curl -X PUT http://localhost:3000/api/products/{id} \
  -H "Content-Type: application/json" \
  -d '{"price": 1299}'

# DELETE product
curl -X DELETE http://localhost:3000/api/products/{id}
```

### Test via Node.js/JavaScript

```javascript
// Test file: server/test-firebase.js
import { findAll, findById, create, updateById, deleteById } from './config/db.js';

async function test() {
    try {
        // Test 1: Get all
        console.log('📦 Getting all products...');
        const all = await findAll('products');
        console.log('✅ Found:', all.length);

        // Test 2: Create
        console.log('📝 Creating product...');
        const created = await create('products', {
            name: 'Test Product',
            price: 999
        });
        console.log('✅ Created:', created._id);

        // Test 3: Get one
        console.log('🔍 Getting product...');
        const one = await findById('products', created._id);
        console.log('✅ Found:', one.name);

        // Test 4: Update
        console.log('✏️ Updating product...');
        const updated = await updateById('products', created._id, { price: 1299 });
        console.log('✅ Updated price to:', updated.price);

        // Test 5: Delete
        console.log('🗑️ Deleting product...');
        await deleteById('products', created._id);
        console.log('✅ Deleted');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

test();

// Run: node test-firebase.js
```

---

## 📚 File Structure After Migration

```
server/
├── config/
│   ├── db.js                        ✅ Firebase setup (READY)
│   └── serviceAccountKey.json       ⏳ Download from Firebase Console
├── controllers/
│   ├── product.controller.js        ⏳ Update (Mongoose → Firebase)
│   ├── user.controller.js           ⏳ Update
│   ├── order.controller.js          ⏳ Update
│   └── ...
├── models/                          ⏳ Can be deleted after migration
├── routes/                          ✅ No changes needed
├── middleware/                      ✅ No changes needed
├── utils/                           ✅ No changes needed
├── package.json                     ✅ Already has firebase-admin
├── index.js                         ✅ No changes needed
└── test-firebase.js                 ⏳ Optional test file
```

---

## 🔑 Key Collection Names

Use these exactly in your helpers:

```javascript
// Example collection names to use:
findAll('products')
findAll('users')
findAll('orders')
findAll('banners')
findAll('categories')
findAll('coupons')
findAll('payments')
findAll('wishlists')
findAll('reviews')
// etc.
```

---

## ⚡ Common Patterns

### Pattern 1: Duplicate Check
```javascript
// Before creating, check if exists
const existing = await findByQuery('products', 'name', productName);
if (existing.length > 0) {
    return res.status(409).json({ success: false, message: "Already exists" });
}

// Then create safely
const product = await create('products', { name: productName, ... });
```

### Pattern 2: Filter Results
```javascript
// Get all, then filter in code
const allProducts = await findAll('products');
const cheapProducts = allProducts.filter(p => p.price < 1000);
```

### Pattern 3: Batch Delete
```javascript
// Delete multiple IDs at once
const idsToDelete = ['key1', 'key2', 'key3'];
await deleteMany('products', idsToDelete);
```

### Pattern 4: User-Specific Data
```javascript
// Get user's orders
const userOrders = await findByQuery('orders', 'userId', userId);
```

---

## 🐛 Troubleshooting 5-Minute Guide

### Problem: "Cannot find module 'serviceAccountKey.json'"
**Solution**: 
1. Go to Firebase Console
2. Download Service Account Key
3. Save to `server/config/serviceAccountKey.json`
4. Restart server: `npm run dev`

### Problem: "No data showing up in Firebase"
**Solution**:
1. Check Firebase Console: https://console.firebase.google.com/
2. Go to Realtime Database tab
3. You should see collections after first create/update
4. If still empty, verify `findAll()` returned []

### Problem: "Cloudinary images not storing"
**Solution**:
1. Verify image URL starts with `https://res.cloudinary.com/`
2. Check Firebase Console - URL should be stored as-is
3. No special handling needed - works like MongoDB

### Problem: "_id looks different"
**Solution**: 
✅ This is correct! Firebase uses string keys instead of MongoDB ObjectIds
- MongoDB: `ObjectId("507f1f77bcf86cd799439011")`
- Firebase: `"Kx8vN2pL9mQ1rT5sU3vW6x"` (string)
- Frontend code doesn't care - both work with `_id`

### Problem: "Getting timeout errors"
**Solution**:
1. Check internet connection
2. Verify Firebase project is active
3. Check Firebase Console for any service issues
4. Restart server: `npm run dev`

---

## 📊 Firebase Console Quick Navigation

```
Firebase Console
└── Select Project: aaramdehi-91f82
    ├── Build
    │   ├── Realtime Database        ← See your collections here
    │   ├── Storage                   ← For future file uploads
    │   └── Firestore                 ← Different DB (not used yet)
    ├── Project Settings
    │   └── Service Accounts          ← Download key here
    └── Monitoring
        └── Usage                      ← Check quota/billing
```

---

## 🎯 Migration Workflow

### For Each Controller:

1. **Open controller file**
2. **Replace imports** (Mongoose → Firebase helpers)
3. **Add collection constant**: `const COLLECTION = 'collectionName'`
4. **Replace function calls** (use table above)
5. **Test with cURL** or Postman
6. **Verify in Firebase Console**
7. **Move to next controller**

---

## 📋 Collections to Migrate (In Order)

### Easy (Start here) ✅
- [ ] `banners`
- [ ] `categories`
- [ ] `coupons`

### Medium (Dependencies) ⚠️
- [ ] `products`
- [ ] `users`

### Complex (Multiple refs) 🔴
- [ ] `orders`
- [ ] `payments`
- [ ] `auth`

---

## 🔒 Security Notes

```javascript
// ✅ GOOD - Service account key is private
// Keep in: server/config/serviceAccountKey.json
// Add to: .gitignore (so it's not committed)

// ❌ BAD - Never expose this key
// Don't commit to Git
// Don't share in messages
// Don't put in frontend code
```

**Check .gitignore**:
```bash
# Make sure this line exists in your .gitignore
serviceAccountKey.json
```

---

## 📞 Questions?

When stuck:
1. Check [FIREBASE_MIGRATION_GUIDE.md](FIREBASE_MIGRATION_GUIDE.md)
2. See [FIREBASE_ROUTE_EXAMPLE.md](FIREBASE_ROUTE_EXAMPLE.md) for real example
3. Review [FIREBASE_ADVANCED_PATTERNS.md](FIREBASE_ADVANCED_PATTERNS.md) for complex cases
4. Follow [FIREBASE_MIGRATION_CHECKLIST.md](FIREBASE_MIGRATION_CHECKLIST.md) step-by-step

---

## ✨ What's Done For You

✅ `server/config/db.js` - Complete Firebase setup with all helpers
✅ `firebase-admin` - Already installed in package.json
✅ Cloudinary URLs - Work exactly as before, no changes needed
✅ Helper functions - All 6 functions ready to use
✅ Error handling - Built into helpers
✅ Timestamps - Auto-added (createdAt, updatedAt)

---

**Database**: https://aaramdehi-91f82-default-rtdb.firebaseio.com/
**Status**: ✅ Ready for migration!

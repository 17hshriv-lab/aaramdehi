# Firebase Realtime Database Migration Guide

## Setup Requirements

### 1. Download Service Account Key from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `aaramdehi-91f82`
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key** (or **Generate Key**)
5. Save the JSON file as `serviceAccountKey.json`
6. Place it in: `server/config/serviceAccountKey.json`

### 2. Install Dependencies

Your project already has firebase-admin installed. Verify with:
```bash
npm list firebase-admin
```

## Database Configuration

Your `server/config/db.js` is configured with:
- **Database URL**: `https://aaramdehi-91f82-default-rtdb.firebaseio.com/`
- **Authentication**: Service Account (for server-side access)

## Migration: Mongoose to Firebase

### Available Helper Functions

| Mongoose | Firebase Helper | Syntax |
|----------|-----------------|--------|
| `Model.find()` | `findAll()` | `await findAll('collectionName')` |
| `Model.findById(id)` | `findById()` | `await findById('collectionName', id)` |
| `Model.find({prop: val})` | `findByQuery()` | `await findByQuery('collectionName', 'prop', val)` |
| `new Model(data).save()` | `create()` | `await create('collectionName', data)` |
| `Model.findByIdAndUpdate(id, data)` | `updateById()` | `await updateById('collectionName', id, data)` |
| `Model.findByIdAndDelete(id)` | `deleteById()` | `await deleteById('collectionName', id)` |
| `Model.deleteMany([ids])` | `deleteMany()` | `await deleteMany('collectionName', [ids])` |

## Example Usage

### Before (Mongoose)
```javascript
const Product = require('../models/Product');

// Get all products
const products = await Product.find();

// Create a product
const newProduct = new Product({
  name: 'Product Name',
  price: 100,
  imageUrl: 'https://cloudinary.com/...'
});
await newProduct.save();

// Update product
await Product.findByIdAndUpdate(productId, { price: 120 });

// Delete product
await Product.findByIdAndDelete(productId);
```

### After (Firebase)
```javascript
const { findAll, create, updateById, deleteById } = require('../config/db');

// Get all products
const products = await findAll('products');

// Create a product
const newProduct = await create('products', {
  name: 'Product Name',
  price: 100,
  imageUrl: 'https://cloudinary.com/...'
});

// Update product
await updateById('products', productId, { price: 120 });

// Delete product
await deleteById('products', productId);
```

## Data Structure Compatibility

### Cloudinary Image URLs
✅ Fully supported - store URLs as strings in Firebase
```javascript
{
  _id: "auto-generated-key",
  name: "Product",
  imageUrl: "https://res.cloudinary.com/...",
  createdAt: "2026-05-14T10:30:00.000Z",
  updatedAt: "2026-05-14T10:30:00.000Z"
}
```

### Automatic Fields
Firebase helpers automatically add:
- `createdAt`: ISO timestamp on creation
- `updatedAt`: ISO timestamp on every update (including creation)
- `_id`: Maps Firebase key to `_id` for frontend compatibility

### Important Notes
1. **No schema validation** - Firebase doesn't enforce schemas like Mongoose
2. **All keys are strings** - Firebase keys are always strings (not ObjectIds)
3. **No JOINs** - Denormalize related data or fetch separately
4. **Real-time listeners** - Use `.on()` instead of `.once()` for live updates

## Common Migration Patterns

### 1. Filtering/Searching
```javascript
// Mongoose: Model.find({ category: 'electronics' })

// Firebase: Use findByQuery helper
const electronics = await findByQuery('products', 'category', 'electronics');
```

### 2. Array Operations
```javascript
// Firebase doesn't support array filters natively
// Instead, fetch all and filter in Node.js:
const allProducts = await findAll('products');
const filtered = allProducts.filter(p => p.tags.includes('sale'));
```

### 3. Sorting
```javascript
// Get all items and sort in Node.js
const products = await findAll('products');
const sorted = products.sort((a, b) => b.price - a.price);
```

## Performance Tips

1. **Avoid fetching all records** for large collections
   - Use `findByQuery()` instead of `findAll()` when possible
   - Filter in application code if necessary

2. **Use transactions for related updates**
   ```javascript
   const updates = {};
   updates[`products/${id1}`] = newData1;
   updates[`users/${id2}`] = newData2;
   await db.ref().update(updates);
   ```

3. **Enable offline persistence** in client code (if needed)

## Troubleshooting

### Error: "Service Account Key not found"
- Verify `server/config/serviceAccountKey.json` exists
- Check file path in `require('./serviceAccountKey.json')`

### Error: "Database URL mismatch"
- Confirm Database URL matches your Firebase project
- Current: `https://aaramdehi-91f82-default-rtdb.firebaseio.com/`

### No data returned from findAll()
- Check if collection exists in Firebase Console
- Verify data structure matches expected format

### Cloudinary URLs not storing correctly
- URLs are strings - should work fine
- If issues, check Firebase security rules allow writes

## Next Steps

1. ✅ Place `serviceAccountKey.json` in `server/config/`
2. ✅ Update your routes to use new helper functions
3. ✅ Test one route thoroughly before migrating others
4. ✅ Update error handling in controllers
5. ✅ Test with actual Cloudinary URLs to ensure compatibility

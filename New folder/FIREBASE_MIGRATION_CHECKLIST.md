# Firebase Migration Checklist

## ✅ Pre-Migration Setup

- [ ] **Download Service Account Key**
  - [ ] Go to [Firebase Console](https://console.firebase.google.com/)
  - [ ] Select project: `aaramdehi-91f82`
  - [ ] Navigate to Project Settings → Service Accounts
  - [ ] Click "Generate New Private Key"
  - [ ] Save as `serviceAccountKey.json`
  - [ ] Place in: `server/config/serviceAccountKey.json`

- [ ] **Verify firebase-admin Installation**
  ```bash
  npm list firebase-admin
  # Should show: firebase-admin@13.9.0
  ```

- [ ] **Review db.js Configuration**
  - [ ] Check database URL: `https://aaramdehi-91f82-default-rtdb.firebaseio.com/`
  - [ ] Verify helper functions exist: findAll, findById, create, updateById, deleteById, deleteMany
  - [ ] Test connection: `npm run dev` should start without errors

## 📚 Documentation Review

- [ ] Read [FIREBASE_MIGRATION_GUIDE.md](FIREBASE_MIGRATION_GUIDE.md)
- [ ] Review [FIREBASE_ROUTE_EXAMPLE.md](FIREBASE_ROUTE_EXAMPLE.md)
- [ ] Study [FIREBASE_ADVANCED_PATTERNS.md](FIREBASE_ADVANCED_PATTERNS.md)
- [ ] Understand Cloudinary URL handling

## 🔄 Migration Strategy

### Phase 1: Low-Risk Migrations (Start Here)
These collections have simple structures with no dependencies.

- [ ] **Banners** (`banneradds/` routes)
  - [ ] Update controller: `banner.controller.js`
  - [ ] Replace: `Model.find()` → `findAll('banners')`
  - [ ] Replace: `new Model().save()` → `create('banners', data)`
  - [ ] Test endpoint: `GET /api/banners`
  - [ ] Test endpoint: `POST /api/banners/create`
  - [ ] Verify Cloudinary URLs persist

- [ ] **Categories** (`category.controller.js`)
  - [ ] Update category controller
  - [ ] Test: GET all categories
  - [ ] Test: POST new category
  - [ ] Test: DELETE category

- [ ] **Coupons** (`coupon.controller.js`)
  - [ ] Update coupon controller
  - [ ] Test create/read/update/delete operations

### Phase 2: Medium-Complexity (Dependencies)

- [ ] **Products** (`product.controller.js`)
  - [ ] ⚠️ Dependencies: Orders, Cart may reference products
  - [ ] Update controller with helper functions
  - [ ] Verify image uploads to Cloudinary still work
  - [ ] Verify image URLs stored correctly
  - [ ] Test inventory/stock updates
  - [ ] Test: GET all products
  - [ ] Test: GET single product
  - [ ] Test: POST create product with multiple Cloudinary images
  - [ ] Test: PUT update product
  - [ ] Test: DELETE product

- [ ] **Users** (`user.controller.js`)
  - [ ] ⚠️ Dependencies: Orders, Wishlist, Auth
  - [ ] Update user controller
  - [ ] Test: User creation with profile images
  - [ ] Test: User profile updates
  - [ ] Test: Account deletion
  - [ ] Verify user wishlist/favorites structure

### Phase 3: High-Complexity (Multiple Dependencies)

- [ ] **Orders** (`order.controller.js`)
  - [ ] ⚠️ Dependencies: Users, Products, Payment
  - [ ] Update order controller
  - [ ] Use denormalized structure (include product details in order)
  - [ ] Test: Create order with nested products
  - [ ] Test: Get user's orders
  - [ ] Test: Update order status
  - [ ] Test: Get dashboard stats

- [ ] **Payments** (`payment.controller.js`)
  - [ ] Update payment controller
  - [ ] Link to order records
  - [ ] Test: Payment creation
  - [ ] Test: Payment status updates

- [ ] **Authentication** (`auth.controller.js`)
  - [ ] Update auth controller
  - [ ] Test: User registration
  - [ ] Test: User login
  - [ ] Test: Password reset
  - [ ] Test: Token generation

### Phase 4: Advanced Features

- [ ] **Search & Analytics** (`analytics.controller.js`)
  - [ ] Implement client-side filtering
  - [ ] Add caching strategy
  - [ ] Test dashboard stats

- [ ] **Real-time Features**
  - [ ] Implement `.on()` listeners for live updates (if needed)
  - [ ] WebSocket support for notifications

## 🧪 Testing for Each Migration

Use this template for each controller update:

```markdown
### [Collection Name] Migration Test

**Controller**: `[path/to/controller.js`
**Collection**: `[collection_name]`

#### Pre-Migration
- [ ] Original functionality documented
- [ ] Sample data identified
- [ ] API endpoint tested (GET, POST, PUT, DELETE)

#### Migration
- [ ] Helper functions imported: `import { findAll, create, ... } from '../config/db.js'`
- [ ] Collection name constant created: `const COLLECTION = '[name]'`
- [ ] All CRUD operations updated
- [ ] Error handling preserved

#### Testing
- [ ] ✅ GET all [items]: `curl http://localhost:3000/api/[route]`
- [ ] ✅ GET single [item]: `curl http://localhost:3000/api/[route]/[id]`
- [ ] ✅ POST create: Test via Postman/API tool
- [ ] ✅ PUT update: Verify updatedAt timestamp
- [ ] ✅ DELETE: Verify record removed

#### Cloudinary (if applicable)
- [ ] ✅ Image URLs stored correctly
- [ ] ✅ Image URLs retrievable
- [ ] ✅ Multiple images handled properly
- [ ] ✅ Frontend can access images

#### Firebase Console Verification
- [ ] ✅ Data visible in Firebase Realtime Database
- [ ] ✅ Structure looks correct
- [ ] ✅ No unexpected nested objects

#### Rollback Plan
- [ ] Backup MongoDB data before deletion
- [ ] Keep Mongoose models until fully confident
- [ ] Can revert router to use old models if needed
```

## 📋 Detailed Controller Migration Checklist

### For Each Controller:

- [ ] **Imports**
  ```javascript
  ❌ import ProductModel from "../models/product.model.js";
  ✅ import { findAll, findById, create, updateById, deleteById } from "../config/db.js";
  ```

- [ ] **Collection Constant**
  ```javascript
  const COLLECTION = 'products';
  ```

- [ ] **Find Operations**
  ```javascript
  ❌ const items = await ProductModel.find();
  ✅ const items = await findAll(COLLECTION);
  
  ❌ const item = await ProductModel.findById(id);
  ✅ const item = await findById(COLLECTION, id);
  
  ❌ const items = await ProductModel.find({ category: 'electronics' });
  ✅ const items = await findByQuery(COLLECTION, 'category', 'electronics');
  ```

- [ ] **Create Operations**
  ```javascript
  ❌ const newItem = new ProductModel(data);
  ❌ await newItem.save();
  
  ✅ const newItem = await create(COLLECTION, data);
  ```

- [ ] **Update Operations**
  ```javascript
  ❌ await ProductModel.findByIdAndUpdate(id, updateData);
  ✅ await updateById(COLLECTION, id, updateData);
  ```

- [ ] **Delete Operations**
  ```javascript
  ❌ await ProductModel.findByIdAndDelete(id);
  ✅ await deleteById(COLLECTION, id);
  ```

- [ ] **Error Responses**
  - [ ] Preserve existing error structure
  - [ ] Use same status codes (404, 500, etc.)
  - [ ] Same message format

## 🔍 Data Integrity Checks

After each migration, verify data:

- [ ] **Record Count**
  ```javascript
  // Check old MongoDB count vs new Firebase count
  ```

- [ ] **Cloudinary URLs**
  ```javascript
  // Verify all Cloudinary URLs are intact
  await verifyCloudinaryURLs(); // From FIREBASE_ADVANCED_PATTERNS.md
  ```

- [ ] **Timestamp Formats**
  ```javascript
  // Ensure createdAt/updatedAt are ISO format
  ```

- [ ] **Unique Identifiers**
  ```javascript
  // Check all records have unique _id values
  ```

## 🚀 Deployment Checklist

- [ ] **All Controllers Migrated**
  - [ ] ✅ product.controller.js
  - [ ] ✅ user.controller.js
  - [ ] ✅ order.controller.js
  - [ ] ✅ banner.controller.js
  - [ ] ✅ payment.controller.js
  - [ ] ✅ auth.controller.js
  - [ ] ✅ [other controllers]

- [ ] **Remove MongoDB Dependencies**
  - [ ] Remove `mongoose` from package.json (or keep for reference)
  - [ ] Delete `models/` folder (or archive it)
  - [ ] Remove MongoDB connection code

- [ ] **Update Environment Variables**
  - [ ] Remove: `MONGODB_URI`
  - [ ] Ensure: `FIREBASE_DATABASE_URL` present (should be in db.js already)
  - [ ] Keep: Other env vars (JWT_SECRET, etc.)

- [ ] **Performance Testing**
  - [ ] Load test: Can API handle spike?
  - [ ] Response times acceptable?
  - [ ] Firebase quota usage reasonable?

- [ ] **Security Review**
  - [ ] Service Account Key not committed to Git
  - [ ] `.gitignore` includes `serviceAccountKey.json`
  - [ ] Firebase Security Rules configured (if needed)
  - [ ] API rate limiting still in place

- [ ] **Monitoring Setup**
  - [ ] Firebase Console monitored for quota
  - [ ] Error logging working
  - [ ] Cloudinary usage monitored

## 📝 MongoDB Backup Strategy

- [ ] **Export current MongoDB data**
  ```bash
  # Before starting migration
  mongoexport --db aaramdehi --collection products --out backup_products.json
  ```

- [ ] **Keep exports until confident**
  - [ ] Don't delete MongoDB until 1-2 weeks of Firebase production run
  - [ ] Have rollback plan ready

## 🎯 Post-Migration

- [ ] **Monitor Firebase Usage**
  - [ ] Check Firebase Console daily for first week
  - [ ] Verify data reads/writes are as expected
  - [ ] No unexpected quota spikes

- [ ] **Update Documentation**
  - [ ] Update API docs with any changes
  - [ ] Document collection structures in Firebase
  - [ ] Add troubleshooting guide

- [ ] **Team Handoff**
  - [ ] Train team on Firebase queries
  - [ ] Share these migration docs
  - [ ] Document where helpers are (db.js)

- [ ] **Frontend Compatibility**
  - [ ] Verify frontend works without changes
  - [ ] `_id` still accessible
  - [ ] Cloudinary URLs still display
  - [ ] No breaking changes in API responses

## ⚠️ Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Data loss | Keep MongoDB backup 2+ weeks |
| Cloudinary URLs broken | Test images explicitly per section |
| API performance degrades | Monitor Firebase reads/writes |
| Frontend breaks | Test all endpoints before deploy |
| Duplicate records | Use unique check in create functions |
| Wrong collection structure | Verify in Firebase Console after each step |

## 📞 Troubleshooting Quick Links

- **Service Account Key Error**: See [FIREBASE_MIGRATION_GUIDE.md](FIREBASE_MIGRATION_GUIDE.md#troubleshooting)
- **Cloudinary URL Issues**: See [FIREBASE_ADVANCED_PATTERNS.md](FIREBASE_ADVANCED_PATTERNS.md#8-denormalization-pattern-recommended-for-firebase)
- **Query Examples**: See [FIREBASE_ROUTE_EXAMPLE.md](FIREBASE_ROUTE_EXAMPLE.md)

## 🎉 Success Criteria

✅ Migration is complete when:
1. All controllers use Firebase helpers
2. All tests pass (unit + integration)
3. Cloudinary URLs still work on frontend
4. Zero data loss during migration
5. Firebase console shows expected data structure
6. API response times acceptable
7. No errors in production logs (first 24h)
8. Team trained on new stack

---

**Last Updated**: May 14, 2026
**Database URL**: https://aaramdehi-91f82-default-rtdb.firebaseio.com/
**Service Account**: Place `serviceAccountKey.json` in `server/config/`

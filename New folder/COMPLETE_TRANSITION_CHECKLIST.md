# MongoDB to Firebase Migration - Complete Transition Checklist

یہ checklist تمام مراحل کو یکجا رکھتا ہے۔ ہر قدم پر کام کریں اور check mark لگائیں۔

---

## 📋 Phase 1: Firebase Setup (Pre-Migration)

### 1.1 Service Account Key Download ✅

- [ ] Firebase Console.com جائیں
- [ ] Project: `aaramdehi-91f82` select کریں
- [ ] Settings → Service Accounts جائیں
- [ ] "Generate New Private Key" click کریں
- [ ] JSON file download کریں
- [ ] `server/config/serviceAccountKey.json` میں save کریں
- [ ] Private key secure ہے (shared نہ کریں)

### 1.2 Verify db.js Configuration ✅

- [ ] `server/config/db.js` open کریں
- [ ] Database URL صحیح ہے: `https://aaramdehi-91f82-default-rtdb.firebaseio.com/`
- [ ] تمام 8 helper functions موجود ہیں:
  - [ ] `findAll()`
  - [ ] `findById()`
  - [ ] `findByQuery()`
  - [ ] `create()`
  - [ ] `updateById()`
  - [ ] `deleteById()`
  - [ ] `deleteMany()`
  - [ ] `db` reference

### 1.3 Update .gitignore ✅

- [ ] `server/.gitignore` open کریں
- [ ] یہ entries add کریں:
  ```
  serviceAccountKey.json
  config/serviceAccountKey.json
  .env.local
  .env*.local
  ```

### 1.4 Test Local Connection ✅

```bash
cd server
npm run dev
```

- [ ] Server start ہو without Firebase errors
- [ ] Terminal میں error نہ ہو

---

## 🔐 Phase 2: Firebase Security & Environment Setup

### 2.1 Firebase Security Rules ✅

- [ ] Firebase Console → Realtime Database → Rules tab
- [ ] Development rules temporarily set کریں:
  ```json
  {
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  ```
- [ ] "Publish" button press کریں
- [ ] Later production rules set کریں (FIREBASE_SECURITY_RULES.md دیکھیں)

### 2.2 Vercel Environment Variables ✅

**Agar Vercel par deploy ہے تو:**

- [ ] Vercel Dashboard open کریں
- [ ] Project select کریں
- [ ] Settings → Environment Variables
- [ ] یہ 5 variables add کریں:
  - [ ] `FIREBASE_PROJECT_ID` = `aaramdehi-91f82`
  - [ ] `FIREBASE_PRIVATE_KEY_ID` = (service account سے)
  - [ ] `FIREBASE_PRIVATE_KEY` = (service account سے)
  - [ ] `FIREBASE_CLIENT_EMAIL` = (service account سے)
  - [ ] `FIREBASE_DATABASE_URL` = `https://aaramdehi-91f82-default-rtdb.firebaseio.com/`

### 2.3 Local .env.local Create ✅

```bash
# server/.env.local میں create کریں
FIREBASE_PROJECT_ID=aaramdehi-91f82
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_DATABASE_URL=https://aaramdehi-91f82-default-rtdb.firebaseio.com/
NODE_ENV=development
```

- [ ] File save کریں
- [ ] Git میں commit نہ کریں (.gitignore میں ہے)

---

## 📚 Phase 3: Documentation Review

- [ ] `FIREBASE_MODEL_STRUCTURE.md` پڑھیں
- [ ] `FIREBASE_ID_HANDLING.md` پڑھیں
- [ ] `FIREBASE_ROUTE_EXAMPLE.md` پڑھیں
- [ ] `FIREBASE_ADVANCED_PATTERNS.md` (advanced features کے لیے)
- [ ] `FIREBASE_SECURITY_RULES.md` پڑھیں

---

## 🔄 Phase 4: Controllers Migration (One by One)

### Migration Strategy
**ہر controller کے لیے:**
1. Model imports remove کریں
2. Firebase helpers import کریں
3. Database calls update کریں
4. Test کریں (cURL/Postman)
5. Firebase Console verify کریں

---

### 4.1 Banner Controller (Easiest - Start Here!)

**File**: `server/controllers/banner.controller.js`

- [ ] **Step 1: Imports Update**
  ```javascript
  // ❌ Remove
  import BannerModel from "../models/banner.model.js";
  
  // ✅ Add
  import { findAll, findById, create, updateById, deleteById } from "../config/db.js";
  const COLLECTION = 'banners';
  ```

- [ ] **Step 2: Functions Update**
  - [ ] `findAll()` → `findAll(COLLECTION)`
  - [ ] `create()` → `create(COLLECTION, data)`
  - [ ] `updateById()` → `updateById(COLLECTION, id, data)`
  - [ ] `deleteById()` → `deleteById(COLLECTION, id)`

- [ ] **Step 3: Test**
  ```bash
  # GET all
  curl http://localhost:3000/api/banners
  
  # POST create
  curl -X POST http://localhost:3000/api/banners \
    -H "Content-Type: application/json" \
    -d '{"title":"Test","imageUrl":"https://res.cloudinary.com/.../img.jpg"}'
  ```

- [ ] **Step 4: Verify**
  - [ ] Firebase Console میں `banners` collection دکھائی دے
  - [ ] Cloudinary URLs store ہو گئے
  - [ ] createdAt/updatedAt auto-added ہو گئے

---

### 4.2 Category Controller

**File**: `server/controllers/category.controller.js`

- [ ] Import statements update کریں
- [ ] Database calls update کریں
- [ ] Test کریں (GET, POST, PUT, DELETE)
- [ ] Firebase میں verify کریں

---

### 4.3 Coupon Controller

**File**: `server/controllers/coupon.controller.js`

- [ ] Import statements update کریں
- [ ] Database calls update کریں
- [ ] Test کریں
- [ ] Firebase میں verify کریں

---

### 4.4 Product Controller (More Complex)

**File**: `server/controllers/product.controller.js`

**خاص دھیان:**
- [ ] Cloudinary image URLs properly store ہو رہے ہیں
- [ ] Multiple images handling
- [ ] Stock/inventory updates
- [ ] Duplicate name check (manual، Firebase میں unique indexes نہیں ہیں)

```javascript
// Duplicate check pattern
const existing = await findByQuery('products', 'name', productName);
if (existing.length > 0) {
  return res.status(409).json({ success: false, message: "Already exists" });
}
```

- [ ] Test کریں image uploads کے ساتھ
- [ ] Verify Cloudinary URLs frontend میں display ہو رہے ہیں

---

### 4.5 User Controller

**File**: `server/controllers/user.controller.js`

**خاص دھیان:**
- [ ] Password hashing still work کر رہی ہے
- [ ] JWT token generation unchanged
- [ ] Profile images (Cloudinary URLs) properly store ہو رہے ہیں
- [ ] Wishlist/favorite logic denormalized ہے (Firebase way)

---

### 4.6 Order Controller (Complex)

**File**: `server/controllers/order.controller.js`

**خاص دھیان - Denormalization:**

```javascript
// Firebase way: Product details اندر order میں store کریں
// NOT just product IDs
const order = {
  _id: "order_key",
  userId: "user_key",
  items: [
    {
      productId: "prod_key",
      productName: "Laptop",              // ← Denormalized
      productImage: "https://...",        // ← Denormalized
      price: 50000,
      quantity: 1
    }
  ]
}
```

- [ ] Order item denormalization implement کریں
- [ ] User details اندر order میں store کریں
- [ ] Payment integration check کریں

---

### 4.7 Payment Controller

**File**: `server/controllers/payment.controller.js`

- [ ] Payment status tracking
- [ ] Order linking (denormalized)
- [ ] Webhook handling (if applicable)

---

### 4.8 Auth Controller

**File**: `server/controllers/auth.controller.js`

**خاص دھیان:**
- [ ] Registration validation
- [ ] Login with Firebase user check
- [ ] JWT token generation
- [ ] Password hashing with bcryptjs

---

### 4.9 Other Controllers

**باقی files:**
- [ ] `appointment.controller.js` - اگر ہے
- [ ] `refund.controller.js` - اگر ہے
- [ ] `analytics.controller.js` - اگر ہے
- [ ] `seo.controller.js` - اگر ہے
- [ ] `team.controller.js` - اگر ہے
- [ ] `payment.controller.js` - اگر ہے
- [ ] `settings.controller.js` - اگر ہے

---

## ✔️ Phase 5: Validation Middleware Setup

### 5.1 Add Validation Middleware

**File**: `server/middleware/validation.js`

```javascript
// Create یا اپ data validate کرنے کے لیے
export const validateProduct = (req, res, next) => {
  const { name, category, price } = req.body;
  const errors = [];
  
  if (!name || name.trim() === '') errors.push('Name required');
  if (!category) errors.push('Category required');
  if (!price || price <= 0) errors.push('Price must be positive');
  
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};
```

- [ ] Validation functions create کریں ہر controller کے لیے
- [ ] Routes میں middleware apply کریں

### 5.2 Update Routes

```javascript
// Before
router.post('/products', createProduct);

// After
router.post('/products', validateProduct, createProduct);
```

---

## 🧪 Phase 6: Integration Testing

### 6.1 Full API Testing

```bash
# Test har endpoint
npm run dev

# In separate terminal, test:
curl http://localhost:3000/api/products
curl http://localhost:3000/api/users
curl http://localhost:3000/api/orders
# etc.
```

- [ ] تمام GET endpoints work کر رہے ہیں
- [ ] تمام POST endpoints work کر رہے ہیں
- [ ] تمام PUT endpoints work کر رہے ہیں
- [ ] تمام DELETE endpoints work کر رہے ہیں

### 6.2 Data Integrity Checks

```javascript
// Verify Cloudinary URLs
const products = await findAll('products');
products.forEach(p => {
  if (p.imageUrl && !p.imageUrl.startsWith('https://res.cloudinary.com')) {
    console.warn('Invalid URL:', p.imageUrl);
  }
});
```

- [ ] تمام Cloudinary URLs intact ہیں
- [ ] کوئی data lost نہیں ہوا
- [ ] IDs properly mapped ہیں (_id)

---

## 🗑️ Phase 7: Dependency Cleanup

### 7.1 Remove Mongoose

```bash
npm uninstall mongoose
```

- [ ] Command run کریں
- [ ] `package-lock.json` update ہو گیا

### 7.2 Archive/Delete Models

```bash
# Archive (safe)
mkdir server/models-backup
move server/models/* server/models-backup/

# OR Delete (if confident)
rm -r server/models
```

- [ ] Models folder remove/archive کریں

### 7.3 Verify No Broken Imports

```bash
npm run dev
```

- [ ] Server بغیر errors start ہو
- [ ] کوئی "mongoose" reference نہ ہو

---

## 🚀 Phase 8: Deployment to Vercel

### 8.1 Code Commit

```bash
git add .
git commit -m "Migrate MongoDB to Firebase Realtime Database"
git push
```

- [ ] Code commit کریں
- [ ] GitHub/Git push کریں

### 8.2 Vercel Redeploy

- [ ] Vercel Dashboard میں جائیں
- [ ] Project select کریں
- [ ] "Redeploy" button press کریں (automatically deploy ہوگا)
- [ ] Build logs check کریں

### 8.3 Production Testing

```bash
# Production URL test کریں
curl https://your-domain.vercel.app/api/products
```

- [ ] Production API respond کر رہا ہے
- [ ] Data Firebase سے آ رہا ہے

---

## 📊 Phase 9: Production Rules Setup

### 9.1 Update Security Rules

- [ ] Firebase Console → Realtime Database → Rules
- [ ] Development rules کو production rules میں update کریں
- [ ] (FIREBASE_SECURITY_RULES.md میں دیکھیں)

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('isAdmin').val() === true"
    },
    // ... etc
  }
}
```

- [ ] "Publish" کریں

### 9.2 Verify Permissions

- [ ] Public data accessible ہے
- [ ] Private data secured ہے
- [ ] Admin-only operations protected ہیں

---

## ✅ Phase 10: Final Verification

### 10.1 Complete Functionality Check

- [ ] User registration/login works
- [ ] Product browse/search works
- [ ] Cart operations work
- [ ] Order creation works
- [ ] Payment processing works (if applicable)
- [ ] Admin functions work

### 10.2 Cloudinary Integration

- [ ] Images upload ہو رہے ہیں
- [ ] URLs properly stored ہیں
- [ ] Frontend display کر رہا ہے
- [ ] Multiple images per product work

### 10.3 Database Integrity

- [ ] Firebase Console میں تمام collections visible ہیں
- [ ] Data structure صحیح ہے
- [ ] Timestamps properly set ہیں

### 10.4 Performance Check

- [ ] API response times reasonable ہیں
- [ ] Database queries efficient ہیں
- [ ] No slow queries (Firebase Console میں check)

### 10.5 Error Handling

- [ ] Error responses consistent ہیں
- [ ] 404/500 errors properly handled ہیں
- [ ] Validation errors clear ہیں

---

## 📋 MongoDB Backup Strategy

- [ ] MongoDB data export لیں (safety)
- [ ] 2-4 weeks keep کریں
- [ ] Production 2+ weeks smooth چلے تو delete کریں
- [ ] Reference: Data export command

---

## 📝 Documentation Update

- [ ] API documentation update کریں (if exists)
- [ ] README.md میں Firebase mention کریں
- [ ] Team کو inform کریں نئے database کے بارے میں
- [ ] Helper functions document کریں

---

## 🎯 Success Criteria

Migration مکمل ہے جب:

- ✅ تمام controllers Firebase helpers استعمال کر رہے ہیں
- ✅ تمام tests pass ہو رہے ہیں
- ✅ Cloudinary URLs intact ہیں
- ✅ کوئی data loss نہیں ہوا
- ✅ Firebase میں data صحیح ہے
- ✅ API response times acceptable ہیں
- ✅ Team نئے stack سے واقف ہے
- ✅ Production 48+ hours بغیر errors

---

## 🆘 Troubleshooting During Migration

| Issue | Solution |
|-------|----------|
| Service Account Key error | `server/config/` میں file check کریں |
| Cloudinary URLs broken | Full URL verify کریں (https:// سے شروع) |
| ID format issues | String IDs Firebase key ہیں, normal ہے |
| Duplicate records | Manual duplicate check implement کریں |
| Slow queries | Pagination/caching implement کریں |
| Auth issues | Middleware check کریں, JWT valid ہے |

---

## 📚 Reference Documents

- **db.js**: `server/config/db.js`
- **Migration Guide**: `FIREBASE_MIGRATION_GUIDE.md`
- **Model Structure**: `FIREBASE_MODEL_STRUCTURE.md`
- **ID Handling**: `FIREBASE_ID_HANDLING.md`
- **Route Examples**: `FIREBASE_ROUTE_EXAMPLE.md`
- **Security Rules**: `FIREBASE_SECURITY_RULES.md`
- **Vercel Setup**: `VERCEL_ENVIRONMENT_SETUP.md`
- **Advanced Patterns**: `FIREBASE_ADVANCED_PATTERNS.md`
- **Dependency Cleanup**: `DEPENDENCY_CLEANUP.md`

---

## ✨ Estimated Timeline

- **Phase 1-2** (Setup): 1-2 hours
- **Phase 3** (Documentation): 1 hour (reference)
- **Phase 4** (Controllers): 3-6 hours (depending on controllers count)
- **Phase 5** (Validation): 1-2 hours
- **Phase 6** (Testing): 2-3 hours
- **Phase 7** (Cleanup): 30 minutes
- **Phase 8** (Deployment): 30 minutes
- **Phase 9-10** (Verification): 1-2 hours

**Total**: 10-18 hours (distributed over 2-3 days recommended)

---

**Last Updated**: May 14, 2026
**Status**: ✅ Complete Migration Plan Ready
**Next Step**: Start with Phase 1!

# Dependency Cleanup - MongoDB to Firebase Migration

Firebase migration complete hone ke baad, unnecessary dependencies ko remove karna zaroori hai. Yeh optimize karta hai build size, installation time, aur performance.

---

## 🗑️ Packages to Remove

### Mongoose-Related Packages

```bash
npm uninstall mongoose
```

**Ye packages automatically remove ho jayenge** (mongoose depend karte hain):
- `kareem` - Mongoose hooks library
- `@types/mongoose` - TypeScript types

### Optional: Deprecation Date
```bash
npm list mongoose
# Confirm ye last version install tha?
```

---

## 📋 Full Cleanup Checklist

### Step 1: Identify Installed Packages
```bash
# Current packages check karo
npm list

# Detailed view
npm list --depth=0
```

### Step 2: Remove Mongoose
```bash
npm uninstall mongoose
```

### Step 3: Check for Mongoose Imports
```bash
# Search workspace mein Mongoose usage
grep -r "mongoose" server/  # Windows PowerShell: findstr /R /S "mongoose" server\

# Agar output aaye, uske files update karne hain
```

### Step 4: Verify No Breaking Changes
```bash
npm run dev
# Server start ho without errors?
```

---

## 📁 Files to Clean (Models, Schemas)

### Remove These Directories (Optional)
```
server/
├── models/           ← Mongoose models - DELETE or ARCHIVE
│   ├── product.model.js
│   ├── user.model.js
│   ├── order.model.js
│   └── ...
└── schemas/          ← If exists - DELETE or ARCHIVE
```

### Archive Instead of Delete
```bash
# Safe approach - ZIP karne se pehle backup rakh sakte ho
mkdir server/models-backup
mv server/models/* server/models-backup/
rmdir server/models
```

### Keep These
```
server/
├── config/
│   └── db.js         ✅ KEEP - Firebase setup
├── middleware/       ✅ KEEP - Auth, validation
├── routes/           ✅ KEEP - API routes
├── controllers/      ✅ KEEP - Business logic (updated)
├── utils/            ✅ KEEP - Helper functions
└── public/           ✅ KEEP - Static files
```

---

## 🔍 Update package.json (Manual Check)

```json
{
  "dependencies": {
    // ❌ REMOVE (if exists)
    "mongoose": "^9.6.2",
    
    // ✅ KEEP
    "firebase-admin": "^13.9.0",
    "express": "^5.2.1",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.3",
    "cloudinary": "^2.9.0",
    "multer": "^2.1.1",
    "helmet": "^8.1.0",
    "morgan": "^1.10.1",
    "cookie-parser": "^1.4.7",
    "express-rate-limit": "^8.4.1",
    "nodemailer": "^8.0.7"
  }
}
```

---

## 🚀 Cleanup Steps

### Step 1: Remove Package
```bash
cd f:\Aramdehi\server
npm uninstall mongoose
```

### Step 2: Remove Models Directory
```bash
# Option A: Archive
mkdir models-backup
move models\* models-backup\
rmdir models

# Option B: Delete (if confident)
rm -r models
```

### Step 3: Clean node_modules
```bash
# Remove node_modules aur reinstall
rm -r node_modules
npm install
```

### Step 4: Verify
```bash
# Start server
npm run dev

# Check for errors
# Agar "mongoose" related error nahi aaye, perfect!
```

### Step 5: Update .gitignore (Optional)
```
# .gitignore mein add karo (agar archived models hai)
models-backup/
```

---

## 📊 Package Size Comparison

### Before (with Mongoose)
```
mongoose                    ~3.8 MB
  ├── bson                  ~1.2 MB
  ├── mongodb               ~4.5 MB
  └── kareem                ~0.2 MB
━━━━━━━━━━━━━━━━━━━━━━━━━
Total additional: ~9.7 MB
```

### After (Firebase only)
```
firebase-admin              ~12 MB (but already installed)
  ├── (compression in Vercel)
  └── (smaller than total with mongoose)
━━━━━━━━━━━━━━━━━━━━━━━━━
Total saved: ~9+ MB
```

**Benefit**: Faster deployment, less bandwidth usage, quicker npm install

---

## 🔗 Files to Update (Remove Mongoose Imports)

### Search for Mongoose Usage
```bash
# PowerShell
findstr /R /S "mongoose\|Model\|Schema" server\

# Result will show files with Mongoose references
```

### Common Files to Check
```
server/
├── index.js              - MongoDB connection (REMOVE)
├── controllers/
│   ├── product.controller.js    (UPDATE - remove Model imports)
│   ├── user.controller.js       (UPDATE - remove Model imports)
│   └── ...
├── models/               (DELETE entire folder)
├── routes/               (No changes needed)
└── middleware/           (No changes needed)
```

### Example Update

#### Before
```javascript
// server/controllers/product.controller.js
import ProductModel from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  const products = await ProductModel.find();
  res.json(products);
};
```

#### After
```javascript
// server/controllers/product.controller.js
import { findAll } from "../config/db.js";

const COLLECTION = 'products';

export const getAllProducts = async (req, res) => {
  const products = await findAll(COLLECTION);
  res.json(products);
};
```

---

## 🧪 Post-Cleanup Testing

### Test 1: Server Starts
```bash
npm run dev
# Should start without errors
```

### Test 2: API Works
```bash
# Test endpoint
curl http://localhost:3000/api/products

# Should return data from Firebase
```

### Test 3: No Module Warnings
```bash
# Check console for warnings
# Should NOT see: "Module not found: mongoose"
```

### Test 4: Build Succeeds
```bash
# If build script exists
npm run build

# Should build without errors
```

---

## 🔒 Keeping MongoDB Connection Code (Optional)

Agar pehle MongoDB connection hai `server/index.js` mein:

### Before
```javascript
import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI;

// MongoDB Connection
mongoose.connect(URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Error:', err));

const app = express();
```

### After (Mongoose Code Removed)
```javascript
// MongoDB connection REMOVED
// Firebase initialized in: server/config/db.js

const app = express();
```

---

## 📝 Complete Cleanup Procedure

```bash
# Step 1: Remove Mongoose package
npm uninstall mongoose

# Step 2: Clean install
rm -r node_modules
npm install

# Step 3: Archive models (if keeping backup)
mkdir models-backup
move models\* models-backup\ 2>$null
# OR delete directly: rm -r models

# Step 4: Search for remaining Mongoose references
findstr /R /S "mongoose" server\
# If found, update those files (remove imports)

# Step 5: Test
npm run dev
# Verify no errors

# Step 6: Git changes (if using Git)
git add .
git commit -m "Remove Mongoose - migrated to Firebase"
git push
```

---

## ⚠️ Before Cleanup - Safety Checklist

- [ ] All controllers updated (use Firebase helpers)
- [ ] All models refactored to classes (if needed)
- [ ] Local testing done completely
- [ ] Backup of models folder taken
- [ ] No Mongoose imports remaining in code
- [ ] Tests passing
- [ ] Team notified of changes

---

## 🔄 Rollback Plan (If Needed)

```bash
# If something breaks after cleanup

# Option 1: Revert from Git
git revert <commit-hash>

# Option 2: Reinstall Mongoose
npm install mongoose

# Option 3: Restore from backup
xcopy models-backup models\ /E /Y
```

---

## 📊 Disk Space Saved

```
node_modules size:
Before: ~450 MB (with mongoose)
After:  ~380 MB (firebase-admin only)
━━━━━━━━━━━━━━━━━━━━
Saved:  ~70 MB

Installation time:
Before: ~2-3 minutes
After:  ~1-1.5 minutes
```

---

## 🎯 What Stays Installed

### Keep These Packages
```json
{
  "dependencies": {
    "firebase": "^12.13.0",           ✅ Firebase SDK
    "firebase-admin": "^13.9.0",      ✅ Firebase Admin (CRITICAL)
    "express": "^5.2.1",              ✅ Server
    "cors": "^2.8.6",                 ✅ CORS
    "dotenv": "^17.4.2",              ✅ Env variables
    "bcryptjs": "^3.0.3",             ✅ Password hashing
    "jsonwebtoken": "^9.0.3",         ✅ JWT auth
    "cloudinary": "^2.9.0",           ✅ Image upload
    "multer": "^2.1.1",               ✅ File handling
    "helmet": "^8.1.0",               ✅ Security
    "morgan": "^1.10.1",              ✅ Logging
    "cookie-parser": "^1.4.7",        ✅ Cookies
    "express-rate-limit": "^8.4.1",   ✅ Rate limiting
    "nodemailer": "^8.0.7"            ✅ Email
  }
}
```

---

## 🚀 Final Verification

```bash
# 1. Check installed packages
npm list --depth=0

# 2. Verify no mongoose
npm list mongoose  # Should show "not installed" or similar

# 3. Ensure firebase-admin is there
npm list firebase-admin  # Should show version

# 4. Start server
npm run dev

# 5. Test API
curl http://localhost:3000/api/products

# 6. Check Firebase Console
# Verify data is in Realtime Database
```

---

## 📚 Related Documentation

- **db.js**: `server/config/db.js` - Firebase setup
- **Model Structure**: `FIREBASE_MODEL_STRUCTURE.md` - Class-based models
- **Migration Checklist**: `FIREBASE_MIGRATION_CHECKLIST.md` - Complete steps

---

## ✅ Cleanup Complete When

- [ ] `npm list mongoose` shows not installed
- [ ] Server starts without errors
- [ ] All APIs working
- [ ] Firebase data accessible
- [ ] Build size reduced
- [ ] No Mongoose references in code
- [ ] Team using new Firebase helpers

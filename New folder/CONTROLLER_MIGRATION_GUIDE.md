# 🔄 Controller Migration Guide: MongoDB → Firebase

**Urdu Summary**: 
- Routes بالکل same رہیں گے
- Controllers میں صرف **Mongoose queries** بدلیں گے
- Business logic، validation، helper functions - سب same ہیں
- **Code delete نہ کریں، صرف import/calls بدلیں**

---

## 📋 The Conversion Pattern

### Step-by-Step Pattern

```javascript
// ❌ OLD (Mongoose)
import ProductModel from "../models/product.model.js";
const product = await ProductModel.findOne({ _id: id });
await ProductModel.create(data);
await ProductModel.findByIdAndUpdate(id, updateData);

// ✅ NEW (Firebase)
import { findById, create, updateById } from "../config/db.js";
const product = await findById('products', id);
const product = await create('products', data);
await updateById('products', id, updateData);
```

---

## 🔐 Auth Controller Migration

### File: `server/controllers/user.controller.js`

#### 🔴 BEFORE: Register User Function (Mongoose)

```javascript
import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export async function registerUserController(request, response) {
    try {
        const { password, confirmPassword } = request.body;
        const name = sanitizeString(request.body.name);
        const email = sanitizeString(request.body.email);
        const mobile = sanitizeString(request.body.mobile);

        // Check duplicate
        const userExist = await UserModel.findOne({ email: email.toLowerCase().trim() });
        if (userExist) {
            return response.status(400).json({ message: "Email already registered", error: true, success: false });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name, 
            email: email.toLowerCase().trim(),
            mobile,
            password: hashedPassword,
            role: "USER",
            forgot_password_otp: verifyCode,
            forgot_password_expiry: new Date(Date.now() + 60 * 60 * 1000) 
        };

        // ❌ Mongoose: Creates new document
        const newUser = new UserModel(payload);
        await newUser.save();

        // ✅ Send OTP email...
        
        return response.status(201).json({
            message: "Registration successful. OTP sent to your email.",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true, success: false });
    }
}
```

#### 🟢 AFTER: Convert to Firebase

```javascript
// ✅ Import Firebase helpers instead of UserModel
import { create, findByQuery } from '../config/db.js';
import bcryptjs from 'bcryptjs';

const COLLECTION = 'users'; // 🎯 Firebase collection name

export async function registerUserController(request, response) {
    try {
        const { password, confirmPassword } = request.body;
        const name = sanitizeString(request.body.name);
        const email = sanitizeString(request.body.email);
        const mobile = sanitizeString(request.body.mobile);

        // ✅ Check duplicate: findByQuery replaces Model.findOne()
        const existingUsers = await findByQuery(COLLECTION, 'email', email.toLowerCase().trim());
        if (existingUsers && existingUsers.length > 0) {
            return response.status(400).json({ message: "Email already registered", error: true, success: false });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name, 
            email: email.toLowerCase().trim(),
            mobile,
            password: hashedPassword,
            role: "USER",
            forgot_password_otp: verifyCode,
            forgot_password_expiry: new Date(Date.now() + 60 * 60 * 1000) 
        };

        // ✅ Create new user: Firebase helper handles _id, timestamps
        const newUser = await create(COLLECTION, payload);

        // ✅ Send OTP email (same code)
        await sendEmail({
            sendTo: email.toLowerCase().trim(),
            subject: "Verify Your Aaramdehi Account",
            html: verifyEmailTemplate({ name, url: verifyCode })
        });
        
        return response.status(201).json({
            message: "Registration successful. OTP sent to your email.",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true, success: false });
    }
}
```

---

#### 🔴 BEFORE: Verify Email Function (Mongoose)

```javascript
export async function verifyEmailController(request, response) {
    try {
        const { email, code, otp } = request.body; 
        const verifyCode = code || otp;

        // ❌ Mongoose: Find user by email
        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return response.status(404).json({ message: "User not found", error: true, success: false });
        }

        // Check OTP...
        if (String(user.forgot_password_otp) !== String(verifyCode).trim()) {
            return response.status(400).json({ message: "Invalid OTP", error: true, success: false });
        }

        // ❌ Mongoose: Update user object and save
        user.verify_email = true;
        user.forgot_password_otp = ""; 
        user.forgot_password_expiry = null;
        await user.save();

        const accessToken = await generatedAccessToken(user._id);
        // ... rest of logic
    }
}
```

#### 🟢 AFTER: Convert to Firebase

```javascript
import { findByQuery, updateById } from '../config/db.js';

export async function verifyEmailController(request, response) {
    try {
        const { email, code, otp } = request.body; 
        const verifyCode = code || otp;

        // ✅ Firebase: Find user by email
        const users = await findByQuery(COLLECTION, 'email', email.toLowerCase().trim());
        if (!users || users.length === 0) {
            return response.status(404).json({ message: "User not found", error: true, success: false });
        }

        const user = users[0]; // Get first matching user

        // Check OTP (logic same)
        if (String(user.forgot_password_otp) !== String(verifyCode).trim()) {
            return response.status(400).json({ message: "Invalid OTP", error: true, success: false });
        }

        // ✅ Firebase: Update user (helper adds timestamp automatically)
        await updateById(COLLECTION, user._id, {
            verify_email: true,
            forgot_password_otp: "", 
            forgot_password_expiry: null
        });

        const accessToken = await generatedAccessToken(user._id);
        // ... rest of logic (same)
    }
}
```

---

#### 🔴 BEFORE: Login Function (Mongoose)

```javascript
export async function loginController(request, response) {
    try {
        const email = sanitizeString(request.body.email);
        const password = request.body.password;

        // ❌ Mongoose: Find user
        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return response.status(400).json({ message: "Invalid credentials", error: true, success: false });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return response.status(400).json({ message: "Invalid credentials", error: true, success: false });
        }

        // ❌ Mongoose: Update and save
        user.refresh_token = refreshToken;
        await user.save();

        return response.status(200).json({ 
            message: "Login successful", 
            success: true,
            accessToken: accessToken,
            user: { 
                id: user._id,  // ⚠️ Note: Firebase returns _id as string
                name: user.name, 
                email: user.email, 
                role: user.role
            } 
        });
    }
}
```

#### 🟢 AFTER: Convert to Firebase

```javascript
import { findByQuery, updateById } from '../config/db.js';

export async function loginController(request, response) {
    try {
        const email = sanitizeString(request.body.email);
        const password = request.body.password;

        // ✅ Firebase: Find user by email
        const users = await findByQuery(COLLECTION, 'email', email.toLowerCase().trim());
        
        if (!users || users.length === 0) {
            return response.status(400).json({ message: "Invalid credentials", error: true, success: false });
        }

        const user = users[0];

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return response.status(400).json({ message: "Invalid credentials", error: true, success: false });
        }

        // ✅ Firebase: Update user (automatic timestamp)
        await updateById(COLLECTION, user._id, {
            refresh_token: refreshToken
        });

        return response.status(200).json({ 
            message: "Login successful", 
            success: true,
            accessToken: accessToken,
            user: { 
                id: user._id,  // ✅ Already string from Firebase!
                name: user.name, 
                email: user.email, 
                role: user.role
            } 
        });
    }
}
```

---

## 📦 Product Controller Migration

### File: `server/controllers/product.controller.js`

#### 🔴 BEFORE: Create Product (Mongoose)

```javascript
import ProductModel from "../models/product.model.js";

export const createProduct = async (req, res) => {
    try {
        const { name, brand, category, mrp, sellingPrice, stock } = req.body;
        
        // Duplicate check
        const existingProduct = await ProductModel.findOne({ name });
        if (existingProduct) {
            return res.status(409).json({ success: false, message: "Product already exists" });
        }

        // Handle image upload...
        let images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await uploadImageCloudinary(file.buffer);
                if (uploadResult.success) {
                    images.push({ url: uploadResult.url, alt: name });
                }
            }
        }

        // ❌ Mongoose: Create with new keyword
        const newProduct = new ProductModel({
            name,
            brand,
            category,
            mrp: Number(mrp),
            sellingPrice: Number(sellingPrice),
            stock: Number(stock),
            images,
            thumbnail: images.length > 0 ? images[0].url : "",
            createdBy: req.userId || null
        });

        await newProduct.save();
        return res.status(201).json({ success: true, message: "Product created", data: newProduct });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error creating product", error: error.message });
    }
};
```

#### 🟢 AFTER: Convert to Firebase

```javascript
import { create, findByQuery } from '../config/db.js';

const COLLECTION = 'products';

export const createProduct = async (req, res) => {
    try {
        const { name, brand, category, mrp, sellingPrice, stock } = req.body;
        
        // ✅ Firebase: Check duplicate using findByQuery
        const existingProducts = await findByQuery(COLLECTION, 'name', name);
        if (existingProducts && existingProducts.length > 0) {
            return res.status(409).json({ success: false, message: "Product already exists" });
        }

        // Handle image upload (same code)
        let images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await uploadImageCloudinary(file.buffer);
                if (uploadResult.success) {
                    images.push({ url: uploadResult.url, alt: name });
                }
            }
        }

        // ✅ Firebase: Create directly with helper
        const newProduct = await create(COLLECTION, {
            name,
            brand,
            category,
            mrp: Number(mrp),
            sellingPrice: Number(sellingPrice),
            stock: Number(stock),
            images,
            thumbnail: images.length > 0 ? images[0].url : "",
            createdBy: req.userId || null
            // ✅ createdAt, updatedAt, _id added automatically by helper!
        });

        return res.status(201).json({ 
            success: true, 
            message: "Product created", 
            data: newProduct  // ✅ Already has _id from Firebase
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error creating product", error: error.message });
    }
};
```

---

#### 🔴 BEFORE: Get All Products (Mongoose)

```javascript
export const getAllProducts = async (req, res) => {
    try {
        const { category, page, limit, search, sort = "-createdAt" } = req.query;
        
        const p = Number(page) || 1;
        const l = Number(limit) || 10;
        const skip = (p - 1) * l;
        
        let filter = {}; 
        if (category) filter.category = category;
        if (search) filter.name = { $regex: search, $options: 'i' };

        // ❌ Mongoose: Query with filters, skip, limit, sort
        const products = await ProductModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(l)
            .lean();

        const total = await ProductModel.countDocuments(filter);
        
        return res.status(200).json({
            success: true,
            data: products,
            totalProducts: total,
            page: p,
            pages: Math.ceil(total / l)
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
```

#### 🟢 AFTER: Convert to Firebase

```javascript
import { findAll } from '../config/db.js';

export const getAllProducts = async (req, res) => {
    try {
        const { category, page, limit, search, sort = "createdAt" } = req.query;
        
        const p = Number(page) || 1;
        const l = Number(limit) || 10;
        const skip = (p - 1) * l;

        // ✅ Firebase: Get all products first
        let products = await findAll(COLLECTION);

        // ✅ Filter by category (client-side filtering)
        if (category) {
            products = products.filter(p => p.category === category);
        }

        // ✅ Search by name (client-side search)
        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p => 
                p.name.toLowerCase().includes(searchLower)
            );
        }

        const total = products.length;

        // ✅ Sort (client-side sorting)
        if (sort) {
            const sortField = sort.replace('-', '');
            const isDesc = sort.startsWith('-');
            products.sort((a, b) => {
                if (a[sortField] < b[sortField]) return isDesc ? 1 : -1;
                if (a[sortField] > b[sortField]) return isDesc ? -1 : 1;
                return 0;
            });
        }

        // ✅ Pagination (client-side)
        const paginatedProducts = products.slice(skip, skip + l);

        return res.status(200).json({
            success: true,
            data: paginatedProducts,
            totalProducts: total,
            page: p,
            pages: Math.ceil(total / l)
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
```

---

#### 🔴 BEFORE: Update Product (Mongoose)

```javascript
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // ❌ Mongoose: Find by ID and update in one step
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ success: true, data: updatedProduct });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
```

#### 🟢 AFTER: Convert to Firebase

```javascript
import { findById, updateById } from '../config/db.js';

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // ✅ Firebase: Check if exists first
        const existingProduct = await findById(COLLECTION, id);
        
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // ✅ Firebase: Update and get latest
        const updatedProduct = await updateById(COLLECTION, id, updateData);

        return res.status(200).json({ success: true, data: updatedProduct });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
```

---

#### 🔴 BEFORE: Delete Product (Mongoose)

```javascript
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // ❌ Mongoose: Find by ID and delete
        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ success: true, message: "Product deleted" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
```

#### 🟢 AFTER: Convert to Firebase

```javascript
import { deleteById } from '../config/db.js';

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Firebase: Delete using helper
        await deleteById(COLLECTION, id);

        return res.status(200).json({ success: true, message: "Product deleted" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
```

---

## 🎯 Quick Reference: All Conversions

| Operation | Mongoose | Firebase Helper |
|-----------|----------|-----------------|
| **Find All** | `Model.find()` | `findAll(COLLECTION)` |
| **Find One** | `Model.findOne({prop: val})` | `findByQuery(COLLECTION, 'prop', val)[0]` |
| **Find by ID** | `Model.findById(id)` | `findById(COLLECTION, id)` |
| **Create** | `new Model(data).save()` | `create(COLLECTION, data)` |
| **Update** | `Model.findByIdAndUpdate(id, data)` | `updateById(COLLECTION, id, data)` |
| **Delete** | `Model.findByIdAndDelete(id)` | `deleteById(COLLECTION, id)` |
| **Delete Many** | `Model.deleteMany({...})` | `deleteMany(COLLECTION, [ids])` |

---

## 📝 Key Differences to Remember

### 1. **Model Import**
```javascript
// ❌ OLD
import UserModel from '../models/user.model.js';

// ✅ NEW
import { findAll, findById, create, updateById, deleteById, findByQuery } from '../config/db.js';
const COLLECTION = 'users';
```

### 2. **Finding One Document**
```javascript
// ❌ OLD (Returns document or null)
const user = await UserModel.findOne({ email: 'test@test.com' });

// ✅ NEW (Returns array)
const users = await findByQuery(COLLECTION, 'email', 'test@test.com');
const user = users && users.length > 0 ? users[0] : null;
```

### 3. **Creating Document**
```javascript
// ❌ OLD
const newUser = new UserModel(data);
await newUser.save();

// ✅ NEW (No need to create instance first)
const newUser = await create(COLLECTION, data);
// Returns: { _id: 'Firebase-Key', ...data, createdAt, updatedAt }
```

### 4. **Updating Document**
```javascript
// ❌ OLD (Modifies object then saves)
user.name = 'New Name';
await user.save();

// ✅ NEW (Direct update)
await updateById(COLLECTION, user._id, { name: 'New Name' });
// Returns: { ...updated_data, updatedAt: auto-timestamp }
```

### 5. **ID Field**
```javascript
// ❌ OLD: ObjectId object
user._id = ObjectId("507f1f77bcf86cd799439011")

// ✅ NEW: String key (but still use ._id!)
user._id = "-NXk5vH1Y2mN3pQ7r8sT"  // String!

// ✅ Both work the same in code:
const userId = user._id;
```

---

## 🔍 Common Pitfalls & Fixes

### ❌ Pitfall 1: Forgetting findByQuery returns array

```javascript
// ❌ WRONG
const user = await findByQuery(COLLECTION, 'email', 'test@test.com');
console.log(user.name);  // ERROR: Cannot read property 'name' of undefined

// ✅ CORRECT
const users = await findByQuery(COLLECTION, 'email', 'test@test.com');
const user = users && users.length > 0 ? users[0] : null;
console.log(user?.name);  // OK
```

### ❌ Pitfall 2: Client-side filtering is slower

```javascript
// ❌ SLOWER (Gets all then filters)
const allProducts = await findAll(COLLECTION);
const expensive = allProducts.filter(p => p.price > 5000);

// ✅ BETTER (Use server logic or Firebase queries)
// For now: keep filtering but cache data if needed
// Later: implement Firebase queries for better performance
```

### ❌ Pitfall 3: Trying to use Mongoose methods

```javascript
// ❌ WRONG
const product = await findById(COLLECTION, id);
await product.save();  // ERROR: product.save is not a function

// ✅ CORRECT
await updateById(COLLECTION, id, updatedData);
```

---

## 🚀 Migration Steps (One Controller at a Time)

### Step 1: Backup Original
```bash
cp server/controllers/product.controller.js server/controllers/product.controller.js.backup
```

### Step 2: Update Imports
```javascript
// Add at top
import { findAll, findById, create, updateById, deleteById, findByQuery } from '../config/db.js';
const COLLECTION = 'products';

// Remove
// import ProductModel from "../models/product.model.js";
```

### Step 3: Replace Each Function

Use the patterns above to convert each function.

### Step 4: Test Locally
```bash
npm run dev
curl http://localhost:3000/api/products
```

### Step 5: Check Firebase Console
```
https://console.firebase.google.com/
→ aaramdehi-91f82
→ Realtime Database
→ Verify 'products' collection has data
```

### Step 6: Move to Next Controller
Repeat for other controllers

---

## ✅ Checklist for Each Controller

- [ ] Backup original file
- [ ] Import Firebase helpers
- [ ] Add COLLECTION constant
- [ ] Remove old model import
- [ ] Convert each function using patterns
- [ ] Test GET endpoint
- [ ] Test POST endpoint
- [ ] Test PUT endpoint
- [ ] Test DELETE endpoint
- [ ] Check Firebase Console for data
- [ ] Verify Cloudinary images (if applicable)
- [ ] Commit changes

---

## 📞 Need Help?

**Still Confused?** Check:
1. **FIREBASE_ROUTE_EXAMPLE.md** - Full working example
2. **FIREBASE_QUICK_REFERENCE.md** - Function signatures
3. **FIREBASE_ADVANCED_PATTERNS.md** - Advanced filtering/searching

---

**Ready to Start?** 

Open `server/controllers/product.controller.js` and follow the patterns above! 🚀

# Firebase Model Classes - Mongoose se Migration

Yeh file models ko Mongoose classes se simple JavaScript classes mein convert karne ka example dikhata hai.
Har model ke liye same pattern follow karein.

## 1. Product Model (Example)

### BEFORE: Mongoose Model (model/product.model.js)
```javascript
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: String,
  images: [{ url: String, alt: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
```

### AFTER: Firebase Class (models/Product.js)
```javascript
/**
 * Product Model Class for Firebase
 * No schema validation - validation done in controller
 */
class Product {
  constructor(data = {}) {
    this.name = data.name;
    this.brand = data.brand || '';
    this.category = data.category;
    this.price = data.price;
    this.stock = data.stock || 0;
    this.imageUrl = data.imageUrl || '';
    this.images = data.images || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Validate product data
   * @returns {Object} { valid: boolean, errors: [] }
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Product name is required');
    }
    
    if (!this.category || this.category.trim() === '') {
      errors.push('Category is required');
    }
    
    if (!this.price || this.price <= 0) {
      errors.push('Price must be a positive number');
    }
    
    if (typeof this.stock !== 'number' || this.stock < 0) {
      errors.push('Stock must be a non-negative number');
    }
    
    // Cloudinary URL validation
    if (this.imageUrl && !this.isValidUrl(this.imageUrl)) {
      errors.push('Invalid image URL format');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate URL format (for Cloudinary)
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert to plain object for Firebase storage
   */
  toJSON() {
    return {
      name: this.name,
      brand: this.brand,
      category: this.category,
      price: this.price,
      stock: this.stock,
      imageUrl: this.imageUrl,
      images: this.images,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Update timestamps
   */
  touch() {
    this.updatedAt = new Date().toISOString();
  }
}

export default Product;
```

---

## 2. User Model (Example)

### AFTER: Firebase Class (models/User.js)
```javascript
class User {
  constructor(data = {}) {
    this._id = data._id || data.id; // Firebase key
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.password = data.password; // Hashed password
    this.profileImage = data.profileImage || '';
    this.addresses = data.addresses || [];
    this.wishlist = data.wishlist || [];
    this.isAdmin = data.isAdmin || false;
    this.isActive = data.isActive !== false; // Default true
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }

    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push('Invalid phone number format');
    }

    if (!this.password || this.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    // Cloudinary profile image validation
    if (this.profileImage && !this.isValidUrl(this.profileImage)) {
      errors.push('Invalid profile image URL');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/; // 10-digit phone
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      profileImage: this.profileImage,
      addresses: this.addresses,
      wishlist: this.wishlist,
      isAdmin: this.isAdmin,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
      // Note: password NOT included in JSON output for security
    };
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }
}

export default User;
```

---

## 3. Order Model (Complex Example)

### AFTER: Firebase Class (models/Order.js)
```javascript
class Order {
  constructor(data = {}) {
    this._id = data._id || data.id;
    this.userId = data.userId; // Required - link to user
    this.items = data.items || []; // Array of order items with product details
    this.totalAmount = data.totalAmount || 0;
    this.status = data.status || 'pending'; // pending, confirmed, shipped, delivered, cancelled
    this.paymentMethod = data.paymentMethod || 'card'; // card, upi, etc.
    this.paymentStatus = data.paymentStatus || 'pending'; // pending, completed, failed
    this.shippingAddress = data.shippingAddress || {};
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!this.items || this.items.length === 0) {
      errors.push('Order must have at least one item');
    }

    if (this.totalAmount <= 0) {
      errors.push('Total amount must be greater than 0');
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(this.status)) {
      errors.push('Invalid order status');
    }

    const validPaymentMethods = ['card', 'upi', 'netbanking', 'wallet'];
    if (!validPaymentMethods.includes(this.paymentMethod)) {
      errors.push('Invalid payment method');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Firebase mein denormalization - product details include karne hote hain
   * Taaki baad mein product reference break na ho
   */
  addItem(item) {
    if (!item.productId || !item.productName || !item.price) {
      throw new Error('Item must have productId, productName, and price');
    }

    this.items.push({
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage || '', // Cloudinary URL
      price: item.price,
      quantity: item.quantity || 1,
      addedAt: new Date().toISOString()
    });

    this.recalculateTotal();
  }

  /**
   * Total amount recalculate karo
   */
  recalculateTotal() {
    this.totalAmount = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }

  toJSON() {
    return {
      _id: this._id,
      userId: this.userId,
      items: this.items,
      totalAmount: this.totalAmount,
      status: this.status,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      shippingAddress: this.shippingAddress,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }
}

export default Order;
```

---

## 4. Generic Base Model (Optional - for reusability)

```javascript
/**
 * Base Model Class - sabke liye common functionality
 */
class BaseModel {
  constructor(data = {}) {
    this._id = data._id || data.id;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Subclasses mein override karein
   */
  validate() {
    return {
      valid: true,
      errors: []
    };
  }

  /**
   * Subclasses mein override karein
   */
  toJSON() {
    return {
      _id: this._id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Timestamp update karo
   */
  touch() {
    this.updatedAt = new Date().toISOString();
  }

  /**
   * URL validation helper
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export default BaseModel;
```

---

## 5. Validation Middleware (Controllers ke liye)

```javascript
// middleware/validation.js

/**
 * Product validation middleware
 */
export const validateProduct = (req, res, next) => {
  const { name, category, price, stock } = req.body;

  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Product name is required');
  }

  if (!category || category.trim() === '') {
    errors.push('Category is required');
  }

  if (!price || isNaN(price) || price <= 0) {
    errors.push('Price must be a positive number');
  }

  if (stock !== undefined && (isNaN(stock) || stock < 0)) {
    errors.push('Stock must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * User validation middleware
 */
export const validateUser = (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (phone && !isValidPhone(phone)) {
    errors.push('Invalid phone number format');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Helper functions
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};
```

---

## Usage in Controllers

### Using Product Class

```javascript
import Product from '../models/Product.js';
import { create } from '../config/db.js';

export const createProduct = async (req, res) => {
  try {
    // Create instance
    const product = new Product(req.body);

    // Validate
    const validation = product.validate();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Save to Firebase
    const result = await create('products', product.toJSON());

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

---

## Key Differences Summary

| Aspect | Mongoose | Firebase Class |
|--------|----------|---|
| **Schema** | Predefined required | Flexible, manual validation |
| **Pre-hooks** | `schema.pre('save', ...)` | Manual method calls |
| **Validation** | Built-in | Model.validate() method |
| **Timestamps** | Auto with timestamps: true | Manual in constructor |
| **ID Type** | ObjectId | String (Firebase key) |
| **URL Storage** | String field | String field (same) |
| **Data Type** | Strong typing | Flexible (manual casting) |

---

## Important Notes for Cloudinary URLs

✅ **Store as-is**: `"https://res.cloudinary.com/dh3ayjpxo/image/upload/v1234567890/product.jpg"`
✅ **Can be in arrays**: `images: [{ url: "...", alt: "..." }]`
✅ **No special handling needed** - just regular strings in JSON
✅ **Frontend unchanged** - still access via `product.imageUrl` or `product.images[0].url`

---

## Date Handling Best Practice

```javascript
// ✅ GOOD - ISO String (Firebase compatible)
createdAt: new Date().toISOString()
// Result: "2026-05-14T10:30:00.000Z"

// ❌ BAD - Date object (Firebase will convert to number)
createdAt: new Date()
// Result: 1715689800000 (hard to read)

// ✅ GOOD - Use ISOString everywhere
const date = new Date().toISOString();
// Then parse if needed: new Date(dateString)
```

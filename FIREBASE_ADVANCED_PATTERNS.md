# Firebase Advanced Patterns & Best Practices

## 1. Working with Arrays (Cloudinary Images)

### Storing Multiple Images
```javascript
// Product with multiple Cloudinary images
const newProduct = await create('products', {
    name: "Laptop",
    category: "electronics",
    images: [
        { url: "https://res.cloudinary.com/.../image1.jpg", alt: "Front view" },
        { url: "https://res.cloudinary.com/.../image2.jpg", alt: "Side view" },
        { url: "https://res.cloudinary.com/.../image3.jpg", alt: "Back view" }
    ],
    thumbnail: "https://res.cloudinary.com/.../image1.jpg"
});
// Returns: { _id: "key123", images: [...], createdAt: "...", ... }
```

### Filtering Products by Image Count
```javascript
import { findAll } from '../config/db.js';

const allProducts = await findAll('products');
const productsWithMultipleImages = allProducts.filter(p => p.images?.length > 1);
```

## 2. Nested Data Structures

### Store Related Data
```javascript
// Order with nested products
const newOrder = await create('orders', {
    userId: "user_123",
    items: [
        {
            productId: "prod_456",
            name: "Laptop",
            imageUrl: "https://res.cloudinary.com/.../image.jpg",
            quantity: 1,
            price: 50000
        },
        {
            productId: "prod_789",
            name: "Mouse",
            imageUrl: "https://res.cloudinary.com/.../mouse.jpg",
            quantity: 2,
            price: 500
        }
    ],
    totalAmount: 51000,
    status: "pending"
});
```

## 3. Batch Operations

### Create Multiple Records
```javascript
const { db } = require('../config/db.js');

async function batchCreateProducts(productsData) {
    try {
        const updates = {};
        const createdIds = [];
        
        productsData.forEach((data) => {
            const newRef = db.ref('products').push();
            updates[`products/${newRef.key}`] = {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            createdIds.push(newRef.key);
        });
        
        await db.ref().update(updates);
        return createdIds;
    } catch (error) {
        console.error('Batch create error:', error);
        throw error;
    }
}

// Usage
const newProducts = await batchCreateProducts([
    { name: "Product 1", price: 100 },
    { name: "Product 2", price: 200 },
    { name: "Product 3", price: 300 }
]);
console.log('Created IDs:', newProducts);
```

### Delete Multiple Records
```javascript
import { deleteMany } from '../config/db.js';

// Delete multiple products
const idsToDelete = ['key1', 'key2', 'key3'];
await deleteMany('products', idsToDelete);
```

## 4. Searching & Filtering (Client-Side)

### Search by Name
```javascript
import { findAll } from '../config/db.js';

async function searchProducts(keyword) {
    const allProducts = await findAll('products');
    return allProducts.filter(p => 
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );
}

// Usage
const results = await searchProducts('laptop');
```

### Multiple Filters
```javascript
async function filterProducts(filters) {
    const { category, minPrice, maxPrice, inStock } = filters;
    let products = await findAll('products');
    
    if (category) {
        products = products.filter(p => p.category === category);
    }
    
    if (minPrice !== undefined) {
        products = products.filter(p => p.sellingPrice >= minPrice);
    }
    
    if (maxPrice !== undefined) {
        products = products.filter(p => p.sellingPrice <= maxPrice);
    }
    
    if (inStock) {
        products = products.filter(p => p.stock > 0);
    }
    
    return products;
}

// Usage
const cheapLaptops = await filterProducts({
    category: 'electronics',
    minPrice: 0,
    maxPrice: 100000,
    inStock: true
});
```

### Sorting
```javascript
async function getSortedProducts(sortBy = 'name', order = 'asc') {
    let products = await findAll('products');
    
    products.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        // Handle numeric comparisons
        if (typeof aValue === 'number') {
            return order === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // Handle string comparisons
        if (typeof aValue === 'string') {
            return order === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        
        return 0;
    });
    
    return products;
}

// Usage
const sortedByPrice = await getSortedProducts('sellingPrice', 'desc');
```

## 5. Pagination

```javascript
async function getPaginatedProducts(page = 1, pageSize = 10) {
    const allProducts = await findAll('products');
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
        data: allProducts.slice(startIndex, endIndex),
        currentPage: page,
        totalPages: Math.ceil(allProducts.length / pageSize),
        totalItems: allProducts.length,
        hasNextPage: endIndex < allProducts.length,
        hasPrevPage: page > 1
    };
}

// Usage in API endpoint
export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        
        const result = await getPaginatedProducts(page, pageSize);
        
        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
```

## 6. Transactions & Atomic Updates

### Multi-Reference Update (Order + Inventory)
```javascript
import { db } from '../config/db.js';

async function processOrder(orderId, orderData) {
    try {
        const timestamp = new Date().toISOString();
        
        const updates = {};
        
        // Update order
        updates[`orders/${orderId}`] = {
            ...orderData,
            status: 'confirmed',
            updatedAt: timestamp
        };
        
        // Update inventory for each product
        orderData.items.forEach(item => {
            updates[`products/${item.productId}/stock`] = 
                admin.database.ServerValue.increment(-item.quantity);
        });
        
        // Apply all updates atomically
        await db.ref().update(updates);
        return { success: true };
    } catch (error) {
        console.error('Transaction error:', error);
        throw error;
    }
}
```

## 7. User-Specific Data

### Get User's Orders
```javascript
import { findByQuery, findAll } from '../config/db.js';

async function getUserOrders(userId) {
    return await findByQuery('orders', 'userId', userId);
}

// Usage
const userOrders = await getUserOrders('user_123');
```

### Get User's Wishlist
```javascript
import { findById } from '../config/db.js';

async function getUserWishlist(userId) {
    const user = await findById('users', userId);
    return user?.wishlist || [];
}
```

## 8. Denormalization Pattern (Recommended for Firebase)

Unlike MongoDB, Firebase works better with denormalized data:

```javascript
// GOOD - Denormalized (Firebase-friendly)
const order = {
    _id: "order_123",
    userId: "user_456",
    userName: "John Doe",  // ❌ Duplicate but fast queries
    userEmail: "john@email.com",  // ❌ Duplicate but fast queries
    items: [
        {
            productId: "prod_789",
            productName: "Laptop",  // ❌ Duplicate
            productImage: "https://cloudinary.com/...",  // ❌ Duplicate
            price: 50000,
            quantity: 1
        }
    ]
};

// BAD - Normalized (Requires additional queries)
const order = {
    _id: "order_123",
    userId: "user_456",  // ✅ Need separate query to get user details
    items: ["prod_789"]  // ✅ Need separate query for each product
};
```

## 9. Error Handling Best Practices

```javascript
import { findAll, deleteById } from '../config/db.js';

export const deleteProductWithFallback = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verify exists
        const product = await findById('products', id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        // Delete with timeout protection
        const deletePromise = deleteById('products', id);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Delete timeout')), 5000)
        );
        
        await Promise.race([deletePromise, timeoutPromise]);
        
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
        
    } catch (error) {
        if (error.message === 'Delete timeout') {
            return res.status(504).json({
                success: false,
                message: "Delete operation timed out"
            });
        }
        
        console.error('Delete error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete product"
        });
    }
};
```

## 10. Caching Strategy

```javascript
// Simple in-memory cache
class FirebaseCache {
    constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    set(key, value) {
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + this.ttl
        });
    }
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (item.expiresAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }
    
    clear() {
        this.cache.clear();
    }
}

// Usage
const cache = new FirebaseCache(10 * 60 * 1000); // 10 minutes

export const getAllProducts = async (req, res) => {
    try {
        // Check cache first
        const cached = cache.get('all-products');
        if (cached) {
            return res.status(200).json({
                success: true,
                data: cached,
                source: 'cache'
            });
        }
        
        // Fetch from Firebase
        const products = await findAll('products');
        cache.set('all-products', products);
        
        return res.status(200).json({
            success: true,
            data: products,
            source: 'firebase'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
```

## Performance Tips

1. **Use findByQuery** instead of findAll() when you need specific records
2. **Implement caching** for frequently accessed data
3. **Denormalize data** to avoid multiple queries
4. **Batch operations** when writing multiple records
5. **Use pagination** for large result sets
6. **Filter in application code** for complex queries
7. **Set appropriate TTL** for cached data

## Common Pitfalls to Avoid

❌ **Don't**: Fetch all products on every request
```javascript
// BAD
const products = await findAll('products'); // Fetches all data every time
```

✅ **Do**: Use specific queries or caching
```javascript
// GOOD - Specific query
const electronics = await findByQuery('products', 'category', 'electronics');

// GOOD - Cached data
const cached = cache.get('all-products') || await findAll('products');
```

❌ **Don't**: Store Cloudinary URLs separately from product data
```javascript
// BAD - Inconsistent updates needed
const product = { name: "Laptop" };
const images = { productId: "prod_123", urls: ["url1", "url2"] };
```

✅ **Do**: Store everything together
```javascript
// GOOD - Single source of truth
const product = {
    name: "Laptop",
    images: [
        { url: "https://res.cloudinary.com/.../img1.jpg", alt: "Front" },
        { url: "https://res.cloudinary.com/.../img2.jpg", alt: "Back" }
    ]
};
```

## Testing Migration

Use this helper to verify your data migration:
```javascript
async function verifyCloudinaryURLs() {
    const products = await findAll('products');
    let validCount = 0;
    let invalidCount = 0;
    
    products.forEach(product => {
        if (product.images && Array.isArray(product.images)) {
            product.images.forEach(img => {
                if (img.url && img.url.startsWith('https://res.cloudinary.com')) {
                    validCount++;
                } else {
                    invalidCount++;
                    console.warn('Invalid image URL:', img.url);
                }
            });
        }
    });
    
    console.log(`✅ Valid URLs: ${validCount}`);
    console.log(`❌ Invalid URLs: ${invalidCount}`);
    return invalidCount === 0;
}
```

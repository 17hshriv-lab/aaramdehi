# Firebase Route Example: Product Controller Conversion

This file shows a real example of converting from Mongoose to Firebase for your product routes.

## Side-by-Side Comparison

### Before (Mongoose)
```javascript
// server/controllers/product.controller.js (BEFORE)
import ProductModel from "../models/product.model.js";

export const createProduct = async (req, res) => {
    try {
        const { name, brand, category, mrp, sellingPrice, stock } = req.body;
        
        // Duplicate Check
        const existingProduct = await ProductModel.findOne({ name });
        if (existingProduct) {
            return res.status(409).json({ 
                success: false, 
                message: "Product with this name already exists" 
            });
        }

        // Create and Save
        const newProduct = new ProductModel({
            name,
            brand,
            category,
            mrp: Number(mrp),
            sellingPrice: Number(sellingPrice),
            stock: Number(stock)
        });

        await newProduct.save();
        return res.status(201).json({ 
            success: true, 
            message: "Product created successfully", 
            data: newProduct 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find();
        return res.status(200).json({ 
            success: true, 
            data: products 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            data: product 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            data: updatedProduct 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            message: "Product deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
```

### After (Firebase)
```javascript
// server/controllers/product.controller.js (AFTER)
import { findAll, findById, findByQuery, create, updateById, deleteById } from "../config/db.js";

const COLLECTION = 'products'; // Collection name in Firebase

export const createProduct = async (req, res) => {
    try {
        const { name, brand, category, mrp, sellingPrice, stock } = req.body;
        
        // Duplicate Check - Query by name
        const existingProducts = await findByQuery(COLLECTION, 'name', name);
        if (existingProducts.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: "Product with this name already exists" 
            });
        }

        // Create and Save - helper function returns _id automatically
        const newProduct = await create(COLLECTION, {
            name,
            brand,
            category,
            mrp: Number(mrp),
            sellingPrice: Number(sellingPrice),
            stock: Number(stock)
        });

        return res.status(201).json({ 
            success: true, 
            message: "Product created successfully", 
            data: newProduct  // Has _id, createdAt, updatedAt already
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        // findAll returns array with _id mapped to Firebase key
        const products = await findAll(COLLECTION);
        return res.status(200).json({ 
            success: true, 
            data: products 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await findById(COLLECTION, id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            data: product  // Has _id already included
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // updateById returns full updated object
        const updatedProduct = await updateById(COLLECTION, id, updateData);
        
        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            data: updatedProduct  // updatedAt timestamp auto-added
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if exists before deleting
        const product = await findById(COLLECTION, id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        await deleteById(COLLECTION, id);
        
        return res.status(200).json({ 
            success: true, 
            message: "Product deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
```

## Key Changes Summary

| Aspect | Mongoose | Firebase |
|--------|----------|----------|
| **Import** | Model class | Helper functions |
| **Find All** | `Model.find()` | `findAll(collectionName)` |
| **Find By ID** | `Model.findById(id)` | `findById(collectionName, id)` |
| **Find by Property** | `Model.findOne({prop: val})` | `findByQuery(collectionName, prop, val)` |
| **Create** | `new Model().save()` | `create(collectionName, data)` |
| **Update** | `Model.findByIdAndUpdate()` | `updateById(collectionName, id, data)` |
| **Delete** | `Model.findByIdAndDelete()` | `deleteById(collectionName, id)` |
| **ID Field** | `_id` (ObjectId) | `_id` (Firebase key as string) |
| **Timestamps** | Optional (Mongoose plugin) | Auto-added by helpers |

## Important Migration Notes

### 1. Cloudinary URLs Work Perfectly
Your existing image URLs are strings and work fine with Firebase:
```javascript
// This still works exactly the same
const product = await create(COLLECTION, {
    name: "Product",
    imageUrl: "https://res.cloudinary.com/...",
    thumbnail: "https://res.cloudinary.com/..."
});
```

### 2. Duplicate Checking Pattern
Firebase doesn't have unique indexes, so manual checking is needed:
```javascript
// OLD (Mongoose) - automatic unique index
const existing = await ProductModel.findOne({ name });

// NEW (Firebase) - manual query and check
const existing = await findByQuery(COLLECTION, 'name', name);
if (existing.length > 0) { /* handle duplicate */ }
```

### 3. Null/Undefined Handling
```javascript
// Firebase helper returns null if not found (like Mongoose)
const product = await findById(COLLECTION, id);
if (!product) {
    return res.status(404).json({ success: false });
}
```

### 4. Auto-Timestamps
```javascript
// Mongoose: Requires timestamps: true in schema
// Firebase: Always added by helpers

const created = await create(COLLECTION, data);
// Returns: { _id: "...", createdAt: "2026-05-14T...", updatedAt: "2026-05-14T...", ...data }
```

## Testing Your Migration

### Quick Test
```bash
# Terminal 1: Start your server
npm run dev

# Terminal 2: Test API
curl -X POST http://localhost:3000/api/products/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "brand": "Test Brand",
    "category": "electronics",
    "mrp": 1000,
    "sellingPrice": 800,
    "stock": 10
  }'
```

### Check Firebase Console
1. Go to Firebase Console
2. Select `aaramdehi-91f82` project
3. Go to **Realtime Database**
4. You should see `products` node with your test data

## Next Steps

1. Update `product.controller.js` with Firebase helpers
2. Update all other controllers (user, order, banner, etc.)
3. Remove MongoDB/Mongoose imports and models
4. Test each endpoint thoroughly
5. Verify Cloudinary URLs persist correctly
6. Monitor Firebase usage in console

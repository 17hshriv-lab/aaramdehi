import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import { uploadImageCloudinary } from "../utils/uploadImageCloudinary.js";

// ✅ 1. CREATE NEW PRODUCT
export const createProduct = async (req, res) => {
    try {
        const { 
            name, brand, description, shortDescription, category, subCategory, 
            tags, mrp, sellingPrice, discountPercent, stock, sku, 
            specifications, seoTitle, seoDescription, seoKeywords 
        } = req.body;
        const userId = req.userId || req.user?._id || req.user?.id;

        // ✅ 1. Advanced Validation: Check precisely for missing fields
        // Stock 0 ho sakta hai, isliye hum undefined/null check karenge
        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!brand) missingFields.push("brand"); // ✅ Added brand to validation
        if (!category) missingFields.push("category");
        if (mrp === undefined || mrp === "") missingFields.push("mrp");
        if (sellingPrice === undefined || sellingPrice === "") missingFields.push("sellingPrice");
        if (stock === undefined || stock === "") missingFields.push("stock");

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Required fields missing: ${missingFields.join(", ")}`,
                errorFields: missingFields
            });
        }

        // Duplicate Check
        const existingProduct = await ProductModel.findOne({ name });
        if (existingProduct) {
            return res.status(409).json({ success: false, message: "Product with this name already exists" });
        }

        // Generate URL-friendly Slug
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        // Handle image upload (Using Buffer for Streams)
        let images = [];
        if (req.file) {
            const uploadResult = await uploadImageCloudinary(req.file.buffer);
            if (uploadResult.success) {
                images = [{
                    url: uploadResult.url,
                    alt: name
                }];
            }
        }

        const newProduct = new ProductModel({
            name,
            brand,
            description: description || "",
            shortDescription: shortDescription || "",
            category,
            subCategory: subCategory || "",
            tags: (typeof tags === 'string' && tags.trim()) ? tags.split(',').map(t => t.trim()) : [],
            mrp: Number(mrp),
            sellingPrice: Number(sellingPrice),
            discountPercent: Number(discountPercent) || 0,
            stock: Number(stock),
            sku: sku || slug,
            images,
            thumbnail: images.length > 0 ? images[0].url : "",
            specifications: (specifications && typeof specifications === 'string' && specifications.startsWith('{')) ? JSON.parse(specifications) : {},
            seoTitle: seoTitle || name,
            seoDescription: seoDescription || shortDescription || "",
            seoKeywords: (typeof seoKeywords === 'string' && seoKeywords.trim()) ? seoKeywords.split(',').map(k => k.trim()) : [],
            slug,
            createdBy: userId || null
        });

        await newProduct.save();
        return res.status(201).json({ success: true, message: "Product created successfully", data: newProduct });

    } catch (error) {
        console.error("❌ Error creating product:", error);
        return res.status(500).json({ success: false, message: "Error creating product", error: error.message });
    }
};

// ✅ 2. GET ALL PRODUCTS (Search & Filter)
// ✅ 2. GET ALL PRODUCTS (Search & Filter)
// ✅ GET ALL PRODUCTS (Updated logic to show all data to Admin)
export const getAllProducts = async (req, res) => {
    try {
        const { category, page, limit, search, sort = "-createdAt" } = req.query;
        
        const p = Number(page) || 1;
        const l = Number(limit) || 10;
        const skip = (p - 1) * l;
        
        let filter = {}; 

        // Category filter fix: Empty string handle karna zaroori hai
        if (category && category !== "" && category !== "undefined") {
            filter.category = category;
        }

        // Search filter fix: Name aur Brand dono mein search karega
        if (search && search !== "" && search !== "undefined") {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await ProductModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(l)
            .populate('createdBy', 'name email'); // Make sure user exists in Users collection

        const totalProducts = await ProductModel.countDocuments(filter);

        return res.json({
            success: true,
            data: products || [],
            pagination: {
                totalProducts,
                totalPages: Math.ceil(totalProducts / l),
                currentPage: p
            }
        });
    } catch (error) {
        console.error("❌ Backend Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
// ✅ 3. GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id).populate('createdBy', 'name email');
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        return res.json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ 4. UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        
        if (req.file) {
            const uploadResult = await uploadImageCloudinary(req.file.buffer);
            if (uploadResult.success) {
                updateData.images = [{ url: uploadResult.url, alt: updateData.name || "product" }];
                updateData.thumbnail = uploadResult.url;
            }
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
        return res.json({ success: true, message: "Updated successfully", data: updatedProduct });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ 5. DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.id);
        return res.json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ 6. ADMIN DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await ProductModel.countDocuments();
        const totalStock = await ProductModel.aggregate([
            { $group: { _id: null, total: { $sum: "$stock" } } }
        ]);
        const lowStockProducts = await ProductModel.find({ stock: { $lt: 10 } }).limit(5);
        const recentProducts = await ProductModel.find().sort({ createdAt: -1 }).limit(5);
        
        return res.json({
            success: true,
            data: { 
                totalProducts,
                totalStock: totalStock[0]?.total || 0,
                lowStockProducts,
                recentProducts
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
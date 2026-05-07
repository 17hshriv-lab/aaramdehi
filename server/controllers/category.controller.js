import Category from '../models/category.model.js';
import Product from '../models/product.model.js'; // To update product categories on delete
import slugify from 'slugify'; // npm install slugify

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: error.message,
    });
  }
};

// Get only active categories (for frontend display)
export const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return res.json({
      success: true,
      message: 'Active categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching active categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching active categories',
      error: error.message,
    });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.json({
      success: true,
      message: 'Category fetched successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching category',
      error: error.message,
    });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ success: false, message: 'Category with this name already exists' });
    }

    const newCategory = new Category({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      isActive: isActive !== undefined ? isActive : true,
    });

    await newCategory.save();
    return res.status(201).json({ success: true, message: 'Category created successfully', data: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ success: false, message: 'Server error while creating category', error: error.message });
  }
};

// Update an existing category
export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    return res.json({ success: true, message: 'Category updated successfully', data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating category', error: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Optionally, update products that belonged to this category to 'uncategorized' or a default category
    await Product.updateMany({ category: category.name }, { category: 'Uncategorized' });

    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ success: false, message: 'Server error while deleting category', error: error.message });
  }
};
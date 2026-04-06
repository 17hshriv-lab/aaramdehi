// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// ====== PRODUCT APIS ======

// Get all products
export const fetchAllProducts = async (filters = {}) => {
    try {
        let url = `${API_BASE_URL}/products?`;
        
        if (filters.category) url += `category=${filters.category}&`;
        if (filters.minPrice) url += `minPrice=${filters.minPrice}&`;
        if (filters.maxPrice) url += `maxPrice=${filters.maxPrice}&`;
        if (filters.search) url += `search=${filters.search}&`;
        if (filters.sort) url += `sort=${filters.sort}&`;
        if (filters.page) url += `page=${filters.page}&`;
        if (filters.limit) url += `limit=${filters.limit}&`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.message);
        return data.data;
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        throw error;
    }
};

// Get single product
export const fetchProductById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.message);
        return data.data;
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        throw error;
    }
};

// Search products
export const searchProducts = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/search/query?q=${query}`);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.message);
        return data.data;
    } catch (error) {
        console.error('❌ Error searching products:', error);
        throw error;
    }
};

// Get featured products
export const fetchFeaturedProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/featured`);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.message);
        return data.data;
    } catch (error) {
        console.error('❌ Error fetching featured products:', error);
        throw error;
    }
};

// Get categories
export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.message);
        return data.data;
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        throw error;
    }
};

// ====== ADMIN APIS ======

// Create product with image
export const createProduct = async (productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/create`, {
            method: 'POST',
            body: productData // Should be FormData
        });
        const data = await response.json();
        
        if (!data.success) throw new Error(data.message);
        return data.data;
    } catch (error) {
        console.error('❌ Error creating product:', error);
        throw error;
    }
};

// Update product
export const updateProduct = async (id, productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            body: productData
        });
        const data = await response.json();
        
        if (!data.success) throw new Error(data.message);
        return data.data;
    } catch (error) {
        console.error('❌ Error updating product:', error);
        throw error;
    }
};

// Delete product
export const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (!data.success) throw new Error(data.message);
        return data.data;
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        throw error;
    }
};

// Get product stats (for dashboard)
export const fetchProductStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/stats`);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.message);
        return data.data;
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        throw error;
    }
};

export default {
    fetchAllProducts,
    fetchProductById,
    searchProducts,
    fetchFeaturedProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProductStats
};

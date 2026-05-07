import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically add Token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// AUTH
export const loginAPI = async (email, password) => (await api.post('/auth/login', { email, password })).data;
export const signupAPI = async (userData) => (await api.post('/auth/signup', userData)).data;
export const forgotPasswordAPI = async (email) => (await api.post('/auth/forgot-password', { email })).data;
export const verifyOTPAPI = async (email, otp) => (await api.post('/auth/verify-otp', { email, otp })).data;
export const resetPasswordAPI = async (email, token, newPassword, confirmPassword) => (await api.post('/auth/reset-password', { email, token, newPassword, confirmPassword })).data;

// ADMIN STATS & PRODUCTS
export const getAdminStatsAPI = async () => (await api.get('/admin/stats')).data;
export const getAdminProductsAPI = async () => (await api.get('/admin/products')).data;

// CREATE PRODUCT (For Sharp/Multer)
export const createProductAPI = async (formData) => {
    return (await api.post('/admin/products/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })).data;
};

// UPDATE PRODUCT (For Sharp/Multer)
export const updateProductAPI = async (id, formData) => {
    return (await api.put(`/admin/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })).data;
};

export const deleteProductAPI = async (id) => (await api.delete(`/admin/products/${id}`)).data;

// ADMIN USERS
export const getAdminUsersAPI = async () => (await api.get('/admin/users')).data;
export const deleteUserAPI = async (id) => (await api.delete(`/admin/users/${id}`)).data;
export const updateUserRoleAPI = async (id, roleData) => (await api.put(`/admin/users/${id}/role`, roleData)).data;

// ADMIN ORDERS
export const getAdminOrdersAPI = async () => (await api.get('/admin/orders')).data;
export const updateOrderStatusAPI = async (id, statusData) => (await api.put(`/admin/orders/${id}/status`, statusData)).data;

export default api;
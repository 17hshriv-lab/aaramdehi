import { Router } from 'express';
import {
    getGlobalSeo,
    updateGlobalSeo,
    getSeoByType,
    updateSeoByType,
    getAllSeo
} from '../controllers/seo.controller.js';

// ✅ Named imports sahi hain
import { isAuthenticatedUser, isAdmin } from '../middleware/auth.middleware.js';

const seoRouter = Router();

/**
 * @routes - SEO API ENDPOINTS (Aaramdehi Project)
 */

// --- 1. Public Routes (Sab dekh sakte hain) ---
seoRouter.get('/global', getGlobalSeo);  // Get global SEO
seoRouter.get('/type/:type', getSeoByType);  // Get SEO by type
seoRouter.get('/', getAllSeo);  // Get all SEO data


// --- 2. Protected Routes (Sirf Admin ke liye) ---

// ✅ FIX: 'auth' ki jagah 'isAuthenticatedUser' aur 'isAdmin' use kiya gaya hai
seoRouter.put('/global', isAuthenticatedUser, isAdmin, updateGlobalSeo);

// ✅ FIX: Yahan bhi security update kar di hai
seoRouter.put('/type/:type', isAuthenticatedUser, isAdmin, updateSeoByType);

export default seoRouter;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';

// DNS Order fix for MongoDB/Localhost connectivity issues
dns.setDefaultResultOrder('ipv4first');

// --- .env configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import helmet from "helmet";
import connectDB from './config/connectDB.js';

// --- Route Imports ---
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
import { getDashboardStats } from './controllers/product.controller.js'; // Controller import karein
import seoRouter from './routes/seo.route.js';
import bannerRouter from './routes/banner.route.js';
import categoryRouter from './routes/category.route.js';
import couponRouter from './routes/coupon.route.js';
import appointmentRouter from './routes/appointment.route.js';
import analyticsRouter from './routes/analytics.route.js';
import paymentRouter from './routes/payment.route.js';
import refundRouter from './routes/refund.route.js';
import settingsRouter from './routes/settings.route.js';
import teamRouter from './routes/team.route.js';

const app = express();

// --- Middlewares ---
// CORS Configuration - Accept both 5173 and 5174 in development
const corsOptions = {
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "accessToken"]
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({ 
    crossOriginResourcePolicy: false 
}));

// --- API Routes ---
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/seo", seoRouter);

// ✅ Admin Dashboard Stats Route
app.get("/api/admin/stats", getDashboardStats); 

app.use("/api/banners", bannerRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/refunds", refundRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/team", teamRouter);

// Health Check
app.get("/", (req, res) => {
    res.json({ message: "Aaramdehi Server is running!", status: "Active" });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
});

const PORT = process.env.PORT || 8000;

// Database Connection & Server Start
connectDB().then(() => {
    console.log("--- ENV CHECK ---");
    console.log("Email User:", process.env.EMAIL_USER); 
    console.log("Mongo URI:", process.env.MONGODB_URI ? "Found" : "Not Found");
    console.log("------------------");

    app.listen(PORT, () => {
        console.log(`✅ MongoDB Connected!`);
        console.log(`🚀 Server live at: http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("❌ Database Connection Failed:", err);
    process.exit(1);
});

export default app;
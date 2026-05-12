# 🚀 AARAMDEHI VERCEL DEPLOYMENT GUIDE

## Complete Production Deployment Setup

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Backend (.env variables)
- ✅ `PORT=8000`
- ✅ `NODE_ENV=production`
- ✅ `FRONTEND_URL=https://aaramdehi-frontend.vercel.app/`
- ✅ `MONGODB_URI=mongodb+srv://himanshu123:IBiDUOit7Titt66D@cluster0.hs1uo20.mongodb.net/aaramdehi?retryWrites=true&w=majority&ssl=true`
- ✅ JWT tokens configured
- ✅ Email credentials configured
- ✅ Cloudinary credentials configured

### Frontend
- ✅ `VITE_API_URL=https://aaramdehi-backend.vercel.app/api`
- ✅ `authAndAdminApi.js` uses environment variables

---

## 🔧 VERCEL DEPLOYMENT - STEP BY STEP

### STEP 1: Backend Deployment

**URL:** https://vercel.com/dashboard

```bash
1. Click "New Project"
2. Select GitHub account & authorize
3. Select "Aramdehi" repository
4. Configure Project:
   - Framework: "Other" (Node.js)
   - Root Directory: "server"
   - Build Command: (leave default or use: npm run build)
   - Output Directory: (leave default)
5. Click "Environment Variables"
```

**Add these variables:**
```
MONGODB_URI = mongodb+srv://himanshu123:IBiDUOit7Titt66D@cluster0.hs1uo20.mongodb.net/aaramdehi?retryWrites=true&w=majority&ssl=true

NODE_ENV = production

FRONTEND_URL = https://aaramdehi-frontend.vercel.app/

SECRET_KEY_ACCESS_TOKEN = 8f6f82f466cd554517a5a3d0696c0ff0ada0bebe145dae4338f7e600b53a5ce7

SECRET_KEY_REFRESH_TOKEN = 7b3f8b518f54623224bf519a061ae7631bb4ea94392613ca0d219c528da4103b

EMAIL_USER = 17hshriv@gmail.com

EMAIL_PASS = xopwjavyxkivdfyc

CLOUDINARY_CLOUD_NAME = dw5xcrhwp

CLOUDINARY_API_KEY = 339959936888631

CLOUDINARY_API_SECRET = d_vsv0c7KbjQcOFZT10K5XqOK5M
```

**6. Click "Deploy"**

⏳ Wait for deployment to complete

📝 **Note down your Backend URL:** (e.g., `https://aaramdehi-backend.vercel.app`)

---

### STEP 2: Frontend Deployment

**URL:** https://vercel.com/dashboard

```bash
1. Click "New Project" (again)
2. Select same repository
3. Configure Project:
   - Framework: "Vite"
   - Root Directory: "Aaramdehi"
   - Build Command: "npm run build"
   - Output Directory: "dist"
   - Install Command: "npm install"
4. Click "Environment Variables"
```

**Add this variable:**
```
VITE_API_URL = https://aaramdehi-backend.vercel.app/api
```

(Replace `aaramdehi-backend` with your actual backend URL from Step 1)

**5. Click "Deploy"**

⏳ Wait for deployment

---

## ✅ DEPLOYMENT COMPLETE!

Your site is now live at:

- **Frontend:** https://aaramdehi-frontend.vercel.app
- **Backend API:** https://aaramdehi-backend.vercel.app/api

---

## 🧪 TESTING

### Test Backend Connection
```bash
curl https://aaramdehi-backend.vercel.app/
# Should return: {"message": "Aaramdehi Server is running!", "status": "Active"}
```

### Test Admin Login
1. Go to https://aaramdehi-frontend.vercel.app/login
2. Use admin credentials
3. Should be redirected to /admin dashboard

### Test API Connection
Open browser console and verify API calls work:
```javascript
// Should return user details
fetch('https://aaramdehi-backend.vercel.app/api/auth/me', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
}).then(r => r.json()).then(console.log)
```

---

## 🐛 TROUBLESHOOTING

### MongoDB Connection Error
**Error:** `querySrv ECONNREFUSED`

**Solution:**
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Select Cluster0
3. Click "Network Access"
4. Ensure "Allow Access from Anywhere" (0.0.0.0/0) is enabled

### CORS Error
**Error:** `Access denied by CORS policy`

**Solution:**
1. Update `FRONTEND_URL` in backend .env variables
2. Redeploy backend on Vercel

### API Not Found (404)
**Error:** `GET /api/auth/me 404`

**Solution:**
1. Verify backend deployed successfully
2. Check `VITE_API_URL` in frontend matches backend URL
3. Redeploy frontend

### Environment Variables Not Loading
**Solution:**
1. In Vercel dashboard, go to Settings > Environment Variables
2. Verify all variables are set
3. Click "Redeploy" button

---

## 📊 DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL CDN                            │
├──────────────────────┬──────────────────────────────────┤
│                      │                                   │
│  Frontend (Vite)     │     Backend (Node.js)             │
│  React App           │     Express Server                │
│  (Production Build)  │     (Serverless Functions)        │
│                      │                                   │
└──────────────────────┴──────────────────────────────────┘
          ↓                            ↓
    https://aaramdehi-frontend    https://aaramdehi-backend
         .vercel.app                .vercel.app/api
          ↓                            ↓
┌──────────────────────────────────────────────────────────┐
│              MongoDB Atlas (Cloud Database)              │
│         mongodb+srv://himanshu123:***@cluster0           │
└──────────────────────────────────────────────────────────┘
```

---

## 🎉 SUCCESS!

Your e-commerce platform is now live and production-ready!

- ✅ Database: MongoDB Atlas (Cloud)
- ✅ Backend: Vercel (Serverless)
- ✅ Frontend: Vercel (CDN)
- ✅ SSL/HTTPS: Automatic

---

## 📞 QUICK REFERENCE

**Backend Environment Variables:** 11 variables
**Frontend Environment Variables:** 1 variable

**Total Deployment Time:** ~5-10 minutes

**Cost:** FREE (Vercel hobby tier + MongoDB free tier)

---

**Next Steps:**
- [ ] Setup custom domain (optional)
- [ ] Enable analytics in Vercel
- [ ] Monitor error logs
- [ ] Setup email notifications for deployment failures

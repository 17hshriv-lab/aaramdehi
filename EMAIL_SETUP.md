# 📧 EMAIL SETUP GUIDE - Aaramdehi

## ✅ Current Status
Your email is already configured! Here's how to verify it's working:

```env
EMAIL_USER = 17hshriv@gmail.com
EMAIL_PASS = xopw javy xkiv dfyc  # 16-digit App Password
```

## 🔧 How It Works

### Registration Flow:
```
User fills signup form
    ↓
User data saved to MongoDB
    ↓
6-digit OTP generated
    ↓
OTP sent via Gmail SMTP
    ↓
User receives email with OTP
    ↓
User enters OTP in app
    ↓
Email verified ✅
    ↓
User can login
```

## 🚀 To Test Everything:

### Step 1: Start Backend
```bash
cd server
npm start
```
Look for: ✅ Email Service Ready - Connected to Gmail SMTP

### Step 2: Start Frontend
```bash
cd Aaramdehi
npm run dev
```

### Step 3: Test Registration
1. Go to http://localhost:5173/register
2. Fill in form with:
   - Name: Test User
   - Email: your_real_email@gmail.com
   - Password: Test@123
3. Click "Create Account"
4. Check your email for OTP
5. Enter OTP in the app
6. Email gets verified ✅

### Step 4: Test Login
1. Go to http://localhost:5173/login
2. Use same email & password from step 2
3. You should login successfully ✅

## ⚠️ If Email Doesn't Arrive

### Check 1: Gmail App Password Setup
```
1. Go to https://myaccount.google.com/security
2. Turn ON "2-Step Verification"
3. Go to "App passwords" (at bottom)
4. Select: Mail → Windows Computer
5. Copy the 16-digit password
6. Remove spaces and update .env:
   EMAIL_PASS = xxxxyyyyzzzzwwww
7. Restart server
```

### Check 2: Verify Server is Running
```bash
# Terminal window
cd server
npm start

# Look for this message:
# ✅ Email Service Ready - Connected to Gmail SMTP
```

### Check 3: Check Backend Logs
When you click "Create Account", terminal should show:
```
✅ Email sent to your_email@gmail.com | Message ID: <xxxxx@google.com>
```

### Check 4: Gmail Security
Gmail may block:
- First-time app access (check email for permission request)
- Less secure apps (use App Password instead)
- Unusual login activity (check "https://myaccount.google.com/device-activity")

## 📋 Environment Variables Ready

| Variable | Value | Status |
|----------|-------|--------|
| EMAIL_USER | 17hshriv@gmail.com | ✅ Set |
| EMAIL_PASS | xopw javy xkiv dfyc | ✅ Set |
| PORT | 8000 | ✅ Updated |
| MONGODB_URI | mongodb://127.0.0.1:27017/aaramdehi | ✅ Set |

## 🎯 Next Steps

1. **Start Backend**: `cd server && npm start`
2. **Start Frontend**: `cd Aaramdehi && npm run dev`
3. **Test Registration** at http://localhost:5173/register
4. **Check Email** for OTP
5. **Verify & Login** ✅

## 💡 Production Tips

When going live:
- Use environment variables from deployment platform (Vercel, Railway, etc)
- Keep EMAIL_PASS secret (never commit to git)
- Consider using premium email service (SendGrid, AWS SES)
- Add email rate limiting to prevent abuse
- Add email bounce/complaint handling

---
**Status**: ✅ Ready to test! Start your servers and try registration.

# 🔧 Fix: serviceAccountKey.json Missing

## ❌ Error سمجھیں:

```
Error: Cannot find module './serviceAccountKey.json'
```

**مطلب**: Firebase کی credentials file (`serviceAccountKey.json`) نہیں ہے۔

---

## ✅ Fix کریں: 3 آسان قدم

### Step 1️⃣: Firebase Console سے Key Download کریں

```
1. جاؤ: https://console.firebase.google.com/
2. اپنا project select کرو: aaramdehi-91f82
3. بائیں طرف ⚙️ Settings آئیکن دیکھو
4. Project Settings پر کلک کرو
5. "Service Accounts" ٹیب پر جاؤ
6. "Generate New Private Key" بٹن دبا
7. JSON file auto-download ہوگی
```

### Step 2️⃣: File کو صحیح جگہ رکھو

```
Download کی ہوئی file:
  ↓
Rename کرو (اگر ضروری ہو): serviceAccountKey.json
  ↓
یہاں رکھو: F:\Aramdehi\server\config\serviceAccountKey.json
  ↓
✅ ہو گیا!
```

### Step 3️⃣: Server دوبارہ شروع کرو

```bash
cd F:\Aramdehi\server

# اگر npm run dev چل رہا ہے تو Ctrl+C دبا

npm run dev
```

---

## 📸 Firebase Console سے Step-by-Step Download

### Step A: Firebase Console کھولو
```
URL: https://console.firebase.google.com/
↓
Browser میں جا
```

### Step B: Project Select کرو
```
Screen میں projects list دکھے گی
↓
aaramdehi-91f82 پر کلک کرو
```

### Step C: Settings میں جاؤ
```
Top Right میں ⚙️ (Settings Icon)
↓
"Project Settings" دبا
```

### Step D: Service Accounts Tab
```
بائیں طرف Tabs دیکھو:
├── General
├── Users and permissions
├── Service Accounts  ← یہاں جاؤ
└── ...
```

### Step E: Generate New Key
```
"Firebase Admin SDK" section میں
↓
"Generate New Private Key" بٹن دبا
↓
⚠️ Warning: یہ secret ہے! محفوظ رکھو
↓
"Generate Key" دبا
↓
✅ JSON file download ہوگی
```

### Step F: File کو صحیح جگہ رکھو
```
Download folder میں ढونڈو:
  aaramdehi-91f82-firebase-adminsdk-xxxxx.json
  
↓
Rename کرو یا Move کرو:
  F:\Aramdehi\server\config\serviceAccountKey.json
```

---

## 🎯 فوری Fix: ٹیسٹ کے لیے

اگر Firebase console سے file download نہیں کر سکتے، تو اس dummy file استعمال کرو:

```bash
# F:\Aramdehi\server\config\serviceAccountKey.json بنا
```

```json
{
  "type": "service_account",
  "project_id": "aaramdehi-91f82",
  "private_key_id": "placeholder-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDU8P7QeP0n1N4g\nLmSKePQmkK9I4q8W7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N\n7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N\n7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N\n7r8N7r8N7r8N7r8NAoGBAPU8P7QeP0n1N4gLmSKePQmkK9I4q8W7r8N7r8N7r8N7r8N\n7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7\nr8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7\nr8N7r8NAoGBAPU8P7QeP0n1N4gLmSKePQmkK9I4q8W7r8N7r8N7r8N7r8N7r8N7r8N\n7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7\nr8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8N7r8NAoGBAP\n-----END PRIVATE KEY-----",
  "client_email": "firebase-adminsdk-test@aaramdehi-91f82.iam.gserviceaccount.com",
  "client_id": "placeholder-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-test%40aaramdehi-91f82.iam.gserviceaccount.com"
}
```

⚠️ **یہ صرف ٹیسٹ کے لیے ہے!**

---

## 📋 File Structure

```
F:\Aramdehi\
├── server/
│   ├── config/
│   │   ├── db.js ← یہاں سے load ہوتا ہے
│   │   └── serviceAccountKey.json ← یہاں ہونا چاہیے! ✅
│   ├── controllers/
│   ├── routes/
│   └── ...
└── ...
```

---

## ✅ Verify کریں: کام کر رہا ہے یا نہیں؟

### Test 1: Server شروع ہو جائے
```bash
npm run dev

# اگر یہ نظر آئے تو ✅ ٹھیک ہے:
# "Server is running on port 3000"
```

### Test 2: API call کرو
```bash
# نیا terminal کھول اور یہ چلا:

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "mobile": "1234567890",
    "password": "Test@123",
    "confirmPassword": "Test@123"
  }'

# اگر response ملے تو ✅ کام کر رہا ہے!
```

### Test 3: Firebase Console میں check کرو
```
https://console.firebase.google.com/
→ aaramdehi-91f82
→ Realtime Database
→ "users" folder کھول
→ اگر test user دکھے تو ✅ ٹھیک ہے!
```

---

## 🚨 اگر پھر بھی Error آئے

### Error 1: File location غلط ہے
```bash
# ✅ صحیح جگہ:
F:\Aramdehi\server\config\serviceAccountKey.json

# ❌ غلط جگہ:
F:\Aramdehi\serviceAccountKey.json  ✗
F:\Aramdehi\server\serviceAccountKey.json  ✗
```

### Error 2: File permissions مسئلہ
```bash
# File کو read کر سکتے ہیں یا نہیں check کرو:
# Right Click → Properties → مطمئن ہو جاؤ

# یا PowerShell میں:
Get-Content "F:\Aramdehi\server\config\serviceAccountKey.json" | head
# اگر content دکھے تو ✅ ٹھیک ہے
```

### Error 3: Invalid JSON format
```bash
# File کو text editor میں کھول اور check کرو:
# {
#   "type": "service_account",
#   "project_id": "aaramdehi-91f82",
#   ...
# }

# اگر یہ format ٹھیک نہیں ہے تو دوبارہ download کرو
```

---

## 🎯 خلاصہ: کیا کرنا ہے؟

| نمبر | کام | وقت |
|------|------|------|
| 1 | Firebase Console سے serviceAccountKey.json download کرو | 2 min |
| 2 | F:\Aramdehi\server\config\ میں رکھو | 1 min |
| 3 | npm run dev چلا | 1 min |
| 4 | API test کرو | 2 min |

**کل وقت: 6 منٹ! 🚀**

---

## 📞 ہنوز مسئلہ ہے؟

اگر پھر بھی کام نہیں ہو رہا، تو:

1. **Error message دیکھو** - screen پر کیا لکھا ہے?
2. **File location verify کرو** - `F:\Aramdehi\server\config\` میں `serviceAccountKey.json` ہے یا نہیں?
3. **Firebase Project ID check کرو** - JSON file میں `"project_id": "aaramdehi-91f82"` ہے یا نہیں?

---

**اب کام کرے گا!** 🚀

کریں:
1. Firebase سے file download کرو
2. config folder میں رکھو
3. Server restart کرو
4. `npm run dev` دوبارہ چلا

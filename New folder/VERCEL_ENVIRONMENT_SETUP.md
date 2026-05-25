# Vercel Deployment - Environment Variables Setup

Apne Vercel par project host kiya hai, isliye Firebase credentials ko environment variables ke through set karna hoga.

## 📋 Service Account Key se Credentials Extract Karna

### Step 1: Service Account Key Download Karo
1. Firebase Console → Project Settings → Service Accounts
2. "Generate New Private Key" click karo
3. JSON file download hoga

### Step 2: Key File Open Karo aur Values Dekho
```json
{
  "type": "service_account",
  "project_id": "aaramdehi-91f82",
  "private_key_id": "a1b2c3d4...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIB...",
  "client_email": "firebase-adminsdk-fbsvc@aaramdehi-91f82.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
}
```

---

## ⚙️ Vercel Environment Variables Add Karna

### Option 1: Vercel Dashboard (GUI)

1. **Vercel.com** par jao
2. **Projects** → Select `Aaramdehi` (ya aapka project)
3. **Settings** tab
4. **Environment Variables** section
5. **Add** button click karo

**Variable 1: Firebase Project ID**
```
Name: FIREBASE_PROJECT_ID
Value: aaramdehi-91f82
Environment: Production, Preview, Development (sab select karo)
```

**Variable 2: Firebase Private Key ID**
```
Name: FIREBASE_PRIVATE_KEY_ID
Value: [service account file mein "private_key_id" se copy karo]
Environment: Production, Preview, Development
```

**Variable 3: Firebase Private Key**
```
Name: FIREBASE_PRIVATE_KEY
Value: [service account file mein "private_key" se copy karo]

⚠️ IMPORTANT: 
- Quotes mein se backslash-n (\n) ko actual newline mein convert karo
- OR pure JSON string use karo
Environment: Production, Preview, Development
```

**Variable 4: Firebase Client Email**
```
Name: FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-fbsvc@aaramdehi-91f82.iam.gserviceaccount.com
Environment: Production, Preview, Development
```

**Variable 5: Database URL**
```
Name: FIREBASE_DATABASE_URL
Value: https://aaramdehi-91f82-default-rtdb.firebaseio.com/
Environment: Production, Preview, Development
```

---

## 🔧 Environment Variables Usage in Code

### Local Development (.env.local)
```
# .env.local file (Git mein add mat karo!)

FIREBASE_PROJECT_ID=aaramdehi-91f82
FIREBASE_PRIVATE_KEY_ID=a1b2c3d4...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@aaramdehi-91f82.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://aaramdehi-91f82-default-rtdb.firebaseio.com/
```

### Updated db.js (Environment Variables Use Karte Hue)

```javascript
// server/config/db.js
const admin = require('firebase-admin');

// Check if running on Vercel or locally
const serviceAccount = process.env.NODE_ENV === 'production' 
  ? {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      universe_domain: 'googleapis.com'
    }
  : require('./serviceAccountKey.json'); // Local development

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://aaramdehi-91f82-default-rtdb.firebaseio.com/"
});

const db = admin.database();

// ... rest of helper functions ...
```

---

## 🛠️ Vercel CLI se Set Karna (Terminal se)

Agar Vercel CLI installed hai:

```bash
# Login
vercel login

# Project folder mein jao
cd f:\Aramdehi

# Environment variables set karo
vercel env add FIREBASE_PROJECT_ID
# Prompt par value enter karo

vercel env add FIREBASE_PRIVATE_KEY_ID
# Value enter karo

vercel env add FIREBASE_PRIVATE_KEY
# Private key paste karo (multiline support hai)

vercel env add FIREBASE_CLIENT_EMAIL
# Email paste karo

vercel env add FIREBASE_DATABASE_URL
# Database URL paste karo
```

---

## 🐛 Debugging: Environment Variables Check Karna

### In Vercel Logs
```bash
# Vercel CLI se logs dekho
vercel logs --prod

# Or Vercel Dashboard mein Deployments → Logs
```

### Code mein Check Karo
```javascript
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID); // Console mein print hoga
console.log('Private Key exists:', !!process.env.FIREBASE_PRIVATE_KEY); // true/false
```

### Error Common Issues

| Issue | Solution |
|-------|----------|
| `Cannot find module 'serviceAccountKey.json'` | Production par file nahi hai - env vars use karo |
| `private_key is invalid` | `\n` properly convert na ho - check string parsing |
| `auth_uri undefined` | Vercel setup incomplete - sab variables add karo |
| `Connection refused` | Database URL galat ho - check spelling |

---

## 📋 Complete Vercel Setup Checklist

### 1. Firebase Credentials Extract
- [ ] Firebase Console mein jao
- [ ] Service Account key download karo
- [ ] JSON file kkholo aur values dekho

### 2. Vercel Environment Variables Add
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_PRIVATE_KEY_ID
- [ ] FIREBASE_PRIVATE_KEY
- [ ] FIREBASE_CLIENT_EMAIL
- [ ] FIREBASE_DATABASE_URL

### 3. Code Update (db.js)
- [ ] Environment variables use karne wale code add karo
- [ ] Local .env.local file banao
- [ ] Git mein .env* add karo .gitignore mein

### 4. Deploy aur Test
- [ ] Local par test karo: `npm run dev`
- [ ] Vercel mein push karo: `git push`
- [ ] Vercel logs dekho
- [ ] Production API test karo

### 5. Security Check
- [ ] Private key committed nahi hai (check .gitignore)
- [ ] Env vars in .gitignore list
- [ ] Only needed vars expose kiye hain

---

## 🔒 Security Best Practices

### ✅ DO THIS
```
.gitignore mein:
.env.local
.env.*.local
serviceAccountKey.json
config/serviceAccountKey.json
```

### ❌ DON'T DO THIS
```
❌ Private key ko code mein hardcode karo
❌ serviceAccountKey.json ko Git mein commit karo
❌ Env vars को public repository mein share karo
```

---

## 📝 .env.local Example

```bash
# .env.local (NEVER commit this file!)

# Firebase Config
FIREBASE_PROJECT_ID=aaramdehi-91f82
FIREBASE_PRIVATE_KEY_ID=a1b2c3d4e5f6g7h8
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@aaramdehi-91f82.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://aaramdehi-91f82-default-rtdb.firebaseio.com/

# Other vars (if needed)
NODE_ENV=development
PORT=3000
```

### .gitignore entry
```
# Environment files
.env
.env.local
.env.*.local
.env*.local

# Firebase
serviceAccountKey.json
config/serviceAccountKey.json
```

---

## 🚀 Vercel Deployment Flow

```
Local Development:
1. .env.local mein credentials
2. npm run dev
3. db.js .env.local se padh ta hai

Vercel Production:
1. Code push karo GitHub mein
2. Vercel auto-deploy karega
3. db.js Vercel env variables se padhega
4. Firebase connect hoga
```

---

## 🔄 Alternative: Using JSON String

Agar `.env` mein `\n` issue ho to pure JSON stringify karo:

```javascript
// db.js
const serviceAccount = process.env.NODE_ENV === 'production'
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  : require('./serviceAccountKey.json');
```

Then in Vercel env:
```
Name: FIREBASE_SERVICE_ACCOUNT_JSON
Value: {"type": "service_account", "project_id": "...", ...}
```

---

## 📞 Troubleshooting

### Problem: "Invalid private key"
```
Solution:
1. \n characters properly convert ho rahe hain check karo
2. Private key quotes remove mat karo
3. BEGIN/END lines include karo
```

### Problem: "Database connection failed"
```
Solution:
1. FIREBASE_DATABASE_URL correct hai check karo
2. Firebase mein Realtime Database enable hai check karo
3. Internet connection check karo
```

### Problem: "Environment variables undefined"
```
Solution:
1. Vercel Dashboard mein variables add kiye hain confirm karo
2. Deployment redeploy karo: Vercel Dashboard → Redeploy
3. Logs mein check karo: Deployments → Logs
```

---

## 📚 Related Files

- **db.js**: `server/config/db.js`
- **Firebase Security Rules**: `FIREBASE_SECURITY_RULES.md`
- **Model Structure**: `FIREBASE_MODEL_STRUCTURE.md`

---

## ✅ Final Checklist

Before deploying:
- [ ] All 5 env variables in Vercel set kiye
- [ ] db.js updated hai env variables ke liye
- [ ] Local .env.local banaya aur tested
- [ ] .gitignore mein env files add kiye
- [ ] Private key publicly exposed nahi hai
- [ ] Firebase Realtime Database enabled hai
- [ ] Ready to deploy!

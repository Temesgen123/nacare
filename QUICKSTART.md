# Nacare Clinic - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Fix MongoDB Connection (CRITICAL)

Your MongoDB connection is timing out. Here's how to fix it:

#### Option A: MongoDB Atlas (Recommended)

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Click on "Network Access"** (left sidebar under Security)
3. **Click "+ ADD IP ADDRESS"**
4. **Select "ALLOW ACCESS FROM ANYWHERE"** (0.0.0.0/0)
5. **Click "Confirm"**

#### Option B: Check Your Credentials

1. Go to your MongoDB Atlas cluster
2. Click "Connect" → "Connect your application"
3. Copy the connection string
4. Update `.env.local` file:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@suhillfreecluster.kjcpm.mongodb.net/nacare?retryWrites=true&w=majority
```

**Replace**:
- `YOUR_USERNAME` with your MongoDB username
- `YOUR_PASSWORD` with your MongoDB password (URL encode special characters)

### Step 2: Install Dependencies

```bash
cd nacare-clinic
npm install
```

### Step 3: Create Initial Admin User

```bash
node scripts/seed.js
```

This creates:
- Username: **admin**
- Password: **admin123**

### Step 4: Start the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Step 5: Login

- Username: **admin**
- Password: **admin123**

## ✅ What You Can Do Now

1. **Register a Patient**: Dashboard → Patients → New Patient
2. **Record a Visit**: Dashboard → Visits
3. **Add Lab Results**: Dashboard → Lab Results

## 🔧 Common Issues

### Issue: MongoDB Connection Timeout

**Solution**: Make sure you've added 0.0.0.0/0 to Network Access in MongoDB Atlas

### Issue: "Failed to fetch patients"

**Solution**: Check that:
1. MongoDB connection is working
2. You ran the seed script
3. You're logged in

### Issue: Can't login

**Solution**: 
1. Run: `node scripts/seed.js`
2. Use credentials: admin / admin123

## 📚 Next Steps

1. Read the full README.md for detailed documentation
2. Change the admin password after first login
3. Create additional users (doctors, nurses, staff)
4. Start registering patients!

## 🆘 Need Help?

Check the README.md file for:
- Detailed setup instructions
- API documentation
- Troubleshooting guide
- Security best practices

---

**You're all set! Start managing your clinic efficiently! 🏥**

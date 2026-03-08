# MongoDB Connection Fix Guide

## Issue Identified
Your MongoDB Atlas connection is failing because your IP address is not whitelisted in MongoDB Atlas Network Access settings.

## Solution: Whitelist Your IP Address

### Step 1: Access MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in with your account
3. Select your cluster (AGMS)

### Step 2: Add IP Address to Whitelist
1. Click on **"Network Access"** in the left sidebar
2. Click **"Add IP Address"** button
3. You have two options:
   
   **Option A: Add Current IP (Recommended)**
   - Click **"Add Current IP Address"** button
   - This will automatically add your current IP
   - Click **"Confirm"**
   
   **Option B: Allow All IPs (For Development Only)**
   - Click **"Allow Access from Anywhere"**
   - Enter `0.0.0.0/0` in the IP address field
   - Click **"Confirm"**
   - ⚠️ **Warning**: Only use this for development. Never use in production!

### Step 3: Wait for Changes to Apply
- It may take 1-2 minutes for the changes to take effect

### Step 4: Test the Connection
After whitelisting your IP, restart your server:

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Atlas Connected: [cluster-name].mongodb.net
```

## Alternative: Check Connection String

If whitelisting doesn't work, verify your connection string in `.env`:

1. Check the password encoding - `@` should be `%40`
2. Verify the username and password are correct
3. Make sure the cluster is running (not paused)

## Quick Test Command

Test your MongoDB connection:

```bash
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI, {serverSelectionTimeoutMS: 5000}).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });"
```

## Common Issues

1. **IP Not Whitelisted**: Most common issue - follow Step 2 above
2. **Wrong Password**: Check password encoding in connection string
3. **Cluster Paused**: Make sure your MongoDB Atlas cluster is running
4. **Network Issues**: Check your internet connection

## Need Help?

If you're still having issues:
1. Check MongoDB Atlas dashboard for any error messages
2. Verify your cluster is active (not paused)
3. Check the MongoDB Atlas logs for connection attempts


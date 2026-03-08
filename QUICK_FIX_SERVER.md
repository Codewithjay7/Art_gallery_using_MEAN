# Quick Fix: Server Not Starting

## Current Issue
Your server cannot start because MongoDB connection is failing. Your IP address **27.59.85.31** is not whitelisted in MongoDB Atlas.

## Solution: Whitelist Your IP (Takes 2 minutes)

### Step 1: Go to MongoDB Atlas
1. Open: https://cloud.mongodb.com/
2. Log in to your account
3. Select your cluster (AGMS)

### Step 2: Add Your IP Address
1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"** button
3. Click **"Add Current IP Address"** (this will add: 27.59.85.31)
4. Click **"Confirm"**

**OR** for development, you can allow all IPs:
- Enter `0.0.0.0/0` in the IP address field
- Click **"Confirm"**
- ⚠️ **Warning**: Only for development, not production!

### Step 3: Wait
- Wait 1-2 minutes for changes to apply

### Step 4: Start Your Server
After whitelisting, the server will automatically restart (if using nodemon) or run:

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Atlas Connected: [cluster-name].mongodb.net
🚀 Server running in development mode on port 3000
```

## Test Your Connection

Before starting the server, test the connection:

```bash
cd server
node test-connection.js
```

This will show you:
- ✅ If .env file is found
- ✅ Your current IP address
- ✅ If MongoDB connection works

## Your Current IP
**27.59.85.31** - Make sure this is whitelisted!

## After Whitelisting

Once your IP is whitelisted:
1. The server will start successfully
2. You'll see: `✅ MongoDB Atlas Connected`
3. The API will be available at: http://localhost:3000/api

## Still Having Issues?

If you've whitelisted your IP but still can't connect:
1. Wait 2-3 minutes (changes take time to propagate)
2. Check MongoDB Atlas dashboard for any error messages
3. Verify your cluster is running (not paused)
4. Run `node test-connection.js` again to verify


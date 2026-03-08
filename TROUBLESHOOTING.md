# Troubleshooting Guide

## Server is Already Running on Port 3000

If you see "EADDRINUSE: address already in use :::3000", it means the server is already running. This is actually **GOOD** - your server is already up!

## Check if Server is Working

### 1. Test Health Endpoint

Open a new terminal and run:

```bash
curl http://localhost:3000/api/health
```

You should see:
```json
{"success":true,"message":"Server is running"}
```

### 2. If Server is Running But Angular Still Can't Connect

Check these things:

#### A. Check Browser Console
- Open browser DevTools (F12)
- Go to Console tab
- Look for any CORS errors or connection errors
- Look for the actual error message

#### B. Check Network Tab
- Go to Network tab in DevTools
- Try to register/login
- Click on the failed request
- Check the Response tab to see the actual error

#### C. Common Issues:

1. **CORS Error**: Should be fixed, but check server console for CORS errors
2. **Wrong Port**: Make sure Angular is calling `http://localhost:3000`
3. **MongoDB Connection**: Check server console for MongoDB connection errors
4. **Firewall**: Make sure port 3000 is not blocked

## If Server is NOT Running

### Start the Server:

```bash
cd "/Users/jaychavda/Desktop/Anguler 19/ArtGallery/server"
npm run dev
```

### Check for Errors:

Look for these messages:

✅ **Good**: 
- `MongoDB Atlas Connected: ...`
- `Server running in development mode on port 3000`

❌ **Bad**:
- `MongoDB Connection Error: ...`
- `Error: MONGODB_URI is not defined`
- Any red error messages

## Kill Existing Server (if needed)

If you need to restart the server:

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Then start fresh
cd server
npm run dev
```

## Still Not Working?

1. Check the server terminal for error messages
2. Check browser console for detailed error messages
3. Make sure both terminals are running (backend + frontend)
4. Try accessing `http://localhost:3000/api/health` in your browser


# Testing Users API

## Issue: Users not showing from MongoDB

There are **4 users** in MongoDB:
- Test User (test@test.com)
- Terminal Test (terminal@test.com)
- Jay Chavda (jay1971chavda@gmail.com)
- Jay Chavda (jay1971@gmail.com)

## Steps to Debug

### 1. Check if you're logged in
After registering, you should be automatically logged in. Check browser console for:
- "Loading users..."
- "Users loaded successfully"
- Any error messages

### 2. Test the API directly

First, get a token by logging in or registering:

```bash
# Register a new user (or use existing)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

This will return a token. Copy the token and use it:

```bash
# Get all users (replace YOUR_TOKEN with the actual token)
curl http://localhost:3000/api/auth/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Check Browser Console

Open browser DevTools (F12) and check:
1. **Console tab** - Look for error messages
2. **Network tab** - Check if the request to `/api/auth/users` is:
   - Being made
   - Returning 200 (success) or 401 (unauthorized)
   - Has the Authorization header

### 4. Verify Authentication

In browser console, run:
```javascript
localStorage.getItem('token')
```

If this returns `null`, you're not logged in. You need to:
- Register a new user, OR
- Login with existing credentials

### 5. Common Issues

**Issue: "Authentication required"**
- Solution: Make sure you're logged in. Register or login first.

**Issue: "Cannot connect to server"**
- Solution: Make sure backend is running on port 3000

**Issue: 401 Unauthorized**
- Solution: Your token might be expired. Try logging in again.

**Issue: CORS error**
- Solution: Check server CORS settings in `server/src/server.js`

## Quick Fix

1. **Make sure you're logged in:**
   - Go to `/register` and register a new user
   - OR go to `/login` and login with existing credentials

2. **Check browser console** for any errors

3. **Verify server is running:**
   ```bash
   curl http://localhost:3000/api/health
   ```

4. **Check MongoDB connection:**
   ```bash
   cd server
   node test-connection.js
   ```


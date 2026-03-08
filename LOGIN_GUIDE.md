# 🔐 How to Login and Access Dashboard

## Quick Steps

### Option 1: Register as First User (Auto-Admin)

1. **Start the Backend Server:**
   ```bash
   cd server
   npm start
   ```
   Make sure it's running on `http://localhost:3000`

2. **Start the Frontend:**
   ```bash
   # In a new terminal, from project root
   ng serve
   ```
   Frontend will run on `http://localhost:4200`

3. **Register a New Account:**
   - Go to `http://localhost:4200/register`
   - Fill in:
     - Name: Your name
     - Email: your-email@example.com
     - Password: Your password
   - Click "Register"
   - **The FIRST user registered automatically becomes ADMIN!**

4. **Login:**
   - Go to `http://localhost:4200/login`
   - Enter your email and password
   - Click "Login"
   - You'll be automatically redirected to `/dashboard`

---

### Option 2: Use Seed Script (Pre-created Admin)

1. **Run the Seed Script:**
   ```bash
   cd server
   npm run seed
   ```
   
   This creates an admin user with default credentials:
   - **Email:** `admin@artgallery.com`
   - **Password:** `Admin123!`

2. **Login with Seed Credentials:**
   - Go to `http://localhost:4200/login`
   - Email: `admin@artgallery.com`
   - Password: `Admin123!`
   - Click "Login"
   - You'll be redirected to the dashboard

---

## 🔍 Troubleshooting

### "Cannot connect to server"
- **Problem:** Backend is not running
- **Solution:** Start the backend server first:
  ```bash
  cd server
  npm start
  ```

### "Invalid credentials"
- **Problem:** Wrong email/password or user doesn't exist
- **Solution:** 
  - Check your credentials
  - Or register a new account (first user = admin)

### "Not authorized" or Redirected to Home
- **Problem:** User doesn't have admin role
- **Solution:**
  - Make sure you're the FIRST user registered, OR
  - Use the seed script to create an admin user, OR
  - Manually update user role in MongoDB:
    ```javascript
    // In MongoDB shell or Compass
    db.users.updateOne(
      { email: "your-email@example.com" },
      { $set: { role: "admin" } }
    )
    ```

### Dashboard Page Not Loading
- **Problem:** Route guard blocking access
- **Solution:** 
  - Check browser console for errors
  - Verify JWT token is stored in localStorage
  - Make sure user has `role: 'admin'` in database

---

## 📍 Dashboard Access

Once logged in as admin, you can access:

- **Main Dashboard:** `http://localhost:4200/dashboard`
- **Artists Management:** `http://localhost:4200/dashboard/artists`
- **Artworks Management:** `http://localhost:4200/dashboard/artworks`
- **Users List:** `http://localhost:4200/dashboard/users`

---

## ✅ Verify You're Admin

After login, check:
1. Browser DevTools → Application → Local Storage
2. Look for `user` key
3. The JSON should include `"role":"admin"`

Example:
```json
{
  "id": "...",
  "name": "Admin",
  "email": "admin@artgallery.local",
  "role": "admin"
}
```

---

## 🎯 Quick Test

1. **Backend running?** → Check `http://localhost:3000/api/health`
2. **Frontend running?** → Check `http://localhost:4200`
3. **Login page?** → Go to `http://localhost:4200/login`
4. **Register first?** → Go to `http://localhost:4200/register`
5. **Dashboard?** → After login, you'll be redirected automatically

---

## 💡 Pro Tip

If you want to reset and start fresh:
```bash
cd server
npm run seed:wipe  # This wipes artists/artworks and creates fresh admin
```

Then login with:
- Email: `admin@artgallery.com`
- Password: `Admin123!`

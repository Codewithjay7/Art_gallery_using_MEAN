# Quick Start Guide

## To Fix "Registration failed" Error

The backend server needs to be running for registration/login to work.

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd server
npm run dev
```

You should see:
```
MongoDB Atlas Connected: ...
Server running in development mode on port 3000
```

### Step 2: Keep the Backend Server Running

**Important:** Leave this terminal open and running. The backend server must stay running for the frontend to work.

### Step 3: Start the Angular Frontend (in a NEW terminal)

Open a **second terminal** and run:

```bash
npm start
```

Or if you're in the root directory:

```bash
ng serve
```

### Step 4: Test Registration

1. Go to `http://localhost:4200/register`
2. Fill in the registration form
3. Click Register

If you see connection errors, make sure:
- ✅ Backend server is running on port 3000
- ✅ MongoDB Atlas connection is working (check backend console)
- ✅ No firewall blocking port 3000


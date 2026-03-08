# Quick Start - Start Your Backend Server

## ⚠️ IMPORTANT: Backend Server Must Be Running

The registration and login will **NOT work** unless the backend server is running.

## Steps to Start Backend Server:

### 1. Open Terminal and Navigate to Server Directory

```bash
cd "/Users/jaychavda/Desktop/Anguler 19/ArtGallery/server"
```

### 2. Start the Server

```bash
npm run dev
```

**OR** if nodemon is not installed:

```bash
npm start
```

### 3. What You Should See

When the server starts successfully, you should see:

```
MongoDB Atlas Connected: agms-shard-00-01.gr2sn1y.mongodb.net
Server running in development mode on port 3000
```

### 4. Keep This Terminal Open!

**IMPORTANT:** Leave this terminal window open and running. The server must stay running for your Angular app to work.

### 5. In a NEW Terminal - Start Angular Frontend

Open a **second terminal** window and run:

```bash
cd "/Users/jaychavda/Desktop/Anguler 19/ArtGallery"
npm start
```

## Troubleshooting

### If you see "Cannot connect to server" error:

1. ✅ Make sure backend server is running (check Terminal 1)
2. ✅ Check that you see "Server running on port 3000" message
3. ✅ Check that MongoDB Atlas connection succeeded
4. ✅ Make sure no firewall is blocking port 3000

### If MongoDB connection fails:

- Check your `.env` file has the correct connection string
- Verify your MongoDB Atlas credentials are correct
- Check your internet connection
- Verify MongoDB Atlas allows connections from your IP

## Testing the API

Once the server is running, you can test it:

```bash
curl http://localhost:3000/api/health
```

You should get: `{"success":true,"message":"Server is running"}`


# How to Start the Server

## Quick Start
```bash
cd server
npm run dev
```

## If Server Won't Start

The server requires MongoDB connection. If it fails:

1. **Check MongoDB Connection:**
   ```bash
   cd server
   node test-connection.js
   ```

2. **If IP not whitelisted:**
   - Your IP: 27.59.85.31
   - Go to: https://cloud.mongodb.com/ → Network Access
   - Add your IP address

3. **After whitelisting, restart:**
   ```bash
   npm run dev
   ```

## Verify Server is Running

```bash
curl http://localhost:3000/api/health
```

Should return: `{"success":true,"message":"Server is running"}`

## Stop Server

Press `Ctrl+C` in the terminal where server is running

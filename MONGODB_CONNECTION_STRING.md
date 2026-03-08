# MongoDB Connection String Guide

## Your Current Connection String

Your `.env` file already has the correct connection string:

```
MONGODB_URI=mongodb+srv://jay1971chavda_db_user:Jay%401234@agms.gr2sn1y.mongodb.net/artgallery?retryWrites=true&w=majority&appName=AGMS
```

## Connection String Format

The MongoDB connection string follows this format:

```
mongodb+srv://<username>:<password>@<cluster>/<database>?<options>
```

### Your Connection Details:
- **Username**: `jay1971chavda_db_user`
- **Password**: `Jay@1234` (URL-encoded as `Jay%401234` in connection string)
- **Cluster**: `agms.gr2sn1y.mongodb.net`
- **Database**: `artgallery`
- **App Name**: `AGMS`

### Connection Parameters:
- `retryWrites=true` - Enables retryable writes
- `w=majority` - Write concern (waits for majority of nodes)
- `appName=AGMS` - Application name for monitoring

## Important Notes

1. **Password Encoding**: Special characters in passwords must be URL-encoded:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
   - etc.

2. **Database Name**: The connection string includes `/artgallery` which specifies the database name.

3. **Template vs Actual**: 
   - Template: `mongodb+srv://jay1971chavda_db_user:<db_password>@agms.gr2sn1y.mongodb.net/?appName=AGMS`
   - Your actual: `mongodb+srv://jay1971chavda_db_user:Jay%401234@agms.gr2sn1y.mongodb.net/artgallery?retryWrites=true&w=majority&appName=AGMS`
   
   Your actual connection string is **more complete** - it includes the database name and additional connection parameters.

## If You Need to Update the Password

If your password has changed, you can:

1. **Manual Update**: Edit `server/.env` and replace the password part (remember to URL-encode it)

2. **Use Helper Script**:
   ```bash
   cd server
   node update-connection-string.js "YourNewPassword"
   ```

## Verify Connection String

Test your connection:
```bash
cd server
node test-connection.js
```

## Current Status

✅ Connection string is properly formatted
✅ Database name is included (`artgallery`)
✅ Connection parameters are set
⚠️ **Still need to whitelist your IP address** (27.59.85.31) in MongoDB Atlas

## Next Steps

1. Whitelist your IP in MongoDB Atlas (if not done)
2. Test connection: `node test-connection.js`
3. Start server: `npm run dev`


# Backend Setup Guide

## Prerequisites
- Node.js installed
- MongoDB installed and running

## Setup Instructions

### 1. Install Backend Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory (already created with your MongoDB Atlas credentials):

```env
PORT=3000
MONGODB_URI=mongodb+srv://jay1971chavda_db_user:Jay%401234@agms.gr2sn1y.mongodb.net/artgallery?retryWrites=true&w=majority&appName=AGMS
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

**Note:** 
- Using MongoDB Atlas (cloud database)
- The password contains `@` which is URL-encoded as `%40` in the connection string
- The `.env` file is already configured with your credentials

### 3. MongoDB Atlas Connection

The project is configured to use MongoDB Atlas (cloud database). The connection string is already set up in the `.env` file. No local MongoDB installation is required.

### 4. Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/me` - Get current user (requires authentication token)

### Health Check

- **GET** `/api/health` - Check if server is running

## Running Both Frontend and Backend

### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend:
```bash
npm start
```

## Testing the API

You can test the API using curl or Postman:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```


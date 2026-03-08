# Art Gallery API Endpoints

## Base URL
```
http://localhost:3000/api
```

## Available Endpoints

### 1. API Information
**GET** `/api`
- Returns API information and available endpoints
- No authentication required

**Response:**
```json
{
  "success": true,
  "message": "Art Gallery API",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /api/health",
    "auth": {
      "register": "POST /api/auth/register",
      "login": "POST /api/auth/login",
      "me": "GET /api/auth/me (requires authentication)",
      "users": "GET /api/auth/users (requires authentication)"
    }
  }
}
```

### 2. Health Check
**GET** `/api/health`
- Check if server is running
- No authentication required

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 3. Register User
**POST** `/api/auth/register`
- Register a new user
- No authentication required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 4. Login User
**POST** `/api/auth/login`
- Login with email and password
- No authentication required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 5. Get Current User
**GET** `/api/auth/me`
- Get currently authenticated user
- **Requires authentication** (Bearer token in Authorization header)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 6. Get All Users
**GET** `/api/auth/users`
- Get list of all registered users
- **Requires authentication** (Bearer token in Authorization header)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Testing with cURL

### Test API Info
```bash
curl http://localhost:3000/api
```

### Test Health Check
```bash
curl http://localhost:3000/api/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Current User (with token)
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Users (with token)
```bash
curl http://localhost:3000/api/auth/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (for registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials or missing token)
- `500` - Server Error


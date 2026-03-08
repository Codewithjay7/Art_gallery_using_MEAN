# Art Gallery Backend Server

Backend server for Art Gallery application with MongoDB and authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/artgallery
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

3. Make sure MongoDB is running on your system.

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Health Check

- `GET /api/health` - Check if server is running


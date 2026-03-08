# Art Gallery Management System - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Angular CLI (v19)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_EXPIRE=7d
   PORT=3000
   ```

4. **Seed dummy data (optional):**
   ```bash
   npm run seed
   # Or to wipe and reseed:
   npm run seed:wipe
   ```

5. **Start the server:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   Server will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   ng serve
   # Or:
   npm start
   ```

   Frontend will run on `http://localhost:4200`

## 🔐 Admin Access

The first user registered automatically becomes an admin. Alternatively, you can:

1. Register a new user (first one becomes admin)
2. Or use the seed script which creates an admin user:
  - Email: `admin@artgallery.com` (or set `SEED_ADMIN_EMAIL` in `.env`)
   - Password: `Admin123!` (or set `SEED_ADMIN_PASSWORD` in `.env`)
  
  Note: the default email uses a `.com` domain to satisfy the backend email validator.

## 📁 Project Structure

```
ArtGallery/
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth & upload middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── seed/          # Seed scripts
│   │   └── server.js       # Entry point
│   └── uploads/           # Uploaded images
│
└── src/                    # Frontend (Angular)
    └── app/
        ├── dashboard/      # Admin dashboard components
        ├── public/         # Public pages
        ├── services/       # API services
        ├── guards/         # Route guards
        └── interceptors/   # HTTP interceptors
```

## 🎯 Features

### Admin Dashboard
- ✅ Statistics (Total Artists, Artworks, Categories)
- ✅ Recent artworks table
- ✅ Artist CRUD (Create, Read, Update, Delete)
- ✅ Artwork CRUD with image upload
- ✅ Delete confirmation modals
- ✅ Image preview before upload

### Public Website
- ✅ Home page with artwork gallery
- ✅ Category filtering
- ✅ Artwork detail page
- ✅ Artist profile page with artworks

## 🔌 API Endpoints

### Public Endpoints (No Auth Required)
- `GET /api/public/artists` - List all artists
- `GET /api/public/artists/:id` - Get artist by ID
- `GET /api/public/artworks` - List all artworks
- `GET /api/public/artworks/:id` - Get artwork by ID

### Admin Endpoints (JWT Auth Required)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/artists` - List artists
- `POST /api/admin/artists` - Create artist
- `PUT /api/admin/artists/:id` - Update artist
- `DELETE /api/admin/artists/:id` - Delete artist
- `GET /api/admin/artworks` - List artworks
- `POST /api/admin/artworks` - Create artwork
- `PUT /api/admin/artworks/:id` - Update artwork
- `DELETE /api/admin/artworks/:id` - Delete artwork

## 🛠️ Tech Stack

**Frontend:**
- Angular 19 (Standalone Components)
- Reactive Forms
- Tailwind CSS
- RxJS

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (Image Upload)

## 📝 Notes

- Images are uploaded to `server/uploads/` directory
- First registered user automatically becomes admin
- All admin routes are protected with JWT + role-based access
- Public routes don't require authentication

## 🐛 Troubleshooting

1. **MongoDB Connection Error:**
   - Check your `MONGODB_URI` in `.env`
   - Ensure MongoDB is running
   - Verify network access (if using Atlas)

2. **Port Already in Use:**
   - Change `PORT` in `.env` file
   - Or kill the process: `lsof -ti:3000 | xargs kill -9`

3. **Image Upload Fails:**
   - Ensure `server/uploads/` directory exists
   - Check file size limits (2MB for artist, 5MB for artwork)
   - Verify file type (JPEG, PNG, WEBP only)

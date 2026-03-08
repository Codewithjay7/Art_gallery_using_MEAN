const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
const { UPLOAD_DIR } = require('./middleware/upload');

// Load env vars - explicitly set path to ensure .env is found
// __dirname is server/src, so we need to go up one level to server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Info route - shows available endpoints
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Art Gallery API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (requires authentication)',
        users: 'GET /api/auth/users (requires authentication)'
      }
    },
    documentation: 'See API documentation for request/response formats'
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));

// Serve uploaded images
app.use('/uploads', express.static(UPLOAD_DIR));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('💡 Try one of these solutions:');
    console.error('   1. Stop the process using port 3000: lsof -ti:3000 | xargs kill -9');
    console.error('   2. Use a different port by setting PORT in .env file');
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});


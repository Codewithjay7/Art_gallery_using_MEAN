const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    // MongoDB Atlas connection string (from .env file)
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.error('Please check your .env file in the server directory');
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.error('❌ MongoDB Connection Error:');
    console.error(`   Error Message: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('authentication failed')) {
      console.error('   💡 Check your MongoDB Atlas username and password');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   💡 Check your internet connection and MongoDB Atlas cluster URL');
    } else if (error.message.includes('timeout')) {
      console.error('   💡 Connection timeout - check your MongoDB Atlas IP whitelist settings');
      console.error('   💡 Make sure your IP address is whitelisted in MongoDB Atlas Network Access');
    } else if (error.message.includes('MONGODB_URI')) {
      console.error('   💡 Make sure .env file exists in the server directory');
      console.error('   💡 Check that MONGODB_URI is set correctly in .env');
    }
    
    console.error('\n📝 Troubleshooting steps:');
    console.error('   1. Verify your .env file has MONGODB_URI set');
    console.error('   2. Check MongoDB Atlas cluster is running');
    console.error('   3. Verify your IP is whitelisted in MongoDB Atlas Network Access');
    console.error('   4. Check your MongoDB Atlas username and password are correct');
    // Do not crash the entire server. Keep API running so it can return 503s.
    // The admin panel will see a clear "MongoDB connection failure" message.
  }
};

connectDB.isConnected = () => isConnected;

module.exports = connectDB;

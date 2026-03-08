#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * This script helps diagnose MongoDB Atlas connection issues
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const https = require('https');

// Get current IP address
function getCurrentIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const ip = JSON.parse(data).ip;
          resolve(ip);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function testConnection() {
  console.log('🔍 MongoDB Connection Diagnostic Tool\n');
  console.log('=' .repeat(50));
  
  // Check .env file
  console.log('\n1️⃣  Checking .env file...');
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('❌ MONGODB_URI not found in .env file');
    console.error('   Make sure .env file exists in server directory');
    process.exit(1);
  }
  console.log('✅ MONGODB_URI found in .env');
  
  // Get current IP
  console.log('\n2️⃣  Getting your current IP address...');
  try {
    const currentIP = await getCurrentIP();
    console.log(`✅ Your current IP address: ${currentIP}`);
    console.log(`   ⚠️  Make sure this IP is whitelisted in MongoDB Atlas`);
    console.log(`   📝 Go to: https://cloud.mongodb.com/ → Network Access → Add IP Address`);
  } catch (error) {
    console.log('⚠️  Could not determine IP address');
  }
  
  // Test connection
  console.log('\n3️⃣  Testing MongoDB connection...');
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!');
    console.error(`   Error: ${error.message}\n`);
    
    // Provide helpful error messages
    if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('💡 Solution: Whitelist your IP address in MongoDB Atlas');
      console.error('   1. Go to https://cloud.mongodb.com/');
      console.error('   2. Select your cluster');
      console.error('   3. Click "Network Access" → "Add IP Address"');
      console.error('   4. Click "Add Current IP Address" or add manually');
    } else if (error.message.includes('authentication')) {
      console.error('💡 Solution: Check your MongoDB Atlas username and password');
      console.error('   Make sure the password is URL-encoded (@ becomes %40)');
    } else if (error.message.includes('timeout')) {
      console.error('💡 Solution: Check your internet connection and MongoDB Atlas cluster status');
    } else {
      console.error('💡 Check the error message above for more details');
    }
    
    process.exit(1);
  }
}

// Run the test
testConnection();


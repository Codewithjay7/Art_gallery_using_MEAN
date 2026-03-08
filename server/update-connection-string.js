#!/usr/bin/env node

/**
 * Helper script to update MongoDB connection string in .env file
 * Usage: node update-connection-string.js <password>
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function updateConnectionString(password) {
  const envPath = path.join(__dirname, '.env');
  
  // Read current .env file
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // URL encode the password (replace @ with %40, and other special chars)
  const encodedPassword = encodeURIComponent(password);
  
  // Build connection string
  // Format: mongodb+srv://username:password@cluster/database?options
  const connectionString = `mongodb+srv://jay1971chavda_db_user:${encodedPassword}@agms.gr2sn1y.mongodb.net/artgallery?retryWrites=true&w=majority&appName=AGMS`;
  
  // Update or create .env file
  const lines = envContent.split('\n');
  let updated = false;
  const newLines = lines.map(line => {
    if (line.startsWith('MONGODB_URI=')) {
      updated = true;
      return `MONGODB_URI=${connectionString}`;
    }
    return line;
  });
  
  if (!updated) {
    // Add MONGODB_URI if it doesn't exist
    newLines.push(`MONGODB_URI=${connectionString}`);
  }
  
  // Ensure other required vars exist
  if (!newLines.some(line => line.startsWith('PORT='))) {
    newLines.unshift('PORT=3000');
  }
  if (!newLines.some(line => line.startsWith('JWT_SECRET='))) {
    newLines.push('JWT_SECRET=your-secret-key-change-this-in-production');
  }
  if (!newLines.some(line => line.startsWith('JWT_EXPIRE='))) {
    newLines.push('JWT_EXPIRE=7d');
  }
  
  // Write back to file
  fs.writeFileSync(envPath, newLines.join('\n'), 'utf8');
  
  console.log('✅ Updated .env file with new MongoDB connection string');
  console.log(`📝 Connection string: mongodb+srv://jay1971chavda_db_user:***@agms.gr2sn1y.mongodb.net/artgallery?retryWrites=true&w=majority&appName=AGMS`);
}

// Get password from command line or prompt
const password = process.argv[2];

if (password) {
  updateConnectionString(password);
  rl.close();
} else {
  rl.question('Enter your MongoDB password: ', (password) => {
    updateConnectionString(password);
    rl.close();
  });
}


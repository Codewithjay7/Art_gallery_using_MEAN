const path = require('path');
const dotenv = require('dotenv');

// server/src/seed -> server/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');

async function run() {
  await connectDB();

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@artgallery.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';

  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({ name: 'Admin', email, password, role: 'admin' });
    console.log(`✅ Admin created: ${email} / ${password}`);
  } else {
    admin.role = 'admin';
    admin.password = password; // will be hashed by pre-save hook
    await admin.save();
    console.log(`✅ Admin reset: ${email} / ${password}`);
  }

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('❌ Reset admin failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


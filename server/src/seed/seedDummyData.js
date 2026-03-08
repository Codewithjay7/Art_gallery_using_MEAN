const path = require('path');
const dotenv = require('dotenv');

// server/src -> server/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');

async function run() {
  await connectDB();

  const wipe = process.argv.includes('--wipe');

  if (wipe) {
    await Promise.all([Artwork.deleteMany({}), Artist.deleteMany({})]);
  }

  // Ensure there is an admin user (bootstrap)
  const existing = await User.findOne({ role: 'admin' });
  if (!existing) {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@artgallery.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
    await User.create({ name: 'Admin', email: adminEmail, password: adminPassword, role: 'admin' });
    console.log(`✅ Seeded admin: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${existing.email}`);
  }

  // Create artists
  const artists = await Artist.insertMany([
    {
      name: 'Aarav Mehta',
      bio: 'Modern painter exploring light and geometry.',
      contact: { email: 'aarav@example.com', phone: '+91-90000-00001' },
      profileImageUrl: ''
    },
    {
      name: 'Diya Sharma',
      bio: 'Digital artist focused on surreal portraits.',
      contact: { email: 'diya@example.com', phone: '+91-90000-00002' },
      profileImageUrl: ''
    },
    {
      name: 'Kabir Singh',
      bio: 'Sculptor working with stone and reclaimed metal.',
      contact: { email: 'kabir@example.com', phone: '+91-90000-00003' },
      profileImageUrl: ''
    }
  ]);

  // Create artworks
  const artworks = await Artwork.insertMany([
    {
      title: 'Golden Hour',
      description: 'Warm tones and minimal forms.',
      imageUrl: '',
      price: 1200,
      category: 'Painting',
      artist: artists[0]._id
    },
    {
      title: 'Neon Dreams',
      description: 'A surreal portrait study.',
      imageUrl: '',
      price: 900,
      category: 'Digital Art',
      artist: artists[1]._id
    },
    {
      title: 'Silent Weight',
      description: 'Reclaimed metal sculpture.',
      imageUrl: '',
      price: 2500,
      category: 'Sculpture',
      artist: artists[2]._id
    },
    {
      title: 'Ink Study #7',
      description: 'Gesture and contrast.',
      imageUrl: '',
      price: 300,
      category: 'Sketch',
      artist: artists[0]._id
    }
  ]);

  console.log(`✅ Seeded ${artists.length} artists and ${artworks.length} artworks`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('❌ Seed failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


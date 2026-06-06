// ============================================================
// DATABASE CONNECTION (MONGODB / MONGOOSE)
// ============================================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chikoti_realestate';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected successfully!');
    
    // Seed default admin user if it doesn't exist
    try {
      const User = require('../models/User');
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        const hashed = await bcrypt.hash('admin123', 10);
        await User.create({
          _id: 'admin-001',
          name: 'Chikoti Admin',
          email: 'admin@chikotirealestate.com',
          password: hashed,
          role: 'admin',
          is_verified: true,
          is_active: true
        });
        console.log('Default Admin account seeded successfully!');
      }
    } catch (err) {
      console.error('Error seeding default admin:', err.message);
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
  });

module.exports = mongoose;

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, default: null },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'seller', 'buyer'], default: 'buyer' },
  avatar_url: { type: String, default: null },
  is_verified: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Virtual for id to match SQL fields in client applications
UserSchema.virtual('id').get(function() {
  return this._id;
});

module.exports = mongoose.model('User', UserSchema);

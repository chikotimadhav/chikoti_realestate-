const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const FavoriteSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  user_id: { type: String, required: true, ref: 'User', index: true },
  property_id: { type: String, required: true, ref: 'Property', index: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
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

// Compound unique index
FavoriteSchema.index({ user_id: 1, property_id: 1 }, { unique: true });

FavoriteSchema.virtual('id').get(function() {
  return this._id;
});

module.exports = mongoose.model('Favorite', FavoriteSchema);

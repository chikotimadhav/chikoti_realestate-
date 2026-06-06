const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const InquirySchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  property_id: { type: String, required: true, ref: 'Property', index: true },
  buyer_name: { type: String, required: true },
  buyer_email: { type: String, required: true },
  buyer_phone: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' }
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

InquirySchema.virtual('id').get(function() {
  return this._id;
});

module.exports = mongoose.model('Inquiry', InquirySchema);

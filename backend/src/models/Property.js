const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PropertySchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  seller_id: { type: String, required: true, ref: 'User', index: true },
  title: { type: String, required: true },
  land_type: { type: String, enum: ['Agriculture', 'Commercial', 'Residential'], required: true, index: true },
  listing_type: { type: String, enum: ['Sale', 'Rent', 'Lease'], default: 'Sale' },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
  description: { type: String, default: '' },
  contact_number: { type: String, default: '' },
  whatsapp_number: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  is_featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  
  // Agriculture fields
  acres: { type: Number, default: null },
  soil_type: { type: String, default: null },
  water_source: { type: String, default: null },
  current_crop: { type: String, default: null },
  crop_yield: { type: Number, default: null },
  electricity: { type: String, default: null },
  fencing: { type: String, default: null },
  agri_facilities: { type: [String], default: [] },
  
  // Commercial fields
  built_area: { type: Number, default: null },
  floor: { type: String, default: null },
  frontage: { type: Number, default: null },
  business_type: { type: String, default: null },
  parking: { type: String, default: null },
  footfall: { type: String, enum: ['Low', 'Medium', 'High', null], default: null },
  landmarks: { type: String, default: null },
  comm_amenities: { type: [String], default: [] },
  
  // Residential fields
  area_sqft: { type: Number, default: null },
  bedrooms: { type: Number, default: null },
  bathrooms: { type: Number, default: null },
  furnishing: { type: String, enum: ['Unfurnished', 'Semi-furnished', 'Fully Furnished', null], default: null },
  res_floor: { type: String, default: null },
  res_amenities: { type: [String], default: [] },
  
  // Images
  images: { type: [String], default: [] }
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

PropertySchema.virtual('id').get(function() {
  return this._id;
});

module.exports = mongoose.model('Property', PropertySchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String
  }],
  ingredients: {
    type: String
  },
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  preparationTime: {
    type: Number,
    default: 15,
    min: 1
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  stockQuantity: {
    type: Number,
    default: 100
  },
  viewsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for main image
productSchema.virtual('image').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Virtual for final price
productSchema.virtual('finalPrice').get(function() {
  return this.salePrice || this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function() {
  if (this.salePrice && this.salePrice < this.price) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ isFeatured: 1, isAvailable: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
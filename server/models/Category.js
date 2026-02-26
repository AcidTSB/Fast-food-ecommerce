const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Tự động tạo createdAt và updatedAt
});

// Tạo các indexes để tối ưu tìm kiếm
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 }, { unique: true });

// Phương thức biến đổi tên thành slug tự động
categorySchema.statics.generateSlug = function(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Loại bỏ ký tự đặc biệt
    .replace(/\s+/g, '-')     // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-');     // Loại bỏ nhiều dấu gạch ngang liên tiếp
};

// Pre-save middleware để tự động tạo slug khi chưa có
categorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.constructor.generateSlug(this.name);
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
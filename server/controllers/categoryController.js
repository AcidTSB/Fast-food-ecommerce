import db from '../config/mysql-connection.js';

// GET all categories
export const getCategories = async (req, res) => {
  try {
    console.log('Getting categories from database...');
    
    const [categories] = await db.query(`
      SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC
    `);
    
    console.log(`✅ Found ${categories.length} categories`);
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('❌ Error getting categories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh mục',
      error: error.message
    });
  }
};

// GET single category
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('Getting category by slug:', slug);
    
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE slug = ? AND is_active = 1',
      [slug]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    console.log('✅ Found category:', categories[0].name);
    
    res.json({
      success: true,
      data: categories[0]
    });
    
  } catch (error) {
    console.error('❌ Error getting category by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin danh mục',
      error: error.message
    });
  }
};

// CREATE category (Admin only)
export const createCategory = async (req, res) => {
  try {
    const { name, slug, image, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Tên danh mục là bắt buộc'
      });
    }
    
    // Generate slug if not provided
    const categorySlug = slug || name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    const [result] = await db.query(
      'INSERT INTO categories (name, slug, image, description) VALUES (?, ?, ?, ?)',
      [name, categorySlug, image || null, description || null]
    );
    
    // Get the created category
    const [newCategory] = await db.query(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: newCategory[0]
    });
    
  } catch (error) {
    console.error('❌ Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo danh mục',
      error: error.message
    });
  }
};

// UPDATE category (Admin only)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, image, description, is_active } = req.body;
    
    // Check if category exists
    const [existingCategory] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    // Generate slug if name is updated but slug is not provided
    let categorySlug = slug;
    if (name && !slug) {
      categorySlug = name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
    
    await db.query(
      `UPDATE categories SET 
       name = COALESCE(?, name),
       slug = COALESCE(?, slug),
       image = COALESCE(?, image),
       description = COALESCE(?, description),
       is_active = COALESCE(?, is_active),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, categorySlug, image, description, is_active, id]
    );
    
    // Get updated category
    const [updatedCategory] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: updatedCategory[0]
    });
    
  } catch (error) {
    console.error('❌ Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật danh mục',
      error: error.message
    });
  }
};

// DELETE category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const [existingCategory] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    // Soft delete: set is_active to false
    await db.query('UPDATE categories SET is_active = false WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: `Đã xóa danh mục "${existingCategory[0].name}" thành công`
    });
    
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa danh mục',
      error: error.message
    });
  }
};
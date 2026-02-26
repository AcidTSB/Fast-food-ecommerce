import db from '../config/mysql-connection.js';

// Helper function để parse JSON an toàn
function safeJSONParse(jsonString) {
  if (!jsonString) return null;
  
  try {
    if (typeof jsonString === 'object') {
      return jsonString;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.log('Failed to parse JSON:', jsonString);
    return [jsonString];
  }
}

// Helper function để format product
export function formatProduct(product) {
  let images = safeJSONParse(product.images);

  return {
    ...product,
    images: images,
    image: product.image || (images && images.length > 0 ? images[0] : null), // Ưu tiên product.image
    price: parseFloat(product.price) || 0,
    sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
    rating: parseFloat(product.rating) || 0,
    is_featured: Boolean(product.is_featured),
    is_available: Boolean(product.is_available),
    is_spicy: Boolean(product.is_spicy),
    is_vegetarian: Boolean(product.is_vegetarian)
  };
}

// GET featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    console.log('Getting featured products...');
    
    const limit = parseInt(req.query.limit) || 8;
    
    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_featured = 1 AND p.is_available = 1 
      ORDER BY p.rating DESC, p.created_at DESC 
      LIMIT ?
    `;
    
    const [rows] = await db.query(query, [limit]);
    const products = rows.map(formatProduct);
    
    console.log(`✅ Found ${products.length} featured products`);
    
    res.json({
      success: true,
      data: products
    });
    
  } catch (error) {
    console.error('❌ Error getting featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy sản phẩm nổi bật',
      error: error.message
    });
  }
};

// GET all products with filters
export const getProducts = async (req, res) => {
  try {
    console.log('Received product request with filters:', req.query);
    
    const { category, category_id, exclude_id, search, sort, limit, offset, featured } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_available = 1
    `;
    const params = [];
    
    // Filter by category slug
    if (category && category !== 'all') {
      query += ` AND c.slug = ?`;
      params.push(category);
    }
    // Filter by category_id (sửa lỗi quan trọng này)
    if (category_id) {
      query += ` AND p.category_id = ?`;
      params.push(Number(category_id));
    }
    // Filter by exclude_id
    if (exclude_id) {
      query += ' AND p.id != ?';
      params.push(Number(exclude_id));
    }
    // Filter by search
    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    // Filter featured
    if (featured === 'true') {
      query += ` AND p.is_featured = 1`;
    }
    // Add sorting
    switch (sort) {
      case 'price_asc':
        query += ` ORDER BY p.price ASC`;
        break;
      case 'price_desc':
        query += ` ORDER BY p.price DESC`;
        break;
      case 'rating':
        query += ` ORDER BY p.rating DESC`;
        break;
      case 'name':
        query += ` ORDER BY p.name ASC`;
        break;
      default:
        query += ` ORDER BY p.created_at DESC`;
    }
    // Add pagination
    if (limit) {
      query += ' LIMIT ?';
      params.push(Number(limit));
      if (offset) {
        query += ` OFFSET ?`;
        params.push(parseInt(offset));
      }
    }
    console.log('Executing query:', query);
    console.log('With parameters:', params);
    const [rows] = await db.query(query, params);
    const products = rows.map(formatProduct);
    res.json({
      success: true,
      data: products,
      total: products.length,
      filters: req.query
    });
  } catch (error) {
    console.error('❌ Error getting products:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách sản phẩm',
      error: error.message
    });
  }
};

// GET single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT *, 
        JSON_UNQUOTE(JSON_EXTRACT(nutrition, '$.calories')) AS calories,
        JSON_UNQUOTE(JSON_EXTRACT(nutrition, '$.protein')) AS protein,
        JSON_UNQUOTE(JSON_EXTRACT(nutrition, '$.carbs')) AS carbs,
        JSON_UNQUOTE(JSON_EXTRACT(nutrition, '$.fat')) AS fat,
        JSON_UNQUOTE(JSON_EXTRACT(nutrition, '$.sodium')) AS sodium
      FROM products WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    const product = rows[0];
    // Parse nutrition nếu cần
    if (product.nutrition && typeof product.nutrition === 'string') {
      try {
        product.nutrition = JSON.parse(product.nutrition);
      } catch {}
    }
    // Parse ingredients nếu lưu dạng JSON
    if (product.ingredients && product.ingredients.startsWith('[')) {
      try {
        product.ingredients = JSON.parse(product.ingredients);
      } catch {}
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// CREATE new product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      sale_price,
      image,
      category_id,
      is_featured,
      is_available
    } = req.body;
    
    // Validate required fields
    if (!name || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: name, price, category_id'
      });
    }
    
    // Generate slug if not provided
    const productSlug = slug || name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    const [result] = await db.query(
      `INSERT INTO products (name, slug, description, price, sale_price, image, category_id, is_featured, is_available, allergens, nutrition)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        productSlug,
        description || null,
        price,
        sale_price || null,
        image || null,
        category_id,
        is_featured || false,
        is_available !== undefined ? is_available : true,
        req.body.allergens || null,
        req.body.nutrition || null
      ]
    );
    
    // Get the created product with category info
    const [newProduct] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: newProduct[0]
    });
    
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo sản phẩm',
      error: error.message
    });
  }
};

// UPDATE product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      price,
      sale_price,
      image,
      category_id,
      is_featured,
      is_available
    } = req.body;
    
    console.log('📝 Updating product:', id, req.body);
    
    // Kiểm tra sản phẩm có tồn tại không
    const [existingProduct] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    console.log('✅ Product exists:', existingProduct[0].name);
    
    // Tạo slug nếu name thay đổi nhưng không có slug
    let productSlug = slug;
    if (name && !slug) {
      productSlug = name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
    
    // Tạo object để update, chỉ update những field được gửi lên
    const updateFields = [];
    const updateValues = [];
    
    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    
    if (productSlug !== undefined) {
      updateFields.push('slug = ?');
      updateValues.push(productSlug);
    }
    
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    
    if (sale_price !== undefined) {
      updateFields.push('sale_price = ?');
      updateValues.push(sale_price);
    }
    
    if (image !== undefined) {
      updateFields.push('image = ?');
      updateValues.push(image);
    }
    
    if (category_id !== undefined) {
      updateFields.push('category_id = ?');
      updateValues.push(category_id);
    }
    
    if (is_featured !== undefined) {
      updateFields.push('is_featured = ?');
      updateValues.push(is_featured);
    }
    
    if (is_available !== undefined) {
      updateFields.push('is_available = ?');
      updateValues.push(is_available);
    }
    if (req.body.allergens !== undefined) {
      updateFields.push('allergens = ?');
      updateValues.push(req.body.allergens);
    }
    if (req.body.nutrition !== undefined) {
      let nutritionValue = req.body.nutrition;
      if (typeof nutritionValue === 'object') {
        nutritionValue = JSON.stringify(nutritionValue);
      }
      // Nếu là chuỗi, kiểm tra có phải JSON hợp lệ không
      if (typeof nutritionValue === 'string') {
        try {
          JSON.parse(nutritionValue);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: 'Trường nutrition phải là JSON hợp lệ!'
          });
        }
      }
      updateFields.push('nutrition = ?');
      updateValues.push(nutritionValue);
    }
    // Luôn update timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    if (updateFields.length === 1) { // Chỉ có updated_at
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }
    
    // Thêm id vào cuối cho WHERE clause
    updateValues.push(id);
    
    const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
    
    console.log('🔍 Update query:', updateQuery);
    console.log('🔍 Update values:', updateValues);
    
    await db.query(updateQuery, updateValues);
    
    console.log('✅ Product updated successfully');
    
    // Lấy sản phẩm đã cập nhật kèm thông tin category
    const [updatedProduct] = await db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    
    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: updatedProduct[0]
    });
    
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật sản phẩm',
      error: error.message
    });
  }
};

// DELETE product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [existingProduct] = await db.query('SELECT id, name FROM products WHERE id = ?', [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // XÓA HẲN sản phẩm khỏi database
    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Đã xóa sản phẩm "${existingProduct[0].name}" khỏi database`
    });

  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa sản phẩm',
      error: error.message
    });
  }
};

// Toggle product featured status
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Toggle featured for product id:', id);

    const [rows] = await db.query('SELECT is_featured FROM products WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });

    const current = Number(rows[0].is_featured);
    const newStatus = current === 1 ? 0 : 1;

    await db.query('UPDATE products SET is_featured = ? WHERE id = ?', [newStatus, id]);
    res.json({ success: true, is_featured: newStatus });
  } catch (error) {
    console.error('❌ Error toggling featured:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi thay đổi nổi bật', error: error.message });
  }
};


export const getProductSuggestions = async (req, res) => {
  const { id } = req.params;
  

  try {
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (!product || product.length === 0) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    const categoryId = product[0].category_id;
    const [suggestions] = await db.query(
      'SELECT id AS product_id, name, image, price FROM products WHERE category_id = ? AND id != ? LIMIT 4',
      [categoryId, id]
    );

    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('❌ Lỗi khi lấy gợi ý:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy gợi ý sản phẩm' });
  }
};

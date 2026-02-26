import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🚀 FastFood Database Setup');
    console.log('═'.repeat(50));
    console.log('🔍 Connecting to MySQL server...');
    
    // Kết nối đến MySQL server (không chỉ định database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });
    
    console.log('✅ Connected to MySQL server');
    console.log(`📍 Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    console.log(`👤 User: ${process.env.DB_USER || 'root'}`);
    
    // Tạo database bằng query thông thường
    console.log('\n🔧 Setting up database...');
    const dbName = process.env.DB_NAME || 'fastfood_db';
    
    // Xóa database cũ nếu tồn tại
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
    console.log(`🗑️  Dropped existing database (if any)`);
    
    // Tạo database mới
    await connection.query(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Created database: ${dbName}`);
    
    // Chọn database
    await connection.query(`USE \`${dbName}\``);
    
    // Tạo bảng categories
    console.log('\n📊 Creating database tables...');
    
    await connection.query(`
      CREATE TABLE categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL COMMENT 'Tên danh mục',
        slug VARCHAR(100) UNIQUE NOT NULL COMMENT 'Đường dẫn thân thiện',
        description TEXT COMMENT 'Mô tả danh mục',
        image VARCHAR(500) COMMENT 'Hình ảnh danh mục',
        is_active BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái hoạt động',
        display_order INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ categories');
    
    // Tạo bảng products
    await connection.query(`
      CREATE TABLE products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category_id INT NOT NULL,
        name VARCHAR(200) NOT NULL COMMENT 'Tên sản phẩm',
        slug VARCHAR(200) UNIQUE NOT NULL COMMENT 'Đường dẫn thân thiện',
        description TEXT COMMENT 'Mô tả sản phẩm',
        short_description VARCHAR(500) COMMENT 'Mô tả ngắn',
        price DECIMAL(10,2) NOT NULL COMMENT 'Giá bán',
        sale_price DECIMAL(10,2) NULL COMMENT 'Giá khuyến mãi',
        images JSON COMMENT 'Danh sách hình ảnh JSON',
        ingredients TEXT COMMENT 'Thành phần nguyên liệu',
        preparation_time INT DEFAULT 15 COMMENT 'Thời gian chuẩn bị (phút)',
        calories INT COMMENT 'Lượng calo',
        rating DECIMAL(3,2) DEFAULT 5.0 COMMENT 'Đánh giá trung bình',
        rating_count INT DEFAULT 0 COMMENT 'Số lượt đánh giá',
        is_available BOOLEAN DEFAULT TRUE COMMENT 'Còn hàng',
        is_featured BOOLEAN DEFAULT FALSE COMMENT 'Sản phẩm nổi bật',
        is_spicy BOOLEAN DEFAULT FALSE COMMENT 'Món cay',
        is_vegetarian BOOLEAN DEFAULT FALSE COMMENT 'Món chay',
        views_count INT DEFAULT 0 COMMENT 'Số lượt xem',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        INDEX idx_category (category_id),
        INDEX idx_featured (is_featured),
        INDEX idx_available (is_available)
      )
    `);
    console.log('  ✓ products');
    
    // Tạo bảng users
    await connection.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        avatar VARCHAR(500),
        date_of_birth DATE,
        gender ENUM('male', 'female', 'other'),
        role ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        phone_verified BOOLEAN DEFAULT FALSE,
        loyalty_points INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ users');
    
    // Tạo bảng cart_items
    await connection.query(`
      CREATE TABLE cart_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NULL,
        session_id VARCHAR(255) NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_session (session_id)
      )
    `);
    console.log('  ✓ cart_items');
    
    // Tạo bảng orders
    await connection.query(`
      CREATE TABLE orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NULL,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        delivery_name VARCHAR(100) NOT NULL,
        delivery_phone VARCHAR(20) NOT NULL,
        delivery_address TEXT NOT NULL,
        delivery_notes TEXT,
        subtotal DECIMAL(10,2) NOT NULL,
        delivery_fee DECIMAL(10,2) DEFAULT 0,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_method ENUM('cash', 'card', 'momo', 'zalopay', 'banking') DEFAULT 'cash',
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        status ENUM('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled') DEFAULT 'pending',
        estimated_delivery DATETIME,
        delivered_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_order_number (order_number),
        INDEX idx_status (status),
        INDEX idx_user (user_id)
      )
    `);
    console.log('  ✓ orders');
    
    // Tạo bảng order_items
    await connection.query(`
      CREATE TABLE order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(200) NOT NULL,
        product_image VARCHAR(500),
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    console.log('  ✓ order_items');
    
    // Thêm dữ liệu mẫu
    console.log('\n📝 Inserting sample data...');
    
    // Thêm categories
    const categoriesData = [
      ['Burger & Sandwich', 'burger-sandwich', 'Burger bò, gà, cá và các loại sandwich thơm ngon', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', 1],
      ['Pizza', 'pizza', 'Pizza Ý authentic với nhiều topping đa dạng', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', 2],
      ['Gà Rán & Gà Nướng', 'ga-ran-nuong', 'Gà rán giòn tan, gà nướng thơm lừng', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500', 3],
      ['Mì Ý & Pasta', 'mi-y-pasta', 'Mì Ý các loại với sốt đặc biệt', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=500', 4],
      ['Đồ Uống', 'do-uong', 'Nước ngọt, cà phê, trà và sinh tố tươi', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500', 5],
      ['Tráng Miệng', 'trang-mieng', 'Bánh ngọt, kem, pudding và các món tráng miệng', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500', 6]
    ];
    
    for (const category of categoriesData) {
      await connection.execute(
        'INSERT INTO categories (name, slug, description, image, display_order) VALUES (?, ?, ?, ?, ?)',
        category
      );
    }
    console.log('  ✓ 6 categories');
    
    // Thêm products
    const productsData = [
      [1, 'Big Burger Bò Úc', 'big-burger-bo-uc', 'Burger bò Úc cao cấp với patty 200g, phô mai cheddar, rau xanh tươi và sốt đặc biệt', 'Burger bò Úc thượng hạng với patty 200g', 159000, 139000, '["https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500"]', 'Thịt bò Úc, bánh mì burger, phô mai cheddar, rau salad', 12, 650, 4.8, 245, true, false, false],
      [1, 'Chicken Deluxe Burger', 'chicken-deluxe-burger', 'Burger gà giòn với miếng gà tươi chiên giòn, phô mai, rau củ và sốt ranch', 'Burger gà giòn thơm ngon với sốt ranch', 129000, null, '["https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500"]', 'Thịt gà tươi, bánh mì burger, phô mai, rau salad, sốt ranch', 10, 580, 4.7, 189, true, false, false],
      [2, 'Pizza Margherita Ý', 'pizza-margherita-y', 'Pizza truyền thống Ý với cà chua, mozzarella tươi và lá húng quế', 'Pizza Margherita authentic từ Ý', 189000, null, '["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"]', 'Bột pizza, cà chua, phô mai mozzarella, lá húng quế', 18, 420, 4.9, 312, true, false, true],
      [2, 'Pizza Hải Sản Đặc Biệt', 'pizza-hai-san-dac-biet', 'Pizza hải sản với tôm, mực, nghêu và phô mai đặc biệt', 'Pizza hải sản tươi ngon từ biển', 259000, 229000, '["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500"]', 'Bột pizza, tôm, mực, nghêu, phô mai', 20, 580, 4.8, 198, true, false, false],
      [3, 'Gà Rán Giòn Cay', 'ga-ran-gion-cay', 'Gà rán giòn tan với gia vị cay đặc biệt, ăn kèm khoai tây', 'Gà rán giòn cay đậm đà', 149000, null, '["https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500"]', 'Gà tươi, bột chiên giòn, gia vị cay', 14, 620, 4.6, 234, true, true, false],
      [5, 'Sinh Tố Xoài Dừa', 'sinh-to-xoai-dua', 'Sinh tố xoài tươi ngon với nước dừa mát lạnh', 'Sinh tố xoài dừa mát lành', 45000, null, '["https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500"]', 'Xoài tươi, nước dừa, đá', 5, 180, 4.5, 89, false, false, true],
      [4, 'Mì Ý Carbonara', 'mi-y-carbonara', 'Mì Ý carbonara với bacon và phô mai parmesan thơm ngon', 'Mì Ý carbonara đậm đà', 159000, null, '["https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=500"]', 'Mì fettuccine, bacon, phô mai parmesan, trứng', 16, 680, 4.7, 198, false, false, false],
      [6, 'Bánh Flan Caramel', 'banh-flan-caramel', 'Bánh flan caramel mềm mịn với lớp caramel thơm béo', 'Bánh flan caramel mềm mịn', 35000, null, '["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500"]', 'Trứng, sữa tươi, đường caramel', 5, 220, 4.3, 123, false, false, true]
    ];
    
    for (const product of productsData) {
      await connection.execute(
        'INSERT INTO products (category_id, name, slug, description, short_description, price, sale_price, images, ingredients, preparation_time, calories, rating, rating_count, is_featured, is_spicy, is_vegetarian) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        product
      );
    }
    console.log('  ✓ 8 products');
    
    // Tạo user admin (password: admin123456)
    await connection.execute(
      'INSERT INTO users (email, password, full_name, phone, role, email_verified) VALUES (?, ?, ?, ?, ?, ?)',
      ['admin@fastfood.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Quản Trị Viên', '0901234567', 'admin', true]
    );
    console.log('  ✓ 1 admin user');
    
    // Test kết nối và hiển thị thống kê
    console.log('\n🧪 Database verification...');
    const [categoriesResult] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    const [productsResult] = await connection.execute('SELECT COUNT(*) as count FROM products');
    const [usersResult] = await connection.execute('SELECT COUNT(*) as count FROM users');
    
    console.log('📊 Final statistics:');
    console.log(`  📂 Categories: ${categoriesResult[0].count}`);
    console.log(`  🍔 Products: ${productsResult[0].count}`);
    console.log(`  👥 Users: ${usersResult[0].count}`);
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('═'.repeat(50));
    console.log('🚀 Ready to start! Run: npm run dev');
    console.log('🔐 Admin login: admin@fastfood.com / admin123456');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Hint: Check your MySQL username/password in .env file.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Hint: Make sure MySQL server is running.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Hint: Database connection issue.');
    }
    
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
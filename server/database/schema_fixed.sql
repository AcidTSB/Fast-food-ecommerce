CREATE DATABASE  IF NOT EXISTS `fastfood_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `fastfood_db`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: fastfood_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_session` (`session_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên danh mục',
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn thân thiện',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả danh mục',
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Hình ảnh danh mục',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Trạng thái hoạt động',
  `display_order` int DEFAULT '0' COMMENT 'Thứ tự hiển thị',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Burger & Sandwich','burger-sandwich','Burger bò, gà, cá và các loại sandwich thơm ngon','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',1,1,'2025-06-25 10:12:22','2025-06-25 10:12:22'),(2,'Pizza','pizza','Pizza Ý authentic với nhiều topping đa dạng','https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',1,2,'2025-06-25 10:12:22','2025-06-25 10:12:22'),(3,'Gà Rán & Gà Nướng','ga-ran-nuong','Gà rán giòn tan, gà nướng thơm lừng','https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500',1,3,'2025-06-25 10:12:22','2025-06-25 10:12:22'),(4,'Mì Ý & Pasta','mi-y-pasta','Mì Ý các loại với sốt đặc biệt','https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=500',1,4,'2025-06-25 10:12:22','2025-06-25 10:12:22'),(5,'Đồ Uống','do-uong','Nước ngọt, cà phê, trà và sinh tố tươi','https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500',1,5,'2025-06-25 10:12:22','2025-06-25 10:12:22'),(6,'Tráng Miệng','trang-mieng','Bánh ngọt, kem, pudding và các món tráng miệng','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500',1,6,'2025-06-25 10:12:22','2025-06-25 10:12:22');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,2,'Chicken Deluxe Burger',NULL,129000.00,1,129000.00,NULL,'2025-06-26 10:58:40'),(2,2,2,'Chicken Deluxe Burger',NULL,129000.00,1,129000.00,NULL,'2025-06-26 12:50:19'),(3,3,8,'Bánh Flan Caramel',NULL,35000.00,1,35000.00,NULL,'2025-06-26 15:27:19'),(4,3,7,'Mì Ý Carbonara','http://localhost:5000/uploads/1750930156712-583947774.jpg',159000.00,1,159000.00,NULL,'2025-06-26 15:27:19'),(5,4,5,'Gà Rán Giòn Cay',NULL,149000.00,1,149000.00,NULL,'2025-06-28 09:24:07'),(6,5,1,'Big Burger Bò Úc','https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',139000.00,1,139000.00,NULL,'2025-06-28 09:34:02'),(7,6,4,'Pizza Hải Sản Đặc Biệt','http://localhost:5000/uploads/1750930094431-18701727.jpg',229000.00,1,229000.00,NULL,'2025-06-29 05:55:44');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_notes` text COLLATE utf8mb4_unicode_ci,
  `subtotal` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','card','momo','zalopay','banking') COLLATE utf8mb4_unicode_ci DEFAULT 'cash',
  `payment_status` enum('pending','paid','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `status` enum('pending','confirmed','preparing','delivering','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `estimated_delivery` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_order_number` (`order_number`),
  KEY `idx_status` (`status`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,'FF1750935520126ZHY9','Chicken Deluxe Burger','0123456789','qe','',129000.00,25000.00,0.00,154000.00,'cash','pending','delivered',NULL,NULL,'2025-06-26 10:58:40','2025-06-26 15:20:17'),(2,2,'FF1750942219268XVW9','Chicken Deluxe Burger','0123456789','assasa','qưqw',129000.00,25000.00,0.00,154000.00,'cash','pending','cancelled',NULL,NULL,'2025-06-26 12:50:19','2025-06-26 13:51:14'),(3,5,'FF17509516391834V2O','Pham Ngoc Han','0123498756','Melbourne, Australia','hihi',194000.00,25000.00,0.00,219000.00,'cash','pending','pending',NULL,NULL,'2025-06-26 15:27:19','2025-06-26 15:27:19'),(4,5,'FF1751102647044QDRA','gagaga','0123498756','eqeq','qeqe',149000.00,25000.00,0.00,174000.00,'card','pending','pending',NULL,NULL,'2025-06-28 09:24:07','2025-06-28 09:24:07'),(5,5,'FF1751103242588ZKFE','Test User','0123456789','assasa','qưeq',139000.00,25000.00,0.00,164000.00,'card','pending','confirmed',NULL,NULL,'2025-06-28 09:34:02','2025-06-28 09:35:16'),(6,5,'FF175117654402200EV','Phạm Ngọc Hân','0123456789','Melbourne, Australia','qqeqe',229000.00,0.00,0.00,229000.00,'cash','pending','pending',NULL,NULL,'2025-06-29 05:55:44','2025-06-29 05:55:44');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên sản phẩm',
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn thân thiện',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả sản phẩm',
  `short_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mô tả ngắn',
  `price` decimal(10,2) NOT NULL COMMENT 'Giá bán',
  `sale_price` decimal(10,2) DEFAULT NULL COMMENT 'Giá khuyến mãi',
  `images` json DEFAULT NULL COMMENT 'Danh sách hình ảnh JSON',
  `ingredients` text COLLATE utf8mb4_unicode_ci COMMENT 'Thành phần nguyên liệu',
  `preparation_time` int DEFAULT '15' COMMENT 'Thời gian chuẩn bị (phút)',
  `calories` int DEFAULT NULL COMMENT 'Lượng calo',
  `rating` decimal(3,2) DEFAULT '5.00' COMMENT 'Đánh giá trung bình',
  `rating_count` int DEFAULT '0' COMMENT 'Số lượt đánh giá',
  `is_available` tinyint(1) DEFAULT '1' COMMENT 'Còn hàng',
  `is_featured` tinyint(1) DEFAULT '0' COMMENT 'Sản phẩm nổi bật',
  `is_spicy` tinyint(1) DEFAULT '0' COMMENT 'Món cay',
  `is_vegetarian` tinyint(1) DEFAULT '0' COMMENT 'Món chay',
  `views_count` int DEFAULT '0' COMMENT 'Số lượt xem',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sold_count` int DEFAULT '0',
  `detailed_description` text COLLATE utf8mb4_unicode_ci,
  `allergens` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nutrition` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_category` (`category_id`),
  KEY `idx_featured` (`is_featured`),
  KEY `idx_available` (`is_available`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Big Burger Bò Úc','big-burger-b-c','Burger bò Úc cao cấp với patty 200g, phô mai cheddar, rau xanh tươi và sốt đặc biệt','Burger bò Úc thượng hạng với patty 200g',141000.00,139000.00,'[\"https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500\"]','Thịt bò Úc, bánh mì burger, phô mai cheddar, rau salad',12,650,4.80,245,1,1,0,0,0,'2025-06-25 10:12:22','2025-06-28 02:37:21','https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',0,'Burger bò Úc cao cấp với patty bò 200g, phô mai cheddar tan chảy, rau xanh tươi và sốt đặc biệt chuẩn vị Mỹ.','{\"contains\": \"Phô mai (sữa), bánh mì (gluten)\"}','{\"fat\": \"28g\", \"protein\": \"35g\", \"calories\": 650, \"carbohydrate\": \"45g\"}'),(2,1,'Chicken Deluxe Burger','chicken-deluxe-burger','Burger gà giòn với miếng gà tươi chiên giòn, phô mai, rau củ và sốt ranch','Burger gà giòn thơm ngon với sốt ranch',129000.00,NULL,'[\"https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500\"]','Thịt gà tươi, bánh mì burger, phô mai, rau salad, sốt ranch',10,580,4.70,189,1,1,0,0,0,'2025-06-25 10:12:22','2025-06-28 02:37:21',NULL,0,'Burger gà giòn với lớp vỏ chiên vàng ruộm, phô mai béo ngậy, rau củ tươi và sốt ranch đậm đà.','{\"contains\": \"Trứng, sữa, gluten\"}','{\"fat\": \"25g\", \"protein\": \"30g\", \"calories\": 580, \"carbohydrate\": \"40g\"}'),(3,2,'Pizza Margherita Ý','pizza-margherita-y','Pizza truyền thống Ý với cà chua, mozzarella tươi và lá húng quế','Pizza Margherita authentic từ Ý',189000.00,NULL,'[\"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500\"]','Bột pizza, cà chua, phô mai mozzarella, lá húng quế',18,420,4.90,312,1,1,0,1,0,'2025-06-25 10:12:22','2025-06-28 02:37:21',NULL,0,'Pizza Margherita truyền thống với đế bánh mỏng, cà chua tươi, mozzarella thơm và lá húng quế Ý.','{\"contains\": \"Sữa (phô mai), gluten\"}','{\"fat\": \"16g\", \"protein\": \"18g\", \"calories\": 420, \"carbohydrate\": \"48g\"}'),(4,2,'Pizza Hải Sản Đặc Biệt','pizza-hi-sn-c-bit','Pizza hải sản với tôm, mực, nghêu và phô mai đặc biệt','Pizza hải sản tươi ngon từ biển',259000.00,229000.00,'[\"https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500\"]','Bột pizza, tôm, mực, nghêu, phô mai',20,580,4.80,198,1,1,0,0,0,'2025-06-25 10:12:22','2025-06-28 02:37:21','http://localhost:5000/uploads/1750930094431-18701727.jpg',0,'Pizza hải sản đậm vị với topping tôm, mực, nghêu tươi và phô mai tan chảy.','{\"contains\": \"Hải sản, sữa, gluten\"}','{\"fat\": \"26g\", \"protein\": \"28g\", \"calories\": 580, \"carbohydrate\": \"50g\"}'),(5,3,'Gà Rán Giòn Cay','ga-ran-gion-cay','Gà rán giòn tan với gia vị cay đặc biệt, ăn kèm khoai tây','Gà rán giòn cay đậm đà',149000.00,NULL,'[\"https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500\"]','Gà tươi, bột chiên giòn, gia vị cay',14,620,4.60,234,1,1,1,0,0,'2025-06-25 10:12:22','2025-06-28 02:37:21',NULL,0,'Gà rán giòn tan với lớp vỏ cay đặc trưng, ăn kèm khoai tây chiên hấp dẫn.','{\"contains\": \"Trứng, gluten\"}','{\"fat\": \"30g\", \"protein\": \"32g\", \"calories\": 620, \"carbohydrate\": \"35g\"}'),(6,5,'Sinh Tố Xoài Dừa','sinh-to-xoai-dua','Sinh tố xoài tươi ngon với nước dừa mát lạnh','Sinh tố xoài dừa mát lành',45000.00,NULL,'[\"https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500\"]','Xoài tươi, nước dừa, đá',5,180,4.50,89,1,0,0,1,0,'2025-06-25 10:12:22','2025-06-28 02:37:21',NULL,0,'Sinh tố mát lạnh kết hợp xoài chín và nước dừa tươi, thơm ngon và bổ dưỡng.','{\"contains\": \"Không có\"}','{\"fat\": \"2g\", \"protein\": \"2g\", \"calories\": 180, \"carbohydrate\": \"38g\"}'),(7,4,'Mì Ý Carbonara','m-carbonara','Mì Ý carbonara với bacon và phô mai parmesan thơm ngon','Mì Ý carbonara đậm đà',159000.00,NULL,'[\"https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=500\"]','Mì fettuccine, bacon, phô mai parmesan, trứng',16,680,4.70,198,1,0,0,0,0,'2025-06-25 10:12:22','2025-06-28 02:37:21','http://localhost:5000/uploads/1750930156712-583947774.jpg',0,'Mì Ý sốt carbonara béo ngậy với bacon chiên giòn và phô mai parmesan thượng hạng.','{\"contains\": \"Trứng, sữa, gluten\"}','{\"fat\": \"34g\", \"protein\": \"24g\", \"calories\": 680, \"carbohydrate\": \"55g\"}'),(8,6,'Bánh Flan Caramel','banh-flan-caramel','Bánh flan caramel mềm mịn với lớp caramel thơm béo','Bánh flan caramel mềm mịn',35000.00,NULL,'[\"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500\"]','Trứng, sữa tươi, đường caramel',5,220,4.30,123,1,0,0,1,0,'2025-06-25 10:12:22','2025-06-28 02:37:21',NULL,0,'Bánh flan mềm mịn, thơm ngậy với lớp caramel vàng óng trên mặt.','{\"contains\": \"Trứng, sữa\"}','{\"fat\": \"8g\", \"protein\": \"6g\", \"calories\": 220, \"carbohydrate\": \"28g\"}');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('customer','admin','staff') COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `is_active` tinyint(1) DEFAULT '1',
  `email_verified` tinyint(1) DEFAULT '0',
  `phone_verified` tinyint(1) DEFAULT '0',
  `loyalty_points` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@fastfood.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Quản Trị Viên','0901234567',NULL,NULL,NULL,'admin',1,1,0,0,'2025-06-25 10:12:22','2025-06-25 10:12:22'),(2,'acidg694@gmail.com','$2a$10$uuNYeCCLunHtf.AyOdYxJuy.3cuMlSz4wM64H22TXYwr1oIemMRjK','Dang Tran Quang Thang','',NULL,NULL,NULL,'customer',1,0,0,0,'2025-06-25 10:53:04','2025-06-25 10:53:04'),(4,'admin1@fastfood.com','$2a$10$U3CENpC1nkYDVosK/sZ7LOVJaV6estPBc6.luLrcKZ0NWIEI8W5/O','Admin','0901234567',NULL,NULL,NULL,'admin',1,1,0,0,'2025-06-26 03:06:45','2025-06-26 04:35:09'),(5,'eliecloudie555@gmail.com','$2a$10$5GaAxHL9EdfNEqKmn4aBAOTmtENYhcFtUVPOPnD4/ADm5NbTPtJOC','Pham Ngoc Han','0123456789',NULL,NULL,NULL,'customer',1,0,0,0,'2025-06-26 15:26:23','2025-06-28 22:04:01');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'fastfood_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-29 14:38:15

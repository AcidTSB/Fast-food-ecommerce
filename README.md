# Fast Food E-commerce

## Giới thiệu

Website thương mại điện tử đặt thức ăn nhanh trực tuyến (gà rán, burger, combo, đồ uống). Dự án có 3 phần riêng biệt:

- **Client** — Giao diện người dùng để đặt hàng
- **Admin** — Trang quản trị nội bộ
- **Server** — REST API backend

---

## Tính năng chính

- Đăng ký / đăng nhập, quản lý tài khoản
- Tìm kiếm & lọc sản phẩm theo danh mục
- Giỏ hàng, thanh toán đa phương thức (MOMO, COD, ví điện tử, thẻ ngân hàng)
- Theo dõi trạng thái đơn hàng, mã giảm giá
- Gợi ý combo thông minh theo lịch sử mua hàng
- Chatbot hỗ trợ đặt hàng
- Tích hợp Google Maps chọn địa chỉ giao hàng
- Dark / Light mode, giao diện responsive
- PWA (Progressive Web App) — có thể cài về máy, hỗ trợ offline
- Trang Admin quản lý sản phẩm, đơn hàng, người dùng, danh mục, báo cáo

---

## Công nghệ sử dụng

| Tầng | Công nghệ |
|---|---|
| **Frontend** | React.js 18, React Router DOM, TailwindCSS, React Icons |
| **State Management** | Redux, React Context API |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (`mysql2`) + MongoDB (`mongoose`) |
| **Auth** | JWT (`jsonwebtoken`), bcryptjs |
| **Upload ảnh** | Multer, Cloudinary |
| **Validation & Security** | express-validator, Joi, Helmet, express-rate-limit |
| **PWA** | Service Worker |
| **Analytics** | Google Analytics, Facebook Pixel |
| **Khác** | Axios, CORS, dotenv, nodemon |

---

## Cài đặt & Chạy dự án

### Yêu cầu

- Node.js
- MySQL
- MongoDB
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository:
   ```bash
   git clone <repository-url>
   cd fast-food-ecommerce
   ```

2. Cài đặt toàn bộ dependencies:
   ```bash
   npm run install-all
   ```

3. Cấu hình biến môi trường:
   - Tạo file `.env` trong thư mục `server/` theo mẫu `.env.example` và điền các giá trị tương ứng.

4. Khởi tạo database:
   ```bash
   cd server
   npm run setup-db
   ```

5. Chạy toàn bộ dự án (server + admin + client):
   ```bash
   npm start
   ```

---

## Mô tả cho CV

> **Fast Food E-commerce** — Full-stack web application
> Xây dựng hệ thống đặt thức ăn nhanh trực tuyến với kiến trúc client–admin–server tách biệt. Tech stack: **React.js, Node.js, Express.js, MySQL, MongoDB, TailwindCSS**. Tích hợp thanh toán MOMO/COD, chatbot hỗ trợ, gợi ý sản phẩm thông minh, Google Maps, PWA và trang quản trị đầy đủ chức năng.
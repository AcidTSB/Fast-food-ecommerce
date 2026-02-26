import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Không tìm thấy trang</h2>
        <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        <Link to="/admin" className="btn-primary">
          Quay lại trang chính
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ items = [] }) => {
  // Đảm bảo items là một mảng
  const breadcrumbItems = Array.isArray(items) ? items : [];
  
  return (
    <nav className="breadcrumb">
      <ol>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={index}>
            {index === breadcrumbItems.length - 1 ? (
              <span>{item.label}</span>
            ) : (
              <Link to={item.path}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
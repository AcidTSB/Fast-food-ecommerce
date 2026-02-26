import React from 'react';
import './UserCard.css';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <p className="user-role">{user.role}</p>
      </div>
      <div className="user-actions">
        <button className="edit-button" onClick={() => onEdit(user.id)}>Edit</button>
        <button className="delete-button" onClick={() => onDelete(user.id)}>Delete</button>
      </div>
    </div>
  );
};

export default UserCard;
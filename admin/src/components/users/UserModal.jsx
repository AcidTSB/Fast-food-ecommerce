import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useTheme } from '../../contexts/ThemeContext';
import { updateUser, deleteUser } from '../../services/userService';
import './UserModal.css';

const UserModal = ({ isOpen, onRequestClose, user, refreshUsers }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user.id, formData);
      refreshUsers();
      onRequestClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      refreshUsers();
      onRequestClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={`user-modal ${isDark ? 'dark' : ''}`}
      overlayClassName="modal-overlay"
    >
      <h2>{user ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <button type="submit">Save</button>
        {user && <button type="button" onClick={handleDelete}>Delete</button>}
      </form>
    </Modal>
  );
};

export default UserModal;
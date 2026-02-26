import React, { useEffect, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserList from '../components/users/UserList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/layout/Layout'; // Thêm Layout component
import './UserManagement.css'; // Import file CSS

const UserManagement = () => {
  const { isDark } = useTheme();
  const { users, loading, error, fetchUsers, deleteUser } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = (userId) => {
    setSelectedUser(userId);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    deleteUser(selectedUser);
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  return (
    <Layout pageTitle="Quản lý Người dùng">
      <div className={`user-management ${isDark ? 'dark' : ''}`}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-message">
            <p className="error">{error}</p>
            <button onClick={fetchUsers} className="retry-button">Thử lại</button>
          </div>
        ) : (
          <>
            <div className="user-actions">
              <button className="add-user-btn">Thêm người dùng</button>
            </div>
            <UserList users={users} onDeleteUser={handleDeleteUser} />
          </>
        )}
        
        {showConfirmModal && (
          <ConfirmModal
            title="Xác nhận xóa"
            message="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>
    </Layout>
  );
};

export default UserManagement;
import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../services/userService';
import UserCard from './UserCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmModal from '../common/ConfirmModal';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      try {
        const data = await getUsers();
        if (isMounted) setUsers(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        if (isMounted) setError('Failed to fetch users');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetch();
    return () => { isMounted = false; };
  }, []);

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        setUsers(users.filter(user => user.id !== userToDelete.id));
        setUserToDelete(null);
      } catch (err) {
        setError('Failed to delete user');
      } finally {
        setShowConfirmModal(false);
      }
    }
  };

  return (
    <div className="user-list">
      {loading && <LoadingSpinner />}
      {error && <p className="error">{error}</p>}
      <div className="user-cards">
        {(users || []).map(user => (
          <UserCard 
            key={user.id} 
            user={user} 
            onDelete={() => {
              setUserToDelete(user);
              setShowConfirmModal(true);
            }} 
          />
        ))}
      </div>
      {showConfirmModal && (
        <ConfirmModal 
          message={`Are you sure you want to delete ${userToDelete.name}?`}
          onConfirm={handleDeleteUser}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default UserList;
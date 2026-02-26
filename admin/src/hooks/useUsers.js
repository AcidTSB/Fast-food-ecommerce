import { useState, useEffect, useCallback } from 'react';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../services/userService';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userCount, setUserCount] = useState(0);
  
  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers(params);
      setUsers(response.users || response);
      setUserCount(response.totalCount || response.length);
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserById(id);
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createUser(userData);
      setUsers(prev => [...prev, response]);
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const editUser = useCallback(async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUser(id, userData);
      setUsers(prev => 
        prev.map(user => user.id === id ? response : user)
      );
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    userCount,
    fetchUsers,
    getUserDetails,
    addUser,
    editUser,
    removeUser
  };
};

// Export both as default and named for compatibility
export default useUsers;
export { useUsers };
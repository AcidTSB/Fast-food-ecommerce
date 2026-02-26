import api from './api';

// Alias for compatibility with existing components
export const getUsers = api.fetchUsers;
export const getUserById = api.fetchUserById;
export const createUser = api.createUser;
export const updateUser = api.updateUser;
export const deleteUser = api.deleteUser;
export const addUser = api.createUser; // Alias for compatibility
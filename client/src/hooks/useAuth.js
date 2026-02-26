import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/auth';

const useAuth = () => {
    const { setUser, setIsAuthenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const user = await loginUser(credentials);
            setUser(user);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const user = await registerUser(userData);
            setUser(user);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        register,
        loading,
        error,
    };
};

export default useAuth;
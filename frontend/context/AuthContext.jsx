import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await fetchCurrentUser();
                    setUser(userData);
                } catch (err) {
                    console.error("Failed to load user", err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        setError(null);
        try {
            const data = await loginUser({ email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return true;
        } catch (err) {
            setError(err.message || 'Login failed');
            return false;
        }
    };

    const signup = async (userData) => {
        setError(null);
        try {
            const data = await registerUser(userData);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return true;
        } catch (err) {
            setError(err.message || 'Signup failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

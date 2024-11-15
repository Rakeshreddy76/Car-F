import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({ token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
    }, []);

    const authAxios = axios.create({
        baseURL: 'http://localhost:5000/api', // Replace with your backend URL
    });

    authAxios.interceptors.request.use(
        (config) => {
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return (
        <AuthContext.Provider value={{ user, login, logout, authAxios }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

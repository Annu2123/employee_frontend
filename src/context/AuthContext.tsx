import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    // const verifyUser= async () =>{

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    // Ideally verify token with backend or decode it
                    // For now, assume if token exists we try to fetch account or rely on stored data
                    // Let's fetch account to be safe and get fresh user data
                    const response = await api.get('/auth/account');
                    setUser({ ...response.data, id: response.data._id }); // Map _id to id if needed
                } catch (error) {
                    console.error("Failed to load user", error);
                    logout();
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, [token]);

    const login = (newToken: string, userData: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

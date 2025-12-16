import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_URL from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(
                `${API_URL}/auth/login`,
                { email, password }
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Login Successful');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login Failed');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post(
                `${API_URL}/auth/register`,
                userData
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Registration Successful');
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Registration Successful');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration Failed');
            return false;
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem('userInfo');
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

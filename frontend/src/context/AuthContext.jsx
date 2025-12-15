import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
                'http://localhost:5001/api/auth/login',
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
                'http://localhost:5001/api/auth/register',
                userData
            );

            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Registration Successful');
            if (data.role === 'admin') navigate('/admin-dashboard');
            else if (data.role === 'provider') navigate('/provider');
            else navigate('/');
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

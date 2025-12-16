import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer',
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(formData);
        if (success) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo?.role === 'admin') navigate('/admin');
            else if (userInfo?.role === 'provider') navigate('/provider');
            else navigate('/profile');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select
                        name="role"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="customer">Customer</option>
                        <option value="provider">Service Provider</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;

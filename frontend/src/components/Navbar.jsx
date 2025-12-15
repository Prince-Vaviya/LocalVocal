import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const location = useLocation();

    // Hide global navbar for admin routes (AdminLayout has its own)
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">LocalVocal</Link>
            <div>
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Hello, {user.name}</span>
                        {user.role === 'customer' && <Link to="/profile" className="text-gray-600 hover:text-blue-500">Profile</Link>}
                        {user.role === 'provider' && <Link to="/provider" className="text-gray-600 hover:text-blue-500">Dashboard</Link>}
                        {user.role === 'admin' && <Link to="/admin" className="text-gray-600 hover:text-blue-500">Admin</Link>}
                        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
                        <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

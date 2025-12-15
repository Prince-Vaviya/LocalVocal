import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Providers', path: '/admin/providers' },
        { name: 'Reports', path: '/admin/reports' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        LocalVocal <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full uppercase ml-1 border border-red-200">Admin</span>
                    </h1>

                    <div className="hidden md:flex space-x-6 items-center">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-semibold transition-colors ${isActive
                                        ? 'text-purple-600 border-b-2 border-purple-600'
                                        : 'text-gray-600 hover:text-purple-600'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium transition-all text-sm"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="flex-1 container mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

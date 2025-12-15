import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CustomerProfileLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarLinks = [
        { name: 'My Bookings', path: '/profile/bookings', icon: '📅' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-blue-100">
                <div className="container mx-auto px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                    {/* Branding */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 tracking-tight hover:opacity-80 transition-opacity">LocalVocal</Link>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-green-200">Customer</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200 overflow-x-auto max-w-full">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2 rounded-lg transition-all font-bold whitespace-nowrap ${isActive
                                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                                    }`
                                }
                            >
                                <span className="mr-2 text-lg">{link.icon}</span>
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* User Profile & Logout */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1.5 rounded-full border border-blue-100/50">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-sm border border-blue-100">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-700 font-medium text-sm hidden lg:block">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-full font-medium transition-colors text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 md:px-8 py-8 animate-fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default CustomerProfileLayout;

import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="text-center mb-8 border-b pb-6">
                                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-600 text-2xl font-bold mb-3">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="font-bold text-gray-800 text-lg">{user?.name}</h2>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>

                            <nav className="space-y-2">
                                {sidebarLinks.map((link) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`
                                        }
                                    >
                                        <span className="mr-3">{link.icon}</span>
                                        {link.name}
                                    </NavLink>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all mt-4"
                                >
                                    <span className="mr-3">🚪</span>
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfileLayout;

import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProviderLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarLinks = [
        { name: 'My Services', path: '/provider/services', icon: '🛠️' },
        { name: 'Order Bookings', path: '/provider/bookings', icon: '📋' },
        { name: 'Order History', path: '/provider/history', icon: '📜' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm border-b z-10 sticky top-0">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Provider Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600 font-medium">Hello, {user?.name}</span>
                        <button onClick={handleLogout} className="text-red-600 font-medium hover:text-red-700">Logout</button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8 flex-1 flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit md:sticky md:top-24">
                    <div className="mb-6 flex flex-col items-center">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-3">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full mt-1">● Active Provider</p>
                    </div>

                    <nav className="space-y-1">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-all font-medium ${isActive
                                        ? 'bg-purple-50 text-purple-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <span className="mr-3">{link.icon}</span>
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProviderLayout;

import React from 'react';

const ProviderDashboard = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-90">My Services</h3>
                    <p className="text-4xl font-bold mt-2">--</p>
                    <p className="text-sm mt-2 opacity-75">Active Listings</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-90">Total Bookings</h3>
                    <p className="text-4xl font-bold mt-2">--</p>
                    <p className="text-sm mt-2 opacity-75">Pending & Completed</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-90">Total Revenue</h3>
                    <p className="text-4xl font-bold mt-2">₹--</p>
                    <p className="text-sm mt-2 opacity-75">Lifetime Earnings</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center py-20">
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h2>
                <p className="text-gray-500 max-w-md">Manage your services, track your bookings, and view your performance reports all in one place.</p>
            </div>
        </div>
    );
};

export default ProviderDashboard;

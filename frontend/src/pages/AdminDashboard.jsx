import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';


const AdminDashboard = () => {
    const [stats, setStats] = useState({ waitlist: 0, services: 0, revenue: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                };
                const res = await axios.get(`${API_URL}/admin/stats`, config);
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats");
            }
        };
        fetchStats();
    }, []);



    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-90">Waitlist</h3>
                    <p className="text-4xl font-bold mt-2">{stats.waitlist}</p>
                    <p className="text-sm mt-2 opacity-75">New Providers</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-90">Total Services</h3>
                    <p className="text-4xl font-bold mt-2">{stats.services}</p>
                    <p className="text-sm mt-2 opacity-75">Active Listings</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-90">Revenue</h3>
                    <p className="text-4xl font-bold mt-2">₹{stats.revenue}</p>
                    <p className="text-sm mt-2 opacity-75">Total Volume</p>
                </div>
            </div>


        </div>
    );
};

export default AdminDashboard;

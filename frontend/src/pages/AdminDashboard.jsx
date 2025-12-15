import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                };
                const res = await axios.get('http://localhost:5001/api/admin/stats', config);
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats");
            }
        };
        fetchStats();
    }, []);

    // Custom Bar Shape for pseudo-3D effect
    const CustomBar = (props) => {
        const { fill, x, y, width, height } = props;

        return (
            <g>
                {/* Main Face */}
                <rect x={x} y={y} width={width} height={height} fill={fill} />
                {/* Top Face */}
                <path d={`M${x},${y} L${x + 10},${y - 10} L${x + width + 10},${y - 10} L${x + width},${y} Z`} fill={fill} filter="brightness(1.2)" />
                {/* Side Face */}
                <path d={`M${x + width},${y} L${x + width + 10},${y - 10} L${x + width + 10},${y + height - 10} L${x + width},${y + height} Z`} fill={fill} filter="brightness(0.8)" />
            </g>
        );
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-90">Waitlist</h3>
                    <p className="text-4xl font-bold mt-2">--</p>
                    <p className="text-sm mt-2 opacity-75">New Providers</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-90">Total Services</h3>
                    <p className="text-4xl font-bold mt-2">--</p>
                    <p className="text-sm mt-2 opacity-75">Active Listings</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-90">Revenue</h3>
                    <p className="text-4xl font-bold mt-2">₹--</p>
                    <p className="text-sm mt-2 opacity-75">Total Volume</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <span className="mr-2">📊</span> Service Analytics by Location
                </h2>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={stats}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            barGap={2} // Increased gap for 3D depth perception
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="completed" name="Completed Services" fill="#8884d8" shape={<CustomBar />} barSize={40} />
                            <Bar dataKey="cancelled" name="Cancelled Services" fill="#ff8042" shape={<CustomBar />} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

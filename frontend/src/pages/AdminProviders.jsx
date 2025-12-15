import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProviders = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProviders = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            const res = await axios.get('http://localhost:5001/api/admin/providers', config);
            setProviders(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleVerify = async (id) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.put(`http://localhost:5001/api/admin/verify/${id}`, {}, config);
            toast.success('Provider Verified');
            fetchProviders();
        } catch (error) {
            toast.error('Verification failed');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Reject and remove this provider account? This cannot be undone.")) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.delete(`http://localhost:5001/api/admin/provider/${id}`, config);
            toast.success('Provider Rejected & Removed');
            fetchProviders();
        } catch (error) {
            toast.error('Rejection failed');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">New Provider verifications</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">{providers.length} Pending</span>
            </div>

            {providers.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border dashed border-gray-300">
                    <div className="text-5xl mb-4">✨</div>
                    <p className="text-xl text-gray-500">All caught up! No new providers waiting for verification.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providers.map(provider => (
                        <div key={provider._id} className="bg-white rounded-xl shadow-lg border-t-4 border-yellow-400 p-6 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-bl-lg">
                                UNVERIFIED
                            </div>

                            <div className="flex items-center mb-4">
                                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                                    {provider.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{provider.name}</h3>
                                    <p className="text-sm text-gray-500">{provider.email}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-6 text-sm">
                                <p className="mb-1"><span className="font-semibold">Phone:</span> {provider.phone}</p>
                                <p><span className="font-semibold">Locations:</span> {provider.serviceLocations?.join(', ') || 'N/A'}</p>
                            </div>

                            <div className="mt-auto flex gap-3">
                                <button
                                    onClick={() => handleReject(provider._id)}
                                    className="flex-1 py-2 border border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleVerify(provider._id)}
                                    className="flex-1 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-md transform active:scale-95"
                                >
                                    Verify ✅
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminProviders;

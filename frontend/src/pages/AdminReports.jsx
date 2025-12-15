import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            const res = await axios.get('http://localhost:5001/api/admin/reports', config);
            setReports(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleIgnore = async (id) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.put(`http://localhost:5001/api/admin/reports/${id}/ignore`, {}, config);
            toast.info('Report Ignored');
            fetchReports();
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this review permanently?")) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.delete(`http://localhost:5001/api/admin/reports/${id}`, config);
            toast.success('Review Deleted');
            fetchReports();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Flagged Reviews</h2>

            <div className="space-y-4">
                {reports.map((review) => (
                    <div key={review._id} className="bg-white rounded-xl shadow-md border-l-4 border-red-500 overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">FLAGGED</span>
                                    <h3 className="font-bold text-gray-800">Review for: {review.serviceId?.title}</h3>
                                </div>
                                <span className="text-sm text-gray-400">{new Date(review.createdAt).toDateString()}</span>
                            </div>

                            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg italic mb-4 border border-gray-100">
                                "{review.comment}"
                            </p>

                            <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
                                <div><span className="font-semibold">By Customer:</span> {review.customerId?.name}</div>
                                <div><span className="font-semibold">Provider Affected:</span> {review.providerId?.name}</div>
                                <div><span className="font-semibold">Rating:</span> {review.rating}/5</div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => handleIgnore(review._id)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    Ignore Flag (Keep Review)
                                </button>
                                <button
                                    onClick={() => handleDelete(review._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-md transition-transform active:scale-95"
                                >
                                    Delete Review
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {reports.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl">
                        <p className="text-green-600 font-medium text-lg">No flagged reviews! Everyone is behaving nicely. 🌟</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;

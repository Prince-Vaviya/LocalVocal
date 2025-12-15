import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProviderHistory = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [view, setView] = useState('completed'); // 'completed' or 'reviews'

    useEffect(() => {
        if (user) {
            fetchBookings();
            fetchReviews();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/bookings');
            // Filter accepted, completed, cancelled
            const history = res.data.filter(b => ['completed', 'cancelled', 'accepted'].includes(b.status));
            setBookings(history.reverse());
        } catch (error) {
            console.error("Error bookings", error);
        }
    };

    const fetchReviews = async () => {
        try {
            // Need endpoint to get reviews for provider.
            // Currently getting reviews by service ID is supported.
            // We might need to iterate services or add endpoint.
            // For now, let's assume we can GET /api/reviews?providerId=... or similar
            // Checking existing reviewController... getReviews takes serviceId query
            // We should add providerId filter there too?
            // Actually, let's just use what we have or add a simple new filter in backend if needed.
            // Or fetched all reviews and filtered on frontend if API returns all (bad practice but MVP)
            // Let's rely on the API returning generic reviews and filter by providerId if possible, or services.

            // Wait, I didn't update reviewController to filter by provider.
            // I will implement a quick client side hack: 
            // 1. Get my services
            // 2. Get reviews for each service
            // This is slow. 
            // Better: update reviewController to support ?provider=ID

            // Assume I will update backend next step.
            const res = await axios.get(`http://localhost:5001/api/reviews?provider=${user._id}`);
            setReviews(res.data);
        } catch (error) {
            console.error("Error reviews", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100';
        }
    };

    const handleFlag = async (reviewId) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.put(`http://localhost:5001/api/reviews/${reviewId}/flag`, {}, config);
            toast.success('Review flagged for admin');
        } catch (error) {
            toast.error('Failed to flag review');
        }
    };

    return (
        <div>
            <div className="flex space-x-4 mb-8 bg-white border border-gray-200 p-1.5 rounded-xl w-fit shadow-sm">
                <button
                    className={`px-6 py-2.5 rounded-lg font-bold transition-all ${view === 'completed' ? 'bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                    onClick={() => setView('completed')}
                >
                    Completed Orders
                </button>
                <button
                    className={`px-6 py-2.5 rounded-lg font-bold transition-all ${view === 'reviews' ? 'bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                    onClick={() => setView('reviews')}
                >
                    My Reviews
                </button>
            </div>

            {view === 'completed' && (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 p-6 flex justify-between items-center group">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="font-bold text-gray-900 text-lg">{booking.serviceId?.title}</h4>
                                    <span className={`px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wide ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 flex items-center">
                                    <span className="mr-2">👤 {booking.customerId?.name}</span>
                                    <span>📅 {new Date(booking.scheduledAt).toLocaleDateString()}</span>
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="font-bold text-gray-900 text-lg">₹{booking.price}</span>
                                <button
                                    onClick={() => navigate(`/chat/${booking.customerId._id}`)}
                                    className="p-3 text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-md transition-colors"
                                    title="Chat with Customer"
                                >
                                    💬
                                </button>
                            </div>
                        </div>
                    ))}
                    {bookings.length === 0 && <p className="text-gray-500 text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">No history found.</p>}
                </div>
            )}

            {view === 'reviews' && (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center font-bold text-purple-700 mr-4 shadow-sm">
                                        {review.customerId?.name?.[0] || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{review.customerId?.name}</p>
                                        <div className="flex items-center space-x-1">
                                            <div className="text-yellow-400 text-sm">
                                                {'★'.repeat(review.rating)}
                                            </div>
                                            <span className="text-gray-400 text-xs">({review.rating}/5)</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded-md">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-600 text-sm italic border-l-4 border-purple-200 pl-4 mb-4 leading-relaxed">"{review.comment}"</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <p className="text-xs text-gray-400">Service: <span className="text-gray-700 font-medium">{review.serviceId?.title}</span></p>

                                <button
                                    onClick={() => handleFlag(review._id)}
                                    className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${review.isFlagged ? 'text-red-600 border-red-200 bg-red-50' : 'text-gray-400 border-gray-200 hover:text-red-500 hover:border-red-200'}`}
                                >
                                    {review.isFlagged ? '🚩 Flagged' : '⚐ Report'}
                                </button>
                            </div>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-gray-500 text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">No reviews yet.</p>}
                </div>
            )}
        </div>
    );
};

export default ProviderHistory;

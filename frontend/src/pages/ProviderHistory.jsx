import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
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

    return (
        <div>
            <div className="flex space-x-6 border-b mb-6">
                <button
                    className={`pb-3 font-semibold ${view === 'completed' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
                    onClick={() => setView('completed')}
                >
                    Completed Orders
                </button>
                <button
                    className={`pb-3 font-semibold ${view === 'reviews' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
                    onClick={() => setView('reviews')}
                >
                    My Reviews
                </button>
            </div>

            {view === 'completed' && (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-between items-center">
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                    <h4 className="font-bold text-gray-900">{booking.serviceId?.title}</h4>
                                    <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {booking.customerId?.name} • {new Date(booking.scheduledAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="font-bold text-gray-900">₹{booking.price}</span>
                                <button
                                    onClick={() => navigate(`/chat/${booking.customerId._id}`)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                    title="Chat with Customer"
                                >
                                    💬
                                </button>
                            </div>
                        </div>
                    ))}
                    {bookings.length === 0 && <p className="text-gray-500 text-center py-10">No history found.</p>}
                </div>
            )}

            {view === 'reviews' && (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs mr-3">
                                        {review.customerId?.name?.[0] || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{review.customerId?.name}</p>
                                        <div className="text-yellow-400 text-xs">
                                            {'★'.repeat(review.rating)} <span className="text-gray-400 text-xs ml-1">({review.rating}/5)</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-gray-400 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-600 text-sm italic border-l-2 border-gray-200 pl-3 mb-3">"{review.comment}"</p>
                            <p className="text-xs text-gray-400 mb-2">Service: {review.serviceId?.title}</p>

                            <button className="text-xs text-red-400 hover:text-red-600 font-medium">
                                ⚐ Flag for Admin Review
                            </button>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-gray-500 text-center py-10">No reviews yet.</p>}
                </div>
            )}
        </div>
    );
};

export default ProviderHistory;

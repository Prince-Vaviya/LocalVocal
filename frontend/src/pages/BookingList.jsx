import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';

const BookingList = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/bookings');
            // Sort by date desc
            const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBookings(sorted);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching bookings", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchBookings();
    }, [user]);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await axios.put(`http://localhost:5001/api/bookings/${bookingId}/status`, { status: newStatus });
            toast.success(`Booking ${newStatus}`);
            fetchBookings(); // Refresh list

            if (newStatus === 'completed') {
                // Find booking to open review modal
                const booking = bookings.find(b => b._id === bookingId);
                setSelectedBookingForReview(booking);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-gray-500 text-lg mb-6">No bookings found yet.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                        Browse Services
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center group">
                            {/* Booking Info */}
                            <div className="mb-6 md:mb-0 w-full md:w-3/5">
                                <div className="flex items-center space-x-4 mb-3">
                                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{booking.serviceId?.title || 'Service Unavailable'}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                                    <p className="flex items-center"><span className="w-5 text-center mr-2">👤</span> <span className="font-medium text-gray-900">{booking.providerId?.name}</span></p>
                                    <p className="flex items-center"><span className="w-5 text-center mr-2">💰</span> <span className="font-bold text-gray-900">₹{booking.price}</span></p>
                                    <p className="col-span-2 flex items-center"><span className="w-5 text-center mr-2">📅</span> {new Date(booking.scheduledAt).toLocaleString()}</p>
                                    <p className="col-span-2 flex items-center truncate"><span className="w-5 text-center mr-2">📍</span> {booking.address}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col space-y-3 w-full md:w-auto min-w-[140px]">
                                <button
                                    className="px-5 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-bold transition-colors flex items-center justify-center"
                                    onClick={() => navigate(`/chat/${booking.providerId._id}`)}
                                >
                                    💬 Chat Provider
                                </button>

                                {booking.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                        className="px-5 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl text-sm font-bold transition-all flex items-center justify-center"
                                    >
                                        ✕ Cancel
                                    </button>
                                )}

                                {booking.status === 'accepted' && (
                                    <button
                                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                        className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center"
                                    >
                                        ✓ Mark Done
                                    </button>
                                )}

                                {booking.status === 'completed' && (
                                    <button
                                        onClick={() => setSelectedBookingForReview(booking)}
                                        className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center"
                                    >
                                        ⭐ Rate Service
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedBookingForReview && (
                <ReviewModal
                    booking={selectedBookingForReview}
                    onClose={() => setSelectedBookingForReview(null)}
                    onSuccess={() => {
                        setSelectedBookingForReview(null);
                        // Optionally refresh or disable review button locally
                    }}
                />
            )}
        </div>
    );
};

export default BookingList;

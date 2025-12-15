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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">No bookings found.</p>
                    <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">Browse Services</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-blue-100 transition-colors">
                            {/* Booking Info */}
                            <div className="mb-4 md:mb-0 w-full md:w-3/5">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="font-bold text-lg text-gray-900">{booking.serviceId?.title || 'Service Unavailable'}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                                    <p><span className="font-medium">Provider:</span> {booking.providerId?.name}</p>
                                    <p><span className="font-medium">Price:</span> ₹{booking.price}</p>
                                    <p className="col-span-2"><span className="font-medium">Date:</span> {new Date(booking.scheduledAt).toLocaleString()}</p>
                                    <p className="col-span-2 truncate"><span className="font-medium">Address:</span> {booking.address}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col space-y-2 w-full md:w-auto">
                                <button
                                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                                    onClick={() => navigate(`/chat/${booking.providerId._id}`)}
                                >
                                    Chat
                                </button>

                                {booking.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                                    >
                                        Cancel Booking
                                    </button>
                                )}

                                {booking.status === 'accepted' && (
                                    <button
                                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        Mark Completed
                                    </button>
                                )}

                                {booking.status === 'completed' && (
                                    <button
                                        onClick={() => setSelectedBookingForReview(booking)}
                                        className="px-4 py-2 bg-yellow-400 text-white rounded-lg text-sm font-semibold hover:bg-yellow-500 transition-colors shadow-sm"
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

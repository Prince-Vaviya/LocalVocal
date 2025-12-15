import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProviderBookings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            // Fetch all bookings for provider (backend usually returns all)
            // We really need a specific endpoint or just filter on client side if getBookings returns my bookings based on token
            // Based on checking bookingController earlier, getBookings returns bookings where providerId matches user
            const res = await axios.get('http://localhost:5001/api/bookings');
            // Filter only pending requests for this "Order Bookings" page
            const pending = res.data.filter(b => b.status === 'pending');
            setBookings(pending);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching bookings", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchBookings();
    }, [user]);

    const handleAction = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/api/bookings/${id}/status`, { status });
            toast.success(`Booking ${status}`);
            fetchBookings();
        } catch (error) {
            toast.error("Action failed");
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Incoming Requests</h2>

            <div className="space-y-4">
                {bookings.map(booking => (
                    <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{booking.serviceId?.title}</h3>
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold uppercase">Pending Request</span>
                            </div>
                            <p className="text-gray-600 mb-1"><span className="font-medium">Customer:</span> {booking.customerId?.name} ({booking.customerId?.email})</p>
                            <p className="text-gray-600 mb-1"><span className="font-medium">Date:</span> {new Date(booking.scheduledAt).toLocaleString()}</p>
                            <p className="text-gray-600"><span className="font-medium">Address:</span> {booking.address}</p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => handleAction(booking._id, 'cancelled')}
                                className="px-5 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                            >
                                Decline
                            </button>
                            <button
                                onClick={() => handleAction(booking._id, 'accepted')}
                                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md transition-colors"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                ))}

                {bookings.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl">
                        <p className="text-gray-400 text-lg">No pending requests at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderBookings;

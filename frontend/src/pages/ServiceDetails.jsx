import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BookingSuccess from '../components/BookingSuccess';

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book a service');
            navigate('/login', { state: { from: `/service/${id}` } });
            return;
        }

        if (user.role === 'provider') {
            toast.error('Providers cannot book services');
            return;
        }

        try {
            setBookingLoading(true);

            // Create booking
            await axios.post('http://localhost:5001/api/bookings', {
                serviceId: id,
                providerId: service.providerId._id,
                scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Default: Tomorrow
                address: user.location?.address || 'Default Address',
                price: service.price
            });

            setBookingLoading(false);
            setShowSuccess(true);

            // Redirect after animation
            setTimeout(() => {
                navigate('/'); // Or to /my-bookings later
            }, 3000);

        } catch (error) {
            setBookingLoading(false);
            toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [serviceRes, reviewsRes] = await Promise.all([
                    axios.get(`http://localhost:5001/api/services/${id}`),
                    axios.get(`http://localhost:5001/api/reviews/service/${id}`)
                ]);
                setService(serviceRes.data);
                setReviews(reviewsRes.data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load service details');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const getCategoryImage = (category) => {
        const images = {
            'Plumbing': '/plumbing.png',
            'Cleaning': '/cleaning.png',
            'Electrician': '/electrician.png',
            'Tutoring': '/tutoring.png',
            'Painter': '/painter.png',
            'Gardener': '/gardener.png',
            'Other': '/other.png'
        };
        return images[category] || images['Other'];
    };

    const getInitials = (name) => {
        if (!name) return 'SP';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!service) {
        return <div className="text-center py-20 text-xl text-red-600">Service not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-gray-600 hover:text-blue-600 flex items-center font-medium"
                >
                    ← Back to Home
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Service Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Service Card */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="h-64 md:h-80 w-full relative">
                                <img
                                    src={getCategoryImage(service.category)}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                                    <span className="text-2xl font-bold text-green-600">₹{service.price}</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                                {service.category}
                                            </span>
                                            <span className="flex items-center">
                                                <span className="mr-1">⏱</span> {service.durationMinutes} mins
                                            </span>
                                            <span className="flex items-center">
                                                <span className="text-yellow-400 mr-1">★</span>
                                                <span className="font-bold text-gray-900">{service.averageRating || 'New'}</span>
                                                <span className="ml-1 text-gray-500">({service.reviewCount} reviews)</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose max-w-none text-gray-600 leading-relaxed border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About this Service</h3>
                                    <p>{service.description}</p>
                                </div>

                                {/* Provider Info */}
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Provider</h3>
                                    <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                            {getInitials(service.providerId?.name)}
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-bold text-gray-900">{service.providerId?.name}</p>
                                            <div className="flex items-center text-gray-600 text-sm mt-1">
                                                <span>📧 {service.providerId?.email}</span>
                                                <span className="mx-2">•</span>
                                                <span>📍 {service.providerId?.location?.city || 'Location N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map(review => (
                                        <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                                                        {getInitials(review.customerId?.name)}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="font-semibold text-gray-900">{review.customerId?.name || 'Customer'}</p>
                                                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex bg-yellow-50 px-2 py-1 rounded">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 pl-14">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8 italic">No reviews yet. Be the first to review!</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Booking Card (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Book this Service</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Price per service</span>
                                    <span className="font-semibold text-gray-900">₹{service.price}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Duration</span>
                                    <span className="font-semibold text-gray-900">{service.durationMinutes} mins</span>
                                </div>
                                <div className="h-px bg-gray-200 my-2"></div>
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₹{service.price}</span>
                                </div>
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleBooking}
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? 'Processing...' : 'Book Service Now'}
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                Secure payment & satisfaction guaranteed
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <BookingSuccess show={showSuccess} onClose={() => setShowSuccess(false)} />
        </div>
    );
};

export default ServiceDetails;

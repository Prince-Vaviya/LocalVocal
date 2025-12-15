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
    // Booking Modal State
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingStep, setBookingStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        date: '',
        time: '',
        address: ''
    });

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    const openBookingModal = () => {
        if (!user) {
            toast.error('Please login to book a service');
            navigate('/login', { state: { from: `/service/${id}` } });
            return;
        }
        if (user.role === 'provider') {
            toast.error('Providers cannot book services');
            return;
        }
        // Pre-fill address if available
        setBookingData(prev => ({ ...prev, address: user.location?.city || '' }));
        setShowBookingModal(true);
        setBookingStep(1);
    };

    const handleBookingSubmit = async () => {
        try {
            setBookingLoading(true);

            // Combine date and time
            const scheduledAt = new Date(`${bookingData.date}T${convertTo24Hour(bookingData.time)}`);

            await axios.post('http://localhost:5001/api/bookings', {
                serviceId: id,
                providerId: service.providerId._id,
                scheduledAt: scheduledAt.toISOString(),
                address: bookingData.address,
                price: service.price
            });

            setBookingLoading(false);
            setShowBookingModal(false); // Close input modal
            setShowSuccess(true); // Show success animation

            setTimeout(() => {
                navigate('/bookings');
            }, 3000);

        } catch (error) {
            setBookingLoading(false);
            toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    const convertTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = modifier === 'PM' ? '12' : '00';
        } else if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}:00`;
    };

    const nextStep = () => {
        if (bookingStep === 1 && (!bookingData.date || !bookingData.time)) {
            toast.error("Please select date and time");
            return;
        }
        if (bookingStep === 2 && !bookingData.address.trim()) {
            toast.error("Please enter your address");
            return;
        }
        setBookingStep(prev => prev + 1);
    };

    const prevStep = () => setBookingStep(prev => prev - 1);

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
        <div className="min-h-screen bg-gray-50 py-12 relative">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-gray-600 hover:text-blue-600 flex items-center font-medium"
                >
                    ← Back to Home
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Service Card */}
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
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">{service.category}</span>
                                    <span>⏱ {service.durationMinutes} mins</span>
                                    <span className="flex items-center text-yellow-500 font-bold">★ {service.averageRating || 'New'} ({service.reviewCount})</span>
                                </div>
                                <div className="prose max-w-none text-gray-600 border-t pt-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                    <p>{service.description}</p>
                                </div>
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Service Provider</h3>
                                    <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                                            {getInitials(service.providerId?.name)}
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-bold text-gray-900">{service.providerId?.name}</p>
                                            <p className="text-sm text-gray-500">📍 {service.providerId?.location?.city || 'Location N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map(review => (
                                        <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6">
                                            <div className="flex justify-between mb-2">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                                        {getInitials(review.customerId?.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{review.customerId?.name}</p>
                                                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm pl-11">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500 italic">No reviews yet.</p>}
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Book this Service</h3>
                            <div className="space-y-4 mb-6 text-gray-600">
                                <div className="flex justify-between"><span>Price</span><span className="font-bold text-gray-900">₹{service.price}</span></div>
                                <div className="flex justify-between"><span>Duration</span><span className="font-bold text-gray-900">{service.durationMinutes} m</span></div>
                                <div className="h-px bg-gray-200 my-2"></div>
                                <div className="flex justify-between text-lg font-bold text-gray-900"><span>Total</span><span>₹{service.price}</span></div>
                            </div>
                            <button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all transform active:scale-95 disabled:opacity-50"
                                onClick={openBookingModal}
                                disabled={bookingLoading}
                            >
                                Book Service Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        {/* Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">
                                {bookingStep === 1 && 'Select Date & Time'}
                                {bookingStep === 2 && 'Enter Address'}
                                {bookingStep === 3 && 'Confirm Booking'}
                            </h3>
                            <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {/* Step 1: Date & Time */}
                            {bookingStep === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.map(slot => (
                                                <button
                                                    key={slot}
                                                    className={`py-2 px-1 text-sm rounded-lg border ${bookingData.time === slot ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                                    onClick={() => setBookingData({ ...bookingData, time: slot })}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Address */}
                            {bookingStep === 2 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Enter full address (House No, Street, Landmark...)"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        value={bookingData.address}
                                        onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                                    ></textarea>
                                </div>
                            )}

                            {/* Step 3: Summary */}
                            {bookingStep === 3 && (
                                <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Service</span>
                                        <span className="font-semibold text-gray-900">{service.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Date & Time</span>
                                        <span className="font-semibold text-gray-900">{bookingData.date} at {bookingData.time}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Amount</span>
                                        <span className="font-semibold text-green-600 text-lg">₹{service.price}</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <span className="text-gray-500 block mb-1">Address</span>
                                        <p className="font-medium text-gray-900">{bookingData.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
                            {bookingStep > 1 ? (
                                <button
                                    onClick={prevStep}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium"
                                >
                                    Back
                                </button>
                            ) : <div></div>}

                            {bookingStep < 3 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleBookingSubmit}
                                    disabled={bookingLoading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md flex items-center"
                                >
                                    {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <BookingSuccess show={showSuccess} />
        </div>
    );
};

export default ServiceDetails;

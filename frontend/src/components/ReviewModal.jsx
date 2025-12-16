import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_URL from '../config';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/reviews`, {
                bookingId: booking._id,
                serviceId: booking.serviceId._id,
                providerId: booking.providerId._id,
                rating,
                comment
            });
            toast.success('Review submitted successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Rate Service</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="text-center mb-4">
                        <p className="text-gray-600 mb-2">How was your experience with</p>
                        <p className="font-bold text-lg">{booking.serviceId?.title}</p>
                        <p className="text-sm text-gray-500">by {booking.providerId?.name}</p>
                    </div>

                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-3xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <textarea
                        required
                        rows="3"
                        placeholder="Write your review here..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;

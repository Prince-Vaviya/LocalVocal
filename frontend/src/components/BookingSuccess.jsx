import React from 'react';

const BookingSuccess = ({ show }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="text-center">
                {/* Checkmark Circle */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                    <div className="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center shadow-xl scale-animation">
                        <svg
                            className="w-16 h-16 text-white checkmark-draw"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Text */}
                <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in-up">
                    Booking Confirmed!
                </h2>
                <p className="text-gray-500 animate-fade-in-up delay-100">
                    Your service has been successfully booked.
                </p>

                {/* Amount */}
                <div className="mt-8 animate-fade-in-up delay-200">
                    <span className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-semibold text-lg">
                        Order Placed
                    </span>
                </div>
            </div>

            <style jsx>{`
        @keyframes scale-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .scale-animation {
            animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .checkmark-draw path {
            stroke-dasharray: 20;
            stroke-dashoffset: 20;
            animation: draw 0.5s ease-in-out forwards 0.3s;
        }
        @keyframes draw {
            to { stroke-dashoffset: 0; }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        .delay-100 { animation-delay: 0.2s; }
        .delay-200 { animation-delay: 0.4s; }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
      `}</style>
        </div>
    );
};

export default BookingSuccess;

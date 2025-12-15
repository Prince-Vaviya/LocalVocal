import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
    const navigate = useNavigate();

    // Generate placeholder image based on category
    const getCategoryImage = (category) => {
        const images = {
            'Plumbing': 'plumbing.png',
            'Cleaning': 'cleaning.png',
            'Electrician': 'electrician.png',
            'Tutoring': 'tutoring.png',
            'Painter': 'painter.png',
            'Gardener': 'gardener.png',
            'Other': 'other.png'
        };
        return images[category] || images['Other'];
    };

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return 'SP';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
            onClick={() => navigate(`/service/${service._id}`)}
        >
            {/* Service Image */}
            <div className="relative h-48 flex-shrink-0">
                <img
                    src={getCategoryImage(service.category)}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-green-100">
                        ₹{service.price}
                    </span>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1" title={service.title}>
                    {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
                    {service.description}
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-gray-100 mb-4"></div>

                {/* Footer - Provider Info & Stats */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        {/* Provider Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
                            <span className="text-blue-600 font-bold text-sm">{getInitials(service.providerId?.name)}</span>
                        </div>

                        {/* Provider Details */}
                        <div className="flex flex-col min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                                {service.providerId?.name || 'Provider'}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span className="truncate">{service.category}</span>

                                {/* Rating Badge */}
                                <div className="flex items-center bg-yellow-50 px-1.5 rounded border border-yellow-100">
                                    <span className="text-yellow-500 text-[10px] mr-1">★</span>
                                    <span className="font-medium text-gray-700">
                                        {service.averageRating > 0 ? service.averageRating : 'New'}
                                    </span>
                                    {service.reviewCount > 0 && (
                                        <span className="text-gray-400 ml-0.5">
                                            ({service.reviewCount})
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="flex-shrink-0 ml-2">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                            {service.durationMinutes}m
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;

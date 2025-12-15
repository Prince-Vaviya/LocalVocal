import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
    const navigate = useNavigate();

    // Generate placeholder image based on category
    const getCategoryImage = (category) => {
        const images = {
            'Plumbing': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=250&fit=crop',
            'Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop',
            'Electrician': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop',
            'Tutoring': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop',
            'Painter': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=250&fit=crop',
            'Gardener': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
            'Other': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop'
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
            className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/service/${service._id}`)}
        >
            {/* Service Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getCategoryImage(service.category)}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
            </div>

            {/* Card Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                    {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {service.description}
                </p>

                {/* Footer - Provider Info & Date */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                        {/* Provider Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials(service.providerId?.name)}
                        </div>
                        {/* Provider Details */}
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                By {service.providerId?.name || 'Service Provider'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {service.category}
                            </p>
                        </div>
                    </div>

                    {/* Price & Duration */}
                    <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₹{service.price}</p>
                        <p className="text-xs text-gray-500">{service.durationMinutes} mins</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;

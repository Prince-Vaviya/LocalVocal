import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ServiceModal from '../components/ServiceModal';
import { toast } from 'react-toastify';
import API_URL from '../config';

const ProviderServices = () => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const fetchMyServices = async () => {
        try {
            const res = await axios.get(`${API_URL}/services?provider=${user._id}`);
            setServices(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch services", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMyServices();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await axios.delete(`${API_URL}/services/${id}`);
            toast.success("Service deleted");
            fetchMyServices();
        } catch (error) {
            toast.error("Failed to delete service");
        }
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setSelectedService(null);
        setShowModal(true);
    };

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

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Services</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center"
                >
                    <span className="text-xl mr-2">+</span> Add New Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service._id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden relative group border border-gray-100">
                        <div className="relative h-48">
                            <img
                                src={getCategoryImage(service.category)}
                                alt={service.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="bg-white p-2 rounded-full shadow text-blue-600 hover:bg-blue-50"
                                    title="Edit"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(service._id)}
                                    className="bg-white p-2 rounded-full shadow text-red-600 hover:bg-red-50"
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                            <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                {service.category}
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{service.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{service.description}</p>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Price</span>
                                    <span className="font-bold text-gray-900">₹{service.price}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400">Duration</span>
                                    <span className="font-bold text-gray-900">{service.durationMinutes}m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">You haven't added any services yet.</p>
                    <button onClick={handleAddNew} className="text-purple-600 font-medium hover:underline">Get started by adding one!</button>
                </div>
            )}

            {showModal && (
                <ServiceModal
                    service={selectedService}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchMyServices}
                />
            )}
        </div>
    );
};

export default ProviderServices;

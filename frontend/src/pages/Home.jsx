import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Redirect provider to their dashboard if they land here
    if (user && user.role === 'provider') {
        return <Navigate to="/provider" replace />;
    }

    // Filter states
    const [filters, setFilters] = useState({
        location: '',
        category: '',
        sort: ''
    });

    const categories = ['All', 'Plumbing', 'Cleaning', 'Tutoring', 'Electrician', 'Painter', 'Gardener', 'Other'];

    // Fetch all services on mount
    useEffect(() => {
        fetchServices();
    }, []);

    // Apply filters whenever services or filters change
    useEffect(() => {
        applyFilters();
    }, [services, filters]);

    const fetchServices = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/services');
            setServices(data);
            setFilteredServices(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch services');
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const applyFilters = () => {
        let filtered = [...services];

        // Filter by category
        if (filters.category && filters.category !== 'All') {
            filtered = filtered.filter(service =>
                service.category === filters.category
            );
        }

        // Filter by location (check if location is in provider's serviceLocations)
        if (filters.location) {
            filtered = filtered.filter(service => {
                const serviceLocations = service.providerId?.serviceLocations || [];
                return serviceLocations.includes(filters.location);
            });
        }

        // Apply Sorting
        if (filters.sort) {
            filtered.sort((a, b) => {
                if (filters.sort === 'price_asc') {
                    return a.price - b.price;
                } else if (filters.sort === 'price_desc') {
                    return b.price - a.price;
                }
                return 0;
            });
        }

        setFilteredServices(filtered);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const resetFilters = () => {
        setFilters({
            location: '',
            category: '',
            sort: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Search */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Welcome to LocalVocal
                    </h1>
                    <p className="text-center text-lg mb-8">
                        Find the best local service providers in your area
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-full shadow-2xl p-2 flex flex-col md:flex-row gap-2 items-center">
                            {/* Location */}
                            <div className="flex-1 px-4 py-3 w-full md:w-auto">
                                <label className="text-xs text-gray-500 font-semibold">Where</label>
                                <select
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    className="w-full text-gray-800 outline-none text-sm bg-transparent"
                                >
                                    <option value="">All Locations</option>
                                    <option value="Sanpada">Sanpada</option>
                                    <option value="Vashi">Vashi</option>
                                    <option value="Kalyan">Kalyan</option>
                                    <option value="Buldhana">Buldhana</option>
                                </select>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block h-8 w-px bg-gray-300"></div>

                            {/* Service Category */}
                            <div className="flex-1 px-4 py-3 w-full md:w-auto">
                                <label className="text-xs text-gray-500 font-semibold">What</label>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    className="w-full text-gray-800 outline-none text-sm bg-transparent"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat === 'All' ? '' : cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block h-8 w-px bg-gray-300"></div>

                            {/* Sort By Price */}
                            <div className="flex-1 px-4 py-3 w-full md:w-auto">
                                <label className="text-xs text-gray-500 font-semibold">Price</label>
                                <select
                                    name="sort"
                                    value={filters.sort}
                                    onChange={handleFilterChange}
                                    className="w-full text-gray-800 outline-none text-sm bg-transparent"
                                >
                                    <option value="">Sort by</option>
                                    <option value="price_asc">Low to High</option>
                                    <option value="price_desc">High to Low</option>
                                </select>
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full p-4 hover:from-pink-600 hover:to-red-600 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Reset Button */}
                    {(filters.location || filters.category || filters.sort) && (
                        <div className="text-center mt-4">
                            <button
                                onClick={resetFilters}
                                className="text-white underline hover:text-gray-200"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Services Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {filters.category ? `${filters.category} Services` : 'All Services'}
                    </h2>
                    <p className="text-gray-600">
                        {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading services...</p>
                    </div>
                ) : filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map(service => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">No services found matching your criteria.</p>
                        <button
                            onClick={resetFilters}
                            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Star, Loader, AlertCircle, RefreshCw, Info } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTaxiProducts } from '../store/slices/shopifySlice';

const PopularCars: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, loading, error, initialized } = useAppSelector((state) => state.shopify);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Fetch products on mount
    useEffect(() => {
        if (!initialized) {
            dispatch(fetchTaxiProducts());
        }
    }, [dispatch, initialized]);

    // Helper function to get category text based on car type
    const getCategoryText = (type: string) => {
        const lowerType = type.toLowerCase();

        if (lowerType.includes('4 passenger')) {
            return 'Or a similar vehicle';
        } else if (lowerType.includes('5 passenger')) {
            return 'Or a similar 5-seater vehicle';
        } else if (lowerType.includes('8 passenger')) {
            return 'Or a similar 8-seater minibus';
        } else if (lowerType.includes('16 passenger')) {
            return 'Or a similar 16-seater minibus';
        } else if (lowerType.includes('24 passenger')) {
            return 'Or a similar 24-seater minibus';
        } else if (lowerType.includes('56 passenger')) {
            return 'Or a similar 56-seater coach';
        } else if (lowerType.includes('64 passenger')) {
            return 'Or a similar 64-seater coach';
        } else if (lowerType.includes('72 passenger')) {
            return 'Or a similar 72-seater coach';
        } else {
            return 'Or a similar vehicle';
        }
    };

    // Loading state
    if (loading && !initialized) {
        return (
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader className="h-12 w-12 text-orange-600 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Loading our fleet...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error && !loading) {
        return (
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <p className="text-gray-900 font-semibold mb-2">Failed to load vehicles</p>
                        <p className="text-gray-600 text-sm mb-4">{error}</p>
                        <button
                            onClick={() => dispatch(fetchTaxiProducts())}
                            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Get only popular products or first 6 products
    const displayedProducts = products
        .filter(product => product.popular)
        .slice(0, 25);

    // If no popular products, show first 6
    const carsToShow = displayedProducts.length > 0 ? displayedProducts : products.slice(0, 25);

    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        Popular Services
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Our Fleet
                    </h2>
                    <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
                        Choose from our wide selection of well-maintained vehicles. From economy to luxury, we have the perfect car for your journey.
                    </p>
                </div>

                {/* Cars Grid */}
                {carsToShow.length > 0 ? (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {carsToShow?.sort((a, b) => {
                                // First, sort by passenger count (low to high)
                                if (a.passengers !== b.passengers) {
                                    return a.passengers - b.passengers;
                                }

                                // If both have 16 passengers, prioritize "Minibus" over "Executive"
                                if (a.passengers === 16 && b.passengers === 16) {
                                    const aIsMinibus = a.name.toLowerCase().includes('minibus');
                                    const bIsMinibus = b.name.toLowerCase().includes('minibus');
                                    const aIsExecutive = a.name.toLowerCase().includes('executive');
                                    const bIsExecutive = b.name.toLowerCase().includes('executive');

                                    // Minibus comes before Executive
                                    if (aIsMinibus && bIsExecutive) return -1;
                                    if (aIsExecutive && bIsMinibus) return 1;
                                }

                                // For same passenger count (other than 16), maintain original order
                                return 0;
                            }).map((car) => (
                                <div
                                    key={car?.id}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200 relative"
                                >
                                    {/* Car Image */}
                                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-65">
                                        <img
                                            src={car?.image}
                                            alt={car?.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Badges */}
                                        {car?.popular && (
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                                Popular
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-lg">
                                            {car?.type}
                                        </div>
                                    </div>

                                    {/* Car Details */}
                                    <div className="p-4">
                                        {/* Name & Rating */}
                                        <div className="mb-3">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                                {car?.name}
                                            </h3>
                                            <div
                                                className="mb-3 relative"
                                                onMouseEnter={() => setHoveredCard(car?.id)}
                                                onMouseLeave={() => setHoveredCard(null)}
                                            >
                                                <div className="flex items-center gap-1.5 text-gray-600 cursor-help">
                                                    <Info className="h-3.5 w-3.5 text-gray-500 hover:text-orange-600 transition-colors flex-shrink-0" />
                                                    <span className="text-xs font-medium italic">
                                                        {getCategoryText(car?.type)}
                                                    </span>
                                                </div>

                                                {/* Tooltip */}
                                                {hoveredCard === car?.id && (
                                                    <div className="absolute left-0 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-30 animate-fadeIn">
                                                        <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                                        <p className="leading-relaxed">
                                                            You may not get the same model, but you will always get a car of the same class, size, number of doors, transmission type, and features.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full">
                                                    <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                                                    <span className="text-xs font-bold text-orange-600">
                                                        {car?.rating}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {car?.reviews} reviews
                                                </span>
                                            </div>
                                        </div>

                                        {/* Specifications */}
                                        <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <div className="p-1.5 bg-orange-50 rounded-lg">
                                                        <Users className="h-3.5 w-3.5 text-orange-600" />
                                                    </div>
                                                    <span className="text-xs font-semibold">{car?.passengers} Passengers</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <div className="p-1.5 bg-purple-50 rounded-lg">
                                                        <Briefcase className="h-3.5 w-3.5 text-purple-600" />
                                                    </div>
                                                    <span className="text-xs font-semibold">{car?.luggage} Bags</span>
                                                </div>
                                            </div>

                                            {/* Driver Included Badge */}
                                            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-50 to-amber-80 border-2 border-orange-200 rounded-xl py-2 px-3">
                                                <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="text-xs font-bold text-orange-700">Professional Driver Included</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 rounded-3xl shadow-2xl shadow-orange-500/20"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No vehicles available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularCars;
import React, { useEffect } from 'react';
import { Bus, Users, Shield, Clock, Star, MapPin, TrendingUp, Loader, AlertCircle, RefreshCw, Briefcase } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTaxiProducts } from '../store/slices/shopifySlice';
import { Link } from 'react-router-dom';
import SEOHead from '../Components/SEOHead';

const MinibusHireServices: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, loading, error, initialized } = useAppSelector((state) => state.shopify);

    // Fetch products on mount
    useEffect(() => {
        if (!initialized) {
            dispatch(fetchTaxiProducts());
        }
    }, [dispatch, initialized]);

    // Filter only minibus products (8, 16, 24 passengers)
    const minibusProducts = products
        .filter(product => {
            const passengerCount = product.passengers;
            return passengerCount === 8 || passengerCount === 16 || passengerCount === 24;
        }).sort((a, b) => a.passengers - b.passengers)

    const stats = [
        { icon: Bus, value: '3', label: 'Minibus Sizes', color: 'from-orange-500 to-orange-600' },
        { icon: Users, value: '8-24', label: 'Passengers', color: 'from-orange-500 to-orange-600' },
        { icon: Clock, value: '24/7', label: 'Available', color: 'from-green-500 to-green-600' },
        { icon: Shield, value: '100%', label: 'CRB Checked', color: 'from-purple-500 to-purple-600' }
    ];

    const features = [
        {
            icon: Shield,
            title: 'CRB Checked Drivers',
            description: 'All our minibus drivers are professionally trained, fully licensed, and CRB checked for your complete safety.',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: Users,
            title: 'Perfect Group Size',
            description: 'Ideal for small to medium groups with minibuses accommodating 8, 16, and 24 passengers comfortably.',
            color: 'bg-orange-100 text-orange-600'
        },
        {
            icon: MapPin,
            title: 'UK-Wide Service',
            description: 'Our minibus hire service covers all areas across the UK, from city transfers to countryside journeys.',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: Star,
            title: 'Modern & Comfortable',
            description: 'Well-maintained, late-model minibuses with comfortable seating, climate control, and ample luggage space.',
            color: 'bg-orange-100 text-orange-600'
        }
    ];

    // Loading state
    if (loading && !initialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
                <div className="container mx-auto px-4 py-20">
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="h-16 w-16 text-orange-600 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium text-lg">Loading our minibus fleet...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
                <div className="container mx-auto px-4 py-20">
                    <div className="flex flex-col items-center justify-center py-20">
                        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                        <p className="text-gray-900 font-semibold text-xl mb-2">Failed to load minibuses</p>
                        <p className="text-gray-600 text-sm mb-6">{error}</p>
                        <button
                            onClick={() => dispatch(fetchTaxiProducts())}
                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                        >
                            <RefreshCw className="h-5 w-5" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEOHead
                title="Minibus Hire UK - 8 to 24 Passenger Minibuses"
                description="Affordable minibus hire across the UK for groups of 8 to 24 passengers. CRB checked drivers, modern vehicles, competitive rates. Book your minibus today."
                keywords="minibus hire UK, 8 seater minibus hire, 16 seater minibus, minibus rental London, small group transport UK"
                canonicalUrl="/minibus"
            />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20 md:py-28 overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 animate-fade-in">
                                Minibus Hire Services
                            </h1>
                            <p className="text-xl md:text-2xl text-orange-100 mb-8 animate-fade-in-delay">
                                Comfortable Small to Medium Group Transportation
                            </p>
                            <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto animate-fade-in-delay-2">
                                Professional minibus hire for 8-24 passengers. Perfect for airport transfers, weddings, corporate events, school trips, and day excursions with CRB checked drivers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="container mx-auto px-4 -mt-16 relative z-20 mb-16">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-xl p-6 text-center hover:scale-105 transition-transform duration-300 border border-gray-100"
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-4`}>
                                    <stat.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 mb-2">{stat.value}</h3>
                                <p className="text-gray-600 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>



                {/* Available Minibuses Section */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-16 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Our Minibus Fleet
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                                    Choose from our range of modern, well-maintained minibuses for your group travel
                                </p>
                            </div>

                            {/* Minibus Grid */}
                            {minibusProducts.length > 0 ? (
                                <>
                                    <div className="mb-6 text-center">
                                        <p className="text-gray-600 font-medium">
                                            Showing <span className="text-orange-600 font-bold">{minibusProducts.length}</span> minibus{minibusProducts.length !== 1 ? 'es' : ''}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {minibusProducts.map((minibus) => (
                                            <div
                                                key={minibus.id}
                                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-orange-100 hover:border-orange-300"
                                            >
                                                {/* Minibus Image */}
                                                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-56">
                                                    <img
                                                        src={minibus.image}
                                                        alt={minibus.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />

                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                    {/* Badges */}
                                                    {minibus.popular && (
                                                        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                                            Most Popular
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-lg">
                                                        {minibus.type}
                                                    </div>

                                                    {/* Passenger Count Badge */}
                                                    <div className="absolute bottom-3 left-3 bg-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2">
                                                        <Users className="h-5 w-5" />
                                                        <span className="text-lg">{minibus.passengers} Seater</span>
                                                    </div>
                                                </div>

                                                {/* Minibus Details */}
                                                <div className="p-6">
                                                    {/* Name & Rating */}
                                                    <div className="mb-4">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                                            {minibus.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                                                                <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                                                                <span className="text-sm font-bold text-orange-600">
                                                                    {minibus.rating}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm text-gray-500 font-medium">
                                                                ({minibus.reviews} reviews)
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Specifications */}
                                                    <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <div className="p-2 bg-orange-50 rounded-lg">
                                                                    <Users className="h-5 w-5 text-orange-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500 font-medium">Passengers</p>
                                                                    <p className="text-sm font-bold">{minibus.passengers} People</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <div className="p-2 bg-purple-50 rounded-lg">
                                                                    <Briefcase className="h-5 w-5 text-purple-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500 font-medium">Luggage</p>
                                                                    <p className="text-sm font-bold">{minibus.luggage} Bags</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Link to="/contact"
                                                        className="block w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl text-center"
                                                    >
                                                        Get a Quote
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                                    <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Minibuses Available</h3>
                                    <p className="text-gray-600 mb-6">
                                        Our minibus fleet is currently being updated. Please check back soon.
                                    </p>
                                    <button
                                        onClick={() => dispatch(fetchTaxiProducts())}
                                        className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                        Refresh
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose Our Minibus Hire
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Reliable, comfortable, and affordable minibus hire for all your group travel needs
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                                >
                                    <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.color} rounded-2xl mb-4`}>
                                        <feature.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Why Choose Minibus Section */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    Why Choose Minibus Over Coaches?
                                </h2>
                                <p className="text-lg text-orange-100 max-w-2xl mx-auto">
                                    Minibuses offer the perfect balance of comfort, cost, and convenience for smaller groups
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">Cost Effective</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        More affordable than hiring a full coach for smaller groups, with no compromise on quality or comfort.
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                                        <MapPin className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">More Accessible</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Easier to navigate narrow streets, city centers, and parking areas where larger coaches can't go.
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">Perfect Size</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Ideal for groups of 8-24, providing a more intimate and comfortable journey for everyone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Book Your Minibus?
                            </h2>
                            <p className="text-xl text-orange-100 mb-8">
                                Get a quote for your group travel needs. Reliable service, professional drivers, and competitive rates guaranteed!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">

                                <Link to="/contact"
                                    className="bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                                >
                                    <Bus className="h-5 w-5" />
                                    Get a Quote Now
                                </Link>
                            </div>
                        </div>
                    </div >
                </div >

                <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-delay {
                    0%, 20% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-delay-2 {
                    0%, 40% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }

                .animate-fade-in-delay {
                    animation: fade-in-delay 1.2s ease-out forwards;
                }

                .animate-fade-in-delay-2 {
                    animation: fade-in-delay-2 1.4s ease-out forwards;
                }

                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
            </div >
        </>
    );
};

export default MinibusHireServices;
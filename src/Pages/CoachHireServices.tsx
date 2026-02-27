import React, { useEffect } from 'react';
import { Bus, Users, Shield, Clock, Star, MapPin, Loader, AlertCircle, RefreshCw, Briefcase } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTaxiProducts } from '../store/slices/shopifySlice';
import { Link } from 'react-router-dom';
import SEOHead from '../Components/SEOHead';

const CoachHireServices: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, loading, error, initialized } = useAppSelector((state) => state.shopify);


    // Fetch products on mount
    useEffect(() => {
        if (!initialized) {
            dispatch(fetchTaxiProducts());
        }
    }, [dispatch, initialized]);

    // Filter only coach products (56, 64, 72 passengers)
    const coachProducts = products
        .filter(product => {
            const passengerCount = product.passengers;
            return passengerCount === 35 || passengerCount === 45 || passengerCount === 56 || passengerCount === 64 || passengerCount === 72;
        }).sort((a, b) => a.passengers - b.passengers)

    const stats = [
        { icon: Bus, value: '3', label: 'Coach Sizes', color: 'from-orange-500 to-orange-600' },
        { icon: Users, value: '56-72', label: 'Passengers', color: 'from-orange-500 to-orange-600' },
        { icon: Clock, value: '24/7', label: 'Available', color: 'from-green-500 to-green-600' },
        { icon: Shield, value: '100%', label: 'CRB Checked', color: 'from-purple-500 to-purple-600' }
    ];

    const features = [
        {
            icon: Shield,
            title: 'CRB Checked Drivers',
            description: 'All our coach drivers are professionally trained, fully licensed, and CRB checked for your safety.',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: Users,
            title: 'Large Group Capacity',
            description: 'Perfect for large groups with coaches accommodating 56, 64, and 72 passengers comfortably.',
            color: 'bg-orange-100 text-orange-600'
        },
        {
            icon: MapPin,
            title: 'UK-Wide Coverage',
            description: 'Our coach hire service covers all areas across the UK for any journey, anywhere.',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: Star,
            title: 'Premium Comfort',
            description: 'Modern, well-maintained coaches with comfortable seating, air conditioning, and ample luggage space.',
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
                        <p className="text-gray-600 font-medium text-lg">Loading our coach fleet...</p>
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
                        <p className="text-gray-900 font-semibold text-xl mb-2">Failed to load coaches</p>
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
                title="Coach Hire UK - Large Group Travel from 30 to 72 Passengers"
                description="Premium coach hire across the UK for large groups. CRB checked drivers, modern coaches from 30 to 72 seats. Perfect for corporate events, tours, weddings and more."
                keywords="coach hire UK, large group coach, 72 seater coach hire, corporate coach hire, coach hire London, nationwide coach hire"
                canonicalUrl="/coachhire"
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
                                Coach Hire Services
                            </h1>
                            <p className="text-xl md:text-2xl text-orange-100 mb-8 animate-fade-in-delay">
                                Premium Large Group Transportation Across the UK
                            </p>
                            <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto animate-fade-in-delay-2">
                                Professional coach hire for 56-72 passengers. Perfect for school trips, corporate events, sports teams, weddings, and long-distance travel with CRB checked drivers.
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


                {/* Available Coaches Section */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-16 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Our Coach Fleet
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                                    Choose from our range of modern, comfortable coaches for your group travel needs
                                </p>
                            </div>

                            {/* Coach Grid */}
                            {coachProducts.length > 0 ? (
                                <>
                                    <div className="mb-6 text-center">
                                        <p className="text-gray-600 font-medium">
                                            Showing <span className="text-orange-600 font-bold">{coachProducts.length}</span> coach{coachProducts.length !== 1 ? 'es' : ''}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {coachProducts.map((coach) => (
                                            <div
                                                key={coach.id}
                                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-orange-100 hover:border-orange-300"
                                            >
                                                {/* Coach Image */}
                                                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-56">
                                                    <img
                                                        src={coach.image}
                                                        alt={coach.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />

                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                    {/* Badges */}
                                                    {coach.popular && (
                                                        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                                            Most Popular
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-lg">
                                                        {coach.type}
                                                    </div>

                                                    {/* Passenger Count Badge */}
                                                    <div className="absolute bottom-3 left-3 bg-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2">
                                                        <Users className="h-5 w-5" />
                                                        <span className="text-lg">{coach.passengers} Seater</span>
                                                    </div>
                                                </div>

                                                {/* Coach Details */}
                                                <div className="p-6">
                                                    {/* Name & Rating */}
                                                    <div className="mb-4">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                                            {coach.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                                                                <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                                                                <span className="text-sm font-bold text-orange-600">
                                                                    {coach.rating}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm text-gray-500 font-medium">
                                                                ({coach.reviews} reviews)
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
                                                                    <p className="text-sm font-bold">{coach.passengers} People</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <div className="p-2 bg-purple-50 rounded-lg">
                                                                    <Briefcase className="h-5 w-5 text-purple-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500 font-medium">Luggage</p>
                                                                    <p className="text-sm font-bold">{coach.luggage} Bags</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Get Quote Button */}

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
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Coaches Available</h3>
                                    <p className="text-gray-600 mb-6">
                                        Our coach fleet is currently being updated. Please check back soon.
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
                                Why Choose Our Coach Hire Service
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Professional, safe, and comfortable coach transportation for all your large group needs
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

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Book Your Coach?
                            </h2>
                            <p className="text-xl text-orange-100 mb-8">
                                Get a quote for your large group travel needs. Professional service, competitive rates, and nationwide coverage guaranteed!
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
                    </div>
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

export default CoachHireServices;
import React from 'react';
import { Award, Users, Bus, Clock, Shield, TrendingUp, CheckCircle, Star, Heart, Zap, Target, MapPin } from 'lucide-react';
import Banner from '../assets/Banner6.png';
import { Link } from 'react-router-dom';
import SEOHead from '../Components/SEOHead';

const AboutUs: React.FC = () => {
    const stats = [
        { icon: Users, value: '50K+', label: 'Happy Passengers', color: 'from-orange-500 to-orange-600' },
        { icon: Bus, value: '150+', label: 'Vehicles in Fleet', color: 'from-orange-500 to-orange-600' },
        { icon: Clock, value: '24/7', label: 'Available Service', color: 'from-green-500 to-green-600' },
        { icon: Award, value: '15+', label: 'Years Experience', color: 'from-purple-500 to-purple-600' }
    ];

    const values = [
        {
            icon: Shield,
            title: 'Safety First',
            description: 'All our drivers are CRB checked, fully licensed, and insured. Our vehicles undergo regular safety inspections and maintenance.',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: Heart,
            title: 'Passenger Care',
            description: 'We treat every passenger with respect and care, ensuring comfort throughout your journey with our professional drivers.',
            color: 'bg-red-100 text-red-600'
        },
        {
            icon: Zap,
            title: 'Quick Response',
            description: 'Fast booking, prompt arrival, and efficient service. We value your time with reliable, punctual transportation.',
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            icon: Target,
            title: 'Excellence',
            description: 'We strive for excellence in every journey, from professional chauffeurs to well-maintained minibuses and coaches.',
            color: 'bg-orange-100 text-orange-600'
        },
        {
            icon: MapPin,
            title: 'Nationwide Coverage',
            description: 'Our service covers all areas across the UK, from London attractions to destinations throughout the country.',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: Star,
            title: 'Quality Service',
            description: 'Consistently delivering high-quality minibus and coach hire that exceeds expectations every single time.',
            color: 'bg-orange-100 text-orange-600'
        }
    ];

    const milestones = [
        { year: '2009', title: 'Founded', description: 'Minibus Hire London was established to provide quality minibus and coach hire services across the UK' },
        { year: '2012', title: 'Fleet Expansion', description: 'Expanded our fleet to include vehicles from 8 to 72 passengers to cater for all group sizes' },
        { year: '2016', title: 'Nationwide Service', description: 'Extended our coverage to provide minibus and coach hire services across all UK regions' },
        { year: '2020', title: 'Safety Enhancement', description: 'Implemented enhanced CRB checking and safety protocols for all our professional drivers' },
        { year: '2024', title: 'Market Leader', description: 'Became one of the UK\'s leading minibus and coach hire companies with 50,000+ satisfied passengers' }
    ];

    const features = [
        'CRB Checked Professional Drivers',
        'Vehicles from 8 to 72 Passengers',
        'Airport Transfers',
        'Wedding & Funeral Transport',
        'School Transportation',
        'Sports Events',
        'Corporate Events',
        'Tours & Excursions',
        'Stag & Hen Parties',
        'Staff Transportation',
        'Long Distance Travel',
        'Multiple Payment Options',
        '24/7 Customer Support',
        'Nationwide Coverage',
        'Flexible Booking Options'
    ];

    return (
        <>
            <SEOHead
                title="About Us - Professional Minibus Hire Across the UK"
                description="Learn about Minibus Hire London - our experienced team, CRB checked drivers, and commitment to safe, reliable group transport across the UK since day one."
                keywords="about minibus hire London, professional minibus company UK, CRB checked drivers, reliable coach hire"
                canonicalUrl="/about"
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
                                About Minibus Hire London
                            </h1>
                            <p className="text-xl md:text-2xl text-orange-100 mb-8 animate-fade-in-delay">
                                UK's Leading Minibus and Coach Hire Travel Agency
                            </p>
                            <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto animate-fade-in-delay-2">
                                For over 15 years, we've been providing safe, reliable, and affordable minibus and coach hire services across the UK. From airport transfers to weddings, sports events to school trips - we've got you covered with professional drivers and vehicles from 8 to 72 passengers.
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

                {/* Our Story Section */}
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                    Our Story
                                </h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        Minibus Hire London was founded with a clear mission: to provide quality, affordable minibus and coach hire services that get you where you need to be in comfort and style. Whether it's a Transport to the airport, transportation to a wedding, or a group trip to a sporting event, we've built our reputation on reliability and professionalism.
                                    </p>
                                    <p>
                                        Our experienced drivers are all CRB checked and know London's famous attractions - from the Tower of London to Buckingham Palace - as well as off-the-beaten-path pubs, shows, theaters, and museums. With our insured and bonded drivers who undergo thorough background checks, you get complete peace of mind.
                                    </p>
                                    <p>
                                        Today, we serve over 50,000 passengers annually with a diverse fleet ranging from 8 to 72-seater vehicles. Our late-model, well-maintained fleet ensures the highest safety standards, while our state-of-the-art GPS and communication devices guarantee you arrive on time, every time.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <img
                                            src={Banner}
                                            alt="Minibus Hire London"
                                            className="w-full h-full object-cover rounded-2xl shadow-2xl"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="h-6 w-6 text-green-500" />
                                        <span className="text-2xl font-bold text-gray-900">98%</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Customer Satisfaction Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                                    <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                                        <Target className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        To provide safe, reliable, and affordable minibus and coach hire services across the UK. We take care of all the details so you can relax, sit back, and enjoy your journey with friends and family - because getting there is half the fun!
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                                    <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                                        <MapPin className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        To be the UK's most trusted minibus and coach hire company, recognized for our professional service, well-maintained fleet, and commitment to getting every passenger to their destination safely and on time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Values */}
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose Us
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                The values that make us the UK's leading minibus hire company
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                                >
                                    <div className={`inline-flex items-center justify-center w-14 h-14 ${value.color} rounded-2xl mb-4`}>
                                        <value.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-16 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Our Journey
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Key milestones in our growth story
                                </p>
                            </div>

                            <div className="space-y-8">
                                {milestones.map((milestone, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-6 group"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                                                {milestone.year}
                                            </div>
                                            {index !== milestones.length - 1 && (
                                                <div className="w-0.5 h-full bg-orange-300 mt-2"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 bg-white rounded-2xl p-6 shadow-md group-hover:shadow-xl transition-all border border-orange-200">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {milestone.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* What We Offer */}
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our Services
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Comprehensive minibus and coach hire services for all occasions
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-100"
                                >
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{feature}</span>
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
                                Ready to Travel in Comfort?
                            </h2>
                            <p className="text-xl text-orange-100 mb-8">
                                Don't waste your gas, time, or mileage. Arrive in style with minimal effort - relax, sit back, and enjoy yourself with friends and family!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">

                                <Link to="/"
                                    className="bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                                >
                                    <Bus className="h-5 w-5" />
                                    Book a Transfer Now
                                </Link>

                                <Link to="/contact"
                                    className="bg-orange-800 text-white font-bold py-4 px-8 rounded-xl hover:bg-orange-900 hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2 border-2 border-white/20"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

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
            </div>
        </>
    );
};

export default AboutUs;
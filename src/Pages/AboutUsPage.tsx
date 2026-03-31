import React from 'react';
import { Award, Users, Clock, Shield, TrendingUp, CheckCircle, Star, Heart, Zap, Target, MapPin, Search, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../Components/SEOHead';

const AboutUs: React.FC = () => {
    const stats = [
        { icon: Users, value: '100s', label: 'Operators Listed', color: 'from-blue-700 to-blue-600' },
        { icon: Search, value: 'UK-Wide', label: 'Coverage', color: 'from-blue-700 to-blue-600' },
        { icon: Clock, value: '100%', label: 'Free Service', color: 'from-green-700 to-green-600' },
        { icon: Award, value: '50+', label: 'Years Experience', color: 'from-purple-700 to-purple-600' }
    ];

    const values = [
        {
            icon: Shield,
            title: 'Verified Operators',
            description: 'Every coach and minibus hire company in our network is vetted and verified, so you only receive quotes from reputable, reliable operators.',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: Heart,
            title: 'Customer First',
            description: 'Our entire platform is built around making your experience as simple and stress-free as possible — from posting a job to selecting your operator.',
            color: 'bg-red-100 text-red-600'
        },
        {
            icon: Zap,
            title: 'Quotes in Minutes',
            description: 'No more calling around or waiting for callbacks. Post your journey requirement once and receive competitive quotes from multiple operators within minutes.',
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            icon: Target,
            title: 'Best Value',
            description: 'With hundreds of operators competing for your business, you always get the most competitive prices and the best-reviewed companies in the market.',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: MapPin,
            title: 'Nationwide Coverage',
            description: 'Our operator network covers every UK town and city. Whether you need local or long-distance coach hire, we have a company ready to quote.',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: Star,
            title: 'Rated & Reviewed',
            description: 'Every operator is rated and reviewed by real customers, giving you full confidence to choose the best coach hire company for your journey.',
            color: 'bg-blue-100 text-blue-600'
        }
    ];

    const milestones = [
        { year: '2008', title: 'Founded', description: 'Compare Transport was established with a mission to simplify the process of finding and booking reliable coach hire across the UK.' },
        { year: '2011', title: 'Network Growth', description: 'Expanded our operator network to cover all major UK cities and regions, giving customers access to hundreds of verified companies.' },
        { year: '2015', title: 'Quote Engine Launch', description: 'Launched our online quote engine, allowing customers to post jobs and receive multiple competitive quotes within minutes for free.' },
        { year: '2019', title: 'Reviews System', description: 'Introduced our operator ratings and reviews system, helping customers make informed decisions based on genuine feedback.' },
        { year: '2024', title: 'Market Leader', description: "Became the UK's largest coach hire comparison platform, connecting thousands of customers with hundreds of verified operators nationwide." }
    ];

    const features = [
        '100% Free to Use',
        'Unlimited Quote Requests',
        'Hundreds of Verified Operators',
        'Airport Transfers',
        'Wedding & Funeral Transport',
        'School Trip Coaches',
        'Sports & Corporate Events',
        'Tours & Excursions',
        'Stag & Hen Parties',
        'Long Distance Travel',
        'Nationwide UK Coverage',
        'Real Customer Reviews',
        'Instant Quote Engine',
        '50+ Years Combined Experience',
        'No Hidden Fees'
    ];

    return (
        <>
            <SEOHead
                title="About Us - UK's Largest Coach Hire Comparison Website"
                description="Learn about Compare Transport — the UK's largest and fastest growing coach and minibus hire price comparison website. Free quotes from hundreds of verified operators across the UK."
                keywords="about Compare Transport, UK coach hire comparison, free coach hire quotes, minibus hire comparison"
                canonicalUrl="/about"
            />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">

                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 md:py-28 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 animate-fade-in">
                                About Compare Transport
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in-delay">
                                The UK's Largest Coach & Minibus Hire Price Comparison Website
                            </p>
                            <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto animate-fade-in-delay-2">
                                We work with hundreds of operators across the UK to bring you the best coach hire deals — completely free.
                                With over 50 years of combined industry experience, we make group travel easy, affordable, and stress-free.
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
                                        Compare Transport was built with one goal in mind: to make finding reliable, affordable coach and
                                        minibus hire as simple as possible. We know that organising group travel can be time consuming and
                                        expensive — so we created a platform that does all the hard work for you.
                                    </p>
                                    <p>
                                        We are the UK's only website where filling in a single form connects you to the entire coach hire
                                        market, getting you direct quotes from recommended operators within minutes. Our team brings over
                                        50 years of combined experience in the industry to help you get the right deal every time.
                                    </p>
                                    <p>
                                        Today, hundreds of operators across every UK town and city are part of our network. Whether you
                                        need a minibus for a school trip or a fleet of coaches for a large corporate event, Compare Transport is the fastest and most cost-effective way to book — and it won't cost you a penny.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center p-12">
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                            <Search className="h-12 w-12 text-white" />
                                        </div>
                                        <p className="text-blue-700 font-black text-3xl mb-2">One Form.</p>
                                        <p className="text-blue-600 font-black text-3xl mb-2">Hundreds of Quotes.</p>
                                        <p className="text-blue-700 font-bold text-2xl">100% Free.</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="h-6 w-6 text-green-700" />
                                        <span className="text-2xl font-bold text-gray-900">6 in 10</span>
                                    </div>
                                    <p className="text-sm text-gray-600">People overpay for coach hire — we fix that</p>
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
                                    <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mb-6">
                                        <Target className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        To provide a completely free, fast, and reliable platform that connects customers with the best
                                        coach and minibus hire companies in the UK. We do all the legwork — so you don't have to call
                                        around, send endless emails, or overpay for your group transport.
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                                    <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mb-6">
                                        <MapPin className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        To be the UK's most trusted coach hire comparison platform — recognised for connecting customers
                                        to the best-reviewed operators at the most competitive prices, across every town and city in the country.
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
                                Why Choose Compare Transport?
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                The values and advantages that make us the UK's leading coach hire comparison platform.
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
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-16 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Our Journey
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Key milestones in building the UK's largest coach hire comparison platform
                                </p>
                            </div>
                            <div className="space-y-8">
                                {milestones.map((milestone, index) => (
                                    <div key={index} className="flex gap-6 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform text-sm">
                                                {milestone.year}
                                            </div>
                                            {index !== milestones.length - 1 && (
                                                <div className="w-0.5 h-full bg-blue-300 mt-2"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 bg-white rounded-2xl p-6 shadow-md group-hover:shadow-xl transition-all border border-blue-200">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                                            <p className="text-gray-600">{milestone.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* What We Cover */}
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                What We Cover
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                From small minibuses to large coaches — we connect you with operators for every occasion across the UK.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-100"
                                >
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 text-green-700" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Find the Best Coach Hire Deal?
                            </h2>
                            <p className="text-xl text-blue-100 mb-8">
                                Post your journey requirement for free and let our quote engine connect you with the best
                                coach hire companies in minutes — no calls, no hassle, no cost.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/"
                                    className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                                >
                                    <FileText className="h-5 w-5" />
                                    Post Your Job for Free
                                </Link>
                                <Link
                                    to="/contact"
                                    className="bg-blue-800 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-900 hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2 border-2 border-white/20"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-delay {
                    0%, 20% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-delay-2 {
                    0%, 40% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 1s ease-out forwards; }
                .animate-fade-in-delay { animation: fade-in-delay 1.2s ease-out forwards; }
                .animate-fade-in-delay-2 { animation: fade-in-delay-2 1.4s ease-out forwards; }
                .delay-1000 { animation-delay: 1s; }
            `}</style>
            </div>
        </>
    );
};

export default AboutUs;
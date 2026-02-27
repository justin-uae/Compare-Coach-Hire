import React from 'react';
import { Shield, Users, MapPin, Star, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutService: React.FC = () => {
    const features = [
        {
            icon: <Shield className="h-8 w-8" />,
            title: "Safety First",
            description: "All vehicles purchased from well-known manufacturers with detailed inspections and tracking devices installed",
            color: "from-orange-400 to-orange-500"
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "Professional Chauffeurs",
            description: "Expert knowledge of London, background-checked and efficiently vetted for your safety",
            color: "from-orange-400 to-orange-500"
        },
        {
            icon: <MapPin className="h-8 w-8" />,
            title: "Multiple Stops",
            description: "No hassle, no extra fees. Plan your day visiting multiple attractions with ease",
            color: "from-green-400 to-green-500"
        },
        {
            icon: <Clock className="h-8 w-8" />,
            title: "Flexible Scheduling",
            description: "We'll wait until you're ready with no added fees, unlike other services",
            color: "from-purple-400 to-purple-500"
        }
    ];

    const vehicles = [
        { size: "4-5 Seater", type: "MPV & Mercedes" },
        { size: "8-16 Seater", type: "Minibuses" },
        { size: "56-72 Seater", type: "Coaches" }
    ];

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        About Our Service
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Welcome to Minibus Hire London
                    </h2>
                    <p className="text-gray-300 text-base lg:text-lg max-w-3xl mx-auto">
                        Experience London can be extremely hectic; fighting masses of crowds, over run buses and uncomfortable tube rides.
                        Here at Minibus Hire London we strive to offer the best minibus and coach service within London, making your trip
                        as easy and as comfortable as possible with some great rates.
                    </p>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 lg:p-12 border border-gray-600 mb-12">
                        <p className="text-gray-300 leading-relaxed mb-6">
                            Anyone that has experienced group travel has likely seen that poor planning can lead to a variety of problems,
                            including unnecessary delays and expenses. Therefore, it is extremely important to make proper arrangements before
                            departing on a trip to ensure that everything goes smoothly.
                        </p>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            London Minibus Hire provides a safe and secure dedicated means of transport in extremely comfortable minibuses.
                            We offer a fleet of vehicles in excellent condition with the best prices in London, and we are dedicated to meeting
                            the needs of groups traveling to our wonderful city.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            Whether it's a hen do, a family trip or even a wedding, Minibus Hire London have a minibus or coach to suit your
                            every need. From the time of arrival to departure, we will conveniently transport your group so that they can focus
                            on their time in London without the worries of transportation.
                        </p>
                    </div>

                    {/* Customer Testimonial */}
                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-2xl p-8 border border-orange-500/30 mb-12">
                        <div className="flex items-start gap-4">
                            <Star className="h-8 w-8 text-orange-400 flex-shrink-0 mt-1" fill="currentColor" />
                            <div>
                                <p className="text-gray-200 italic leading-relaxed mb-4">
                                    "What a fantastic service that was provided by Minibus Hire London. They came 15 minutes before departure
                                    and waited till we were all ready to travel. We also would like to thank the driver Dave for not charging
                                    us extra for dropping us off at two locations."
                                </p>
                                <p className="text-orange-400 font-semibold">- Cara Sousa</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="relative group"
                        >
                            <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600 hover:border-orange-500 transition-all duration-300 hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-orange-500/20 h-full">
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fleet Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Our Fleet</h3>
                        <p className="text-gray-300">
                            Offering vehicles that seat between 4 to 72 passengers, there is a vehicle for every occasion
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {vehicles.map((vehicle, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-600 hover:border-orange-500 transition-all duration-300 text-center"
                            >
                                <div className="text-3xl font-bold text-orange-400 mb-2">{vehicle.size}</div>
                                <div className="text-gray-300">{vehicle.type}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Services Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 lg:p-12 border border-gray-600">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Award className="h-8 w-8 text-orange-400" />
                            Our Services Include
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-6 text-gray-300">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-1">•</span>
                                    <span>Airport transfers (Heathrow, Gatwick, Stansted, Luton, City Airport)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-1">•</span>
                                    <span>Weddings and family functions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-1">•</span>
                                    <span>School trips with comfortable coaches</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-1">•</span>
                                    <span>Corporate events and sport team functions</span>
                                </li>
                            </ul>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-1">•</span>
                                    <span>Stag and hen dos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-1">•</span>
                                    <span>Tourist attractions and sightseeing</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-1">•</span>
                                    <span>Self-drive minibus hire options</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-400 mt-1">•</span>
                                    <span>European travel with free tour guides (10+ days)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Vehicle Features */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600">
                        <h3 className="text-xl font-bold text-white mb-6">Vehicle Amenities</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                <span>Front & rear climate control</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                <span>Power outlets</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                <span>WiFi available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                <span>Ample storage space</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                <span>State of the art GPS</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                <span>Reclining seats</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                <span>TV monitors (coaches)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                <span>Toilets (large coaches)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                <span>Tracking devices</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Testimonial */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-2xl p-8 border border-orange-500/30">
                        <div className="flex items-start gap-4">
                            <Star className="h-8 w-8 text-orange-400 flex-shrink-0 mt-1" fill="currentColor" />
                            <div>
                                <p className="text-gray-200 italic leading-relaxed mb-4">
                                    "We would like to thank the team at Minibus Hire London for organising the transport of 200 passengers
                                    from London to Manchester without any problems. Your service was the best I have ever used in the minibus
                                    hire industry and will recommend Minibus Hire London to all my friends and family."
                                </p>
                                <p className="text-orange-400 font-semibold">- David Carter</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Special Offers */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-8 border border-green-500/30">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Award className="h-8 w-8 text-green-400" />
                            Special Offers
                        </h3>
                        <div className="space-y-3 text-gray-200">
                            <p className="flex items-start gap-2">
                                <span className="text-green-400 mt-1 text-xl">✓</span>
                                <span><strong>25% off</strong> standard rates from London to Manchester</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-green-400 mt-1 text-xl">✓</span>
                                <span><strong>20% off</strong> rates from London to Amsterdam minibus hire</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-green-400 mt-1 text-xl">✓</span>
                                <span>Same rates during <strong>quiet and peak season</strong></span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-green-400 mt-1 text-xl">✓</span>
                                <span><strong>Free meals</strong> on all executive coach bookings traveling to Europe</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center mt-16">
                    <div className="inline-block bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Experience the Best of London With Us
                        </h3>
                        <p className="text-gray-300 mb-6 max-w-2xl">
                            Our company has been in the transport field for many years, and our experience has led us to provide
                            the premier minibus hire services in London. Count on London Minibus Hire for the best group transport
                            services in London!
                        </p>
                        <Link to={'/contact'} className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105">
                            Get Your Quote Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutService;
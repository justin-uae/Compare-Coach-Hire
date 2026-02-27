import React from 'react';
import { Shield, Users, Calendar, MapPin, CheckCircle, Award } from 'lucide-react';

const Features: React.FC = () => {
    const features = [
        {
            icon: <Shield className="h-8 w-8" />,
            title: "CRB Checked Drivers",
            description: "All our drivers are fully CRB checked and professionally trained for your complete safety and peace of mind",
            color: "from-orange-400 to-orange-500"
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "6 to 72 Passengers",
            description: "Extensive fleet of minibuses and coaches to accommodate any group size, from small parties to large events",
            color: "from-orange-400 to-orange-500"
        },
        {
            icon: <Calendar className="h-8 w-8" />,
            title: "All Events Catered",
            description: "Airport transfers, sports events, weddings, funerals, school trips, tours and excursions - we cover it all",
            color: "from-green-400 to-green-500"
        },
        {
            icon: <MapPin className="h-8 w-8" />,
            title: "Nationwide Coverage",
            description: "Our service covers all areas across the UK - wherever you need to go, we'll get you there",
            color: "from-purple-400 to-purple-500"
        },
        {
            icon: <CheckCircle className="h-8 w-8" />,
            title: "Affordable Rates",
            description: "Competitive pricing for minibus and coach hire without compromising on quality or service",
            color: "from-red-400 to-red-500"
        },
        {
            icon: <Award className="h-8 w-8" />,
            title: "Professional Service",
            description: "Experienced team dedicated to making your journey comfortable, safe and stress-free every time",
            color: "from-indigo-400 to-indigo-500"
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose Minibus Hire London?
                    </h2>
                    <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
                        Affordable UK minibus and coach hire for all your travel needs. Experience reliable, professional transport for any occasion.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
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
        </section>
    );
};

export default Features;
import React from 'react';
import { Shield, Users, Calendar, MapPin, CheckCircle, Award } from 'lucide-react';

const Features: React.FC = () => {
    const features = [
        {
            icon: <Shield className="h-8 w-8" />,
            title: "100% Free Service",
            description: "Our service costs you nothing. Post unlimited job requests and receive quotes from verified operators completely free of charge.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "Hundreds of Operators",
            description: "Access hundreds of vetted coach and minibus hire companies across the UK, all competing to give you the best deal.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <Calendar className="h-8 w-8" />,
            title: "All Events Catered",
            description: "Airport transfers, sports events, weddings, school trips, corporate travel and more — we connect you with the right operator for any occasion.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <MapPin className="h-8 w-8" />,
            title: "Nationwide Coverage",
            description: "Our network of operators covers every UK town and city. Wherever you need to go, we have a company ready to quote.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <CheckCircle className="h-8 w-8" />,
            title: "Quotes in Minutes",
            description: "No more calling around or waiting for callbacks. Fill in one form and get competitive quotes from multiple companies within minutes.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <Award className="h-8 w-8" />,
            title: "50+ Years Experience",
            description: "Our team brings over 50 years of combined coach and minibus hire industry experience to help you find the right deal every time.",
            color: "from-blue-600 to-blue-500"
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        Why Choose Us
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose Compare Transport?
                    </h2>
                    <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
                        The UK's largest coach and minibus hire comparison platform — saving you time and money on every group journey.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-blue-200"
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
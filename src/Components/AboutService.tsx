import React from 'react';
import { Shield, Users, Search, Clock, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutService: React.FC = () => {
    const features = [
        {
            icon: <Search className="h-8 w-8" />,
            title: "One Form, Many Quotes",
            description: "Fill in one simple form and get direct quotes from recommended coach hire suppliers within minutes.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: "Verified Operators",
            description: "We work with hundreds of vetted coach and minibus hire operators across all UK towns and cities.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "50+ Years Experience",
            description: "Our team has over 50 years combined coach and minibus hire experience to get you the right deal.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <Clock className="h-8 w-8" />,
            title: "Quotes in Seconds",
            description: "No more calling or emailing multiple companies. Post your job and let our quote engine do the work.",
            color: "from-blue-600 to-blue-500"
        }
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
                    <div className="inline-block bg-blue-500/20 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        About Us
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Welcome to Coach Hire Compare
                    </h2>
                    <p className="text-gray-300 text-base lg:text-lg max-w-3xl mx-auto">
                        The UK's largest and fastest growing coach hire and minibus hire price comparison website —
                        connecting you with hundreds of operators to find the best deal for your group travel.
                    </p>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 lg:p-12 border border-gray-600 mb-12">
                        <p className="text-gray-300 leading-relaxed mb-6">
                            We work with hundreds of operators across the UK to bring you the best coach hire deals.
                            With over 50 years of combined coach and minibus hire experience within our organisation,
                            we help you — the end consumer — get the right deals for group travel across all UK towns and cities.
                        </p>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            We are the only website where filling in one form will get you availability across the entire
                            coach hire market, enabling you to receive direct quotes from recommended suppliers within minutes.
                            Best of all, our service is completely free — unlimited requests, no hidden charges, not a penny.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            Finding a reliable, low-cost coach hire company can be very time consuming, and 6 out of 10 people
                            pay more than necessary. We've brought together hundreds of coach and minibus hire companies so you
                            get not just the best price, but the best-reviewed operators in the market.
                        </p>
                    </div>

                    {/* Highlight Box */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-8 border border-blue-500/30 mb-12">
                        <div className="flex items-start gap-4">
                            <CheckCircle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-bold text-xl mb-3">We Do All the Legwork for You</h3>
                                <p className="text-gray-200 leading-relaxed">
                                    No more calling coach companies or sending emails to multiple operators and waiting for callbacks.
                                    Simply post your job using our simple request form and let us do the rest. With just a few details
                                    about your journey, our quote engine finds you low-cost coach hire quotes from reliable companies within seconds.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <div key={index} className="relative group">
                            <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/20 h-full">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-300 leading-relaxed text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Why Use Us */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 lg:p-12 border border-gray-600">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Award className="h-8 w-8 text-blue-600" />
                            Why Use Coach Hire Compare?
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 text-gray-300">
                            {[
                                "100% free, unlimited quote requests",
                                "Hundreds of verified UK operators",
                                "Get quotes in minutes, not days",
                                "Best-reviewed companies in the market",
                                "50+ years of combined industry experience",
                                "All UK towns and cities covered",
                                "No need to call or email multiple companies",
                                "One form connects you to the whole market"
                            ].map((item, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center mt-16">
                    <div className="inline-block bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Ready to Find the Best Coach Hire Deal?
                        </h3>
                        <p className="text-gray-300 mb-6 max-w-2xl">
                            Coach Hire Compare is ready to service you. Fill in our online enquiry form and let
                            our quote engine find the perfect coach hire deal for you — completely free.
                        </p>
                        <Link
                            to={'/contact'}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
                        >
                            Get Your Free Quotes Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutService;
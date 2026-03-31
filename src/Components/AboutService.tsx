import React from 'react';
import { Shield, Search, Clock, Award, CheckCircle, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutService: React.FC = () => {
    const features = [
        {
            icon: <Search className="h-8 w-8" />,
            title: "One Form, Many Quotes",
            description: "Fill in one simple form and instantly receive quotes from multiple coach hire companies — displayed side by side so you can compare at a glance.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <BarChart2 className="h-8 w-8" />,
            title: "Compare & Book in One Place",
            description: "See prices, ratings, vehicle types, and availability from different companies all on one screen. When you find the right match, book instantly through Compare Transport.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: "Verified Operators Only",
            description: "Every company on our platform is vetted. You're always comparing reliable, professional coach and minibus hire operators across the UK.",
            color: "from-blue-600 to-blue-500"
        },
        {
            icon: <Clock className="h-8 w-8" />,
            title: "Quotes in Seconds",
            description: "No more calling or emailing multiple companies and waiting for callbacks. Post your job and our comparison engine does the legwork for you instantly.",
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
                    <div className="inline-block bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        About Us
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Welcome to Compare Transport
                    </h2>
                    <p className="text-gray-300 text-base lg:text-lg max-w-3xl mx-auto">
                        The UK's largest and fastest growing coach hire price comparison platform —
                        letting you compare quotes from hundreds of operators and book the best deal, all in one place.
                    </p>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 lg:p-12 border border-gray-600 mb-12">
                        <p className="text-gray-300 leading-relaxed mb-6">
                            Compare Transport works with hundreds of operators across the UK to bring you the most competitive coach and minibus hire deals available. With over 50 years of combined industry experience within our organisation, we've built a platform that puts the power back in your hands.
                        </p>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            We are the only website where filling in one form gets you live availability and pricing from across the entire coach hire market. Our comparison engine displays quotes from multiple companies side by side — so you can instantly see who offers the best price, the best rating, and the right vehicle for your group. When you've made your choice, you can book directly through Compare Transport in just a few clicks.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            Finding a reliable, low-cost coach hire company used to be time consuming — 6 out of 10 people pay more than they need to. Compare Transport solves that by putting every option in front of you at once, so you always get the best-reviewed operator at the best price, without having to search anywhere else.
                        </p>
                    </div>

                    {/* Highlight Box */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-8 border border-blue-500/30 mb-12">
                        <div className="flex items-start gap-4">
                            <CheckCircle className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-white font-bold text-xl mb-3">Compare Companies, Then Book Instantly</h3>
                                <p className="text-gray-200 leading-relaxed">
                                    Our platform shows you quotes from multiple coach hire companies side by side — prices, vehicle types, passenger capacity, and customer ratings all visible at once. There's no back-and-forth, no waiting for callbacks. Once you spot the right deal, you can confirm your booking directly through Compare Transport in seconds.
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
                            <Award className="h-8 w-8 text-blue-400" />
                            Why Use Compare Transport?
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 text-gray-300">
                            {[
                                "100% free, unlimited quote requests",
                                "Compare multiple companies side by side",
                                "Book directly through our platform",
                                "Hundreds of verified UK operators",
                                "See prices, ratings & vehicles at a glance",
                                "All UK towns and cities covered",
                                "No need to call or email multiple companies",
                                "50+ years of combined industry experience"
                            ].map((item, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
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
                            Ready to Compare & Book Your Coach?
                        </h3>
                        <p className="text-gray-300 mb-6 max-w-2xl">
                            Post your job for free, compare quotes from multiple companies in seconds, and book the best deal — all through Compare Transport. No hidden charges, not a penny.
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
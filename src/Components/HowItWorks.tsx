import React from 'react';
import { FileText, MessageSquare, Star, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
    const steps = [
        {
            number: "01",
            icon: <FileText className="h-8 w-8" />,
            title: "Post Your Job for Free",
            description: "Submit your coach hire requirements at no cost. Tell us your route, dates, and passenger count.",
            color: "from-blue-600 to-blue-500"
        },
        {
            number: "02",
            icon: <MessageSquare className="h-8 w-8" />,
            title: "Get Company Quotes",
            description: "Receive competitive quotes from multiple verified coach hire companies in your area.",
            color: "from-blue-600 to-blue-500"
        },
        {
            number: "03",
            icon: <Star className="h-8 w-8" />,
            title: "Review & Select",
            description: "Compare ratings, reviews, and prices to choose the best coach hire company for your needs.",
            color: "from-blue-600 to-blue-500"
        },
        {
            number: "04",
            icon: <ThumbsUp className="h-8 w-8" />,
            title: "Rate Your Company",
            description: "After your journey, leave a review to help others find the best coach hire companies.",
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
                        Simple Process
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-300 text-base lg:text-lg max-w-2xl mx-auto">
                        Our service is <span className="text-blue-600 font-semibold">100% free</span> for anyone looking for coach hire companies. Get quotes in just 4 easy steps.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    {steps.map((step, index) => (
                        <div key={index} className="relative group">
                            {/* Connecting Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-20 left-[60%] w-full h-0.5 bg-gradient-to-r from-gray-600 to-gray-700 z-0">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-gray-600"></div>
                                </div>
                            )}

                            {/* Step Card */}
                            <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 lg:p-8 border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                                {/* Step Number */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 text-base">
                        Not ready to post a job?{" "}
                        <Link to={'/contact'} className="text-blue-600 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors duration-200">
                            Ask an expert.
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
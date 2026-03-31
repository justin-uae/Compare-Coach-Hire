import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    company: string;
    rating: number;
    comment: string;
}

const Testimonials: React.FC = () => {
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: "LA Travel",
            company: "Coach Hire Operator",
            rating: 5,
            comment: "We have been using Compare Transport for only 3 weeks and we have had an excellent experience so far. We have made over GBP 9000 worth of bookings from clients."
        },
        {
            id: 2,
            name: "Ace Travel",
            company: "Coach Hire Operator",
            rating: 5,
            comment: "I would like to thank the team at Compare Transport for delivering us many new customers for the last few months. Our company now has contracts from 2 schools which have enabled us to get another coach on the road."
        },
        {
            id: 3,
            name: "Swan Travel",
            company: "Coach Hire Operator",
            rating: 5,
            comment: "Brilliant service from Compare Transport from the day we were registered. The team is very professional and are always looking to improve the service they offer us."
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        Testimonials
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        What Our Operators Say
                    </h2>
                    <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
                        Trusted by hundreds of coach hire and minibus hire companies across the UK. Here's what our operators have to say.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 relative group hover:-translate-y-2"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote className="h-16 w-16 text-blue-500" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-blue-400 text-blue-400" />
                                ))}
                            </div>

                            {/* Comment */}
                            <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                                "{testimonial.comment}"
                            </p>

                            {/* User Info */}
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-16 lg:mt-20">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                        <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">100%</div>
                        <p className="text-gray-700 font-semibold">Free Service</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                        <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">UK-Wide</div>
                        <p className="text-gray-700 font-semibold">Coverage</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                        <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">100s</div>
                        <p className="text-gray-700 font-semibold">Operators Listed</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                        <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">50+</div>
                        <p className="text-gray-700 font-semibold">Years Experience</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
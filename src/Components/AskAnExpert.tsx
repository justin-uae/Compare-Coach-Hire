import React, { useState } from 'react';
import { Send, MessageCircle, Mail, ChevronDown, ChevronUp, User, AtSign, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QA {
    id: number;
    question: string;
    answer: string;
    name: string;
    date: string;
}

const AskAnExpert: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        question: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expandedQA, setExpandedQA] = useState<number | null>(1);

    const sampleQAs: QA[] = [
        {
            id: 1,
            question: "How many passengers can a standard coach accommodate?",
            answer: "Standard coaches typically seat between 49 and 57 passengers. We also have options ranging from 16-seater minibuses all the way up to 72-seater double-deckers depending on your group size and requirements.",
            name: "James T.",
            date: "2 weeks ago"
        },
        {
            id: 2,
            question: "Do you provide coach hire for school trips?",
            answer: "Yes, absolutely. All operators in our network that handle school trips use CRB/DBS checked drivers and comply with all relevant safety regulations. Simply post your job and mention it's a school trip so operators can provide appropriate vehicles.",
            name: "Sarah M.",
            date: "1 month ago"
        },
        {
            id: 3,
            question: "How far in advance should I book a coach?",
            answer: "We recommend booking at least 2–4 weeks in advance, especially for peak seasons, weekends, or large events. However, our network of operators is large enough that we can often accommodate last-minute requests too.",
            name: "David R.",
            date: "3 weeks ago"
        }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate email send
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', question: '', message: '' });
    };

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        Expert Advice
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Ask an Expert
                    </h2>
                    <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
                        Have a question about coach or minibus hire? Our experts are here to help. Submit your question and we'll get back to you promptly.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">

                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <MessageCircle className="h-7 w-7 text-white" />
                                    <h3 className="text-xl font-bold text-white">Submit Your Question</h3>
                                </div>
                                <p className="text-blue-100 text-sm mt-1">We'll respond to your question as soon as possible</p>
                            </div>

                            {/* Form Body */}
                            <div className="p-8">
                                {submitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Send className="h-10 w-10 text-green-600" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-900 mb-3">Question Submitted!</h4>
                                        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                                            Thank you for your question. One of our experts will get back to you via email shortly.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30"
                                        >
                                            Ask Another Question
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Full Name <span className="text-blue-600">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <User className="h-5 w-5 text-gray-700" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Your full name"
                                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-700"
                                                    />
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Email Address <span className="text-blue-600">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <AtSign className="h-5 w-5 text-gray-700" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="your@email.com"
                                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Question */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Question <span className="text-blue-600">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <HelpCircle className="h-5 w-5 text-gray-700" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="question"
                                                    value={formData.question}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g. How do I get quotes for a school trip?"
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-700"
                                                />
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Message <span className="text-blue-600">*</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                placeholder="Provide more details about your question..."
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-700 resize-none"
                                            />
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 3 1.343 3 12h1z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-5 w-5" />
                                                    Submit Now
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">

                        {/* Post a Job CTA */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <Send className="h-6 w-6 text-white" />
                            </div>
                            <h4 className="text-white font-bold text-lg mb-2">Find a Coach Company</h4>
                            <p className="text-gray-200 text-sm leading-relaxed mb-5">
                                Post your journey requirement and we will do the rest. Get free quotes from verified operators across the UK.
                            </p>
                            <Link to={'/'} className="block text-center bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30 text-sm">
                                Post Your Job for Free
                            </Link>

                        </div>

                        {/* Contact Us */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                            <h4 className="text-gray-900 font-bold text-lg mb-2">Contact Us</h4>
                            <p className="text-gray-600 text-sm leading-relaxed mb-5">
                                Have a question about Ask An Expert or our service in general? We'd love to hear from you.
                            </p>

                            <a href="/contact"
                                className="block text-center border-2 border-blue-700 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 text-sm"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>

                {/* Q&A Section */}
                <div className="max-w-7xl mx-auto mt-16">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                            Questions & Answers
                        </h3>
                        <p className="text-gray-600">
                            Browse answers to commonly asked questions from our community.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {sampleQAs.map((qa) => (
                            <div
                                key={qa.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition-all duration-200"
                            >
                                <button
                                    onClick={() => setExpandedQA(expandedQA === qa.id ? null : qa.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-9 h-9 bg-gradient-to-br from-blue-700 to-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                            <HelpCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{qa.question}</p>
                                            <p className="text-xs text-gray-700 mt-1">Asked by {qa.name} · {qa.date}</p>
                                        </div>
                                    </div>
                                    {expandedQA === qa.id
                                        ? <ChevronUp className="h-5 w-5 text-blue-700 shrink-0" />
                                        : <ChevronDown className="h-5 w-5 text-gray-700 shrink-0" />
                                    }
                                </button>

                                {expandedQA === qa.id && (
                                    <div className="px-6 pb-6">
                                        <div className="ml-13 pl-13 border-l-2 border-blue-200 ml-[52px] pl-4">
                                            <p className="text-gray-600 leading-relaxed">{qa.answer}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div >
        </section >
    );
};

export default AskAnExpert;
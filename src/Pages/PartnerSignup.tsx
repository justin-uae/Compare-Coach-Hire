import React, { useState, useRef } from 'react';
import { Send, CheckCircle, AlertCircle, ArrowRight, FileText, Phone, Handshake } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import SEOHead from '../Components/SEOHead';

//  How it works steps 

const STEPS = [
    {
        icon: <FileText className="w-5 h-5" />,
        title: 'Fill this form',
        desc: 'Share your company name, contact details, and a brief about your fleet.',
    },
    {
        icon: <Phone className="w-5 h-5" />,
        title: 'We get in touch',
        desc: 'Our partnerships team will call or email you within 2 business days.',
    },
    {
        icon: <Handshake className="w-5 h-5" />,
        title: 'Start earning',
        desc: 'Get listed, receive bookings, and grow your business with us.',
    },
];

//  Component 

const PartnerSignup: React.FC = () => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [responseMessage, setResponseMessage] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const appURL = import.meta.env.VITE_APP_URL;
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    const [form, setForm] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        fleetSize: '',
        message: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.companyName.trim()) e.companyName = 'Required';
        if (!form.contactName.trim()) e.contactName = 'Required';
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
        if (!form.phone.trim()) e.phone = 'Required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const token = recaptchaRef.current?.getValue();
        if (!token) {
            setStatus('error');
            setResponseMessage('Please complete the reCAPTCHA.');
            return;
        }

        setStatus('loading');

        try {
            const res = await fetch(`${appURL}/api/partner-signup.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: 'Company Partner Sign-Up Application',
                    type: 'partner_signup',
                    recaptchaToken: token,
                    ...form,
                }),
            });

            const result = await res.json();

            if (result.success) {
                setStatus('success');
                setResponseMessage(
                    result.message || "Application received! We'll be in touch within 2 business days.",
                );
            } else {
                setStatus('error');
                setResponseMessage(result.message || 'Something went wrong. Please try again.');
                recaptchaRef.current?.reset();
            }
        } catch {
            setStatus('error');
            setResponseMessage('Network error. Please try again.');
            recaptchaRef.current?.reset();
        }
    };

    const inputBase = (err?: string) =>
        `w-full px-4 py-3 text-sm border-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 ${err
            ? 'border-red-300 focus:ring-red-300 focus:border-red-400'
            : 'border-blue-200 focus:ring-blue-300 focus:border-blue-400'
        }`;

    //  Success 

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 pt-16 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-blue-100 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">You're on the list!</h2>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">{responseMessage}</p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all text-sm"
                    >
                        Back to Home <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        );
    }

    //  Main 

    return (
        <>
            <SEOHead
                title="Partner With Us - Compare Transport"
                description="Join the Compare Transport network. Register your transport company and start receiving bookings from thousands of customers across the UK."
                keywords="coach hire partner, minibus company sign up, transport operator UK"
                canonicalUrl="/partner-signup"
            />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 pt-16">

                {/* Hero */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 md:py-20">
                    <div className="container mx-auto px-4 text-center max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30 text-sm font-bold uppercase tracking-wider">
                            Become a Partner
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                            Grow your business<br />with Compare Transport
                        </h1>
                        <p className="text-blue-100 text-lg font-medium">
                            Join our network of transport companies and reach thousands of customers.
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">

                    {/* How it works */}
                    <div className="mb-12">
                        <p className="text-xs font-black uppercase tracking-widest text-blue-600 text-center mb-8">
                            How it works
                        </p>
                        <div className="relative">
                            {/* Connecting line desktop only */}
                            <div className="hidden sm:block absolute top-7 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-blue-200" />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {STEPS.map((step, i) => (
                                    <div key={i} className="flex flex-col items-center text-center">
                                        <div className="w-14 h-14 bg-white border-2 border-blue-200 rounded-2xl flex items-center justify-center text-blue-600 shadow-md mb-4 relative z-10">
                                            {step.icon}
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">
                                            Step {i + 1}
                                        </div>
                                        <h3 className="font-black text-gray-900 text-sm mb-1">{step.title}</h3>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border-2 border-blue-100">
                        <h2 className="text-xl font-black text-gray-900 mb-1">Tell us about your company</h2>
                        <p className="text-sm text-gray-500 font-medium mb-8">
                            Just the basics, we'll handle the rest on our call.
                        </p>

                        {status === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm font-bold">{responseMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">

                            {/* Row 1 */}
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                                        Company Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text" name="companyName" value={form.companyName}
                                        onChange={handleChange} placeholder="ABC Coaches Ltd"
                                        className={inputBase(errors.companyName)}
                                    />
                                    {errors.companyName && (
                                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.companyName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                                        Your Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text" name="contactName" value={form.contactName}
                                        onChange={handleChange} placeholder="Jane Smith"
                                        className={inputBase(errors.contactName)}
                                    />
                                    {errors.contactName && (
                                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.contactName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email" name="email" value={form.email}
                                        onChange={handleChange} placeholder="jane@company.co.uk"
                                        className={inputBase(errors.email)}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                                        Phone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel" name="phone" value={form.phone}
                                        onChange={handleChange} placeholder="+44 7700 900000"
                                        className={inputBase(errors.phone)}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Fleet size */}
                            <div>
                                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                                    Fleet Size
                                </label>
                                <select
                                    name="fleetSize" value={form.fleetSize}
                                    onChange={handleChange}
                                    className={inputBase()}
                                >
                                    <option value="">How many vehicles do you operate?</option>
                                    <option>1–5 vehicles</option>
                                    <option>6–15 vehicles</option>
                                    <option>16–30 vehicles</option>
                                    <option>31–50 vehicles</option>
                                    <option>50+ vehicles</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                                    Tell us more?{' '}
                                    <span className="text-gray-400 font-medium normal-case">(optional)</span>
                                </label>
                                <textarea
                                    name="message" value={form.message}
                                    onChange={handleChange} rows={3}
                                    placeholder="Types of vehicles, operating regions, specialisations..."
                                    className={inputBase()}
                                />
                            </div>

                            {/* reCAPTCHA */}
                            {recaptchaSiteKey && (
                                <div className="flex justify-center pt-1">
                                    <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaSiteKey} theme="light" />
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg hover:shadow-blue-200 hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Application
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400 font-medium">
                                No commitment. We'll reach out within 2 business days.
                            </p>
                        </form>
                    </div>

                    {/* Bottom note */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Already a partner?{' '}
                            <a href="/contact" className="text-blue-600 font-bold hover:underline">
                                Contact us directly
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerSignup;
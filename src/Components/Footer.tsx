import React from 'react';
import { Mail, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
// import Logo from '../assets/Logo.png'

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Post a Job', href: '/' },
        { name: 'Vehicles', href: '/vehicles' },
        { name: 'Ask an Expert', href: '/askanexpert' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
    ];

    const legalLinks = [
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
    ];

    const appURL = import.meta.env.VITE_APP_URL;

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-10 relative overflow-hidden">
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(249, 115, 22, 0.1) 20px, rgba(249, 115, 22, 0.1) 40px),
                              repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(249, 115, 22, 0.1) 20px, rgba(249, 115, 22, 0.1) 40px)`
                }}></div>
            </div>

            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">

                    {/* Company Info */}
                    <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-auto">
                        {/* Logo/Brand */}
                        <Link to="/" className="flex items-center gap-3 group">
                            {/* <img
                                src={Logo}
                                loading='lazy'
                                alt="Coach Hire Compare Logo"
                                className="h-16 sm:h-16 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105"
                            /> */}
                            <h1 className="text-lg sm:text-xl font-bold text-white">
                                Coach Hire<span className="text-blue-600"> Compare</span>
                            </h1>
                        </Link>

                        {/* Tagline */}
                        <p className="text-xs text-gray-600 leading-relaxed max-w-xs text-center md:text-left">
                            The UK's largest coach and minibus hire price comparison website.
                            Free quotes from hundreds of verified operators nationwide.
                        </p>

                        {/* Contact Info */}
                        <div className="flex flex-col items-start gap-3 mt-2">
                            <div className="flex items-center gap-2 group">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm text-left font-medium">
                                    Parkshot House, 5 Kew Rd, Richmond TW9 2PR, UK
                                </span>
                            </div>
                            <div className="flex items-center gap-2 group">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                                    <Mail className="w-4 h-4 text-white" />
                                </div>

                                <a href="mailto:info@coachhirecompare.co.uk"
                                    className="text-sm hover:text-blue-600 transition-colors font-medium"
                                >
                                    info@coachhirecompare.co.uk
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                        <div>
                            <h3 className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-3 text-center md:text-right">
                                Quick Links
                            </h3>
                            <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6">
                                {quickLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className="text-sm font-bold hover:text-blue-600 transition-colors relative group"
                                    >
                                        {link.name}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div className="mt-2">
                            <h3 className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-3 text-center md:text-right">
                                Legal
                            </h3>
                            <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6">
                                {legalLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className="text-sm font-bold hover:text-blue-600 transition-colors relative group"
                                    >
                                        {link.name}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Free Service Badge */}
                        <div className="text-center md:text-right max-w-md mt-4">
                            <div className="flex items-center justify-center md:justify-end gap-2 mb-2">
                                <Search className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-bold text-blue-600">100% Free Service</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Post your job for free and receive competitive quotes from hundreds of verified UK coach hire operators — no fees, no commitment.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-4 my-8">
                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-blue-500/50"></div>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="w-24 h-0.5 bg-gradient-to-l from-transparent to-blue-500/50"></div>
                </div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-sm text-gray-600 font-medium">
                        © {currentYear}{' '}

                        <a href={appURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-300 font-bold transition-colors"
                        >
                            Coach Hire Compare
                        </a>
                        {' '}• All rights reserved
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <Search className="w-4 h-4 text-blue-500" />
                        <p className="text-xs text-gray-500">
                            UK's Largest Coach Hire Comparison Website • Free Quotes • Verified Operators
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom decorative border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </footer>
    );
};

export default Footer;
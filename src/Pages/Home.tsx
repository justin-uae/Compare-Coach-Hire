import React from 'react';
import Features from '../Components/Features';
import PopularCars from '../Components/PopularCars';
import HowItWorks from '../Components/HowItWorks';
import Testimonials from '../Components/Testimonials';
import Homepage from '../Components/HomePage';
import AboutService from '../Components/AboutService';
import SEOHead from '../Components/SEOHead';

const CompletePage: React.FC = () => {
    return (
        <div className="min-h-screen">
            <SEOHead
                description="Professional minibus and coach hire across the UK. CRB checked drivers, vehicles from 8-72 passengers. Airport transfers, weddings, school trips & more."
                keywords="minibus hire London, coach hire UK, minibus rental, airport transfers"
                canonicalUrl="/"
            />
            {/* Hero Section with Booking Form */}
            <Homepage />

            {/* Popular Cars Section */}
            <PopularCars />
            
            {/* Features Section */}
            <Features />

            {/* How It Works Section */}
            <HowItWorks />
            {/* Testimonials Section */}
            <Testimonials />
            <AboutService />

            {/* Footer */}
        </div>
    );
};

export default CompletePage;
import React from 'react';
import { FileText, CheckCircle, CreditCard, Ban, Clock, AlertCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../Components/SEOHead';

interface PolicySection {
    id: string;
    title: string;
    content: string[];
    icon: React.ReactNode;
}

const TermsAndConditions: React.FC = () => {
    const termsData: PolicySection[] = [
        {
            id: 'payment',
            title: 'Payment Terms',
            icon: <CreditCard className="h-6 w-6" />,
            content: [
                'Option 1 - Deposit via card at the time of booking + outstanding balance cash to the driver',
                'Option 2 - Deposit via card at the time of booking + outstanding balance via card prior to travel. A second card transaction is subject to an admin fee of £20 or 5% whichever is greater',
                'Option 3 - Full payment via card (max card limit is £500)',
                'Option 4 - Full payment via BACS / CHAPS / Bank Transfer',
                'We cannot make any booking until we have received the minimum deposit. The latest the balance can be settled by is cash on the day to the driver.'
            ]
        },
        {
            id: 'amendments',
            title: 'Amendments',
            icon: <FileText className="h-6 w-6" />,
            content: [
                'We will try to do our best to make any amendments that you request but we cannot guarantee all amendments will be achievable.',
                'Amendments must NEVER be made direct with a driver as drivers do not have access to make changes on the system.',
                'All amendments need to be emailed to us and allowed 24 hours to process your request.',
                'We cannot make amendments less than 24 hours prior to travel as the driver schedule will have already been done.',
                'Simple amendments that don\'t affect anything with drivers or other bookings are done free of charge. Some amendments such as time changes may affect drivers legal hours so should your amendment require a driver change then a charge will be added which will be confirmed to you before making the change.'
            ]
        },
        {
            id: 'cancellation',
            title: 'Cancellation & Refund Policy',
            icon: <Ban className="h-6 w-6" />,
            content: [
                'All cancellations need to be emailed in writing.',
                'All deposits are non-refundable for cancellations made by the customer.',
                'If you have paid the full balance we will refund the amount minus the minimum deposit.',
                'Cancellations made less than 5 days prior to travel are liable to pay the full balance.',
                'We are always happy to transfer your deposit amount onto another booking in the future.',
                'If we have to cancel a booking a full refund will be given.',
                'All our payments / refunds are done every Friday.'
            ]
        },
        {
            id: 'delays',
            title: 'Delays to Service',
            icon: <Clock className="h-6 w-6" />,
            content: [
                'No responsibility or liability whatsoever can be accepted by UK Minibus Hire for traffic congestion, road accidents, adverse weather conditions or other matters outside its reasonable control which may cause delay.',
                'If any driver is delayed by more than 60 minutes and we are unable to replace a delayed coach within 1 hour and 30 minutes from the pick up time and the client chooses to make their own alternative travel arrangements they may be entitled to a refund of the deposit paid to UK Minibus Hire only.',
                'If for any reason the driver has to re-route the journey due to traffic, adverse weather conditions or any unforeseen reasons and cannot get the passengers to the destination on time, neither the driver or we will be held liable for any loss incurred for missed flights, paying extra for alternative transport, missed events or lateness to meetings etc.',
                'Also if the vehicle allocated to the journey has a mechanical issue prior to the journey or on the journey and we cannot find an alternative vehicle, we will not be held liable for any loss incurred and will not pay out any compensation under any circumstance.'
            ]
        },
        {
            id: 'additional',
            title: 'Additional Services & Pickups',
            icon: <AlertCircle className="h-6 w-6" />,
            content: [
                'Each booking includes one pick up and one drop off only (unless quoted otherwise).',
                'Any additional pick ups or drop offs start from £5 each based on being local / on route.',
                'Unbooked waiting time is charged at £50 per hour.',
                'For a more specific quote of the additional amount please provide all postcodes so we can accurately inform you of the cost.',
                'If additional drops are decided on the day whilst travelling, the driver has the right to refuse and only to complete the booked itinerary.'
            ]
        },
        {
            id: 'alcohol',
            title: 'Alcohol, Food & Drink',
            icon: <AlertCircle className="h-6 w-6" />,
            content: [
                'We allow eating and drinking on board. Alcohol must be agreed PRIOR to travelling.',
                'Any spillages, vomiting or urinating are charged at £50.',
                'Vandalism is charged at the cost of repair.',
                'Alcohol is only permitted within moderation. If at any point the driver is distracted or feeling uncomfortable / threatened then he has the right to terminate the transport.',
                'Think ahead and bring a bin liner for your waste. Your driver will be more than happy to dispose of the bin liner for you at no charge at all.',
                'Should there be litter all around the bus this will result in a £20 cleaning fee.'
            ]
        },
        {
            id: 'damages',
            title: 'Damages & Spillage',
            icon: <AlertCircle className="h-6 w-6" />,
            content: [
                'Any damage/spillage caused by the passengers will be charged accordingly by the driver at a minimum rate of £25.',
                'This includes soft drinks, water, wine, spirits or any form of liquid.',
                'Any fines for misuse, damage or spillages have to be paid in cash to the driver.',
                'Drinking is not permitted unless it has been agreed prior to booking.',
                'It MAY be allowed at drivers discretion but only if driver has agreed for passengers to do so.'
            ]
        },
        {
            id: 'pets',
            title: 'Dogs & Pets',
            icon: <AlertCircle className="h-6 w-6" />,
            content: [
                'Guide dogs are permitted.',
                'Other than guide dogs only 2 dogs are allowed on board with the condition that they are well behaved.',
                'Any dog fouling is charged at £50.',
                'Please ensure your pet is properly controlled throughout the journey.'
            ]
        },
        {
            id: 'children',
            title: 'Children & Babies',
            icon: <AlertCircle className="h-6 w-6" />,
            content: [
                'Everybody regardless of age is classed as a passenger and needs a seat of their own.',
                'We can sometimes provide the correct child seat if available for £5 each use.',
                'Most customers tend to use their own child seats and we label it in our storage room ready for your return journey.',
                'We will NEVER use your child seats for anyone else\'s transfer.'
            ]
        },
        {
            id: 'complaints',
            title: 'Complaints',
            icon: <FileText className="h-6 w-6" />,
            content: [
                'We go above and beyond to make sure all our passengers are happy so receiving a complaint is heartbreaking.',
                'If you do have a complaint please email your full detailed complaint with your booking reference number.',
                'Allow 3 working days for your complaint to be dealt with & resolved.',
                'We take all feedback seriously and will work to resolve any issues promptly.'
            ]
        }
    ];

    return (
        <>
            <SEOHead
                title="Terms & Conditions - Minibus Hire London"
                description="Read the terms and conditions for booking minibus and coach hire services with Minibus Hire London. Understand our booking policy, cancellations and passenger guidelines."
                keywords="minibus hire terms and conditions, booking policy, coach hire cancellation policy"
                canonicalUrl="/terms"
                noIndex={false}
            />
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12 lg:mb-16">
                        <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Legal Information
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Booking Terms & Conditions
                        </h2>
                        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
                            All bookings are made subject to UK Minibus Hire terms below and the specific booking conditions of your relevant Travel Supplier.
                            It is your responsibility to ensure that you have read, understood and agree both prior to booking.
                        </p>
                    </div>

                    {/* Policy Sections Grid */}
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {termsData.map((section) => (
                            <div
                                key={section.id}
                                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
                            >
                                {/* Section Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                        {section.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                                            {section.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Section Content */}
                                <ul className="space-y-3">
                                    {section.content.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 text-sm lg:text-base leading-relaxed">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="mt-16 lg:mt-20 text-center">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 lg:p-12 max-w-3xl mx-auto border-2 border-orange-200">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-6">
                                <Phone className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                Questions About Our Terms?
                            </h3>
                            <p className="text-gray-700 text-base lg:text-lg mb-6">
                                If you have any questions about our Terms & Conditions, please don't hesitate to contact us.
                                We're here to help and ensure you have a clear understanding of our policies.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Contact Us Today
                            </Link>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-gray-500">
                            Last Updated: January 2025
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TermsAndConditions;
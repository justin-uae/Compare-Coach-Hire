import React from 'react';
import { Shield, FileText, CheckCircle, AlertCircle, Globe, Lock, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../Components/SEOHead';

interface PolicySection {
    id: string;
    title: string;
    content: string[];
    icon: React.ReactNode;
}

const PrivacyPolicy: React.FC = () => {
    const privacyData: PolicySection[] = [
        {
            id: 'collection',
            title: 'Personal Information We Collect',
            icon: <FileText className="h-6 w-6" />,
            content: [
                'Your email address',
                'Your first name and last name',
                'Your telephone number',
                'Your flight number (when applicable)',
                'Your passenger information',
                'Date and time of travel',
                'Your address including the first line and postcode'
            ]
        },
        {
            id: 'usage-data',
            title: 'Usage Data Collection',
            icon: <Globe className="h-6 w-6" />,
            content: [
                'We may collect information on how the Service is accessed and used ("Usage Data").',
                'This Usage Data may include information such as your computer\'s Internet Protocol address (e.g. IP address).',
                'Browser type, browser version, the pages of our Service that you visit.',
                'The time and date of your visit, the time spent on those pages.',
                'Unique device identifiers and other diagnostic data.'
            ]
        },
        {
            id: 'cookies',
            title: 'Cookies & Tracking Technologies',
            icon: <AlertCircle className="h-6 w-6" />,
            content: [
                'We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.',
                'Session Cookies - We use Session Cookies to operate our Service.',
                'Preference Cookies - We use Preference Cookies to remember your preferences and various settings.',
                'Security Cookies - We use Security Cookies for security purposes.',
                'You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.'
            ]
        },
        {
            id: 'data-use',
            title: 'How We Use Your Data',
            icon: <CheckCircle className="h-6 w-6" />,
            content: [
                'To provide and maintain the Service',
                'To notify you about changes to our Service',
                'To allow you to participate in interactive features of our Service when you choose to do so',
                'To provide customer care and support',
                'To provide analysis or valuable information so that we can improve the Service',
                'To monitor the usage of the Service',
                'To detect, prevent and address technical issues'
            ]
        },
        {
            id: 'transfer',
            title: 'Transfer of Data',
            icon: <Globe className="h-6 w-6" />,
            content: [
                'Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction.',
                'If you are located outside United Kingdom and choose to provide information to us, please note that we transfer the data, including Personal Data, to United Kingdom and process it there.',
                'Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.',
                'Minibus Hire London will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.'
            ]
        },
        {
            id: 'security',
            title: 'Data Security',
            icon: <Shield className="h-6 w-6" />,
            content: [
                'The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.',
                'While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.',
                'We take all steps reasonably necessary to ensure that your data is treated securely.',
                'No transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.'
            ]
        },
        {
            id: 'disclosure',
            title: 'Disclosure of Data',
            icon: <Lock className="h-6 w-6" />,
            content: [
                'Minibus Hire London may disclose your Personal Data in the good faith belief that such action is necessary to comply with a legal obligation.',
                'To protect and defend the rights or property of Minibus Hire London.',
                'To prevent or investigate possible wrongdoing in connection with the Service.',
                'To protect the personal safety of users of the Service or the public.',
                'To protect against legal liability.'
            ]
        },
        {
            id: 'service-providers',
            title: 'Service Providers & Analytics',
            icon: <Globe className="h-6 w-6" />,
            content: [
                'We may employ third party companies and individuals to facilitate our Service ("Service Providers").',
                'These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.',
                'We use Google Analytics - a web analytics service offered by Google that tracks and reports website traffic.',
                'You can opt-out of having made your activity on the Service available to Google Analytics by installing the Google Analytics opt-out browser add-on.',
                'For more information on the privacy practices of Google, please visit: https://policies.google.com/privacy?hl=en'
            ]
        },
        {
            id: 'links',
            title: 'Links to Other Sites',
            icon: <Globe className="h-6 w-6" />,
            content: [
                'Our Service may contain links to other sites that are not operated by us.',
                'If you click on a third party link, you will be directed to that third party\'s site.',
                'We strongly advise you to review the Privacy Policy of every site you visit.',
                'We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.'
            ]
        },
        {
            id: 'children',
            title: 'Children\'s Privacy',
            icon: <Shield className="h-6 w-6" />,
            content: [
                'Our Service does not address anyone under the age of 18 ("Children").',
                'We do not knowingly collect personally identifiable information from anyone under the age of 18.',
                'If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.',
                'If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.'
            ]
        },
        {
            id: 'changes',
            title: 'Changes to This Privacy Policy',
            icon: <FileText className="h-6 w-6" />,
            content: [
                'We may update our Privacy Policy from time to time.',
                'You are advised to review this Privacy Policy periodically for any changes.',
                'Changes to this Privacy Policy are effective when they are posted on this page.',
                'We will notify you of any significant changes via email or a prominent notice on our Service.'
            ]
        }
    ];

    return (
        <>
            <SEOHead
                title="Privacy Policy - Minibus Hire London"
                description="Read our privacy policy to understand how Minibus Hire London collects, uses and protects your personal data in compliance with UK GDPR regulations."
                keywords="privacy policy minibus hire, data protection, GDPR compliance, personal data policy"
                canonicalUrl="/privacy"
                noIndex={false}
            />
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12 lg:mb-16">
                        <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Your Privacy Matters
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Privacy Policy
                        </h2>
                        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
                            Minibus Hire London ("us", "we", or "our") operates the https://www.minibushirelondon.org website (the "Service").
                            This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.
                        </p>
                    </div>

                    {/* Important Notice */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 lg:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Your Data Protection
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        The data we receive from you is used to improve the website experience for yourself and new users who may visit or make an enquiry on our website.
                                        You agree to the collection and use of information in relation to this privacy policy by using our service.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Policy Sections Grid */}
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {privacyData.map((section) => (
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
                                Questions About Your Privacy?
                            </h3>
                            <p className="text-gray-700 text-base lg:text-lg mb-6">
                                If you have any questions about this Privacy Policy, please don't hesitate to contact us.
                                Your privacy and data security are our top priorities.
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
                            Last Updated: 15th July 2020
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PrivacyPolicy;
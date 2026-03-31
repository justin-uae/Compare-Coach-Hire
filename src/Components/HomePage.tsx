import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Navigation, Clock, Users, ArrowRightLeft, Locate, Car, History, User, Mail, Phone, ChevronRight, ChevronLeft, ChevronUp } from 'lucide-react';
import Banner5 from '../assets/Banner3.png';
import { companies, countryDialCodes, formatDate, formatDateWithOrdinal, formatTime12Hour, generateCalendar, generateTimeSlots, isDateWithin12Hours, isPastDate, isTimeAtLeast12HoursFromNow, updateSelectedTimeToValid } from '../utils/common';

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

interface PlaceDetails {
    address: string;
    lat: number;
    lng: number;
}

type TripType = 'one-way' | 'return';
type ServiceType = 'transfers' | 'daily-rental';
type RentalPeriod = 'half-day' | number; // 'half-day' = 5hrs, number = full days (10hrs each)

const HALF_DAY_HOURS = 5;
const FULL_DAY_HOURS = 10;

const getRentalHoursFromPeriod = (period: RentalPeriod): number => {
    if (period === 'half-day') return HALF_DAY_HOURS;
    return (period as number) * FULL_DAY_HOURS;
};

const getRentalPeriodLabel = (period: RentalPeriod): string => {
    if (period === 'half-day') return 'Half Day (5 hrs)';
    const days = period as number;
    return days === 1 ? '1 Day (10 hrs)' : `${days} Days (${days * FULL_DAY_HOURS} hrs)`;
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const [showAll, setShowAll] = useState(false);

    const visible = showAll ? companies : companies.slice(0, 4);
    const remaining = companies.length - 4;

    // Form Step State
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    // Service Type State
    const [serviceType, setServiceType] = useState<ServiceType>('transfers');

    // Contact Information States
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [selectedDialCode, setSelectedDialCode] = useState('+44');
    const [showDialCodes, setShowDialCodes] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    // Common States
    const [pickupLocation, setPickupLocation] = useState('');
    const [pickupDetails, setPickupDetails] = useState<PlaceDetails | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const now = new Date();
        now.setHours(now.getHours() + 12);
        return now;
    });
    const [selectedTime, setSelectedTime] = useState(() => {
        const now = new Date();
        now.setHours(now.getHours() + 12);
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = '00';
        return `${hours}:${minutes}`;
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [numberOfPersons, setNumberOfPersons] = useState(1);
    const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState<{
        pickup: boolean;
        dropoff: boolean;
    }>({ pickup: false, dropoff: false });

    // Transfer-specific States
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [dropoffDetails, setDropoffDetails] = useState<PlaceDetails | null>(null);
    const [tripType, setTripType] = useState<TripType>('one-way');
    const [returnDate, setReturnDate] = useState<Date>(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(tomorrow.getHours() + 12);
        return tomorrow;
    });
    const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
    const [currentReturnMonth, setCurrentReturnMonth] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    });
    const [distance, setDistance] = useState<number | null>(null);
    const [duration, setDuration] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [returnTime, setReturnTime] = useState(() => {
        const now = new Date();
        now.setHours(now.getHours() + 12);
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = '00';
        return `${hours}:${minutes}`;
    });

    // Daily Rental specific States
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(1);

    // Refs for Google Places Autocomplete
    const pickupInputRef = useRef<HTMLInputElement>(null);
    const dropoffInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const pickupAutocompleteRef = useRef<any>(null);
    const dropoffAutocompleteRef = useRef<any>(null);

    // Get current location using Geolocation API
    const getCurrentLocation = (type: 'pickup' | 'dropoff') => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsGettingCurrentLocation(prev => ({ ...prev, [type]: true }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}`
                    );

                    const data = await response.json();

                    if (data.results && data.results[0]) {
                        const address = data.results[0].formatted_address;

                        if (type === 'pickup') {
                            setPickupLocation(address);
                            setPickupDetails({
                                address,
                                lat: latitude,
                                lng: longitude
                            });
                            if (pickupInputRef.current) {
                                pickupInputRef.current.value = address;
                            }
                        } else {
                            setDropoffLocation(address);
                            setDropoffDetails({
                                address,
                                lat: latitude,
                                lng: longitude
                            });
                            if (dropoffInputRef.current) {
                                dropoffInputRef.current.value = address;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error getting address from coordinates:', error);
                    const fallbackAddress = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;

                    if (type === 'pickup') {
                        setPickupLocation(fallbackAddress);
                        setPickupDetails({
                            address: fallbackAddress,
                            lat: latitude,
                            lng: longitude
                        });
                    } else {
                        setDropoffLocation(fallbackAddress);
                        setDropoffDetails({
                            address: fallbackAddress,
                            lat: latitude,
                            lng: longitude
                        });
                    }
                } finally {
                    setIsGettingCurrentLocation(prev => ({ ...prev, [type]: false }));
                }
            },
            (error) => {
                console.error('Error getting current location:', error);
                setIsGettingCurrentLocation(prev => ({ ...prev, [type]: false }));

                let errorMessage = 'Unable to get your current location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access was denied. Please enable location services.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Please try again.';
                        break;
                }
                alert(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    useEffect(() => {
        const detectDialCode = async () => {
            try {
                // Try to get user's location from IP
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();

                if (data.country_code) {
                    const countryToDialCode: { [key: string]: string } = {
                        'GB': '+44', 'US': '+1', 'CA': '+1', 'IN': '+91', 'AU': '+61',
                        'AE': '+971', 'DE': '+49', 'FR': '+33', 'JP': '+81', 'CN': '+86',
                        'RU': '+7', 'ES': '+34', 'IT': '+39', 'NL': '+31', 'CH': '+41',
                        'SE': '+46', 'NO': '+47', 'DK': '+45', 'BE': '+32', 'IE': '+353',
                        'NZ': '+64', 'MX': '+52', 'BR': '+55', 'AR': '+54', 'PK': '+92',
                        'ID': '+62', 'PH': '+63', 'MY': '+60', 'SG': '+65', 'TH': '+66',
                        'KR': '+82', 'TR': '+90', 'ZA': '+27', 'EG': '+20', 'NG': '+234',
                        'KE': '+254', 'SA': '+966', 'IL': '+972', 'PL': '+48', 'UA': '+380',
                        'GR': '+30', 'PT': '+351', 'AT': '+43', 'HU': '+36', 'CZ': '+420',
                        'FI': '+358', 'RO': '+40', 'BG': '+359', 'HR': '+385', 'RS': '+381',
                        'SI': '+386', 'SK': '+421', 'LT': '+370', 'LV': '+371', 'EE': '+372',
                        'IS': '+354', 'LU': '+352', 'MT': '+356', 'CY': '+357', 'VN': '+84',
                        'LK': '+94', 'NP': '+977', 'BD': '+880', 'MM': '+95', 'KH': '+855',
                        'LA': '+856', 'TW': '+886', 'HK': '+852', 'MO': '+853', 'KP': '+850',
                        'MN': '+976', 'AF': '+93', 'IR': '+98', 'IQ': '+964', 'SY': '+963',
                        'LB': '+961', 'JO': '+962', 'KW': '+965', 'BH': '+973', 'QA': '+974',
                        'OM': '+968', 'YE': '+967', 'PS': '+970', 'DZ': '+213', 'MA': '+212',
                        'TN': '+216', 'LY': '+218', 'SD': '+249', 'SO': '+252', 'DJ': '+253',
                        'ER': '+291', 'ET': '+251', 'UG': '+256', 'RW': '+250', 'BI': '+257',
                        'TZ': '+255', 'MZ': '+258', 'ZM': '+260', 'ZW': '+263', 'MW': '+265',
                        'LS': '+266', 'BW': '+267', 'SZ': '+268', 'KM': '+269', 'SC': '+248',
                        'MU': '+230', 'CV': '+238', 'ST': '+239', 'GW': '+245', 'GN': '+224',
                        'SL': '+232', 'LR': '+231', 'CI': '+225', 'GH': '+233', 'TG': '+228',
                        'BJ': '+229', 'BF': '+226', 'ML': '+223', 'SN': '+221', 'GM': '+220',
                        'MR': '+222', 'NE': '+227', 'TD': '+235', 'CF': '+236', 'CM': '+237',
                        'GQ': '+240', 'GA': '+241', 'CG': '+242', 'CD': '+243', 'AO': '+244',
                        'NA': '+264', 'MG': '+261',
                        'RE': '+262', 'YT': '+262', 'SH': '+290', 'FK': '+500', 'GI': '+350',
                        'AD': '+376', 'MC': '+377', 'SM': '+378', 'VA': '+379',
                        'LI': '+423', 'FO': '+298', 'GL': '+299', 'AX': '+358', 'JE': '+44',
                        'GG': '+44', 'IM': '+44'
                    };

                    const detectedDialCode = countryToDialCode[data.country_code];
                    if (detectedDialCode) {
                        setSelectedDialCode(detectedDialCode);
                    }
                }
            } catch (error) {
                console.log('Could not auto-detect location, using default +44');
            }
        };

        detectDialCode();
    }, []);

    // Initialize Google Maps Places Autocomplete
    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const existingScript = document.getElementById('google-maps-script');

            if (!existingScript) {
                const script = document.createElement('script');
                script.id = 'google-maps-script';
                const googleMapAPIKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

                script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapAPIKey}&libraries=places,geocoding`;
                script.async = true;
                script.defer = true;
                script.onload = initAutocomplete;
                document.head.appendChild(script);
            } else if (window.google) {
                initAutocomplete();
            }
        };

        const initAutocomplete = () => {
            if (!window.google || !window.google.maps || !window.google.maps.places) {
                return;
            }

            if (pickupAutocompleteRef.current && pickupInputRef.current) {
                window.google.maps.event.clearInstanceListeners(pickupInputRef.current);
                pickupAutocompleteRef.current = null;
            }

            if (dropoffAutocompleteRef.current && dropoffInputRef.current) {
                window.google.maps.event.clearInstanceListeners(dropoffInputRef.current);
                dropoffAutocompleteRef.current = null;
            }

            if (pickupInputRef.current) {
                pickupAutocompleteRef.current = new window.google.maps.places.Autocomplete(
                    pickupInputRef.current,
                    {
                        types: ['geocode', 'establishment'],
                        componentRestrictions: { country: 'uk' }
                    }
                );

                pickupAutocompleteRef.current.addListener('place_changed', () => {
                    const place = pickupAutocompleteRef.current.getPlace();
                    if (place.formatted_address && place.geometry) {
                        setPickupLocation(place.formatted_address);
                        setPickupDetails({
                            address: place.formatted_address,
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        });
                    }
                });
            }

            if (serviceType === 'transfers' && dropoffInputRef.current) {
                dropoffAutocompleteRef.current = new window.google.maps.places.Autocomplete(
                    dropoffInputRef.current,
                    {
                        types: ['geocode', 'establishment'],
                        componentRestrictions: { country: 'uk' }
                    }
                );

                dropoffAutocompleteRef.current.addListener('place_changed', () => {
                    const place = dropoffAutocompleteRef.current.getPlace();
                    if (place.formatted_address && place.geometry) {
                        setDropoffLocation(place.formatted_address);
                        setDropoffDetails({
                            address: place.formatted_address,
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        });
                    }
                });
            }
        };

        loadGoogleMapsScript();
    }, [serviceType]);

    // Calculate distance when both locations are selected (transfers only)
    useEffect(() => {
        if (serviceType === 'transfers' && pickupDetails && dropoffDetails && window.google) {
            calculateDistance();
        } else {
            setDistance(null);
            setDuration(null);
        }
    }, [pickupDetails, dropoffDetails, serviceType]);

    const calculateDistance = () => {
        if (!pickupDetails || !dropoffDetails || !window.google) return;

        setIsCalculating(true);

        const service = new window.google.maps.DistanceMatrixService();

        service.getDistanceMatrix(
            {
                origins: [{ lat: pickupDetails.lat, lng: pickupDetails.lng }],
                destinations: [{ lat: dropoffDetails.lat, lng: dropoffDetails.lng }],
                travelMode: 'DRIVING',
                unitSystem: window.google.maps.UnitSystem.IMPERIAL,
            },
            (response: any, status: any) => {
                setIsCalculating(false);

                if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                    const result = response.rows[0].elements[0];
                    const distanceInMiles = result.distance.value / 1609.34; // Convert meters to miles
                    setDistance(distanceInMiles);
                    setDuration(result.duration.text);
                } else {
                    console.error('Distance calculation failed:', status);
                    setDistance(null);
                    setDuration(null);
                }
            }
        );
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);

        const updated = updateSelectedTimeToValid(date, selectedTime);
        setSelectedDate(updated.date);
        setSelectedTime(updated.time);

        if (serviceType === 'transfers' && tripType === 'return') {
            if (returnDate < updated.date) {
                const tomorrow = new Date(updated.date);
                tomorrow.setDate(tomorrow.getDate() + 1);
                setReturnDate(tomorrow);
                const returnUpdated = updateSelectedTimeToValid(tomorrow, returnTime);
                setReturnDate(returnUpdated.date);
                setReturnTime(returnUpdated.time);
            }
        }

        setShowDatePicker(false);
    };

    const handleReturnDateClick = (date: Date) => {
        setReturnDate(date);
        const updated = updateSelectedTimeToValid(date, returnTime);
        setReturnDate(updated.date);
        setReturnTime(updated.time);
        setShowReturnDatePicker(false);
    };

    const handlePickupTimeChange = (time: string) => {
        if (!isTimeAtLeast12HoursFromNow(selectedDate, time)) {
            alert('Please select a time at least 12 hours from now');
            return;
        }
        setSelectedTime(time);
    };

    const handleReturnTimeChange = (time: string) => {
        if (!isTimeAtLeast12HoursFromNow(returnDate, time)) {
            alert('Please select a time at least 12 hours from now');
            return;
        }
        setReturnTime(time);
    };

    const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setContactPhone(value);
    };

    const handleDialCodeSelect = (code: string) => {
        setSelectedDialCode(code);
        if (contactPhone.startsWith(selectedDialCode)) {
            setContactPhone(code + contactPhone.slice(selectedDialCode.length));
        } else {
            setContactPhone(code);
        }
        setShowDialCodes(false);
    };

    const sendEnquiryEmail = async () => {
        setIsSendingEmail(true);

        const rentalHours = serviceType === 'daily-rental' ? getRentalHoursFromPeriod(rentalPeriod) : null;

        const enquiryData = {
            name: contactName,
            email: contactEmail,
            phone: `${selectedDialCode} ${contactPhone}`,
            serviceType: serviceType,
            pickupLocation: pickupLocation,
            dropoffLocation: serviceType === 'transfers' ? dropoffLocation : null,
            pickupDate: formatDate(selectedDate),
            pickupTime: formatTime12Hour(selectedTime),
            numberOfPersons: numberOfPersons,
            tripType: serviceType === 'transfers' ? tripType : null,
            distance: distance,
            duration: duration,
            rentalPeriod: serviceType === 'daily-rental' ? getRentalPeriodLabel(rentalPeriod) : null,
            rentalHours: rentalHours,
            returnDate: (serviceType === 'transfers' && tripType === 'return') ? formatDate(returnDate) : null,
            returnTime: (serviceType === 'transfers' && tripType === 'return') ? formatTime12Hour(returnTime) : null,
        };

        try {
            const appURL = import.meta.env.VITE_APP_URL;

            const response = await fetch(`${appURL}/api/enquiry.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(enquiryData)
            });

            const result = await response.json();

            if (result.success) {
                console.log('Email sent successfully');
            } else {
                console.error('Failed to send email:', result.message);
            }
        } catch (error) {
            console.error('Error sending email:', error);
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!contactName || !contactEmail || !contactPhone) {
            alert('Please fill in all contact details');
            return;
        }

        await sendEnquiryEmail();

        if (serviceType === 'transfers') {
            if (tripType === 'return' && !isTimeAtLeast12HoursFromNow(returnDate, returnTime)) {
                alert('Return time must be at least 12 hours from now');
                return;
            }

            if (!pickupLocation || !dropoffLocation) {
                alert('Please select both pickup and dropoff locations');
                return;
            }

            navigate('/transport-options', {
                state: {
                    serviceType: 'transfers',
                    from: pickupLocation,
                    to: dropoffLocation,
                    tripType: tripType,
                    fromCoords: pickupDetails ? { lat: pickupDetails.lat, lng: pickupDetails.lng } : null,
                    toCoords: dropoffDetails ? { lat: dropoffDetails.lat, lng: dropoffDetails.lng } : null,
                    distance: distance,
                    duration: duration,
                    date: formatDate(selectedDate),
                    time: formatTime12Hour(selectedTime),
                    returnDate: tripType === 'return' ? formatDate(returnDate) : null,
                    returnTime: tripType === 'return' ? formatTime12Hour(returnTime) : null,
                    passengers: numberOfPersons,
                    contactName: contactName,
                    contactEmail: contactEmail,
                    contactPhone: contactPhone
                }
            });
        } else {
            if (!pickupLocation) {
                alert('Please select a pickup location');
                return;
            }

            const rentalHours = getRentalHoursFromPeriod(rentalPeriod);
            const rentalDays = rentalPeriod === 'half-day' ? 0.5 : rentalPeriod as number;

            navigate('/car-rental-options', {
                state: {
                    serviceType: 'daily-rental',
                    pickupLocation: pickupLocation,
                    pickupCoords: pickupDetails ? { lat: pickupDetails.lat, lng: pickupDetails.lng } : null,
                    date: formatDate(selectedDate),
                    time: formatTime12Hour(selectedTime),
                    rentalPeriod: getRentalPeriodLabel(rentalPeriod),
                    rentalHours: rentalHours,
                    rentalDays: rentalDays,
                    passengers: numberOfPersons,
                    contactName: contactName,
                    contactEmail: contactEmail,
                    contactPhone: contactPhone
                }
            });
        }
    };

    const isDateSelected = (date: Date, type: 'departure' | 'return') => {
        if (!date) return false;
        if (type === 'departure') {
            return date.toDateString() === selectedDate.toDateString();
        } else {
            return date.toDateString() === returnDate.toDateString();
        }
    };

    const isBeforeDeparture = (date: Date) => {
        return date < selectedDate;
    };

    const handleTripTypeChange = (type: TripType) => {
        setTripType(type);
        if (type === 'one-way' && returnDate < selectedDate) {
            const tomorrow = new Date(selectedDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            setReturnDate(tomorrow);
        }
    };

    const departureCalendarDays = generateCalendar(currentMonth);
    const returnCalendarDays = generateCalendar(currentReturnMonth);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const currentRentalHours = serviceType === 'daily-rental' ? getRentalHoursFromPeriod(rentalPeriod) : 0;

    const pickupTimeSlots = generateTimeSlots(selectedDate);
    const returnTimeSlots = generateTimeSlots(returnDate);

    // Rental period options
    const rentalPeriodOptions: RentalPeriod[] = ['half-day', 1, 2, 3, 4, 5, 6, 7];

    // Step validation functions
    const canProceedToStep2 = () => {
        if (serviceType === 'transfers') {
            return pickupLocation && dropoffLocation;
        } else {
            return pickupLocation;
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1 && !canProceedToStep2()) {
            alert(serviceType === 'transfers'
                ? 'Please enter both pickup and destination locations'
                : 'Please enter pickup location');
            return;
        }
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div
                className="relative min-h-screen bg-cover bg-no-repeat mt-16"
                style={{
                    backgroundImage: `url(${Banner5})`,
                }}
            >
                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start min-h-screen py-8 lg:py-12">
                        {/* Left Column - Booking Form */}
                        <div className="w-full mx-auto order-2 lg:order-1">
                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-black/10 border border-white/30 max-w-lg lg:mx-0 mx-auto">
                                {/* Service Type Selector */}
                                <div className="mb-4 sm:mb-6">
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setServiceType('transfers');
                                                setCurrentStep(1);
                                            }}
                                            className={`py-3 px-3 sm:px-4 rounded-xl border-2 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${serviceType === 'transfers'
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                                                }`}
                                        >
                                            <Car className="h-4 w-4 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm whitespace-nowrap">Transfers</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setServiceType('daily-rental');
                                                setCurrentStep(1);
                                            }}
                                            className={`py-3 px-3 sm:px-4 rounded-xl border-2 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${serviceType === 'daily-rental'
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                                                }`}
                                        >
                                            <History className="h-4 w-4 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm whitespace-nowrap">Daily Bookings</span>
                                        </button>
                                    </div>

                                    <h2 className="text-lg sm:text-xl font-bold text-blue-600 mb-2">
                                        {serviceType === 'transfers' ? 'Reserve Your Transport Now' : 'Reserve a Vehicle for the Day'}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        {serviceType === 'transfers'
                                            ? 'Experience luxury travel with professional drivers'
                                            : 'Choose from our premium fleet with driver included'
                                        }
                                    </p>
                                </div>

                                {/* Progress Steps */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        {[1, 2, 3].map((step) => (
                                            <React.Fragment key={step}>
                                                <div className="flex flex-col items-center flex-1">
                                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= step
                                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                                        : 'bg-gray-200 text-gray-500'
                                                        }`}>
                                                        {step}
                                                    </div>
                                                    <span className={`text-xs whitespace-nowrap mt-1 font-medium ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}>
                                                        {step === 1 ? 'Location' : step === 2 ? 'Date & Time' : 'Contact'}
                                                    </span>
                                                </div>
                                                {step < 3 && (
                                                    <div className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${currentStep > step ? 'bg-blue-500' : 'bg-gray-200'}`} />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
                                    {/* STEP 1: Location Details */}
                                    {currentStep === 1 && (
                                        <div className="space-y-3 sm:space-y-4 animate-fadeIn">
                                            {serviceType === 'transfers' && (
                                                <>
                                                    {/* Trip Type Selection */}
                                                    <div className="group">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                                <div className="p-1 sm:p-1.5 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-lg border border-indigo-200">
                                                                    <ArrowRightLeft className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
                                                                </div>
                                                                Trip Type
                                                            </label>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTripTypeChange('one-way')}
                                                                className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 font-medium text-sm transition-all duration-200 ${tripType === 'one-way'
                                                                    ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-500 text-indigo-700 shadow-sm'
                                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                One Way
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTripTypeChange('return')}
                                                                className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 font-medium text-sm transition-all duration-200 ${tripType === 'return'
                                                                    ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-500 text-indigo-700 shadow-sm'
                                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                Return
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Pickup Location */}
                                                    <div className="group">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                                <div className="p-1 sm:p-1.5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-200">
                                                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                                </div>
                                                                Pickup Location
                                                            </label>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="relative transform transition-all duration-200 group-hover:scale-[1.01]">
                                                                <input
                                                                    ref={pickupInputRef}
                                                                    type="text"
                                                                    placeholder="Enter pickup location"
                                                                    value={pickupLocation}
                                                                    onChange={(e) => setPickupLocation(e.target.value)}
                                                                    required
                                                                    className="relative w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm sm:text-base text-gray-700 placeholder-gray-400 transition-all duration-200"
                                                                />
                                                                <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => getCurrentLocation('pickup')}
                                                                    disabled={isGettingCurrentLocation.pickup}
                                                                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    title="Use current location"
                                                                >
                                                                    {isGettingCurrentLocation.pickup ? (
                                                                        <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-blue-600"></div>
                                                                    ) : (
                                                                        <Locate className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 hover:text-blue-500" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Dropoff Location */}
                                                    <div className="group">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                                <div className="p-1 sm:p-1.5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-200">
                                                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                                </div>
                                                                Destination
                                                            </label>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="relative transform transition-all duration-200 group-hover:scale-[1.01]">
                                                                <input
                                                                    ref={dropoffInputRef}
                                                                    type="text"
                                                                    placeholder="Enter destination"
                                                                    value={dropoffLocation}
                                                                    onChange={(e) => setDropoffLocation(e.target.value)}
                                                                    required
                                                                    className="relative w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm sm:text-base text-gray-700 placeholder-gray-400 transition-all duration-200"
                                                                />
                                                                <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => getCurrentLocation('dropoff')}
                                                                    disabled={isGettingCurrentLocation.dropoff}
                                                                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    title="Use current location"
                                                                >
                                                                    {isGettingCurrentLocation.dropoff ? (
                                                                        <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-blue-600"></div>
                                                                    ) : (
                                                                        <Locate className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 hover:text-blue-500" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Distance Display */}
                                                    {distance !== null && (
                                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-green-200 animate-fadeIn">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 sm:gap-3">
                                                                    <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm">
                                                                        <Navigation className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] sm:text-xs text-green-600 font-semibold uppercase tracking-wide">Route Distance</p>
                                                                        <p className="text-lg sm:text-2xl font-bold text-gray-900">{distance.toFixed(1)} miles</p>
                                                                    </div>
                                                                </div>
                                                                {duration && (
                                                                    <div className="text-right">
                                                                        <p className="text-[10px] sm:text-xs text-green-600 font-semibold uppercase tracking-wide">Est. Time</p>
                                                                        <p className="text-base sm:text-lg font-bold text-gray-900">{duration}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isCalculating && (
                                                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-200">
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-600"></div>
                                                                <p className="text-xs sm:text-sm text-gray-600 font-medium">Calculating distance...</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {/* Daily Rental Pickup */}
                                            {serviceType === 'daily-rental' && (
                                                <div className="group">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                            <div className="p-1 sm:p-1.5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-200">
                                                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                            </div>
                                                            Pickup Location
                                                        </label>
                                                    </div>
                                                    <div className="relative">
                                                        <div className="relative transform transition-all duration-200 group-hover:scale-[1.01]">
                                                            <input
                                                                ref={pickupInputRef}
                                                                type="text"
                                                                placeholder="Enter pickup location"
                                                                value={pickupLocation}
                                                                onChange={(e) => setPickupLocation(e.target.value)}
                                                                required
                                                                className="relative w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm sm:text-base text-gray-700 placeholder-gray-400 transition-all duration-200"
                                                            />
                                                            <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                                            <button
                                                                type="button"
                                                                onClick={() => getCurrentLocation('pickup')}
                                                                disabled={isGettingCurrentLocation.pickup}
                                                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Use current location"
                                                            >
                                                                {isGettingCurrentLocation.pickup ? (
                                                                    <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-blue-600"></div>
                                                                ) : (
                                                                    <Locate className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 hover:text-blue-500" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* STEP 2: Date & Time + Passengers */}
                                    {currentStep === 2 && (
                                        <div className="space-y-3 sm:space-y-4 animate-fadeIn">
                                            {/* Pickup Date and Time Row */}
                                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                                {/* Pickup Date Selection */}
                                                <div className="group relative">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                            <div className="p-1 sm:p-1.5 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-200">
                                                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                                                            </div>
                                                            <span className="hidden sm:inline">Pickup Date</span>
                                                            <span className="sm:hidden">Pickup</span>
                                                        </label>
                                                        {isDateWithin12Hours(selectedDate) && (
                                                            <span className="text-xs text-red-600 font-medium">*12h</span>
                                                        )}
                                                    </div>
                                                    <div className="relative transform transition-all duration-200 group-hover:scale-[1.01]">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDatePicker(!showDatePicker)}
                                                            className="relative w-full h-[46px] sm:h-auto py-3 sm:py-4 px-3 sm:px-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 cursor-pointer text-left flex items-center"
                                                        >
                                                            <div className="text-gray-700 font-medium text-xs sm:text-sm">
                                                                {formatDateWithOrdinal(selectedDate)}
                                                            </div>
                                                        </button>
                                                    </div>

                                                    {/* Date Picker Dropdown */}
                                                    {showDatePicker && (
                                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 z-50 animate-slideDown min-w-[280px] sm:min-w-[300px]">
                                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                                                <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                                    </svg>
                                                                </button>
                                                                <div className="text-center">
                                                                    <h3 className="text-lg font-bold text-gray-900">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
                                                                </div>
                                                                <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-7 gap-2 mb-2">
                                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                                                    <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">{day}</div>
                                                                ))}
                                                            </div>
                                                            <div className="grid grid-cols-7 gap-2">
                                                                {departureCalendarDays.map((date, index) => {
                                                                    if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
                                                                    const isToday = date.toDateString() === new Date().toDateString();
                                                                    const isPast = isPastDate(date);
                                                                    const isWithin12Hours = isDateWithin12Hours(date);
                                                                    const isSelected = isDateSelected(date, 'departure');
                                                                    return (
                                                                        <button key={index} type="button" onClick={() => !isPast && !isWithin12Hours && handleDateClick(date)} disabled={isPast || isWithin12Hours}
                                                                            className={`aspect-square rounded-lg text-sm font-medium transition-all duration-200 ${isPast || isWithin12Hours ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-purple-50 cursor-pointer'} ${isSelected ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg scale-105' : 'text-gray-700'} ${isToday && !isSelected ? 'border-2 border-purple-500' : ''}`}
                                                                            title={isWithin12Hours ? 'Must be at least 12 hours from now' : ''}>
                                                                            {date.getDate()}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                                                <button type="button" onClick={() => { const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); handleDateClick(tomorrow); }} className="text-sm text-purple-600 hover:text-purple-700 font-semibold">Tomorrow</button>
                                                                <button type="button" onClick={() => setShowDatePicker(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">Done</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Pickup Time */}
                                                <div className="group">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                            <div className="p-1 sm:p-1.5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-200">
                                                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                            </div>
                                                            <span className="hidden sm:inline">Pickup Time</span>
                                                            <span className="sm:hidden">Time</span>
                                                        </label>
                                                    </div>
                                                    <div className="relative transform transition-all duration-200 group-hover:scale-[1.01]">
                                                        <select value={selectedTime} onChange={(e) => handlePickupTimeChange(e.target.value)} className="relative w-full h-[46px] sm:h-auto py-3 sm:py-4 px-3 sm:px-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-gray-700 text-xs sm:text-sm transition-all duration-200 appearance-none cursor-pointer font-medium">
                                                            {pickupTimeSlots.length > 0 ? pickupTimeSlots.map((time) => (<option key={time} value={time}>{formatTime12Hour(time)}</option>)) : (<option value="">No available times</option>)}
                                                        </select>
                                                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    {pickupTimeSlots.length === 0 && (
                                                        <p className="text-xs text-red-600 mt-1">No available times for today. Please select a future date.</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Daily Rental: Rental Period Selector */}
                                            {serviceType === 'daily-rental' && (
                                                <>
                                                    {/* Driving hours info banner */}
                                                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                                                        <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <p className="text-xs text-blue-700 leading-relaxed">
                                                            <span className="font-semibold">Driver hours:</span> Half Day = 5 hrs &nbsp;|&nbsp; Full Day = 10 hrs. Due to legal driving regulations, a maximum of 10 hours per day applies.
                                                        </p>
                                                    </div>

                                                    {/* Rental Period Selection */}
                                                    <div className="group">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                                <div className="p-1 sm:p-1.5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-200">
                                                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                                </div>
                                                                Rental Period
                                                            </label>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                                                            {rentalPeriodOptions.map((period) => {
                                                                const isSelected = rentalPeriod === period;
                                                                const label = period === 'half-day' ? 'Half Day' : period === 1 ? '1 Day' : `${period} Days`;
                                                                const hours = period === 'half-day' ? '5 hrs' : `${(period as number) * 10} hrs`;
                                                                return (
                                                                    <button
                                                                        key={String(period)}
                                                                        type="button"
                                                                        onClick={() => setRentalPeriod(period)}
                                                                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 font-medium text-center transition-all duration-200 ${isSelected
                                                                            ? 'bg-gradient-to-b from-blue-500 to-blue-600 border-blue-500 text-white shadow-md'
                                                                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                                                                            }`}
                                                                    >
                                                                        <span className="text-xs sm:text-sm font-bold leading-tight">{label}</span>
                                                                        <span className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>{hours}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Rental Summary */}
                                                    <div className="bg-gradient-to-r from-blue-50 to-amber-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-0.5">Selected Period</p>
                                                                <p className="text-base sm:text-lg font-bold text-gray-900">{getRentalPeriodLabel(rentalPeriod)}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-0.5">Driver Hours</p>
                                                                <p className="text-lg sm:text-xl font-bold text-blue-700">{currentRentalHours} hrs</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Transfers: Return Date/Time for return trips */}
                                            {serviceType === 'transfers' && tripType === 'return' && (
                                                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                                    {/* Return Date */}
                                                    <div className="group relative">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                                <div className="p-1.5 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-200">
                                                                    <Calendar className="h-4 w-4 text-purple-600" />
                                                                </div>
                                                                Return Date
                                                            </label>
                                                            {isDateWithin12Hours(returnDate) && (
                                                                <span className="text-xs text-red-600 font-medium">*12h</span>
                                                            )}
                                                        </div>
                                                        <div className="relative transform transition-all duration-200 group-hover:scale-[1.01]">
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowReturnDatePicker(!showReturnDatePicker)}
                                                                className="relative w-full h-[46px] sm:h-auto py-3 sm:py-4 px-3 sm:px-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 cursor-pointer text-left flex items-center"
                                                            >
                                                                <div className="text-gray-700 font-medium text-xs sm:text-sm">
                                                                    {formatDateWithOrdinal(returnDate)}
                                                                </div>
                                                            </button>
                                                        </div>

                                                        {/* Return Date Picker Dropdown */}
                                                        {showReturnDatePicker && (
                                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50 animate-slideDown min-w-[300px]">
                                                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                                                    <button type="button" onClick={() => setCurrentReturnMonth(new Date(currentReturnMonth.getFullYear(), currentReturnMonth.getMonth() - 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                                        </svg>
                                                                    </button>
                                                                    <div className="text-center">
                                                                        <h3 className="text-lg font-bold text-gray-900">{monthNames[currentReturnMonth.getMonth()]} {currentReturnMonth.getFullYear()}</h3>
                                                                    </div>
                                                                    <button type="button" onClick={() => setCurrentReturnMonth(new Date(currentReturnMonth.getFullYear(), currentReturnMonth.getMonth() + 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <div className="grid grid-cols-7 gap-2 mb-2">
                                                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                                                        <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">{day}</div>
                                                                    ))}
                                                                </div>
                                                                <div className="grid grid-cols-7 gap-2">
                                                                    {returnCalendarDays.map((date, index) => {
                                                                        if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
                                                                        const isToday = date.toDateString() === new Date().toDateString();
                                                                        const isPast = isPastDate(date);
                                                                        const isWithin12Hours = isDateWithin12Hours(date);
                                                                        const isBefore = isBeforeDeparture(date);
                                                                        const isSelected = isDateSelected(date, 'return');
                                                                        return (
                                                                            <button key={index} type="button" onClick={() => !isPast && !isWithin12Hours && !isBefore && handleReturnDateClick(date)} disabled={isPast || isWithin12Hours || isBefore}
                                                                                className={`aspect-square rounded-lg text-sm font-medium transition-all duration-200 ${isPast || isWithin12Hours || isBefore ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-purple-50 cursor-pointer'} ${isSelected ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg scale-105' : 'text-gray-700'} ${isToday && !isSelected ? 'border-2 border-purple-500' : ''}`}
                                                                                title={isWithin12Hours ? 'Must be at least 12 hours from now' : isBefore ? 'Must be after departure date' : ''}>
                                                                                {date.getDate()}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                                                    <button type="button" onClick={() => { const nextDay = new Date(selectedDate); nextDay.setDate(nextDay.getDate() + 1); handleReturnDateClick(nextDay); }} className="text-sm text-purple-600 hover:text-purple-700 font-semibold">Next Day</button>
                                                                    <button type="button" onClick={() => setShowReturnDatePicker(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">Done</button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Return Time */}
                                                    <div className="group">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                                <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-200">
                                                                    <Clock className="h-4 w-4 text-blue-600" />
                                                                </div>
                                                                Return Time
                                                            </label>
                                                        </div>
                                                        <div className="relative transform transition-all duration-200 group-hover:scale-[1.01]">
                                                            <select value={returnTime} onChange={(e) => handleReturnTimeChange(e.target.value)} className="relative w-full h-[46px] sm:h-auto py-3 sm:py-4 px-3 sm:px-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-gray-700 text-xs sm:text-sm transition-all duration-200 appearance-none cursor-pointer font-medium">
                                                                {returnTimeSlots.length > 0 ? returnTimeSlots.map((time) => (<option key={time} value={time}>{formatTime12Hour(time)}</option>)) : (<option value="">No available times</option>)}
                                                            </select>
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        {returnTimeSlots.length === 0 && (
                                                            <p className="text-xs text-red-600 mt-1">No available times for today. Please select a future date.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Number of Passengers */}
                                            <div className="group">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                        <div className="p-1 sm:p-1.5 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border border-green-200">
                                                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                                        </div>
                                                        <span className="hidden sm:inline">Number of Passengers</span>
                                                        <span className="sm:hidden">Passengers</span>
                                                    </label>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <button type="button" onClick={() => setNumberOfPersons(Math.max(1, numberOfPersons - 1))} className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 flex items-center justify-center font-bold text-lg sm:text-xl text-gray-700 hover:text-green-600">−</button>
                                                    <div className="flex-1 text-center">
                                                        <div className="text-2xl sm:text-3xl font-bold text-gray-900">{numberOfPersons}</div>
                                                        <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{numberOfPersons === 1 ? 'Passenger' : 'Passengers'}</div>
                                                    </div>
                                                    <button type="button" onClick={() => setNumberOfPersons(Math.min(50, numberOfPersons + 1))} className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 flex items-center justify-center font-bold text-lg sm:text-xl text-gray-700 hover:text-green-600">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 3: Contact Information */}
                                    {currentStep === 3 && (
                                        <div className="space-y-3 sm:space-y-4 animate-fadeIn">
                                            {/* Name Input */}
                                            <div className="group">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                        <div className="p-1 sm:p-1.5 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-lg border border-indigo-200">
                                                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
                                                        </div>
                                                        Full Name
                                                    </label>
                                                </div>
                                                <div className="relative transform transition-all duration-200 group-hover:scale-[1.01]">
                                                    <input type="text" placeholder="Enter your full name" value={contactName} onChange={(e) => setContactName(e.target.value)} required className="relative w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-sm sm:text-base text-gray-700 placeholder-gray-400 transition-all duration-200" />
                                                    <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                                                </div>
                                            </div>

                                            {/* Email Input */}
                                            <div className="group">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                        <div className="p-1 sm:p-1.5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-200">
                                                            <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                        </div>
                                                        Email Address
                                                    </label>
                                                </div>
                                                <div className="relative transform transition-all duration-200 group-hover:scale-[1.01]">
                                                    <input type="email" placeholder="Please enter your email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required className="relative w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm sm:text-base text-gray-700 placeholder-gray-400 transition-all duration-200" />
                                                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                                </div>
                                            </div>

                                            {/* Phone Input with International Dial Codes */}
                                            <div className="group relative">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                                        <div className="p-1 sm:p-1.5 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border border-green-200">
                                                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                                        </div>
                                                        Phone Number
                                                    </label>
                                                </div>
                                                <div className="relative transform transition-all duration-200 group-hover:scale-[1.01]">
                                                    <div className="flex gap-2">
                                                        {/* Dial Code Selector */}
                                                        <div className="relative flex-shrink-0" >
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowDialCodes(!showDialCodes)}
                                                                className="w-full py-3 sm:py-4 px-2.5 sm:px-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-green-500 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 text-left flex items-center gap-1.5 sm:gap-2 min-w-[120px] sm:min-w-[140px]"
                                                            >
                                                                <img
                                                                    src={`https://flagcdn.com/w40/${countryDialCodes.find(c => c.code === selectedDialCode)?.countryCode.toLowerCase()}.png`}
                                                                    alt="flag"
                                                                    className="w-5 h-4 sm:w-6 sm:h-4 object-cover rounded shadow-sm flex-shrink-0"
                                                                    onError={(e) => {
                                                                        const target = e.currentTarget as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                    }}
                                                                />
                                                                <span className="text-sm sm:text-base font-semibold truncate">{selectedDialCode}</span>
                                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </button>

                                                            {/* Dial Code Dropdown */}
                                                            {showDialCodes && (
                                                                <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-50 animate-slideDown max-h-[320px] overflow-y-auto w-[180px] sm:w-[210px]">
                                                                    <div className="space-y-1">
                                                                        {[...countryDialCodes].sort((a, b) => a.name.localeCompare(b.name)).map((country, index) => (
                                                                            <button
                                                                                key={index}
                                                                                type="button"
                                                                                onClick={() => handleDialCodeSelect(country.code)}
                                                                                className={`w-full px-3 py-2.5 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left flex items-center gap-2.5 ${selectedDialCode === country.code ? 'bg-green-100 border-2 border-green-300' : 'border-2 border-transparent'
                                                                                    }`}
                                                                            >
                                                                                <img
                                                                                    src={`https://flagcdn.com/w40/${country.countryCode.toLowerCase()}.png`}
                                                                                    alt={`${country.name} flag`}
                                                                                    className="w-7 h-5 object-cover rounded shadow-sm flex-shrink-0"
                                                                                    onError={(e) => {
                                                                                        const target = e.currentTarget as HTMLImageElement;
                                                                                        target.style.display = 'none';
                                                                                        const span = document.createElement('span');
                                                                                        span.className = 'text-lg';
                                                                                        span.textContent = country.flag;
                                                                                        target.parentElement?.insertBefore(span, target);
                                                                                    }}
                                                                                />
                                                                                <span className="flex-1 text-sm font-medium text-gray-900 truncate">{country.name}</span>
                                                                                <span className="text-xs sm:text-sm text-gray-600 font-mono font-semibold flex-shrink-0">{country.code}</span>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Phone Number Input */}
                                                        <input
                                                            ref={phoneInputRef}
                                                            type="tel"
                                                            placeholder="7700 900000"
                                                            value={contactPhone}
                                                            onChange={handlePhoneInputChange}
                                                            required
                                                            className="relative flex-1 py-3 sm:py-4 px-3 sm:px-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 text-sm sm:text-base text-gray-700 placeholder-gray-400 transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        {currentStep > 1 && (
                                            <button type="button" onClick={handlePrevStep} className="flex-1 py-3 sm:py-3.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2">
                                                <ChevronLeft className="h-4 w-4" />
                                                <span>Back</span>
                                            </button>
                                        )}

                                        {currentStep < totalSteps ? (
                                            <button type="button" onClick={handleNextStep} className={`${currentStep > 1 ? 'flex-1' : 'w-full'} bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg sm:rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2`}>
                                                <span>Next</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            <button type="submit" disabled={!contactName || !contactEmail || !contactPhone || isSendingEmail} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg sm:rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2">
                                                {isSendingEmail ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Searching...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <>
                                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                            </svg>
                                                            <span className="text-xs sm:text-sm whitespace-nowrap">
                                                                {serviceType === 'transfers' ? 'Search Transports' : 'View Cars'}
                                                            </span>
                                                        </>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column - Features */}
                        <div className="hidden lg:flex flex-col justify-start h-full order-1 lg:order-2 pt-0">
                            <div className="w-full relative">
                                <div className="relative space-y-8">

                                    {/*  Headline */}
                                    <div className="text-center">
                                        <p className="text-blue-800 text-xs font-black uppercase tracking-[0.3em] mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                            Instant comparison
                                        </p>
                                        <h2 className="text-5xl xl:text-6xl 2xl:text-7xl font-black mb-4 leading-[1.1]">
                                            <span className="block text-white mb-2">Compare &amp;</span>
                                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800">Save More.</span>
                                        </h2>
                                        <p className="text-white/90 text-sm font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-xs mx-auto">
                                            Live prices from multiple companies — shown side by side, instantly.
                                        </p>
                                    </div>

                                    {/*  Mock comparison card  */}
                                    <div className="mx-auto max-w-sm">
                                        <div className="bg-black backdrop-blur-md border border-white/05 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">

                                            {/* Card header */}
                                            <div className="bg-white/10 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                                                <span className="text-white/90 text-[10px] font-black uppercase tracking-widest">
                                                    {companies?.length}+ companies · London → Heathrow
                                                </span>
                                                <span className="text-emerald-400 text-[10px] font-black flex items-center gap-1">
                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                                    </svg>
                                                    Save up to GBP 24
                                                </span>
                                            </div>

                                            {/* Company rows */}
                                            <div className="divide-y divide-white/[0.08]">
                                                {visible.map((co, i) => (
                                                    <div key={i} className={`flex items-center gap-3 px-4 py-3 transition-colors ${co.best ? 'bg-emerald-700/10' : 'hover:bg-white/5'}`}>
                                                        {/* Avatar */}
                                                        <div
                                                            className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-black shadow-md"
                                                            style={{ backgroundColor: co.color }}
                                                        >
                                                            {co.initial}
                                                        </div>

                                                        {/* Name + rating */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-white text-xs font-bold">{co.name}</span>
                                                                {co.tag && (
                                                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border uppercase tracking-wide ${co.tagCls}`}>
                                                                        {co.tag}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <svg className="h-2.5 w-2.5 fill-amber-800 text-amber-800" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                                <span className="text-white/40 text-[10px] font-semibold">{co.rating}</span>
                                                            </div>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="text-right flex-shrink-0">
                                                            <p className={`text-sm font-black tabular-nums ${co.best ? 'text-emerald-400' : 'text-white'}`}>
                                                                GBP {co.price}
                                                            </p>
                                                            {co.diff > 0 && (
                                                                <p className="text-[9px] text-rose-400/90 font-semibold tabular-nums">+GBP {co.diff}</p>
                                                            )}
                                                        </div>

                                                        {/* Selected radio */}
                                                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
                ${co.best ? 'border-emerald-800 bg-emerald-800' : 'border-white/20'}`}>
                                                            {co.best && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                    </div>
                                                ))}

                                                {(
                                                    <button
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-white/5 transition-colors"
                                                    >
                                                        {/* Stacked avatars preview */}
                                                        <div className="flex -space-x-1.5">
                                                            {companies.slice(4, 7).map((co, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-white text-[8px] font-black"
                                                                    style={{ backgroundColor: co.color }}
                                                                >
                                                                    {co.initial}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <span className="text-white/50 text-[11px] font-semibold">
                                                            +{remaining} more companies
                                                        </span>
                                                    </button>
                                                )}

                                                {showAll && (
                                                    <button
                                                        onClick={() => setShowAll(false)}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-white/5 transition-colors"
                                                    >
                                                        <ChevronUp className="h-3 w-3 text-white/30" />
                                                        <span className="text-white/50 text-[11px] font-semibold">Show less</span>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Card footer */}
                                            <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex items-center justify-between">
                                                <span className="text-white/35 text-[10px] font-medium">Professional driver included</span>
                                                <div className="bg-blue-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-default shadow-lg shadow-blue-700/30">
                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    Book Now
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Trust row  */}
                                    <div className="flex items-center justify-center gap-8">
                                        {[
                                            {
                                                icon: (
                                                    <svg className="h-4 w-4 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                ),
                                                value: '4+', label: 'Companies'
                                            },
                                            {
                                                icon: (
                                                    <svg className="h-4 w-4 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                    </svg>
                                                ),
                                                value: '100%', label: 'Free service'
                                            },
                                            {
                                                icon: (
                                                    <svg className="h-4 w-4 text-sky-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                ),
                                                value: 'Instant', label: 'Confirmation'
                                            },
                                        ].map((stat, i) => (
                                            <div key={i} className="text-center">
                                                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                                                    {stat.icon}
                                                    <span className="text-white font-black text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{stat.value}</span>
                                                </div>
                                                <p className="text-white/40 text-[10px] font-medium">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/*  Footer note  */}
                                    <p className="text-center text-white/90 text-lg font-semibold drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] px-4">
                                        Our service is{" "}
                                        <span className="text-blue-500 font-black">100% free</span>{" "}
                                        for anyone looking for coach hire companies.{" "}
                                        <br />
                                        Not ready?{" "}
                                        <Link to={'/contact'} className="underline underline-offset-2 text-blue-400 hover:text-blue-800 transition-colors duration-200 font-bold">
                                            Ask an expert.
                                        </Link>
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Calendar, MapPin, RefreshCw, AlertCircle, Lock,
    Users, Briefcase, Star, Clock,
    ChevronDown, ChevronUp,
} from 'lucide-react';
import { useMobile } from '../hooks/useMobile';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTaxiProducts } from '../store/slices/shopifySlice';
import { createCheckout } from '../store/slices/cartSlice';
import type { SearchDetails } from '../types';
import { companyColor, formatDateDisplay, TagPill } from '../utils/common';
import SEOHead from '../Components/SEOHead';

//  Types

interface RentalDetails {
    serviceType: 'daily-rental';
    pickupLocation: string;
    pickupCoords: { lat: number; lng: number } | null;
    date: string;
    time: string;
    rentalPeriod: string;   // e.g. "Half Day (5 hrs)" | "1 Day (10 hrs)" | "3 Days (30 hrs)"
    rentalHours: number;    // total driver hours
    rentalDays: number;     // 0.5 for half-day, N for full days
    passengers: number;
}

interface CompanyOffer {
    company: string;
    baseFare: number;
    rentalPrice: number;
    currency: string;
    rating: number;
    reviews: number;
    eta: string;
    tag?: 'Best Price' | 'Top Rated' | 'Fastest';
    variantId: string;
    shopifyProductId: string;
}

interface RentalVehicleGroup {
    vehicleType: string;
    displayName: string;
    passengers: number;
    luggage: number;
    popular: boolean;
    image: string;
    rating: number;
    reviews: number;
    rentalType: string;
    quantity: number;
    offers: CompanyOffer[];
}

//  Helpers

function parseTitleParts(title: string): { vehicleLabel: string; company: string } {
    const idx = title.lastIndexOf(' - ');
    if (idx !== -1) {
        return { vehicleLabel: title.slice(0, idx).trim(), company: title.slice(idx + 3).trim() };
    }
    return { vehicleLabel: title.trim(), company: title.trim() };
}

function parsePrice(price: any): number {
    if (typeof price === 'object' && price !== null) return parseFloat(price.amount ?? '0');
    return parseFloat(String(price ?? '0'));
}

function getRentalVariant(variants: any[], type: 'half' | 'full'): any | null {
    if (!variants?.length) return null;
    return variants.find((v: any) => {
        const t = (v.title ?? '').toLowerCase();
        if (type === 'half') return t.includes('daily rental') && (t.includes('half day') || t.includes('half-day'));
        return t.includes('daily rental') && (t.includes('full day') || t.includes('full-day'));
    }) ?? null;
}

function groupProductsForRental(
    products: any[],
    rentalHours: number,
): RentalVehicleGroup[] {
    const map = new Map<string, RentalVehicleGroup>();

    const isHalfDay = rentalHours <= 5;
    const isMultiDay = rentalHours >= 24;
    const numberOfDays = isMultiDay ? Math.ceil(rentalHours / 10) : 1; // 10 hrs = 1 full day

    for (const product of products) {
        const hasRentalVariant = product.variants?.some(
            (v: any) => (v.title ?? '').toLowerCase().includes('daily rental')
        );
        if (!hasRentalVariant) continue;

        const { vehicleLabel: titleLabel, company: titleCompany } = parseTitleParts(product.title ?? '');
        const groupKey: string = product.vehicleType || product.type || titleLabel || 'Unknown';
        const company: string = product.companyName || titleCompany;
        const displayName: string = product.displayName || titleLabel;

        const halfVariant = getRentalVariant(product.variants, 'half');
        const fullVariant = getRentalVariant(product.variants, 'full');
        const halfPrice = parsePrice(halfVariant?.price);
        const fullPrice = parsePrice(fullVariant?.price);

        let selectedVariant: any;
        let rentalPrice: number;
        let rentalType: string;
        let quantity: number;

        if (isHalfDay) {
            selectedVariant = halfVariant;
            rentalPrice = halfPrice || fullPrice / 2;
            rentalType = 'Half Day';
            quantity = 1;
        } else if (!isMultiDay) {
            selectedVariant = fullVariant;
            rentalPrice = fullPrice;
            rentalType = 'Full Day';
            quantity = 1;
        } else {
            selectedVariant = fullVariant;
            rentalPrice = fullPrice * numberOfDays;
            rentalType = `${numberOfDays} Day${numberOfDays > 1 ? 's' : ''}`;
            quantity = numberOfDays;
        }

        if (!selectedVariant || rentalPrice <= 0) continue;

        const baseFare = parseFloat(String(product.baseFare ?? product.base_fare ?? '0'));

        const offer: CompanyOffer = {
            company,
            baseFare,
            rentalPrice,
            currency: 'GBP',
            rating: parseFloat(String(product.rating ?? '4.5')),
            reviews: parseInt(String(product.reviews ?? '0'), 10),
            eta: String(product.eta ?? product.estimatedArrival ?? '5 min').replace(/^"|"$/g, ''),
            variantId: selectedVariant.id,
            shopifyProductId: product.shopifyProductId ?? product.shopifyId ?? '',
        };

        if (map.has(groupKey)) {
            const group = map.get(groupKey)!;
            group.offers.push(offer);
            if (offer.rating > group.rating) group.rating = offer.rating;
            group.reviews += offer.reviews;
        } else {
            map.set(groupKey, {
                vehicleType: groupKey,
                displayName,
                passengers: parseInt(String(product.passengers ?? '4'), 10),
                luggage: parseInt(String(product.luggage ?? '2'), 10),
                popular: product.popular === true || product.popular === 'true',
                image: product.image ?? '',
                rating: offer.rating,
                reviews: offer.reviews,
                rentalType,
                quantity,
                offers: [offer],
            });
        }
    }

    for (const group of map.values()) {
        for (const o of group.offers) o.tag = undefined;
        const byPrice = [...group.offers].sort((a, b) => a.rentalPrice - b.rentalPrice);
        const byRating = [...group.offers].sort((a, b) => b.rating - a.rating);
        if (byPrice[0]) byPrice[0].tag = 'Best Price';
        if (byRating[0] && byRating[0].company !== byPrice[0]?.company) byRating[0].tag = 'Top Rated';
    }

    return Array.from(map.values()).sort((a, b) => a.passengers - b.passengers);
}

//  CompanyOfferRow

const CompanyOfferRow: React.FC<{
    offer: CompanyOffer;
    lowestRentalPrice: number;
    isSelected: boolean;
    onSelect: () => void;
}> = ({ offer, lowestRentalPrice, isSelected, onSelect }) => {
    const isCheapest = offer.rentalPrice === lowestRentalPrice;
    const color = companyColor(offer.company);

    return (
        <div
            onClick={onSelect}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all duration-200 border-2
                ${isSelected
                    ? 'border-blue-400 bg-blue-50 shadow-sm'
                    : isCheapest
                        ? 'border-emerald-200 bg-emerald-50 hover:border-emerald-300'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
                }`}
        >
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black shadow flex-shrink-0"
                style={{ backgroundColor: color }}
            >
                {offer.company ? offer.company[0].toUpperCase() : '?'}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-gray-900 truncate">{offer.company || 'Unknown'}</span>
                    <TagPill tag={offer.tag} isCheapest={isCheapest && !offer.tag} />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-semibold text-gray-500">{offer.rating}</span>
                    <span className="text-gray-300 text-[10px]">·</span>
                    <span className="text-[10px] text-gray-400">{offer.reviews} reviews</span>
                </div>
            </div>

            <div className="text-right flex-shrink-0">
                <div className="text-[12px] text-red-400 line-through">
                    GBP {(offer.rentalPrice * 1.15).toFixed(0)}
                </div>
                <div className={`text-sm font-black ${isCheapest ? 'text-red-700' : 'text-red-500'}`}>
                    {offer.currency}{offer.rentalPrice}
                </div>
            </div>

            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
                ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
        </div>
    );
};

//  VehicleRentalCard

const VehicleRentalCard: React.FC<{
    group: RentalVehicleGroup;
    selectedVehicleType: string | null;
    selectedCompany: string | null;
    rentalHours: number;
    onSelectOffer: (vehicleType: string, company: string) => void;
}> = ({ group, selectedVehicleType, selectedCompany, onSelectOffer }) => {
    const [expanded, setExpanded] = useState(false);

    const sortedOffers = useMemo(
        () => [...group.offers].sort((a, b) => a.rentalPrice - b.rentalPrice),
        [group.offers],
    );
    const lowestRentalPrice = sortedOffers[0]?.rentalPrice ?? 0;
    const highestRentalPrice = sortedOffers[sortedOffers.length - 1]?.rentalPrice ?? 0;
    const savings = highestRentalPrice - lowestRentalPrice;
    const isGroupSelected = selectedVehicleType === group.vehicleType;
    const visibleOffers = expanded ? sortedOffers : sortedOffers.slice(0, 2);

    return (
        <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300
            ${isGroupSelected ? 'border-blue-500 shadow-xl shadow-blue-500/20' : 'border-gray-100 hover:border-blue-300'}`}
        >
            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                <img src={group.image} alt={group.displayName} className="w-full h-full object-cover" />
                {group.popular && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Popular
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-lg">
                    {group.vehicleType}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl text-right">
                    <p className="text-white font-black text-base leading-tight">GBP {lowestRentalPrice}</p>
                    {savings > 0 && (
                        <p className="text-emerald-300 text-[10px] font-semibold">save GBP {savings}</p>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{group.displayName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                                <Users className="h-3.5 w-3.5 text-blue-500" />{group.passengers} pax
                            </span>
                            <span className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                                <Briefcase className="h-3.5 w-3.5 text-blue-500" />{group.luggage} bags
                            </span>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border bg-blue-50 border-blue-200 text-blue-700">
                        <Clock className="h-3 w-3" />{group.rentalType}
                    </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-blue-500 text-blue-500" />
                        <span className="text-xs font-bold text-blue-700">{group.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">{group.reviews} reviews</span>
                </div>

                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {group.offers.length} {group.offers.length === 1 ? 'Company' : 'Companies'} · Compare & select
                        </span>
                    </div>
                    <div className="space-y-1.5">
                        {visibleOffers.map(offer => (
                            <CompanyOfferRow
                                key={`${offer.shopifyProductId}-${offer.company}`}
                                offer={offer}
                                lowestRentalPrice={lowestRentalPrice}
                                isSelected={isGroupSelected && selectedCompany === offer.company}
                                onSelect={() => onSelectOffer(group.vehicleType, offer.company)}
                            />
                        ))}
                    </div>

                    {sortedOffers.length > 2 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="w-full flex items-center justify-center gap-1.5 mt-2 py-1.5 text-[11px] font-bold text-gray-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50"
                        >
                            {expanded
                                ? <><ChevronUp className="h-3.5 w-3.5" />Show less</>
                                : <><ChevronDown className="h-3.5 w-3.5" />Show {sortedOffers.length - 2} more</>
                            }
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl py-1.5 px-3">
                    <svg className="h-3.5 w-3.5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-bold text-blue-700">Professional Driver Included</span>
                </div>
            </div>
        </div>
    );
};

//  Main component

const CarRentalOptions: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMobile();

    const dispatch = useAppDispatch();
    const { products: allProducts, loading, error, initialized } = useAppSelector((state) => state.shopify);
    const { loading: checkoutLoading, error: checkoutError, checkoutUrl } = useAppSelector((state) => state.cart);

    const [rentalDetails, setRentalDetails] = useState<RentalDetails>({
        serviceType: 'daily-rental',
        pickupLocation: '',
        pickupCoords: null,
        date: new Date().toLocaleDateString(),
        time: '10:00 AM',
        rentalPeriod: '1 Day (10 hrs)',
        rentalHours: 10,
        rentalDays: 1,
        passengers: 1,
    });

    const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'price' | 'rating' | 'passengers'>('price');

    const getRentalTypeDescription = () => rentalDetails.rentalPeriod || '1 Day (10 hrs)';

    //  effects

    useEffect(() => { if (!initialized) dispatch(fetchTaxiProducts()); }, [dispatch, initialized]);
    useEffect(() => { if (checkoutUrl) window.location.href = checkoutUrl; }, [checkoutUrl]);
    useEffect(() => {
        if (location.state) {
            setRentalDetails(location.state as RentalDetails);
        }
    }, [location]);
    useEffect(() => { if (!selectedVehicleType) setSelectedCompany(null); }, [selectedVehicleType]);

    //  group products

    const vehicleGroups = useMemo(
        () => groupProductsForRental(allProducts, rentalDetails.rentalHours),
        [allProducts, rentalDetails.rentalHours],
    );

    //  filter & sort

    const filteredGroups = useMemo(() => {
        return vehicleGroups
            .filter(g => g.passengers >= rentalDetails.passengers)
            .filter(g => {
                if (activeFilter === 'all') return true;
                if (activeFilter === 'popular') return g.popular;
                const lowestPrice = Math.min(...g.offers.map(o => o.rentalPrice));
                if (activeFilter === 'economy') return lowestPrice <= 200;
                if (activeFilter === 'premium') return lowestPrice > 400;
                return true;
            })
            .sort((a, b) => {
                const aMin = Math.min(...a.offers.map(o => o.rentalPrice));
                const bMin = Math.min(...b.offers.map(o => o.rentalPrice));
                if (sortBy === 'price') return aMin - bMin;
                if (sortBy === 'rating') return b.rating - a.rating;
                return b.passengers - a.passengers;
            });
    }, [vehicleGroups, rentalDetails.passengers, activeFilter, sortBy]);

    //  derived selection

    const selectedGroup = vehicleGroups.find(g => g.vehicleType === selectedVehicleType) ?? null;
    const selectedOffer = selectedGroup?.offers.find(o => o.company === selectedCompany) ?? null;

    //  handlers

    const handleSelectOffer = (vehicleType: string, company: string) => {
        if (selectedVehicleType === vehicleType && selectedCompany === company) {
            setSelectedVehicleType(null);
            setSelectedCompany(null);
        } else {
            setSelectedVehicleType(vehicleType);
            setSelectedCompany(company);
        }
    };

    const handleProceedToPay = () => {
        if (!selectedGroup || !selectedOffer) return;

        const searchDetails: SearchDetails = {
            serviceType: 'daily-rental',
            from: rentalDetails.pickupLocation,
            to: rentalDetails.pickupLocation,
            fromCoords: rentalDetails.pickupCoords || undefined,
            toCoords: rentalDetails.pickupCoords || undefined,
            distance: 0,
            duration: `${rentalDetails.rentalHours} hours`,
            date: rentalDetails.date,
            time: rentalDetails.time,
            passengers: rentalDetails.passengers,
            pickupDate: rentalDetails.date,
            pickupTime: rentalDetails.time,
            rentalType: getRentalTypeDescription(),
            numberOfDays: selectedGroup.quantity || 1,
            rentalHours: rentalDetails.rentalHours,
        };

        dispatch(createCheckout({
            item: {
                taxi: {
                    id: parseInt(selectedOffer.shopifyProductId.split('/').pop() ?? '0', 10),
                    shopifyId: selectedOffer.variantId,
                    shopifyProductId: selectedOffer.shopifyProductId,
                    name: selectedGroup.displayName,
                    type: selectedGroup.vehicleType,
                    vehicleType: selectedGroup.vehicleType,
                    displayName: selectedGroup.displayName,
                    companyName: selectedOffer.company,
                    image: selectedGroup.image,
                    passengers: selectedGroup.passengers,
                    luggage: selectedGroup.luggage,
                    popular: selectedGroup.popular,
                    rating: selectedOffer.rating,
                    reviews: selectedOffer.reviews,
                    baseFare: selectedOffer.rentalPrice,
                    perKmRate: 0,
                    estimatedArrival: selectedOffer.eta,
                    eta: selectedOffer.eta,
                    features: [],
                    variants: [],
                } satisfies import('../types').TaxiOption,
                search: searchDetails,
                totalPrice: selectedOffer.rentalPrice,
                quantity: selectedGroup.quantity || 1,
            }
        }));
    };

    //  Loading

    if (loading && !initialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 text-blue-700 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Available Cars</h2>
                    <p className="text-gray-700">Comparing prices across companies…</p>
                </div>
            </div>
        );
    }

    if (error && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button onClick={() => dispatch(fetchTaxiProducts())}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <RefreshCw className="h-5 w-5" /> Try Again
                        </button>
                        <button onClick={() => navigate('/')}
                            className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (initialized && filteredGroups.length === 0 && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Cars Available for Daily Rental</h2>
                    <p className="text-gray-700 mb-6">
                        We couldn't find any cars for daily rental that can accommodate {rentalDetails.passengers} passenger{rentalDetails.passengers > 1 ? 's' : ''}.
                    </p>
                    <button onClick={() => navigate('/')}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
                        Change Search
                    </button>
                </div>
            </div>
        );
    }

    //  Main render

    return (
        <>
            <SEOHead
                title="Car Rental Options - Executive & Group Vehicle Hire"
                description="Compare car rental prices from multiple companies. Executive saloons to MPVs — find the right vehicle for your journey."
                keywords="car rental UK, executive car hire London, MPV hire UK, group car rental, vehicle hire options"
                canonicalUrl="/car-rental-options"
            />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 pb-24">

                {/* Sticky Header */}
                <div className="bg-white shadow-lg sticky top-16 z-40 border-b border-gray-200">
                    <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <Calendar className="h-4 w-4 text-blue-700" />
                                    </div>
                                    <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                                        Daily Rental — {getRentalTypeDescription()}
                                    </h1>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-700">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{rentalDetails.pickupLocation}</span>
                                    </div>
                                    <span className="hidden sm:inline text-gray-300">•</span>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                        <span>{rentalDetails.rentalHours} hrs driver time</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => navigate('/')}
                                className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">

                    {/* Page header */}
                    <div className="mb-6">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                            Available Cars <span className="text-blue-700">({filteredGroups.length})</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-700">
                            <p>Comparing prices from multiple companies · {rentalDetails.passengers} passenger{rentalDetails.passengers > 1 ? 's' : ''}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm bg-blue-50 px-3 py-1 rounded-full font-medium">
                                    {formatDateDisplay(rentalDetails.date)} • {rentalDetails.time}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {['all', 'popular', 'economy', 'premium'].map(filter => (
                                <button key={filter} onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all
                                        ${activeFilter === filter
                                            ? 'bg-blue-500 text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }`}>
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </button>
                            ))}
                        </div>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="price">Price: Low to High</option>
                            <option value="rating">Rating: High to Low</option>
                            <option value="passengers">Capacity: High to Low</option>
                        </select>
                    </div>

                    {/* Rental info banner */}
                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">{getRentalTypeDescription()}</h3>
                                <p className="text-sm text-gray-700">
                                    {rentalDetails.rentalDays === 0.5
                                        ? 'Half day — up to 5 driver hours'
                                        : rentalDetails.rentalDays === 1
                                            ? 'Full day — up to 10 driver hours'
                                            : `${rentalDetails.rentalDays} days — up to ${rentalDetails.rentalHours} driver hours`}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Driver Hours</p>
                                <p className="text-lg font-bold text-blue-700">{rentalDetails.rentalHours} hrs</p>
                                {rentalDetails.rentalDays > 1 && (
                                    <p className="text-xs text-blue-700 font-medium">
                                        ({rentalDetails.rentalDays} days)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cars grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredGroups.map(group => (
                            <VehicleRentalCard
                                key={group.vehicleType}
                                group={group}
                                selectedVehicleType={selectedVehicleType}
                                selectedCompany={selectedVehicleType === group.vehicleType ? selectedCompany : null}
                                rentalHours={rentalDetails.rentalHours}
                                onSelectOffer={handleSelectOffer}
                            />
                        ))}
                    </div>
                </div>

                {/* Mobile Booking Bar */}
                {isMobile && selectedGroup && selectedOffer && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 animate-slideUp">
                        <div className="container mx-auto px-4 py-3">
                            {checkoutError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-2 mb-3">
                                    <AlertCircle className="h-4 w-4 text-red-700 flex-shrink-0 mt-0.5" />
                                    <p className="text-red-700 text-xs">{checkoutError}</p>
                                </div>
                            )}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 mb-0.5">Selected</p>
                                    <p className="font-bold text-gray-900 truncate text-sm">{selectedGroup.displayName}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm flex-shrink-0"
                                            style={{ backgroundColor: companyColor(selectedOffer.company) }} />
                                        <p className="text-xs text-gray-500">{selectedOffer.company}</p>
                                        <span className="text-xs text-gray-300">·</span>
                                        <p className="text-sm font-black text-blue-700">{selectedOffer.currency}{selectedOffer.rentalPrice}</p>
                                    </div>
                                </div>
                                <button onClick={handleProceedToPay} disabled={checkoutLoading}
                                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50 text-sm">
                                    {checkoutLoading
                                        ? <><RefreshCw className="h-4 w-4 animate-spin" /><span>Processing...</span></>
                                        : <><Lock className="h-4 w-4" /><span>Book Now</span></>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop Booking Summary */}
                {!isMobile && selectedGroup && selectedOffer && (
                    <div className="fixed bottom-8 right-8 bg-white rounded-2xl shadow-2xl border-2 border-blue-500 z-50 max-w-md overflow-hidden animate-slideIn">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Booking Summary</h3>
                                <button onClick={() => { setSelectedVehicleType(null); setSelectedCompany(null); }}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {checkoutError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-4">
                                    <AlertCircle className="h-4 w-4 text-red-700 flex-shrink-0 mt-0.5" />
                                    <p className="text-red-700 text-sm">{checkoutError}</p>
                                </div>
                            )}

                            {/* Vehicle + company */}
                            <div className="mb-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <img src={selectedGroup.image} alt={selectedGroup.displayName}
                                        className="w-20 h-12 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">{selectedGroup.displayName}</p>
                                        <p className="text-xs text-gray-500">{selectedGroup.vehicleType}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="w-3.5 h-3.5 rounded-md flex-shrink-0"
                                                style={{ backgroundColor: companyColor(selectedOffer.company) }} />
                                            <span className="text-xs font-semibold text-gray-700">{selectedOffer.company}</span>
                                            <span className="text-gray-300 text-xs">·</span>
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            <span className="text-xs text-gray-700">{selectedOffer.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rental details */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-gray-700">Rental Period</span>
                                    <span className="text-sm font-bold text-blue-700">{getRentalTypeDescription()}</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">Driver Hours</span>
                                        <span className="font-semibold text-gray-900">{rentalDetails.rentalHours} hrs</span>
                                    </div>
                                    {rentalDetails.rentalDays > 1 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700">Days</span>
                                            <span className="font-semibold text-gray-900">
                                                {rentalDetails.rentalDays} day{rentalDetails.rentalDays > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 flex-shrink-0">
                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Pickup</p>
                                        <p className="font-semibold text-gray-900">{formatDateDisplay(rentalDetails.date)}</p>
                                        <p className="text-sm text-gray-700">{rentalDetails.time}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{rentalDetails.pickupLocation}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="border-t-2 border-gray-200 pt-4 mb-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">{selectedGroup.rentalType}</span>
                                        <span className="font-semibold text-gray-900">{selectedOffer.currency}{selectedOffer.rentalPrice}</span>
                                    </div>
                                    {rentalDetails.rentalDays > 1 && selectedGroup.quantity > 1 && (
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Price calculation</span>
                                            <span>{selectedOffer.currency}{Math.round(selectedOffer.rentalPrice / selectedGroup.quantity)} × {selectedGroup.quantity} days</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold text-gray-900">Total Amount</span>
                                        <span className="text-2xl font-bold text-blue-700">{selectedOffer.currency}{selectedOffer.rentalPrice}</span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleProceedToPay} disabled={checkoutLoading}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                {checkoutLoading
                                    ? <><RefreshCw className="h-5 w-5 animate-spin" /><span>Processing...</span></>
                                    : <><Lock className="h-5 w-5" /><span>Proceed to Payment</span></>
                                }
                            </button>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Lock className="h-3 w-3" /><span>Secure Payment</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Instant Confirmation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes slideUp   { from { opacity:0; transform:translateY(100%); }  to { opacity:1; transform:translateY(0); }  }
                    @keyframes slideIn   { from { opacity:0; transform:translateX(100%); }  to { opacity:1; transform:translateX(0); }  }
                    .animate-slideUp  { animation: slideUp  0.3s ease-out; }
                    .animate-slideIn  { animation: slideIn  0.3s ease-out; }
                `}</style>
            </div>
        </>
    );
};

export default CarRentalOptions;
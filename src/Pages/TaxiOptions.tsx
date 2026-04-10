import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Navigation, Lock, RefreshCw, AlertCircle, Plane,
    Users, Briefcase, Star, Clock
    , CheckCircle2, Shield, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { SearchDetails } from '../types';
import { useMobile } from '../hooks/useMobile';
import TaxiHeader from '../Components/TaxiOptions/TaxiHeader';
import MapView from '../Components/TaxiOptions/MapView';
import Filters from '../Components/TaxiOptions/Filters';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTaxiProducts } from '../store/slices/shopifySlice';
// import { createCheckout } from '../store/slices/cartSlice';
import { companyColor, formatDateDisplay, TagPill } from '../utils/common';
import SEOHead from '../Components/SEOHead';
import { isAirportLocation } from '../services/shopifyCartService';
import { createCheckout } from '../store/slices/cartSlice';

//  Types

interface CompanyOffer {
    company: string;
    baseFare: number;   // metafield base_fare — used only for Best Price tag assignment, never displayed
    price: number;      // distance-band variant price — used for checkout
    currency: string;
    rating: number;
    reviews: number;
    eta: string;
    tag?: 'Best Price' | 'Top Rated' | 'Fastest';
    variantId: string;
    shopifyProductId: string;
}

interface TaxiOptionGrouped {
    /** metafield vehicle_type, e.g. "5 Passenger" — used as the group key */
    vehicleType: string;
    /** Title prefix before " - ", e.g. "5 Seater Car" */
    displayName: string;
    passengers: number;
    luggage: number;
    popular: boolean;
    image: string;
    baseFare: number;
    perKmRate: number;
    rating: number;   // best rating across all offers
    offers: CompanyOffer[];
}

//  Helpers 

/**
 * Parse "5 Seater Car - TransferEase"
 * → { vehicleLabel: "5 Seater Car", company: "TransferEase" }
 */
function parseTitleParts(title: string): { vehicleLabel: string; company: string } {
    const idx = title.lastIndexOf(' - ');
    if (idx !== -1) {
        return {
            vehicleLabel: title.slice(0, idx).trim(),
            company: title.slice(idx + 3).trim(),
        };
    }
    return { vehicleLabel: title.trim(), company: title.trim() };
}

function parsePrice(price: any): number {
    if (typeof price === 'object' && price !== null) return parseFloat(parseFloat(price.amount ?? '0').toFixed(2));
    return parseFloat(parseFloat(String(price ?? '0')).toFixed(2));
}

/**
 * Match a distance (miles) to the correct variant band.
 * Variant titles: "0-10 miles", "11-20 miles", …, "491-500 miles"
 * Ignores "Daily Rental - *" variants.
 */
function getVariantForDistance(variants: any[], distanceMiles: number): any | null {
    if (!variants?.length) return null;

    const distanceBands = variants.filter(v => /^\d+-\d+\s*miles?$/i.test(v.title ?? ''));

    // Exact match
    for (const v of distanceBands) {
        const match = v.title.match(/^(\d+)-(\d+)\s*miles?$/i);
        if (match) {
            const min = parseInt(match[1], 10);
            const max = parseInt(match[2], 10);
            if (distanceMiles >= min && distanceMiles <= max) return v;
        }
    }

    // Nearest band fallback (instead of always picking the highest)
    let closest: any = null;
    let closestDiff = Infinity;
    for (const v of distanceBands) {
        const match = v.title.match(/^(\d+)-(\d+)\s*miles?$/i);
        if (match) {
            const min = parseInt(match[1], 10);
            const max = parseInt(match[2], 10);
            const mid = (min + max) / 2;
            const diff = Math.abs(distanceMiles - mid);
            if (diff < closestDiff) {
                closestDiff = diff;
                closest = v;
            }
        }
    }
    return closest;
}

function groupProductsByVehicleType(
    products: any[],
    distanceMiles: number,
): TaxiOptionGrouped[] {
    const map = new Map<string, TaxiOptionGrouped>();

    for (const product of products) {
        const { vehicleLabel: titleLabel, company: titleCompany } = parseTitleParts(product.title ?? '');

        // Group key: prefer metafield vehicleType / type, fall back to title prefix
        const groupKey: string = product.vehicleType || product.type || titleLabel || 'Unknown';

        // Company name: prefer dedicated metafield, fall back to title suffix
        const company: string = product.companyName || titleCompany;

        // Display name for image overlay
        const displayName: string = product.displayName || titleLabel;

        const variant = getVariantForDistance(product.variants ?? [], distanceMiles);
        if (!variant) continue;

        const price = parsePrice(variant.price);
        if (price <= 0) continue;

        const baseFareOffer = parseFloat(String(product.baseFare ?? product.base_fare ?? '0'));

        const offer: CompanyOffer = {
            company,
            baseFare: baseFareOffer,
            price,
            currency: '£',
            rating: parseFloat(String(product.rating ?? '4.5')),
            reviews: parseInt(String(product.reviews ?? '0'), 10),
            eta: String(product.eta ?? product.estimatedArrival ?? '5 min').replace(/^"|"$/g, ''),
            variantId: variant.id,
            shopifyProductId: product.shopifyProductId ?? product.shopifyId ?? product.id ?? '',
        };

        if (map.has(groupKey)) {
            const group = map.get(groupKey)!;
            group.offers.push(offer);
            if (offer.rating > group.rating) group.rating = offer.rating;
        } else {
            map.set(groupKey, {
                vehicleType: groupKey,
                displayName,
                passengers: parseInt(String(product.passengers ?? '4'), 10),
                luggage: parseInt(String(product.luggage ?? '2'), 10),
                popular: product.popular === true || product.popular === 'true',
                image: product.image ?? '',
                baseFare: baseFareOffer,
                perKmRate: parseFloat(String(product.perKmRate ?? product.per_km_rate ?? '0')),
                rating: offer.rating,
                offers: [offer],
            });
        }
    }

    // Assign tags per group — based on baseFare (starting price)
    for (const group of map.values()) {
        for (const o of group.offers) o.tag = undefined;

        const byBase = [...group.offers].sort((a, b) => a.baseFare - b.baseFare);
        const byRating = [...group.offers].sort((a, b) => b.rating - a.rating);

        if (byBase[0]) byBase[0].tag = 'Best Price';
        if (byRating[0] && byRating[0].company !== byBase[0]?.company) {
            byRating[0].tag = 'Top Rated';
        }
    }

    return Array.from(map.values()).sort((a, b) => a.passengers - b.passengers);
}

//  CompanyOfferRow 

const CompanyOfferRow: React.FC<{
    offer: CompanyOffer;
    lowestPrice: number;        // lowest distance-band variant price in this group
    isSelected: boolean;
    onSelect: () => void;
    tripType?: 'one-way' | 'return';
}> = ({ offer, lowestPrice, isSelected, onSelect, tripType }) => {
    const isReturn = tripType === 'return';
    const displayPrice = isReturn ? offer.price * 2 : offer.price;
    const isCheapest = offer.price === lowestPrice;
    const color = companyColor(offer.company);

    // Format: no decimals if whole number, else 2dp
    const fmt = (n: number) => Number.isInteger(n) ? `${n}` : n.toFixed(0); //possible bug, check in future

    return (
        <div
            onClick={onSelect}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-200 border-2
                ${isSelected
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
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
                    <Star className="h-3 w-3 fill-amber-600 text-amber-600" />
                    <span className="text-[10px] font-semibold text-gray-500">{offer.rating}</span>
                    <span className="text-gray-300 text-[10px]">·</span>
                    <span className="text-[10px] text-gray-500">{offer.reviews} reviews</span>
                    <span className="text-gray-300 text-[10px]">·</span>
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-[10px] text-gray-500">{offer.eta}</span>
                </div>
            </div>

            <div className="text-right flex-shrink-0">
                <div className="text-[9px] text-gray-400 leading-none mb-0.5">{isReturn ? 'return' : 'from'}</div>
                <div>
                    <div className="text-[12px] text-red-400 line-through">
                        £{fmt(displayPrice * 1.15)}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-red-600 leading-none">
                        £{fmt(displayPrice)}
                    </div>
                </div>
            </div>

            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
                ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
        </div>
    );
};

//  TaxiCard 

const TaxiCard: React.FC<{
    taxi: TaxiOptionGrouped;
    selectedVehicleType: string | null;
    selectedCompany: string | null;
    tripType?: 'one-way' | 'return';
    onSelectOffer: (vehicleType: string, company: string) => void;
}> = ({ taxi, selectedVehicleType, selectedCompany, tripType, onSelectOffer }) => {
    const [expanded, setExpanded] = useState(false);

    const sortedOffers = useMemo(
        () => [...taxi.offers].sort((a, b) => a.price - b.price),
        [taxi.offers],
    );
    const lowestPrice = sortedOffers[0]?.price ?? 0;
    const highestPrice = sortedOffers[sortedOffers.length - 1]?.price ?? 0;
    const isReturn = tripType === 'return';
    const savings = (highestPrice - lowestPrice) * (isReturn ? 2 : 1);
    const displayPrice = isReturn ? lowestPrice * 2 : lowestPrice;

    const isGroupSelected = selectedVehicleType === taxi.vehicleType;
    const visibleOffers = expanded ? sortedOffers : sortedOffers.slice(0, 2);

    return (
        <div className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2
            ${isGroupSelected ? 'border-blue-600 shadow-blue-100' : 'border-gray-100 hover:border-blue-200'}`}>

            {/* ── Vehicle banner: thumbnail left + title/price right ── */}
            <div className="flex items-stretch border-b border-gray-100">

                {/* Fixed square thumbnail — never crops weirdly */}
                <div className="relative w-36 sm:w-48 flex-shrink-0 overflow-hidden bg-gray-200">
                    <img
                        src={taxi.image}
                        alt={taxi.displayName}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    {taxi.popular && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow">
                            Popular
                        </div>
                    )}
                </div>

                {/* Vehicle info + price summary */}
                <div className="flex-1 flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h3 className="text-sm sm:text-base font-black text-gray-900 leading-tight">{taxi.displayName}</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">{taxi.vehicleType}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-gray-500 text-[10px] font-semibold">
                                <Users className="h-3 w-3 text-blue-500" />{taxi.passengers} pax
                            </span>
                            <span className="flex items-center gap-1 text-gray-500 text-[10px] font-semibold">
                                <Briefcase className="h-3 w-3 text-blue-500" />{taxi.luggage} bags
                            </span>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                            {isReturn ? 'return from' : 'from'}
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-gray-900 leading-none">
                            £{displayPrice.toFixed(0)}
                        </div>
                        {savings > 0 && (
                            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">save £{savings}</div>
                        )}
                        {tripType === 'return' && (
                            <div className="text-[9px] text-blue-500 font-semibold mt-0.5">×2 return</div>
                        )}
                    </div>
                </div>
            </div>

            {/*  Company list  */}
            <div className="p-3 flex flex-col gap-2">

                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {taxi.offers.length} {taxi.offers.length === 1 ? 'Company' : 'Companies'}
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                <div className="space-y-1.5">
                    {visibleOffers.map(offer => (
                        <CompanyOfferRow
                            key={`${offer.shopifyProductId}-${offer.company}`}
                            offer={offer}
                            lowestPrice={lowestPrice}
                            isSelected={isGroupSelected && selectedCompany === offer.company}
                            onSelect={() => onSelectOffer(taxi.vehicleType, offer.company)}
                            tripType={tripType}
                        />
                    ))}
                </div>

                {sortedOffers.length > 2 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold text-gray-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50"
                    >
                        {expanded
                            ? <><ChevronUp className="h-3.5 w-3.5" />Show less</>
                            : <><ChevronDown className="h-3.5 w-3.5" />Show {sortedOffers.length - 2} more</>
                        }
                    </button>
                )}

                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg py-1.5 px-2.5">
                    <svg className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px] font-bold text-blue-700">Professional Driver Included</span>
                </div>
            </div>
        </div>
    );
};

//  Main Page 

const TaxiOptions: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMobile();

    const dispatch = useAppDispatch();
    const { products: rawProducts, loading, error, initialized } = useAppSelector((state) => state.shopify);
    const { loading: checkoutLoading, error: checkoutError, checkoutUrl } = useAppSelector((state) => state.cart);

    const [searchDetails, setSearchDetails] = useState<SearchDetails>({
        from: 'Heathrow Airport (LHR)',
        to: 'Central London',
        fromCoords: { lat: 51.470, lng: -0.4543 },
        toCoords: { lat: 51.5074, lng: -0.1278 },
        distance: 24.5,
        duration: '45 mins',
        date: '01/15/2025',
        time: '10:00 AM',
        passengers: 4,
    });

    // Selection is now keyed on vehicleType (group) + company
    const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'price' | 'rating' | 'passengers'>('price');
    const [parkingAcknowledged, setParkingAcknowledged] = useState(false);
    const [flightNumber, setFlightNumber] = useState('');

    const isAirportTrip = useMemo(() => (
        isAirportLocation(searchDetails.from) || isAirportLocation(searchDetails.to)
    ), [searchDetails.from, searchDetails.to]);

    const distance = searchDetails.distance || 18.5;
    const duration = searchDetails.duration || '25 mins';
    const requiredPassengers = searchDetails.passengers || 1;

    useEffect(() => {
        if (!initialized) dispatch(fetchTaxiProducts());
    }, [dispatch, initialized]);

    useEffect(() => {
        if (checkoutUrl) window.location.href = checkoutUrl;
    }, [checkoutUrl]);

    useEffect(() => {
        if (location.state) {
            const state = location.state as SearchDetails;
            setSearchDetails(prev => ({
                ...prev,
                ...state,
                fromCoords: state.fromCoords || prev.fromCoords,
                toCoords: state.toCoords || prev.toCoords,
            }));
        }
    }, [location]);

    useEffect(() => {
        if (selectedVehicleType === null) {
            setParkingAcknowledged(false);
            setFlightNumber('');
        }
    }, [selectedVehicleType]);

    // ── Group products by vehicle_type ───────────────────────────────────────
    const vehicleGroups = useMemo(
        () => groupProductsByVehicleType(rawProducts, distance),
        [rawProducts, distance],
    );

    // ── Filter & sort ────────────────────────────────────────────────────────
    const filteredVehicles = useMemo(() => {
        return vehicleGroups
            .filter(v => v.passengers >= requiredPassengers)
            .filter(v => {
                if (activeFilter === 'all') return true;
                if (activeFilter === 'popular') return v.popular;
                if (activeFilter === 'economy') return v.perKmRate <= 2.5;
                if (activeFilter === 'premium') return v.perKmRate > 3.5;
                return true;
            })
            .sort((a, b) => {
                const aMin = Math.min(...a.offers.map(o => o.price));
                const bMin = Math.min(...b.offers.map(o => o.price));
                if (sortBy === 'price') return aMin - bMin;
                if (sortBy === 'rating') return b.rating - a.rating;
                return b.passengers - a.passengers;
            });
    }, [vehicleGroups, requiredPassengers, activeFilter, sortBy]);

    // ── Derived selection ────────────────────────────────────────────────────
    const selectedGroup = vehicleGroups.find(v => v.vehicleType === selectedVehicleType) ?? null;
    const selectedOffer = selectedGroup?.offers.find(o => o.company === selectedCompany) ?? null;
    const displayPrice = selectedOffer
        ? (searchDetails.tripType === 'return' ? selectedOffer.price * 2 : selectedOffer.price)
        : null;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleSelectOffer = (vehicleType: string, company: string) => {
        if (selectedVehicleType === vehicleType && selectedCompany === company) {
            // Deselect on second click
            setSelectedVehicleType(null);
            setSelectedCompany(null);
        } else {
            setSelectedVehicleType(vehicleType);
            setSelectedCompany(company);
        }
    };
    const handleProceedToPay = () => {
        if (isAirportTrip) {
            if (!parkingAcknowledged) { alert('Please acknowledge parking fees.'); return; }
            if (!flightNumber.trim()) { alert('Please enter your flight number.'); return; }
        }
        if (!selectedGroup || !selectedOffer) return;

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
                    baseFare: selectedOffer.baseFare,
                    perKmRate: selectedGroup.perKmRate,
                    estimatedArrival: selectedOffer.eta,
                    eta: selectedOffer.eta,
                    features: [],
                    variants: [],
                } satisfies import('../types').TaxiOption,
                search: {
                    ...searchDetails,
                    flightNumber: isAirportTrip ? flightNumber.trim() : undefined,
                },
                totalPrice: displayPrice ?? selectedOffer.price,
                quantity: searchDetails.tripType === 'return' ? 2 : 1,
            }
        }));
    };

    const isProceedDisabled = () => {
        if (checkoutLoading || !selectedVehicleType) return true;
        if (isAirportTrip) return !parkingAcknowledged || !flightNumber.trim();
        return false;
    };

    // ── Render: Loading ───────────────────────────────────────────────────────
    if (loading && !initialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Available Transport</h2>
                    <p className="text-gray-600">Comparing prices across companies…</p>
                </div>
            </div>
        );
    }

    // ── Render: Error ─────────────────────────────────────────────────────────
    if (error && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button onClick={() => dispatch(fetchTaxiProducts())}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
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

    //  Render: No products 
    if (initialized && vehicleGroups.length === 0 && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Vehicles Available</h2>
                    <p className="text-gray-600 mb-6">
                        We couldn't find any vehicles that can accommodate {requiredPassengers} passenger{requiredPassengers > 1 ? 's' : ''}.
                    </p>
                    <div className="space-y-3">
                        <button onClick={() => dispatch(fetchTaxiProducts())}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <RefreshCw className="h-5 w-5" /> Refresh
                        </button>
                        <button onClick={() => navigate('/')}
                            className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all">
                            Change Search
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEOHead
                title="Transport Options - UK Group Travel Solutions"
                description="Compare transfer prices from multiple companies. Airport transfers, day trips, events, school runs and more."
                keywords="group transport options UK, minibus transport solutions, coach hire options, group travel UK"
                canonicalUrl="/transport-options"
            />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 pb-24">

                {/* Fixed Header */}
                <div className="bg-white shadow-lg sticky top-16 z-40 border-b border-gray-200">
                    <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                        <TaxiHeader
                            searchDetails={searchDetails}
                            onEditSearch={() => navigate('/')}
                            isMobile={isMobile}
                        />
                    </div>
                </div>

                <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">

                    {/*  MOBILE  */}
                    {isMobile && (
                        <>
                            <div className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Navigation className="h-4 w-4 text-blue-600" /> Route Map
                                    </h2>
                                </div>
                                <div className="h-64 sm:h-80 p-2">
                                    <MapView
                                        from={searchDetails.from} to={searchDetails.to}
                                        fromCoords={searchDetails.fromCoords || { lat: 25.2532, lng: 55.3657 }}
                                        toCoords={searchDetails.toCoords || { lat: 25.1972, lng: 55.2744 }}
                                        distance={distance} duration={duration}
                                        selectedTaxiId={selectedVehicleType ? 1 : null}
                                    />
                                </div>
                            </div>

                            {isAirportTrip && selectedVehicleType && (
                                <div className="mb-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Plane className="h-5 w-5 text-blue-600" />
                                        <h4 className="font-bold text-gray-900">Airport Trip Information</h4>
                                    </div>
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={parkingAcknowledged}
                                            onChange={e => setParkingAcknowledged(e.target.checked)}
                                            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                I acknowledge that parking fees will be collected
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">Airport parking charges applicable</p>
                                        </div>
                                    </label>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Flight Number <span className="text-red-500">*</span>
                                        </label>
                                        <input type="text" value={flightNumber}
                                            onChange={e => setFlightNumber(e.target.value.toUpperCase())}
                                            placeholder="e.g., BA0245"
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium uppercase" />
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <h1 className="text-xl font-bold text-gray-900 mb-1">
                                    Available Transport ({filteredVehicles.length})
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    Comparing prices · {requiredPassengers} passenger{requiredPassengers > 1 ? 's' : ''} · {distance.toFixed(1)} miles
                                </p>
                            </div>

                            <Filters activeFilter={activeFilter} sortBy={sortBy}
                                onFilterChange={setActiveFilter} onSortChange={setSortBy} />

                            <div className="space-y-4 mt-4">
                                {filteredVehicles.map(taxi => (
                                    <TaxiCard
                                        key={taxi.vehicleType}
                                        taxi={taxi}
                                        selectedVehicleType={selectedVehicleType}
                                        selectedCompany={selectedVehicleType === taxi.vehicleType ? selectedCompany : null}
                                        tripType={searchDetails.tripType}
                                        onSelectOffer={handleSelectOffer}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/*  DESKTOP  */}
                    {!isMobile && (
                        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

                            {/* Left: vehicle list */}
                            <div className="lg:col-span-2">
                                <div className="mb-6">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                        Available Transport <span className="text-blue-600">({filteredVehicles.length})</span>
                                    </h1>
                                    <p className="text-gray-600 mb-4">
                                        Comparing prices from multiple companies · {requiredPassengers} passenger{requiredPassengers > 1 ? 's' : ''} · {distance.toFixed(1)} miles
                                    </p>
                                    <Filters activeFilter={activeFilter} sortBy={sortBy}
                                        onFilterChange={setActiveFilter} onSortChange={setSortBy} />
                                </div>

                                <div className="space-y-4">
                                    {filteredVehicles.map(taxi => (
                                        <TaxiCard
                                            key={taxi.vehicleType}
                                            taxi={taxi}
                                            selectedVehicleType={selectedVehicleType}
                                            selectedCompany={selectedVehicleType === taxi.vehicleType ? selectedCompany : null}
                                            tripType={searchDetails.tripType}
                                            onSelectOffer={handleSelectOffer}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Right: Map + Booking Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto space-y-4">

                                    {/* Booking summary */}
                                    {selectedGroup && selectedOffer && (
                                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-500 animate-slideIn">
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                                                <h3 className="text-lg font-bold mb-1">Booking Summary</h3>
                                                <p className="text-sm text-blue-100">
                                                    {searchDetails.tripType === 'return' ? 'Round Trip' : 'One-Way Trip'}
                                                </p>
                                            </div>

                                            <div className="p-4 space-y-3">
                                                {checkoutError && (
                                                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 flex items-start gap-2">
                                                        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                        <p className="text-red-700 text-sm">{checkoutError}</p>
                                                    </div>
                                                )}

                                                {isAirportTrip && (
                                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Plane className="h-5 w-5 text-blue-600" />
                                                            <h4 className="font-bold text-gray-900">Airport Trip Information</h4>
                                                        </div>
                                                        <label className="flex items-start gap-3 cursor-pointer group">
                                                            <input type="checkbox" checked={parkingAcknowledged}
                                                                onChange={e => setParkingAcknowledged(e.target.checked)}
                                                                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                    I acknowledge that parking fees will be collected
                                                                </p>
                                                                <p className="text-xs text-gray-600 mt-1">Airport parking charges applicable</p>
                                                            </div>
                                                        </label>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                                Flight Number <span className="text-red-500">*</span>
                                                            </label>
                                                            <input type="text" value={flightNumber}
                                                                onChange={e => setFlightNumber(e.target.value.toUpperCase())}
                                                                placeholder="e.g., BA0245"
                                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium uppercase" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Selected vehicle */}
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Selected Vehicle</p>
                                                    <div className="flex items-center gap-3">
                                                        <img src={selectedGroup.image} alt={selectedGroup.displayName}
                                                            className="w-16 h-10 object-cover rounded-lg" />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-gray-900">{selectedGroup.displayName}</p>
                                                            <p className="text-xs text-gray-500">{selectedGroup.vehicleType}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Selected company */}
                                                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black shadow flex-shrink-0"
                                                        style={{ backgroundColor: companyColor(selectedOffer.company) }}>
                                                        {selectedOffer.company[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-gray-900">{selectedOffer.company}</p>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <Star className="h-3 w-3 fill-amber-600 text-amber-600" />
                                                            <span className="text-xs text-gray-500">{selectedOffer.rating} · {selectedOffer.reviews} reviews</span>
                                                        </div>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                                                        <CheckCircle2 className="h-3 w-3" />Verified
                                                    </span>
                                                </div>

                                                {/* Journey details */}
                                                <div className="border-t border-gray-200 pt-3">
                                                    <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Journey Details</p>
                                                    <div className="space-y-1.5 text-sm">
                                                        {searchDetails.tripType === 'return' ? (
                                                            <>
                                                                <div className="bg-blue-50 p-2 rounded-lg">
                                                                    <p className="text-xs font-semibold text-blue-700 mb-1">→ Pickup</p>
                                                                    <div className="text-xs text-gray-700">
                                                                        <div>{formatDateDisplay(searchDetails.date)} at {searchDetails.time}</div>
                                                                        <div className="text-gray-500">{distance.toFixed(1)} miles</div>
                                                                    </div>
                                                                </div>
                                                                {searchDetails.returnDate && (
                                                                    <div className="bg-green-50 p-2 rounded-lg">
                                                                        <p className="text-xs font-semibold text-green-700 mb-1">← Return</p>
                                                                        <div className="text-xs text-gray-700">
                                                                            <div>{formatDateDisplay(searchDetails.returnDate)} at {searchDetails.returnTime}</div>
                                                                            <div className="text-gray-500">{distance.toFixed(1)} miles</div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Date & Time</span>
                                                                    <span className="font-semibold text-gray-900">{formatDateDisplay(searchDetails.date)} at {searchDetails.time}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Distance</span>
                                                                    <span className="font-semibold text-gray-900">{distance.toFixed(1)} miles</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Duration</span>
                                                                    <span className="font-semibold text-gray-900">{duration}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Price breakdown */}
                                                <div className="border-t border-gray-200 pt-3">
                                                    <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Price Breakdown</p>
                                                    <div className="space-y-1.5 text-sm">
                                                        {searchDetails.tripType === 'return' ? (
                                                            <>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Outbound</span>
                                                                    <span className="font-semibold text-gray-900">{selectedOffer.currency}{selectedOffer.price}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600">Return</span>
                                                                    <span className="font-semibold text-gray-900">{selectedOffer.currency}{selectedOffer.price}</span>
                                                                </div>
                                                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                                                    <span className="font-bold text-gray-900">Total</span>
                                                                    <span className="text-xl font-bold text-blue-600">{selectedOffer.currency}{displayPrice}</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="flex justify-between">
                                                                <span className="font-bold text-gray-900">Total</span>
                                                                <span className="text-xl font-bold text-blue-600">{selectedOffer.currency}{displayPrice}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleProceedToPay}
                                                    disabled={isProceedDisabled()}
                                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3.5 px-6 rounded-xl
                                                        hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300
                                                        flex items-center justify-center gap-3 mt-4
                                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                >
                                                    {checkoutLoading
                                                        ? <><RefreshCw className="h-5 w-5 animate-spin" /><span>Processing...</span></>
                                                        : <><Lock className="h-5 w-5" /><span>Proceed to Pay</span></>
                                                    }
                                                </button>
                                                <p className="text-center text-[10px] text-gray-600 flex items-center justify-center gap-1 mt-1">
                                                    <Shield className="h-3 w-3" /> Secure SSL encrypted payment
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Map */}
                                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                        <div className="p-4 border-b border-gray-200">
                                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <Navigation className="h-5 w-5 text-blue-600" /> Route Map
                                            </h2>
                                            <p className="text-gray-600 text-xs mt-1 truncate">
                                                {searchDetails.from} → {searchDetails.to}
                                            </p>
                                        </div>
                                        <div className="h-[350px] p-3">
                                            <MapView
                                                from={searchDetails.from} to={searchDetails.to}
                                                fromCoords={searchDetails.fromCoords || { lat: 25.2532, lng: 55.3657 }}
                                                toCoords={searchDetails.toCoords || { lat: 25.1972, lng: 55.2744 }}
                                                distance={distance} duration={duration}
                                                selectedTaxiId={selectedVehicleType ? 1 : null}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile bottom bar */}
                {isMobile && selectedGroup && selectedOffer && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 animate-slideUp">
                        <div className="container mx-auto px-4 py-3">
                            {checkoutError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-2 mb-3">
                                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-red-700 text-xs">{checkoutError}</p>
                                </div>
                            )}
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 mb-0.5">Selected Vehicle</p>
                                    <p className="font-bold text-gray-900 truncate text-sm">{selectedGroup.displayName}</p>
                                    <p className="text-xs text-gray-500">{selectedOffer.company}</p>
                                    <p className="text-sm font-black text-blue-600">{selectedOffer.currency}{displayPrice}</p>
                                </div>
                                <button
                                    onClick={handleProceedToPay}
                                    disabled={isProceedDisabled()}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-5 rounded-xl
                                        hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap
                                        disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {checkoutLoading
                                        ? <><RefreshCw className="h-4 w-4 animate-spin" /><span>Processing...</span></>
                                        : <><Lock className="h-4 w-4" /><span>Proceed to Pay</span></>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes slideIn { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
                    @keyframes slideUp { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
                    .animate-slideIn { animation: slideIn 0.3s ease-out; }
                    .animate-slideUp { animation: slideUp 0.3s ease-out; }
                `}</style>
            </div>
        </>
    );
};

export default TaxiOptions;
import React, { useEffect, useState, useMemo } from 'react';
import {
    Users, Briefcase, Star, Loader, AlertCircle, RefreshCw,
    ChevronDown, ChevronUp, TrendingDown, Shield, Clock, BadgeCheck, Zap,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTaxiProducts } from '../store/slices/shopifySlice';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CompanyOffer {
    company: string;
    baseFare: number;   // metafield base_fare — used for display in card & offer row
    price: number;      // distance-band variant price — used for checkout
    currency: string;
    rating: number;
    reviews: number;
    eta: string;
    tag?: 'Best Price' | 'Top Rated' | 'Fastest';
    variantId: string;
    shopifyProductId: string;
}

interface VehicleGroup {
    /** Derived from metafield vehicle_type, e.g. "5 Passenger" */
    vehicleType: string;
    /** Display label parsed from title prefix, e.g. "5 Seater Car" */
    displayName: string;
    passengers: number;
    luggage: number;
    popular: boolean;
    image: string;
    offers: CompanyOffer[];
}

//  Helpers

/**
 * Title format: "5 Seater Car - TransferEase"
 * Returns { vehicleLabel: "5 Seater Car", company: "TransferEase" }
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

/** Parse variant price regardless of whether Shopify returns a string or object */
function parsePrice(price: any): number {
    if (typeof price === 'object' && price !== null) return parseFloat(price.amount ?? '0');
    return parseFloat(String(price ?? '0'));
}

/**
 * Given the trip distance (miles) and a product's variants
 * (titled "0-10 miles", "11-20 miles" …), return the matching variant.
 */
function getVariantForDistance(variants: any[], distanceMiles: number): any | null {
    if (!variants?.length) return null;

    for (const v of variants) {
        const match = v.title?.match(/^(\d+)-(\d+)\s*miles?$/i);
        if (match) {
            const min = parseInt(match[1], 10);
            const max = parseInt(match[2], 10);
            if (distanceMiles >= min && distanceMiles <= max) return v;
        }
    }

    // Fallback: last distance-band variant
    const distanceBands = variants.filter(v => /^\d+-\d+\s*miles?$/i.test(v.title ?? ''));
    return distanceBands[distanceBands.length - 1] ?? variants[variants.length - 1] ?? null;
}

/**
 * Group raw Shopify products by their `vehicle_type` metafield.
 *
 * Expected product shape from your shopifySlice:
 *   product.title       — "5 Seater Car - TransferEase"
 *   product.vehicleType — metafield value, e.g. "5 Passenger"   ← GROUP KEY
 *   product.passengers  — metafield integer
 *   product.luggage     — metafield integer
 *   product.popular     — metafield boolean / "true"
 *   product.rating      — metafield decimal
 *   product.reviews     — metafield integer
 *   product.eta         — metafield string, e.g. "5-7 mins"
 *   product.image       — first image URL
 *   product.variants    — Shopify variants array
 *   product.shopifyId   — product GID
 */
function groupProductsByVehicleType(
    products: any[],
    distanceMiles: number,
): VehicleGroup[] {
    // Map keyed by vehicle_type metafield value
    const map = new Map<string, VehicleGroup>();

    for (const product of products) {
        //  Determine group key
        // product.vehicleType  ← metafield "vehicle_type" (set by transformProduct)
        // product.type         ← same value, legacy alias
        // product.displayName  ← label parsed from title prefix, e.g. "5 Seater Car"
        // Fallback chain ensures we never show "Unknown"
        const { vehicleLabel: titleLabel, company: titleCompany } = parseTitleParts(product.title ?? '');
        const groupKey: string = product.vehicleType || product.type || titleLabel || 'Unknown';

        // company name: prefer dedicated metafield, fall back to title parse
        const company: string = product.companyName || titleCompany;

        // displayName shown inside the card image overlay
        const displayName: string = product.displayName || titleLabel;

        //  Find the correct distance-band variant
        const variant = getVariantForDistance(product.variants ?? [], distanceMiles);
        if (!variant) continue;

        const price = parsePrice(variant.price);
        if (price <= 0) continue;

        //  Build a CompanyOffer for this product 
        const baseFare = parseFloat(String(product.baseFare ?? product.base_fare ?? '0'));

        const offer: CompanyOffer = {
            company,
            baseFare,               // shown in the card UI
            price,                  // distance-band variant price — sent to checkout
            currency: '£',
            rating: parseFloat(String(product.rating ?? '4.5')),
            reviews: parseInt(String(product.reviews ?? '0'), 10),
            eta: String(product.eta ?? product.estimatedArrival ?? '5 min').replace(/^"|"$/g, ''),
            variantId: variant.id,
            shopifyProductId: product.shopifyProductId ?? product.shopifyId ?? product.id ?? '',
        };

        //  Add to existing group or create a new one 
        if (map.has(groupKey)) {
            map.get(groupKey)!.offers.push(offer);
        } else {
            map.set(groupKey, {
                vehicleType: groupKey,
                displayName,
                passengers: parseInt(String(product.passengers ?? '4'), 10),
                luggage: parseInt(String(product.luggage ?? '2'), 10),
                popular: product.popular === true || product.popular === 'true',
                image: product.image ?? '',
                offers: [offer],
            });
        }
    }

    //  Assign tags — based on baseFare (starting price) 
    for (const group of map.values()) {
        const byBase = [...group.offers].sort((a, b) => a.baseFare - b.baseFare);
        const cheapest = byBase[0];
        const topRated = [...group.offers].sort((a, b) => b.rating - a.rating)[0];

        // Reset tags first
        for (const offer of group.offers) {
            offer.tag = undefined;
        }

        if (cheapest) cheapest.tag = 'Best Price';
        if (topRated && topRated.company !== cheapest?.company) topRated.tag = 'Top Rated';
    }

    //  Sort groups by passenger count ascending 
    return Array.from(map.values()).sort((a, b) => a.passengers - b.passengers);
}

//  Company colour palette 

const COMPANY_COLORS: Record<string, string> = {
    TransferEase: '#ea580c',
    RideXpress: '#2563eb',
    LuxiCab: '#7c3aed',
    CityLink: '#059669',
};

function companyColor(name: string): string {
    if (COMPANY_COLORS[name]) return COMPANY_COLORS[name];
    const key = Object.keys(COMPANY_COLORS).find(k =>
        name.toLowerCase().includes(k.toLowerCase()),
    );
    return key ? COMPANY_COLORS[key] : '#6b7280';
}

//  TagPill 

const TAG_CONFIG: Record<string, { cls: string; icon: React.ReactNode }> = {
    'Best Price': { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <TrendingDown className="h-2.5 w-2.5" /> },
    'Top Rated': { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <BadgeCheck className="h-2.5 w-2.5" /> },
    'Fastest': { cls: 'bg-sky-50 text-sky-700 border-sky-200', icon: <Zap className="h-2.5 w-2.5" /> },
};

const TagPill: React.FC<{ tag?: string }> = ({ tag }) => {
    if (!tag || !TAG_CONFIG[tag]) return null;
    const { cls, icon } = TAG_CONFIG[tag];
    return (
        <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide ${cls}`}>
            {icon}{tag}
        </span>
    );
};

//  OfferRow 

const OfferRow: React.FC<{
    offer: CompanyOffer;
    lowestBaseFare: number;
    onSelect: (offer: CompanyOffer) => void;
}> = ({ offer, lowestBaseFare, onSelect }) => {
    const isCheapest = offer.baseFare === lowestBaseFare;
    const diff = offer.baseFare - lowestBaseFare;
    const color = companyColor(offer.company);

    return (
        <button
            onClick={() => onSelect(offer)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all duration-200 text-left
                ${isCheapest
                    ? 'border-emerald-200 bg-emerald-50/70 hover:border-emerald-300'
                    : 'border-transparent bg-gray-50/80 hover:bg-white hover:border-gray-200'
                }`}
        >
            {/* Avatar */}
            <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-black shadow-sm"
                style={{ backgroundColor: color }}
            >
                {offer.company[0]}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span className="text-[11px] font-bold text-gray-900">{offer.company}</span>
                    <TagPill tag={offer.tag} />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-500">{offer.rating}</span>
                    <span>·</span>
                    <span>{offer.reviews} reviews</span>
                    <span>·</span>
                    <Clock className="h-2.5 w-2.5" />
                    <span>{offer.eta}</span>
                </div>
            </div>

            {/* Price — shows baseFare (starting price) */}
            <div className="text-right flex-shrink-0">
                <div className={`text-[9px] text-gray-400 leading-none mb-0.5`}>from</div>
                <div className={`text-base font-black ${isCheapest ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {offer.currency}{offer.baseFare}
                </div>
                {diff > 0 && (
                    <div className="text-[9px] text-red-400 font-semibold">+£{diff} more</div>
                )}
            </div>
        </button>
    );
};

//  VehicleCard 

const VehicleCard: React.FC<{
    vehicle: VehicleGroup;
    onSelectOffer: (vehicle: VehicleGroup, offer: CompanyOffer) => void;
}> = ({ vehicle, onSelectOffer }) => {
    const [expanded, setExpanded] = useState(false);

    const sortedOffers = useMemo(
        () => [...vehicle.offers].sort((a, b) => a.baseFare - b.baseFare),
        [vehicle.offers],
    );
    const lowestBaseFare = sortedOffers[0]?.baseFare ?? 0;
    const highestBaseFare = sortedOffers[sortedOffers.length - 1]?.baseFare ?? 0;
    const savings = highestBaseFare - lowestBaseFare;
    const visibleOffers = expanded ? sortedOffers : sortedOffers.slice(0, 2);

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">

            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {vehicle.image ? (
                    <img
                        src={vehicle.image}
                        alt={vehicle.displayName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Users className="h-16 w-16" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-gray-800 shadow">
                    {vehicle.vehicleType}
                </div>
                {vehicle.popular && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-[11px] font-bold shadow">
                        Popular
                    </div>
                )}

                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between">
                    <div>
                        <h3 className="text-white font-black text-base leading-tight">{vehicle.displayName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-white/90">
                                <Users className="h-3 w-3" />
                                <span className="text-[11px] font-semibold">{vehicle.passengers} pax</span>
                            </div>
                            <div className="flex items-center gap-1 text-white/90">
                                <Briefcase className="h-3 w-3" />
                                <span className="text-[11px] font-semibold">{vehicle.luggage} bags</span>
                            </div>
                            <div className="flex items-center gap-1 text-white/90">
                                <Shield className="h-3 w-3" />
                                <span className="text-[11px] font-semibold">Driver incl.</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-white/70">From</div>
                        <div className="text-xl font-black text-white leading-none">£{lowestBaseFare}</div>
                        {savings > 0 && (
                            <div className="text-[10px] text-emerald-300 font-bold">Save up to £{savings}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Offers list */}
            <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        {vehicle.offers.length} {vehicle.offers.length === 1 ? 'Company' : 'Companies'}
                    </span>
                    <span className="text-[11px] text-gray-400">Compare prices</span>
                </div>

                {visibleOffers.map((offer) => (
                    <OfferRow
                        key={`${offer.shopifyProductId}-${offer.company}`}
                        offer={offer}
                        lowestBaseFare={lowestBaseFare}
                        onSelect={(o) => onSelectOffer(vehicle, o)}
                    />
                ))}

                {sortedOffers.length > 2 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center justify-center gap-1.5 mt-1 py-2 text-[11px] font-bold text-gray-500 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50"
                    >
                        {expanded
                            ? <><ChevronUp className="h-3.5 w-3.5" />Show less</>
                            : <><ChevronDown className="h-3.5 w-3.5" />Show {sortedOffers.length - 2} more</>
                        }
                    </button>
                )}
            </div>
        </div>
    );
};

//  Main Component 

interface PopularCarsProps {
    distanceMiles?: number;
    onBookOffer?: (vehicle: VehicleGroup, offer: CompanyOffer) => void;
}

const PopularCars: React.FC<PopularCarsProps> = ({
    distanceMiles = 0,
    onBookOffer,
}) => {
    const dispatch = useAppDispatch();
    const { products, loading, error, initialized } = useAppSelector((state) => state.shopify);

    useEffect(() => {
        if (!initialized) dispatch(fetchTaxiProducts());
    }, [dispatch, initialized]);

    const vehicleGroups = useMemo(
        () => groupProductsByVehicleType(products, distanceMiles),
        [products, distanceMiles],
    );

    const handleSelectOffer = (vehicle: VehicleGroup, offer: CompanyOffer) => {
        if (onBookOffer) {
            onBookOffer(vehicle, offer);
        } else {
            console.log('Book:', vehicle.displayName, '|', offer.company, '| £' + offer.price, '| variantId:', offer.variantId);
        }
    };

    if (loading && !initialized) {
        return (
            <section className="py-16 lg:py-24 bg-gray-50">
                <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center justify-center py-20">
                    <Loader className="h-10 w-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Comparing prices across companies…</p>
                </div>
            </section>
        );
    }

    if (error && !loading) {
        return (
            <section className="py-16 lg:py-24 bg-gray-50">
                <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center justify-center py-20">
                    <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                    <p className="text-gray-900 font-semibold mb-2">Failed to load vehicles</p>
                    <p className="text-gray-500 text-sm mb-4">{error}</p>
                    <button
                        onClick={() => dispatch(fetchTaxiProducts())}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" /> Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        <TrendingDown className="h-4 w-4" />
                        Best Price Guarantee
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
                        Compare & Save
                    </h2>
                    <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
                        We compare prices from top transfer companies so you always get the best deal. Book directly — no hidden fees.
                    </p>
                    {distanceMiles > 0 && (
                        <p className="mt-2 text-sm text-blue-600 font-semibold">
                            Showing prices for {distanceMiles} miles
                        </p>
                    )}

                    {/* Trust bar */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
                        {[
                            { icon: <Shield className="h-4 w-4" />, label: 'Secure Booking' },
                            { icon: <BadgeCheck className="h-4 w-4" />, label: 'Verified Drivers' },
                            { icon: <TrendingDown className="h-4 w-4" />, label: 'Lowest Price' },
                            { icon: <Clock className="h-4 w-4" />, label: 'Instant Confirmation' },
                        ].map(({ icon, label }) => (
                            <div key={label} className="flex items-center gap-1.5 text-gray-600 text-sm font-medium">
                                <span className="text-blue-600">{icon}</span>
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {vehicleGroups.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {vehicleGroups.map((group) => (
                            <VehicleCard
                                key={group.vehicleType}
                                vehicle={group}
                                onSelectOffer={handleSelectOffer}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-400">
                        {initialized ? 'No vehicles available for this distance.' : 'Loading vehicles…'}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularCars;
export type { VehicleGroup, CompanyOffer };
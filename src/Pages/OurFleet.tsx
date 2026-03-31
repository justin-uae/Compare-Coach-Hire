import React, { useEffect, useMemo, useState } from 'react';
import { Users, Briefcase, Star, Loader, AlertCircle, RefreshCw, Filter, X, Building2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTaxiProducts } from '../store/slices/shopifySlice';
import SEOHead from '../Components/SEOHead';

//  Types 

interface FleetGroup {
    vehicleType: string;    // metafield vehicle_type — group key & badge
    displayName: string;    // parsed from title prefix, e.g. "5 Seater Car"
    passengers: number;
    luggage: number;
    popular: boolean;
    image: string;
    lowestBaseFare: number;
    bestRating: number;
    totalReviews: number;
    companyCount: number;
    companies: string[];    // list of company names in this group
}

//  Helpers 

function parseTitleParts(title: string): { vehicleLabel: string; company: string } {
    const idx = title.lastIndexOf(' - ');
    if (idx !== -1) {
        return { vehicleLabel: title.slice(0, idx).trim(), company: title.slice(idx + 3).trim() };
    }
    return { vehicleLabel: title.trim(), company: title.trim() };
}

/**
 * Group all products by vehicleType metafield.
 * One card per group — shows lowest baseFare and number of companies available.
 */
function groupProductsForFleet(products: any[]): FleetGroup[] {
    const map = new Map<string, FleetGroup>();

    for (const product of products) {
        const { vehicleLabel: titleLabel, company: titleCompany } = parseTitleParts(product.title ?? '');
        const groupKey: string = product.vehicleType || product.type || titleLabel || 'Unknown';
        const company: string = product.companyName || titleCompany;
        const displayName: string = product.displayName || titleLabel;
        const baseFare = parseFloat(String(product.baseFare ?? product.base_fare ?? '0'));
        const rating = parseFloat(String(product.rating ?? '4.5'));
        const reviews = parseInt(String(product.reviews ?? '0'), 10);

        if (map.has(groupKey)) {
            const group = map.get(groupKey)!;
            if (baseFare > 0 && (group.lowestBaseFare === 0 || baseFare < group.lowestBaseFare)) {
                group.lowestBaseFare = baseFare;
            }
            if (rating > group.bestRating) group.bestRating = rating;
            group.totalReviews += reviews;
            group.companyCount += 1;
            if (company && !group.companies.includes(company)) group.companies.push(company);
            // Prefer popular image if not already marked popular
            if (!group.popular && (product.popular === true || product.popular === 'true')) {
                group.popular = true;
            }
        } else {
            map.set(groupKey, {
                vehicleType: groupKey,
                displayName,
                passengers: parseInt(String(product.passengers ?? '4'), 10),
                luggage: parseInt(String(product.luggage ?? '2'), 10),
                popular: product.popular === true || product.popular === 'true',
                image: product.image ?? '',
                lowestBaseFare: baseFare,
                bestRating: rating,
                totalReviews: reviews,
                companyCount: 1,
                companies: company ? [company] : [],
            });
        }
    }

    return Array.from(map.values()).sort((a, b) => a.passengers - b.passengers);
}

//  Fleet Card 

const FleetCard: React.FC<{ group: FleetGroup }> = ({ group }) => (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-blue-200">

        {/* Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-40 sm:h-44">
            <img
                src={group.image}
                alt={group.displayName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Type badge */}
            <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-gray-800 shadow-lg">
                {group.vehicleType}
            </div>

            {/* Popular badge */}
            {group.popular && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                    Popular
                </div>
            )}

            {/* Companies available badge — bottom right */}
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-xl text-right">
                <p className="text-white/70 text-[9px] leading-none">from</p>
                <p className="text-white font-black text-sm leading-tight">
                    {group.lowestBaseFare > 0 ? `GBP ${group.lowestBaseFare}` : 'POA'}
                </p>
            </div>
        </div>

        {/* Details */}
        <div className="p-4">
            {/* Name & rating */}
            <div className="mb-3">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {group.displayName}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-blue-500 text-blue-500" />
                        <span className="text-xs font-bold text-blue-700">{group.bestRating}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        {group.totalReviews} reviews
                    </span>
                </div>
            </div>

            {/* Specs */}
            <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-gray-700">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                            <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-700" />
                        </div>
                        <span className="text-xs font-semibold">{group.passengers} passengers</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                        <div className="p-1.5 bg-purple-50 rounded-lg">
                            <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-700" />
                        </div>
                        <span className="text-xs font-semibold">{group.luggage} bags</span>
                    </div>
                </div>

                {/* Company count */}
                {group.companyCount > 0 && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl py-1.5 px-3">
                        <Building2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                        <span className="text-xs font-bold text-emerald-700">
                            {group.companyCount} {group.companyCount === 1 ? 'company' : 'companies'} available
                        </span>
                        {group.companies.length > 0 && (
                            <span className="text-[10px] text-emerald-600 truncate hidden sm:inline">
                                · {group.companies.slice(0, 2).join(', ')}{group.companies.length > 2 ? ` +${group.companies.length - 2}` : ''}
                            </span>
                        )}
                    </div>
                )}

                {/* Driver included */}
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-amber-50 border-2 border-blue-200 rounded-xl py-2 px-3">
                    <svg className="h-4 w-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-bold text-blue-700">Professional Driver Included</span>
                </div>
            </div>
        </div>
    </div>
);

//  Main Component 

const OurFleet: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, loading, error, initialized } = useAppSelector((state) => state.shopify);

    const [filterType, setFilterType] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('passengers-low');

    useEffect(() => {
        if (!initialized) dispatch(fetchTaxiProducts());
    }, [dispatch, initialized]);

    // Group once — memoized
    const allGroups = useMemo(() => groupProductsForFleet(products), [products]);

    // Unique vehicleType values for filter buttons
    const vehicleTypes = useMemo(
        () => ['all', ...Array.from(new Set(allGroups.map(g => g.vehicleType)))],
        [allGroups],
    );

    const filteredGroups = useMemo(() => {
        return allGroups
            .filter(g => filterType === 'all' || g.vehicleType === filterType)
            .sort((a, b) => {
                switch (sortBy) {
                    case 'popular': return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
                    case 'rating': return b.bestRating - a.bestRating;
                    case 'price-low': return a.lowestBaseFare - b.lowestBaseFare;
                    case 'price-high': return b.lowestBaseFare - a.lowestBaseFare;
                    case 'passengers-high': return b.passengers - a.passengers;
                    default: return a.passengers - b.passengers; // passengers-low
                }
            });
    }, [allGroups, filterType, sortBy]);

    //  Loading 

    if (loading && !initialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 pt-16">
                <div className="container mx-auto px-4 py-20">
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="h-16 w-16 text-blue-700 animate-spin mb-4" />
                        <p className="text-gray-700 font-medium text-lg">Loading our fleet...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 pt-16">
                <div className="container mx-auto px-4 py-20">
                    <div className="flex flex-col items-center justify-center py-20">
                        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                        <p className="text-gray-900 font-semibold text-xl mb-2">Failed to load vehicles</p>
                        <p className="text-gray-700 text-sm mb-6">{error}</p>
                        <button onClick={() => dispatch(fetchTaxiProducts())}
                            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                            <RefreshCw className="h-5 w-5" /> Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    //  Main render 

    return (
        <>
            <SEOHead
                title="Our Fleet - Minibus & Coach Vehicles 8 to 72 Passengers"
                description="Browse our full fleet of minibuses and coaches available for hire across the UK. Vehicles ranging from 8 to 72 passengers, all maintained to the highest standards."
                keywords="minibus fleet UK, coach hire vehicles, 8 seater minibus, 16 seater minibus, 72 seater coach, minibus sizes UK"
                canonicalUrl="/vehicles"
            />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 pt-16">

                {/* Hero */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Our Fleet</h1>
                            <p className="text-lg md:text-xl text-blue-100">
                                Discover our wide range of vehicles — from economy to luxury
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8 border border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Filter className="inline h-4 w-4 mr-1" />
                                    Filter by Type
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {vehicleTypes.map(type => (
                                        <button key={type} onClick={() => setFilterType(type)}
                                            className={`px-4 py-2 rounded-xl font-medium transition-all text-sm
                                                ${filterType === type
                                                    ? 'bg-blue-500 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}>
                                            {type === 'all' ? 'All Vehicles' : type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:w-64">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Sort By</label>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-medium">
                                    <option value="passengers-low">Least Passengers</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="passengers-high">Most Passengers</option>
                                </select>
                            </div>
                        </div>

                        {filterType !== 'all' && (
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-sm text-gray-700">Active filter:</span>
                                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {filterType}
                                    <button onClick={() => setFilterType('all')}
                                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results count */}
                    <div className="mb-6">
                        <p className="text-gray-700 font-medium">
                            Showing <span className="text-blue-700 font-bold">{filteredGroups.length}</span> vehicle type{filteredGroups.length !== 1 ? 's' : ''}
                            {filterType !== 'all' && ` in ${filterType} category`}
                        </p>
                    </div>

                    {/* Grid */}
                    {filteredGroups.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                            {filteredGroups.map(group => (
                                <FleetCard key={group.vehicleType} group={group} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                <AlertCircle className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles found</h3>
                            <p className="text-gray-700 mb-6">Try adjusting your filters to see more results</p>
                            {filterType !== 'all' && (
                                <button onClick={() => setFilterType('all')}
                                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg">
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OurFleet;
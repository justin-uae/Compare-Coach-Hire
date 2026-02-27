import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Bus, Search, X, Loader } from 'lucide-react';
import { fetchBlogPosts, type BlogPost } from '../services/shopifyClient';
import SEOHead from '../Components/SEOHead';

export default function BlogListing() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Fetch blogs on mount
    useEffect(() => {
        const loadBlogs = async () => {
            try {
                setLoading(true);
                const allBlogs = await fetchBlogPosts();
                setBlogs(allBlogs);
            } catch (error) {
                console.error('Error loading blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadBlogs();
    }, []);

    // Get unique categories
    const categories = Array.from(new Set(blogs.map((blog) => blog.category))).sort();

    // Filter blogs
    const filteredBlogs = blogs.filter((blog) => {
        const matchesSearch =
            !searchQuery ||
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = !selectedCategory || blog.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const goToBlogDetail = (blogSlug: string) => {
        navigate(`/viewBlog/${blogSlug}`);
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <>
            <SEOHead
                title="Minibus Hire Blog - Tips, Guides & Travel Advice"
                description="Read our latest articles on group travel, minibus hire tips, UK destinations, event transport guides and advice to help you plan your perfect journey."
                keywords="minibus hire blog, group travel tips, coach hire advice, UK travel guide, minibus booking tips"
                canonicalUrl="/blogs"
                appendSiteName={false}
            />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20 md:py-28 overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <Bus className="absolute top-20 right-20 w-32 h-32 text-white animate-pulse" />
                        <Bus className="absolute bottom-20 left-20 w-40 h-40 text-white animate-bounce" style={{ animationDuration: '2.5s' }} />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center z-10">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 animate-fade-in">
                            Minibus Hire <span className="text-orange-200">Blog</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-orange-100 mb-8 animate-fade-in-delay max-w-3xl mx-auto">
                            Travel tips, guides, and insights for group transportation
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto w-full animate-fade-in-delay-2">
                            <div className="relative group">
                                <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400 group-focus-within:text-orange-600 transition-colors z-10" />
                                <input
                                    type="text"
                                    placeholder="Search travel tips, guides, destinations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="relative w-full pl-12 sm:pl-14 md:pl-16 pr-12 sm:pr-14 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl bg-white text-gray-900 text-sm sm:text-base md:text-lg focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-xl font-medium border-2 border-transparent focus:border-orange-400 transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10"
                                    >
                                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                    {/* Category Filter */}
                    {categories.length > 0 && (
                        <div className="mb-8">
                            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl ${!selectedCategory
                                        ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white'
                                        : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-orange-300'
                                        }`}
                                >
                                    All Posts
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl ${selectedCategory === category
                                            ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white'
                                            : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-orange-300'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-gray-600 font-medium">
                            Showing <span className="text-orange-600 font-bold text-lg">{filteredBlogs.length}</span>
                            <span className="ml-1">{filteredBlogs.length === 1 ? 'article' : 'articles'}</span>
                        </p>
                    </div>

                    {/* Blog Grid */}
                    {filteredBlogs.length === 0 ? (
                        <EmptyState searchQuery={searchQuery} onClear={() => { setSearchQuery(''); setSelectedCategory(''); }} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBlogs.map((blog) => (
                                <BlogCard
                                    key={blog.id}
                                    blog={blog}
                                    onClick={() => goToBlogDetail(blog.slug)} // Changed to use slug
                                />
                            ))}
                        </div>
                    )}
                </div>

                <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-delay {
                    0%, 20% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-delay-2 {
                    0%, 40% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }

                .animate-fade-in-delay {
                    animation: fade-in-delay 1.2s ease-out forwards;
                }

                .animate-fade-in-delay-2 {
                    animation: fade-in-delay-2 1.4s ease-out forwards;
                }

                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
            </div>
        </>
    );
}

// Blog Card Component (no changes needed, just using onClick prop)
const BlogCard = ({ blog, onClick }: { blog: BlogPost; onClick: () => void }) => (
    <div
        onClick={onClick}
        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-orange-300 hover:-translate-y-2"
    >
        <div className="relative overflow-hidden" style={{ minHeight: '200px', maxHeight: '240px' }}>
            <img
                src={blog.image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={blog.title}
                style={{ display: 'block' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-orange-600 border border-orange-200 shadow-lg">
                {blog.category}
            </div>
        </div>

        <div className="p-5">
            <div className="flex items-center gap-3 mb-2 text-xs text-orange-600">
                <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">{blog.readTime}</span>
                </div>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                {blog.title}
            </h3>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{blog.excerpt}</p>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    <span className="text-xs font-semibold text-gray-700">{blog.author}</span>
                </div>
                <span className="text-xs font-bold text-orange-600">Read More →</span>
            </div>
        </div>
    </div>
);

// Empty State and LoadingSkeleton remain the same
const EmptyState = ({ searchQuery, onClear }: { searchQuery: string; onClear: () => void }) => (
    <div className="text-center py-20 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
        <Bus className="w-32 h-32 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No Articles Found
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery
                ? `We couldn't find any articles matching "${searchQuery}". Try adjusting your search.`
                : "We couldn't find any articles. Check back soon!"}
        </p>
        <button
            onClick={onClear}
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
            Clear Filters
        </button>
    </div>
);

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 h-80 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col items-center justify-center py-20">
                <Loader className="h-16 w-16 text-orange-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium text-lg">Loading blog articles...</p>
            </div>
        </div>
    </div>
);
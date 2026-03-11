import { SHOPIFY_CONFIG, SHOPIFY_GRAPHQL_URL, METAFIELD_NAMESPACES, METAFIELD_KEYS } from '../config/shopifyConfig';
import type { TaxiOption, TaxiVariant } from '../types';

// Request headers for Shopify API
const headers: HeadersInit = {
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
};

// GraphQL query to fetch products with ALL variants
const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          productType
          tags
          variants(first: 100) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(
            identifiers: [
              { namespace: "taxi_details", key: "vehicle_type" }
              { namespace: "taxi_details", key: "company_name" }
              { namespace: "taxi_details", key: "passengers" }
              { namespace: "taxi_details", key: "luggage" }
              { namespace: "taxi_details", key: "rating" }
              { namespace: "taxi_details", key: "reviews" }
              { namespace: "taxi_details", key: "base_fare" }
              { namespace: "taxi_details", key: "per_km_rate" }
              { namespace: "taxi_details", key: "estimated_arrival" }
              { namespace: "taxi_details", key: "popular" }
              { namespace: "features", key: "features_list" }
            ]
          ) {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

/**
 * Parse variant title to extract mile or KM range.
 * Supports: "0-10 miles", "11-20 miles", "0-50 km", etc.
 */
function parseRangeFromTitle(title: string): { min: number; max: number } | null {
  const match = title.match(/(\d+)-(\d+)/);
  if (match) {
    return { min: parseInt(match[1]), max: parseInt(match[2]) };
  }
  return null;
}

/**
 * Parse variants from Shopify product
 */
function parseVariants(variantEdges: any[]): TaxiVariant[] {
  return variantEdges.map((edge: any) => {
    const variant = edge.node;
    const range = parseRangeFromTitle(variant.title) || { min: 0, max: 50 };

    return {
      id: variant.id,
      title: variant.title,
      price: parseFloat(variant.price?.amount || '0'),
      kmRangeMin: range.min,
      kmRangeMax: range.max,
    };
  });
}

/**
 * Get metafield value with type parsing
 */
function getMetafieldValue(
  metafields: any[],
  namespace: string,
  key: string,
  defaultValue: any
): any {
  const metafield = metafields?.find(
    (m) => m?.namespace === namespace && m?.key === key
  );

  if (!metafield) return defaultValue;

  switch (metafield.type) {
    case 'number_integer':
      return parseInt(metafield.value, 10);
    case 'number_decimal':
      return parseFloat(metafield.value);
    case 'boolean':
      return metafield.value === 'true';
    case 'list.single_line_text_field':
      try {
        return JSON.parse(metafield.value);
      } catch {
        return defaultValue;
      }
    default:
      // Strip surrounding quotes Shopify sometimes wraps around string values
      return String(metafield.value).replace(/^"|"$/g, '');
  }
}

/**
 * Extract company name from product title as a fallback.
 * Title format: "5 Seater Car - TransferEase" → "TransferEase"
 */
function extractCompanyFromTitle(title: string): string {
  const idx = title.lastIndexOf(' - ');
  return idx !== -1 ? title.slice(idx + 3).trim() : title.trim();
}

/**
 * Extract vehicle label from product title as a fallback.
 * Title format: "5 Seater Car - TransferEase" → "5 Seater Car"
 */
function extractVehicleLabelFromTitle(title: string): string {
  const idx = title.lastIndexOf(' - ');
  return idx !== -1 ? title.slice(0, idx).trim() : title.trim();
}

/**
 * Transform Shopify product to TaxiOption.
 *
 * Key fields populated:
 *   .vehicleType   — metafield "vehicle_type"  (group key in comparison UI)
 *   .companyName   — metafield "company_name"  (displayed in offer rows)
 *   .name          — full product title
 *   .displayName   — vehicle label parsed from title (e.g. "5 Seater Car")
 */
function transformProduct(product: any): TaxiOption {
  const metafields = product.metafields || [];
  const image = product.images?.edges?.[0]?.node?.url || '';
  const variantEdges = product.variants?.edges || [];
  const firstVariant = variantEdges[0]?.node;

  const numericId = parseInt(product.id.split('/').pop() || '0', 10);
  const variants = parseVariants(variantEdges);

  //  Core identifiers 

  // vehicleType: metafield "vehicle_type", e.g. "5 Passenger"
  // Used as the GROUP KEY in PopularCars / TaxiOptions comparison views
  const vehicleType = getMetafieldValue(
    metafields,
    METAFIELD_NAMESPACES.TAXI_DETAILS,
    METAFIELD_KEYS.VEHICLE_TYPE,
    extractVehicleLabelFromTitle(product.title ?? '')  // fallback: parse title
  );

  // companyName: metafield "company_name", e.g. "TransferEase"
  // Fallback: parse from title suffix "5 Seater Car - TransferEase" → "TransferEase"
  const companyName = getMetafieldValue(
    metafields,
    METAFIELD_NAMESPACES.TAXI_DETAILS,
    METAFIELD_KEYS.COMPANY_NAME,
    extractCompanyFromTitle(product.title ?? '')  // fallback: parse title
  );

  //  Other metafields 

  const passengers = getMetafieldValue(
    metafields, METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.PASSENGERS, 4
  );

  const luggage = getMetafieldValue(
    metafields, METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.LUGGAGE, 2
  );

  const rating = getMetafieldValue(
    metafields, METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.RATING, 4.5
  );

  const reviews = getMetafieldValue(
    metafields, METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.REVIEWS, 0
  );

  const baseFare = getMetafieldValue(
    metafields,
    METAFIELD_NAMESPACES.TAXI_DETAILS,
    METAFIELD_KEYS.BASE_FARE,
    parseFloat(firstVariant?.price?.amount || '25')
  );

  const perKmRate = getMetafieldValue(
    metafields, METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.PER_KM_RATE, 2.0
  );

  const estimatedArrival = getMetafieldValue(
    metafields, METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.ESTIMATED_ARRIVAL, '5-7 mins'
  );

  const popular = getMetafieldValue(
    metafields, METAFIELD_NAMESPACES.TAXI_DETAILS, METAFIELD_KEYS.POPULAR, false
  );

  const features = getMetafieldValue(
    metafields, METAFIELD_NAMESPACES.FEATURES, METAFIELD_KEYS.FEATURES_LIST,
    ['Air Conditioning', 'GPS Navigation']
  );

  return {
    id: numericId,
    shopifyId: firstVariant?.id || product.id,
    shopifyProductId: product.id,
    name: product.title,

    // ↓ vehicleType is now reliably set from the metafield
    // (was incorrectly stored as `type` before, causing "Unknown" in grouping)
    vehicleType,
    type: vehicleType,          // keep `type` alias for any existing code that uses it

    // ↓ companyName is now a first-class field, not parsed ad-hoc from the title
    companyName,

    // vehicleLabel parsed from title for display (e.g. "5 Seater Car")
    displayName: extractVehicleLabelFromTitle(product.title ?? ''),

    image,
    rating,
    reviews,
    passengers,
    luggage,
    features: Array.isArray(features) ? features : [],
    baseFare,
    perKmRate,
    estimatedArrival,
    eta: estimatedArrival,      // alias used by comparison components
    popular,
    variants,
  };
}

/**
 * Fetch all taxi products from Shopify
 */
export async function fetchTaxiProducts(): Promise<TaxiOption[]> {
  try {
    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: GET_PRODUCTS_QUERY,
        variables: { first: 200 },
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(result.errors[0]?.message || 'GraphQL query failed');
    }

    const products = result.data?.products?.edges || [];

    const filteredProducts = products.filter((edge: any) => {
      const productType = edge.node?.productType || '';
      const tags = edge.node?.tags || [];
      const title = edge.node?.title || '';

      if (productType === 'Parking Fee') return false;

      const isBlogPost =
        productType === 'Blog' ||
        tags.includes('blog') ||
        title.toLowerCase().includes('blog:');

      return !isBlogPost;
    });

    return filteredProducts.map((edge: any) => transformProduct(edge.node));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch single product by ID
 */
export async function fetchProductById(productId: string): Promise<TaxiOption | null> {
  try {
    const query = `
      query GetProduct($id: ID!) {
        product(id: $id) {
          id
          title
          description
          variants(first: 80) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(
            identifiers: [
              { namespace: "taxi_details", key: "vehicle_type" }
              { namespace: "taxi_details", key: "company_name" }
              { namespace: "taxi_details", key: "passengers" }
              { namespace: "taxi_details", key: "luggage" }
              { namespace: "taxi_details", key: "rating" }
              { namespace: "taxi_details", key: "reviews" }
              { namespace: "taxi_details", key: "base_fare" }
              { namespace: "taxi_details", key: "per_km_rate" }
              { namespace: "taxi_details", key: "estimated_arrival" }
              { namespace: "taxi_details", key: "popular" }
              { namespace: "features", key: "features_list" }
            ]
          ) {
            namespace
            key
            value
            type
          }
        }
      }
    `;

    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables: { id: productId } }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    if (result.errors) { console.error('GraphQL Errors:', result.errors); return null; }

    const product = result.data?.product;
    return product ? transformProduct(product) : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}


// ─── Blog post queries (unchanged) ───────────────────────────────────────────

const GET_BLOG_POSTS_QUERY = `
  query GetBlogPosts($first: Int!, $query: String!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          tags
          createdAt
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(
            identifiers: [
              { namespace: "blog", key: "author" }
              { namespace: "blog", key: "excerpt" }
              { namespace: "blog", key: "read_time" }
              { namespace: "blog", key: "category" }
              { namespace: "blog", key: "featured" }
            ]
          ) {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

const GET_BLOG_POST_QUERY = `
  query GetBlogPost($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      description
      descriptionHtml
      tags
      createdAt
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      metafields(
        identifiers: [
          { namespace: "blog", key: "author" }
          { namespace: "blog", key: "excerpt" }
          { namespace: "blog", key: "read_time" }
          { namespace: "blog", key: "category" }
          { namespace: "blog", key: "featured" }
          { namespace: "blog", key: "author_bio" }
          { namespace: "blog", key: "author_image" }
        ]
      ) {
        namespace
        key
        value
        type
      }
    }
  }
`;

const GET_BLOG_POST_BY_HANDLE_QUERY = `
  query GetBlogPostByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      tags
      createdAt
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      metafields(
        identifiers: [
          { namespace: "blog", key: "author" }
          { namespace: "blog", key: "excerpt" }
          { namespace: "blog", key: "read_time" }
          { namespace: "blog", key: "category" }
          { namespace: "blog", key: "featured" }
          { namespace: "blog", key: "author_bio" }
          { namespace: "blog", key: "author_image" }
        ]
      ) {
        namespace
        key
        value
        type
      }
    }
  }
`;

export interface BlogPost {
  id: string;
  shopifyId: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  contentHtml: string;
  image: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  images: string[];
}

function transformToBlogPost(product: any): BlogPost {
  const metafields = product.metafields || [];
  const imageEdges = product.images?.edges || [];
  const mainImage = imageEdges[0]?.node?.url || '';
  const allImages = imageEdges.map((edge: any) => edge.node.url);
  const numericId = product.id.split('/').pop() || '0';
  const slug = product.handle || createSlug(product.title);

  const author = getMetafieldValue(metafields, 'blog', 'author', 'Admin');
  const authorBio = getMetafieldValue(metafields, 'blog', 'author_bio', '');
  const authorImage = getMetafieldValue(metafields, 'blog', 'author_image', '');
  const excerpt = getMetafieldValue(
    metafields, 'blog', 'excerpt',
    product.description?.substring(0, 150) + '...' || ''
  );
  const readTime = getMetafieldValue(metafields, 'blog', 'read_time', '5 min read');
  const category = getMetafieldValue(metafields, 'blog', 'category', 'General');
  const featured = getMetafieldValue(metafields, 'blog', 'featured', false);

  const date = new Date(product.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return {
    id: numericId,
    shopifyId: product.id,
    slug,
    title: product.title,
    excerpt,
    content: product.description || '',
    contentHtml: product.descriptionHtml || '',
    image: mainImage,
    author,
    authorBio,
    authorImage,
    date,
    readTime,
    category,
    tags: product.tags || [],
    featured,
    images: allImages,
  };
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: GET_BLOG_POSTS_QUERY,
        variables: { first: 90, query: 'tag:blog OR product_type:Blog' },
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(result.errors[0]?.message || 'GraphQL query failed');
    }

    const products = result.data?.products?.edges || [];
    return products.map((edge: any) => transformToBlogPost(edge.node));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function fetchBlogPostById(blogId: string): Promise<BlogPost | null> {
  try {
    const shopifyId = blogId.startsWith('gid://')
      ? blogId
      : `gid://shopify/Product/${blogId}`;

    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: GET_BLOG_POST_QUERY, variables: { id: shopifyId } }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    if (result.errors) { console.error('GraphQL Errors:', result.errors); return null; }

    const product = result.data?.product;
    return product ? transformToBlogPost(product) : null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: GET_BLOG_POST_BY_HANDLE_QUERY, variables: { handle: slug } }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    if (result.errors) { console.error('GraphQL Errors:', result.errors); return null; }

    const product = result.data?.productByHandle;
    return product ? transformToBlogPost(product) : null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

export async function fetchFeaturedBlogPosts(): Promise<BlogPost[]> {
  try {
    const allPosts = await fetchBlogPosts();
    return allPosts.filter((post) => post.featured).slice(0, 3);
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    return [];
  }
}

export async function fetchBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const allPosts = await fetchBlogPosts();
    return allPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
}

export default {
  fetchTaxiProducts,
  fetchProductById,
  fetchBlogPosts,
  fetchBlogPostById,
  fetchFeaturedBlogPosts,
  fetchBlogPostsByCategory,
};
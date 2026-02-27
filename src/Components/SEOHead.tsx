import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: string;
    noIndex?: boolean;
    schema?: object | object[];
    appendSiteName?: boolean;
}

const SITE_NAME = 'Minibus Hire London';
const BASE_URL = 'https://minibushirelondon.org';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

export default function SEOHead({
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage = DEFAULT_IMAGE,
    ogType = 'website',
    noIndex = false,
    schema,
    appendSiteName = true,
}: SEOHeadProps) {

    const fullTitle = title
        ? appendSiteName
            ? `${title} | ${SITE_NAME}`
            : title
        : `${SITE_NAME} - Professional minibus and coach hire across the UK. CRB checked drivers, vehicles from 8-72 passengers. Airport transfers, weddings, school trips & more | 8-72 Passengers`;

    const fullCanonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : BASE_URL;

    return (
        <Helmet prioritizeSeoTags>
            <title>{fullTitle}</title>
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:type" content={ogType} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={SITE_NAME} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
                </script>
            )}
        </Helmet>
    );
}
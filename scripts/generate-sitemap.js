// scripts/generate-sitemap.js
// Run this script to generate your sitemap: node scripts/generate-sitemap.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your website domain
const DOMAIN = 'https://www.minibushirelondon.org';

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Define your routes with their properties
// DO NOT include dynamic routes like /car-rental/:carId or /viewBlog/:slug
// Only include actual, accessible URLs
const routes = [
    // Main Pages
    { path: '/', changefreq: 'daily', priority: '1.0', lastmod: today },
    { path: '/about', changefreq: 'monthly', priority: '0.8', lastmod: today },
    { path: '/contact', changefreq: 'monthly', priority: '0.7', lastmod: today },
    { path: '/vehicles', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { path: '/payment', changefreq: 'weekly', priority: '0.9', lastmod: today },

    // Booking Pages
    { path: '/transport-options', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { path: '/car-rental-options', changefreq: 'weekly', priority: '0.8', lastmod: today },
    // NOTE: Don't add /car-rental/:carId - it's a dynamic route pattern, not a real URL
    { path: '/coachhire', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { path: '/minibus', changefreq: 'weekly', priority: '0.8', lastmod: today },

    // Blog Index
    { path: '/blogs', changefreq: 'weekly', priority: '0.8', lastmod: today },
    // NOTE: Don't add /viewBlog/:slug - add actual blog URLs below instead

    // Legal
    { path: '/terms', changefreq: 'yearly', priority: '0.3', lastmod: '2025-01-15' },
    { path: '/privacy', changefreq: 'yearly', priority: '0.3', lastmod: '2020-07-15' },
];

// Add your ACTUAL blog posts (not the dynamic route pattern)
const blogPosts = [
    { slug: 'best-minibus-hire-london', lastmod: '2025-02-10' },
    { slug: 'wedding-transport-guide', lastmod: '2025-02-08' },
    { slug: 'airport-transfer-tips', lastmod: '2025-02-05' },

    // London Area Blog Posts
    ...[
        "coach-hire-spitalfields-minibus-hire-spitalfields",
        "coach-hire-southgate-minibus-hire-southgate",
        "coach-hire-south-woodford-minibus-hire-south-woodford",
        "coach-hire-shepherds-bush-minibus-hire-shepherds-bush",
        "coach-hire-rotherhithe-minibus-hire-rotherhithe",
        "coach-hire-regents-park-minibus-hire-regents-park",
        "coach-hire-stratford-minibus-hire-stratford",
        "coach-hire-soho-minibus-hire-soho",
        "coach-hire-putney-minibus-hire-putney",
        "coach-hire-notting-hill-minibus-hire-notting-hill",
        "coach-hire-north-finchley-minibus-hire-north-finchley",
        "coach-hire-new-cross-minibus-hire-new-cross",
        "coach-hire-new-addington-minibus-hire-new-addington",
        "coach-hire-neasden-minibus-hire-neasden",
        "coach-hire-muswell-hill-minibus-hire-muswell-hill",
        "coach-hire-primrose-hill-minibus-hire-primrose-hill",
        "coach-hire-poplar-minibus-hire-poplar",
        "coach-hire-plaistow-minibus-hire-plaistow",
        "coach-hire-peckham-minibus-hire-peckham",
        "coach-hire-palmers-green-minibus-hire-palmers-green",
        "coach-hire-paddington-minibus-hire-paddington",
        "coach-hire-mortlake-minibus-hire-mortlake",
        "coach-hire-mill-hill-minibus-hire-mill-hill",
        "coach-hire-mile-end-minibus-hire-mile-end",
        "coach-hire-merton-minibus-hire-merton",
        "coach-hire-mayfair-minibus-hire-mayfair",
        "coach-hire-manor-park-minibus-hire-manor-park",
        "coach-hire-marylebone-minibus-hire-marylebone",
        "coach-hire-maida-vale-minibus-hire-maida-vale",
        "coach-hire-london-minibus-hire-london",
        "coach-hire-leyton-minibus-hire-leyton",
        "coach-hire-leytonstone-minibus-hire-leytonstone",
        "coach-hire-lewisham-minibus-hire-lewisham",
        "coach-hire-knightsbridge-minibus-hire-knightsbridge",
        "coach-hire-kingston-upon-thames-minibus-hire-kingston-upon-thames",
        "coach-hire-kingsbury-minibus-hire-kingsbury",
        "coach-hire-kilburn-minibus-hire-kilburn",
        "coach-hire-kensington-minibus-hire-kensington",
        "coach-hire-islington-minibus-hire-islington",
        "coach-hire-isle-of-dogs-minibus-hire-isle-of-dogs",
        "coach-hire-hoxton-minibus-hire-hoxton",
        "coach-hire-hornsey-minibus-hire-hornsey",
        "coach-hire-hornsey-minibus-hire-hornsey-1",
        "coach-hire-holloway-minibus-hire-holloway",
        "coach-hire-holborn-minibus-hire-holborn",
        "coach-hire-highgate-minibus-hire-highgate",
        "coach-hire-highbury-minibus-hire-highbury",
        "coach-hire-herne-hill-minibus-hire-herne-hill",
        "coach-hire-hendon-minibus-hire-hendon",
        "coach-hire-havering-atte-bower-minibus-hire-havering-atte-bower"
    ].map(slug => ({
        slug,
        lastmod: '2025-02-10'
    }))
];

// Add blog posts to routes (these are ACTUAL URLs, not patterns)
blogPosts.forEach(post => {
    routes.push({
        path: `/viewBlog/${post.slug}`,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: post.lastmod
    });
});

// Generate XML
const generateSitemap = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes.map(route => `    <url>
        <loc>${DOMAIN}${route.path}</loc>
        <lastmod>${route.lastmod}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

    return xml;
};

// Write sitemap to public folder
const writeSitemap = () => {
    const sitemap = generateSitemap();
    const publicDir = path.join(__dirname, '..', 'public');

    // Create public directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated successfully at public/sitemap.xml');
    console.log(`📝 Total URLs: ${routes.length}`);
};

// Run the script
writeSitemap();
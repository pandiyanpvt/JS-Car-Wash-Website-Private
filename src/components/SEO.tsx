import { Helmet } from 'react-helmet-async'

interface SEOProps {
    title?: string
    description?: string
    keywords?: string
    canonical?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogUrl?: string
    twitterTitle?: string
    twitterDescription?: string
    twitterImage?: string
}

const SEO = ({
    title = 'JS Car Wash & Detailing | Professional Car Cleaning in Toongabbie & Dubbo',
    description = 'JS Car Wash & Detailing offers premium professional hand wash, car detailing, ceramic coating, and interior cleaning services. Book online for the best car care experience.',
    keywords = 'car wash, car detailing, hand wash, interior cleaning, ceramic coating, Toongabbie car wash, Dubbo car wash, JS car wash',
    canonical = 'https://www.jscarwash.com/',
    ogTitle,
    ogDescription,
    ogImage = 'https://www.jscarwash.com/JS Car Wash Images/cropped-fghfthgf.png',
    ogUrl = 'https://www.jscarwash.com/',
    twitterTitle,
    twitterDescription,
    twitterImage
}: SEOProps) => {
    const siteTitle = title
    const siteDescription = description

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={siteDescription} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={ogUrl} />
            <meta property="og:title" content={ogTitle || siteTitle} />
            <meta property="og:description" content={ogDescription || siteDescription} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={ogUrl} />
            <meta property="twitter:title" content={twitterTitle || ogTitle || siteTitle} />
            <meta property="twitter:description" content={twitterDescription || ogDescription || siteDescription} />
            <meta property="twitter:image" content={twitterImage || ogImage} />
        </Helmet>
    )
}

export default SEO

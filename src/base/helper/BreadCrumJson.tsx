import Script from 'next/script';

import React from 'react';

interface BreadcrumbItem {
    name: string;
    item: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.item
        }))
    };
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbProps) {
    const breadcrumbJsonLd = generateBreadcrumbJsonLd(items);

    return (
        <Script
            id="breadcrumb-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbJsonLd)
            }}
            strategy="afterInteractive"
        />
    );
}

export function getBaseUrl() {
    return BASE_URL;
}


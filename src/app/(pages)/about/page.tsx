import React, { Fragment } from 'react';

import { fetchAboutContents, fetchTestimonialsContents, fetchAppsContents } from "@/hooks/(pages)/about/utils/FetchAbout"

import About from '@/hooks/(pages)/about/About';

import AboutSkeleton from '@/hooks/(pages)/about/AboutSkelaton';

import { Metadata } from 'next';

import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

export const metadata: Metadata = {
    title: 'Tentang Kami | Sunik Yohan',
    description: 'Pelajari lebih lanjut tentang Sunik Yohan, misi kami, dan perjalanan kami',
    keywords: 'tentang, perusahaan, Sunik Yohan, misi, visi',
    openGraph: {
        title: 'Tentang Kami | Sunik Yohan',
        description: 'Pelajari lebih lanjut tentang Sunik Yohan, misi kami, dan perjalanan kami',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/about.png',
                width: 1200,
                height: 630,
                alt: 'Tentang Sunik Yohan',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tentang Kami | Sunik Yohan',
        description: 'Pelajari lebih lanjut tentang Sunik Yohan, misi kami, dan perjalanan kami',
        images: ['/public/about.png'],
    },
};

export default async function Page() {
    const BASE_URL = getBaseUrl();
    const breadcrumbItems = [
        { name: "Beranda", item: BASE_URL },
        { name: "Tentang Kami", item: `${BASE_URL}/about` }
    ];

    try {
        const aboutData = await fetchAboutContents();
        const testimonialsData = await fetchTestimonialsContents();
        const appsData = await fetchAppsContents();

        return <Fragment>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <About aboutData={aboutData} testimonialsData={testimonialsData} appsData={appsData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching products data:', error);
        return (
            <AboutSkeleton />
        );
    }
}
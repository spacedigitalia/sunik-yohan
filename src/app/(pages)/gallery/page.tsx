import React, { Fragment } from 'react';

import { fetchGalleryData } from "@/hooks/(pages)/gallery/utils/FetchGallery"

import Gallery from '@/hooks/(pages)/gallery/Gallery';

import GallerySkeleton from '@/hooks/(pages)/gallery/GallerySkeleton';

import { Metadata } from 'next';

import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

export const metadata: Metadata = {
    title: 'Galeri | Sunik Yohan',
    description: 'Jelajahi koleksi karya visual dan proyek kreatif kami di Sunik Yohan',
    keywords: 'galeri, karya visual, proyek kreatif, Sunik Yohan',
    openGraph: {
        title: 'Galeri | Sunik Yohan',
        description: 'Jelajahi koleksi karya visual dan proyek kreatif kami di Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/gallery.png',
                width: 1200,
                height: 630,
                alt: 'Galeri Sunik Yohan',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Galeri | Sunik Yohan',
        description: 'Jelajahi koleksi karya visual dan proyek kreatif kami di Sunik Yohan',
        images: ['/public/gallery.png'],
    },
};

export default async function Page() {
    const BASE_URL = getBaseUrl();
    const breadcrumbItems = [
        { name: "Beranda", item: BASE_URL },
        { name: "Galeri", item: `${BASE_URL}/gallery` }
    ];

    try {
        const galleryData = await fetchGalleryData();

        return <Fragment>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <Gallery galleryData={galleryData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching gallery data:', error);
        return (
            <GallerySkeleton />
        );
    }
}
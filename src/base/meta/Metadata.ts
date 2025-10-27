const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: "#f5f5f5",
};

export const metadata = {
    title: "Sunik Yohan - Tegukan Manis, Mood Makin Asik!",
    description:
        "Temukan kesegaran minuman boba terbaik hanya di Sunik Yohan! Dengan varian rasa yang menggoda dan topping melimpah, rasakan sensasi manis yang tak terlupakan",
    authors: [{ name: "Sunik Yohan" }],
    creator: "Sunik Yohan",
    publisher: "Sunik Yohan",
    category: "Makanan & Minuman",
    keywords: [
        "Minuman Boba",
        "Bubble Tea",
        "Minuman Segar",
        "Kafe",
        "Rumah Makan",
        "Kuliner Ciampea",
        "Minuman Bogor",
        "Jawa Barat",
        "Minuman Manis",
        "Topping Boba",
        "Minuman Kekinian",
    ],
    icons: {
        icon: [
            {
                url: "/favicon.ico",
                sizes: "64x64 32x32 24x24 16x16",
                type: "image/x-icon",
            },
            {
                url: "/logo.jpg",
                sizes: "192x192",
                type: "image/jpeg",
            },
            {
                url: "/logo.jpg",
                sizes: "512x512",
                type: "image/jpeg",
            },
        ],
        apple: "/logo.jpg",
        shortcut: "/logo.jpg",
        appleTouchIcon: "/logo.jpg",
    },
    tags: [
        {
            name: "Sunik Yohan",
            content: "Makanan & Minuman",
        },
    ],
    manifest: "/manifest.json",
    metadataBase: new URL(BASE_URL),
    canonical: BASE_URL,
    other: {
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "format-detection": "telephone=no",
        "apple-mobile-web-app-status-bar-style": "black-translucent",
        "msapplication-TileColor": "#f5f5f5",
        "application-name": "Sunik Yohan",
        "msapplication-tap-highlight": "no",
        "theme-color": "#f5f5f5",
        "robots": "all",
    },
    openGraph: {
        type: "website",
        title: "Sunik Yohan - Tegukan Manis, Mood Makin Asik!",
        description:
            "Temukan kesegaran minuman boba terbaik hanya di Sunik Yohan! Dengan varian rasa yang menggoda dan topping melimpah, rasakan sensasi manis yang tak terlupakan",
        url: BASE_URL,
        siteName: "Sunik Yohan",
        locale: "id_ID",
        images: [
            {
                url: "/desktop.png",
                width: 1200,
                height: 630,
                alt: "Sunik Yohan - Makanan & Minuman",
                type: "image/jpeg",
            },
        ],
        countryName: "Indonesia",
        emails: ["sunikyohan@gmail.com"],
        phoneNumbers: ["+62-813-9863-2939"],
        streetAddress: "Kp dukuh, RT.03/RW.08, Cibadak, Kec. Ciampea",
        postalCode: "16620",
        locality: "Ciampea",
        region: "Jawa Barat",
        country: "ID",
        profile: {
            firstName: "Sunik",
            lastName: "Yohan",
            username: "sunik_yohan",
            gender: "male",
        },
        article: {
            publishedTime: "2024-01-01T00:00:00+07:00",
            modifiedTime: "2024-03-19T00:00:00+07:00",
            section: "Makanan & Minuman",
            tags: ["Minuman Boba", "Bubble Tea", "Minuman Segar"],
        },
        video: {
            url: `${BASE_URL}/video-preview.mp4`,
            type: "video/mp4",
            width: 1280,
            height: 720,
        },
        audio: {
            url: `${BASE_URL}/audio-preview.mp3`,
            type: "audio/mpeg",
        },
    },
    twitter: {
        card: "summary_large_image",
        title: "Sunik Yohan - Tegukan Manis, Mood Makin Asik!",
        description:
            "Temukan kesegaran minuman boba terbaik hanya di Sunik Yohan! Dengan varian rasa yang menggoda dan topping melimpah, rasakan sensasi manis yang tak terlupakan",
        creator: "@sunik_yohan",
        site: "@sunik_yohan",
        images: ["/og-image.jpg"],
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_ID,
        googleTagManager: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: BASE_URL,
        languages: {
            "id-ID": BASE_URL,
        },
    },
};

export default metadata;
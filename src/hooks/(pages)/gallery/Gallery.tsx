"use client"

import React, { useState } from 'react'

import { GalleryData } from '@/hooks/(pages)/gallery/types/gallery'

import Image from 'next/image'

import { Pagination } from "@/components/ui/pagination"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog"

export default function Gallery({ galleryData }: { galleryData: GalleryData[] }) {
    const [selectedImage, setSelectedImage] = useState<GalleryData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 11;

    const totalPages = Math.ceil(galleryData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = galleryData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className='py-8 sm:py-12 pt-20 sm:pt-28'>
            <div className='container px-4 md:px-8'>
                <div className="columns-2 sm:columns-3 gap-3 sm:gap-4">
                    {currentItems.map((data) => {
                        return (
                            <Dialog key={data.id}>
                                <DialogTrigger asChild>
                                    <div
                                        className="break-inside-avoid mb-3 sm:mb-4 cursor-pointer"
                                        onClick={() => setSelectedImage(data)}
                                    >
                                        <Image
                                            src={data.imageUrl}
                                            alt={"image"}
                                            width={800}
                                            height={600}
                                            loading='eager'
                                            className="w-full h-auto rounded-lg"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                        />
                                    </div>
                                </DialogTrigger>

                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[300]">
                                    <DialogTitle className="sr-only">Gallery Image View</DialogTitle>
                                    {selectedImage && (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={selectedImage.imageUrl}
                                                alt="Selected image"
                                                width={1200}
                                                loading='eager'
                                                height={800}
                                                className="w-full h-auto object-contain rounded-lg"
                                                style={{ maxHeight: '80vh' }}
                                            />
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        );
                    })}
                </div>
                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}

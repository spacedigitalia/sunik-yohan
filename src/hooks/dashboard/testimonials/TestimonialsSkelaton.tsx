import React from 'react'

import { Skeleton } from "@/components/ui/skeleton"

import { Card } from "@/components/ui/card"

export default function TestimonialsSkelaton() {
    return (
        <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <Card key={index} className="overflow-hidden border-none shadow-lg">
                        <div className="flex flex-col">
                            <div className="aspect-video relative">
                                <Skeleton className="w-full h-full" />
                            </div>
                            <div className="flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50">
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-8 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

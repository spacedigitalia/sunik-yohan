import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function BannerSkelaton() {
    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
                <Card key={index} className="overflow-hidden border-none shadow-lg">
                    <div className="aspect-video relative">
                        <Skeleton className="w-full h-full" />
                    </div>
                </Card>
            ))}
        </div>
    )
}

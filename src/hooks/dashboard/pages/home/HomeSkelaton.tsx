import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function HomeSkelaton() {
    return (
        <div className="mt-6 space-y-6">
            {[1].map((index) => (
                <Card key={index} className="overflow-hidden border-none shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="aspect-video relative">
                            <Skeleton className="w-full h-full" />
                        </div>
                        <div className="flex flex-col justify-between p-8 bg-gradient-to-br from-white to-gray-50">
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>
                            <Skeleton className="w-full h-12 mt-6" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

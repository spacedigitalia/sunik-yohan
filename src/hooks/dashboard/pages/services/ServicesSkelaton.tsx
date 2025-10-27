import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function ServiceSkelaton() {
    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
                <Card key={index} className="overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                        <Skeleton className="w-full h-full" />
                    </div>
                    <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                    <div className="p-4 pt-0 flex justify-end gap-2">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                </Card>
            ))}
        </div>
    )
}

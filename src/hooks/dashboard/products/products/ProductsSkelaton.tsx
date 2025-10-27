import React from 'react'

import { Skeleton } from "@/components/ui/skeleton"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ProductsSkelaton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <Card key={index} className="overflow-hidden border border-gray-100">
                    <CardHeader className="p-0">
                        <div className="aspect-[4/3] w-full overflow-hidden relative bg-gray-100">
                            <Skeleton className="h-full w-full" />
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <div className="flex items-center justify-between mt-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

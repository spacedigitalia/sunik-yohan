import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AboutSkeleton() {
    return (
        <div className="mt-6 space-y-6">
            {[1, 2, 3].map((index) => (
                <Card key={index} className="overflow-hidden border-none shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="aspect-video relative">
                            <Skeleton className="w-full h-full" />
                        </div>
                        <div className="flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50">
                            <div className="space-y-3 sm:space-y-4">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>
                            <Skeleton className="w-full h-12 mt-4 sm:mt-6" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
} 
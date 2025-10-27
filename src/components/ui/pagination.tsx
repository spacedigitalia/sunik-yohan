import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
    ...props
}: PaginationProps) {
    const pages = React.useMemo(() => {
        const items: (number | string)[] = []

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    items.push(i)
                }
                items.push("...")
                items.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                items.push(1)
                items.push("...")
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    items.push(i)
                }
            } else {
                items.push(1)
                items.push("...")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    items.push(i)
                }
                items.push("...")
                items.push(totalPages)
            }
        }

        return items
    }, [currentPage, totalPages])

    return (
        <div
            className={cn("flex items-center justify-center space-x-2", className)}
            {...props}
        >
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
                    "h-10 px-4 py-2",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "border border-input bg-background cursor-pointer"
                )}
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
            </button>

            <div className="flex items-center space-x-1">
                {pages.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </span>
                        )
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(Number(page))}
                            className={cn(
                                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors cursor-pointer",
                                "h-10 w-10",
                                "hover:bg-accent",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                currentPage === page
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "border border-input bg-background"
                            )}
                        >
                            {page}
                        </button>
                    )
                })}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
                    "h-10 px-4 py-2",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "border border-input bg-background cursor-pointer"
                )}
            >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
            </button>
        </div>
    )
} 
import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
    title: string
    description: string
    status: "current" | "complete" | "upcoming"
}

interface StepsProps {
    steps: Step[]
    className?: string
}

export function Steps({ steps, className }: StepsProps) {
    return (
        <nav aria-label="Progress" className={className}>
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                {steps.map((step, index) => (
                    <li key={step.title} className="md:flex-1 relative">
                        <div
                            className={cn(
                                "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 transition-colors",
                                step.status === 'complete' ? "border-[#FF204E]" : step.status === 'current' ? "border-[#FF204E] bg-[#FFF0F3]" : "border-gray-200"
                            )}
                        >
                            <span className={cn("text-sm font-medium", step.status === 'current' ? "text-[#FF204E] font-bold" : "text-gray-500")}>{step.title}</span>
                            <span className={cn("text-xs", step.status === 'current' ? "text-[#FF204E]" : "text-gray-400")}>{step.description}</span>
                            <span className={cn(
                                "absolute -ml-9 mt-3 flex h-5 w-5 items-center justify-center rounded-full border-2",
                                step.status === 'complete' ? "bg-[#FF204E] border-[#FF204E]" : step.status === 'current' ? "bg-[#FF204E] border-[#FF204E]" : "bg-white border-gray-200"
                            )}>
                                {step.status === 'complete' ? (
                                    <Check className="h-3 w-3 text-white" aria-hidden="true" />
                                ) : step.status === 'current' ? (
                                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                                ) : (
                                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                                )}
                            </span>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
} 
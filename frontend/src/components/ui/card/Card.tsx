// src/components/ui/card/Card.tsx
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-neutral-200 bg-[#2F4B7A]/30 shadow-sm p-4",
                className
            )}
            {...props}
        />
    );
}

export function CardContent({
                                className,
                                ...props
                            }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-4", className)} {...props} />;
}

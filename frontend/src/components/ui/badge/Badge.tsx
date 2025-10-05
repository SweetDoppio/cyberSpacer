import { cn } from "@/lib/cn";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "outline" | "success" | "warning" | "destructive";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
        default: "bg-neutral-900 text-white",
        outline: "border border-neutral-300",
        success: "bg-green-600 text-white",
        warning: "bg-amber-500 text-white",
        destructive: "bg-red-600 text-white",
    };
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}

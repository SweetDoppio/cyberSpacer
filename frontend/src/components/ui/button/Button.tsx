import React, {forwardRef} from "react";
import {cn} from "@/lib/cn";
import {Slot} from "@radix-ui/react-slot"; // tiny helper to join class names

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
    asChild?: boolean;

};


export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant = "default", size = "md", asChild = false,...props}, ref) => {
        const Comp: any = asChild ? Slot : "button"; // Slot will render the child element
        const base =
            "inline-flex items-center justify-center rounded-2xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
            default: "bg-black text-white hover:opacity-90",
            outline: "border border-neutral-300 hover:bg-neutral-50",
            ghost: "hover:bg-neutral-100",
            destructive: "bg-red-600 text-white hover:bg-red-700",
        };

        const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
            sm: "h-8 px-3 text-sm",
            md: "h-10 px-4 text-sm",
            lg: "h-12 px-6 text-base",
        };

        return (
            <Comp
                ref={ref}
                className={cn(base, variants[variant], sizes[size], className)}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

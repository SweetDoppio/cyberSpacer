import React, { forwardRef } from "react";
import { cn } from "src/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "h-10 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm",
                    "placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black",
                    className
                )}
                {...props}
            />
        );
    }
);

const LoginInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    className,
                )}
                ref={ref}
                {...props}
            />
        )
    },
)

LoginInput.displayName = "LoginInput"
Input.displayName = "Input"

export {LoginInput, Input}
import { forwardRef } from "react";
import { cn } from "src/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
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
Input.displayName = "Input";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-orange-500 text-white hover:bg-orange-600",
      outline:
        "border border-orange-500 text-orange-400 bg-transparent hover:bg-orange-500/10",
      destructive:
        "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-600",
      secondary:
        "bg-indigo-900/80 text-gray-100 hover:bg-indigo-800 border border-orange-500/30",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm rounded-md",
      md: "h-10 px-4 text-sm rounded-lg",
      lg: "h-12 px-6 text-base rounded-xl",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

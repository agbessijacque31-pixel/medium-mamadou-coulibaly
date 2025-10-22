import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "destructive" | "secondary"; // ✅ ajoute secondary
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-cyan-600 text-white",
    success: "bg-green-600 text-white",
    warning: "bg-yellow-500 text-white",
    destructive: "bg-red-600 text-white",
    secondary: "bg-gray-500 text-white", // ✅ ajouté
    outline:
      "border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };

import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 5, ...props }, ref) => {
  return (
<textarea
  className={cn(
    "flex w-full rounded-lg border border-orange-500/30 bg-indigo-900/80 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 ring-offset-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all",
    className
  )}
  ref={ref}
  rows={rows} // définit le nombre de lignes visibles
  {...props}
/>

  );
});

Textarea.displayName = "Textarea";

export { Textarea };

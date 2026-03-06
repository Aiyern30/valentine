import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-5 py-3.5 rounded-2xl border-2 border-rose-200 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100 placeholder:text-rose-300 dark:placeholder:text-rose-400/60 hover:border-rose-300 dark:hover:border-rose-700/60 hover:bg-rose-50 dark:hover:bg-rose-900/20 focus:bg-white dark:focus:bg-rose-950/40 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "w-full px-5 py-3.5 rounded-2xl border-2 border-rose-200 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100 placeholder:text-rose-300 dark:placeholder:text-rose-400/60 hover:border-rose-300 dark:hover:border-rose-700/60 hover:bg-rose-50 dark:hover:bg-rose-900/20 focus:bg-white dark:focus:bg-rose-950/40 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all resize-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<"label">
>(({ className, ...props }, ref) => {
  return (
    <label
      className={cn(
        "text-sm font-semibold text-rose-700 dark:text-rose-300 ml-1",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Label.displayName = "Label";

export { Input, Textarea, Label };

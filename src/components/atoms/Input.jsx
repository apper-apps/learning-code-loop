import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-lg border border-gray-600 bg-navy-800 px-4 py-3 text-white placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
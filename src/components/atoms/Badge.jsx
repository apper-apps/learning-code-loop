import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-navy-800 text-gray-300 border border-gray-600",
    primary: "bg-gradient-to-r from-blue-400/20 to-blue-500/20 text-blue-400 border border-blue-400/30",
    success: "bg-green-500/20 text-green-400 border border-green-400/30",
    featured: "bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 border border-yellow-400/30"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  message, 
  actionLabel, 
  onAction,
  icon = "Package",
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 space-y-6 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} size={40} className="text-blue-400" />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 max-w-md leading-relaxed">
          {message || "It looks like there's nothing here yet. Check back later or try a different action."}
        </p>
      </div>
      
      {onAction && actionLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={onAction} className="mt-2">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;
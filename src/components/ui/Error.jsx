import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ title = "Something went wrong", message, onRetry, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 space-y-6 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" size={32} className="text-red-400" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 max-w-md">
          {message || "We encountered an issue while loading the content. Please try again."}
        </p>
      </div>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;
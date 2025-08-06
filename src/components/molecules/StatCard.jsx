import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, description, trend, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`card-navy p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg">
            <ApperIcon name={icon} size={24} className="text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend.type === "up" 
              ? "bg-green-500/20 text-green-400" 
              : "bg-red-500/20 text-red-400"
          }`}>
            <ApperIcon 
              name={trend.type === "up" ? "TrendingUp" : "TrendingDown"} 
              size={12} 
            />
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      {description && (
        <p className="text-gray-400 text-sm">{description}</p>
      )}
    </motion.div>
  );
};

export default StatCard;
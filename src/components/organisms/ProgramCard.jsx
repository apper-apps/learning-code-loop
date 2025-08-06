import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ProgramCard = ({ program, className, showRoleBasedButtons = false, canEnterCourse = false, onJoinWaitlist }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`card-navy p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl">
            <ApperIcon 
              name={program.type === "master" ? "Crown" : "Users"} 
              size={24} 
              className={program.type === "master" ? "text-yellow-400" : "text-blue-400"}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{program.title}</h3>
            <Badge variant={program.type === "master" ? "featured" : "primary"}>
              {program.type.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">${program.price}</div>
          <div className="text-sm text-gray-400">{program.duration}</div>
        </div>
      </div>

      <p className="text-gray-300 mb-6 leading-relaxed">
        {program.description}
      </p>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <ApperIcon name="Clock" size={16} />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <ApperIcon name="BarChart" size={16} />
            <span>{program.level}</span>
          </div>
          {program.has_common_course && (
            <Badge variant="success">Common Course</Badge>
          )}
        </div>
      </div>

<div className="flex items-center space-x-3">
        {showRoleBasedButtons ? (
          <>
            {canEnterCourse ? (
              <Link to={`/program/${program.slug}`} className="flex-1">
                <Button className="w-full">
                  Enter Course
                </Button>
              </Link>
            ) : (
              <Button 
                className="flex-1" 
                onClick={() => onJoinWaitlist?.(program)}
              >
                Join Waitlist
              </Button>
            )}
          </>
        ) : (
          <Link to={`/program/${program.slug}`} className="flex-1">
            <Button className="w-full">
              View Details
            </Button>
          </Link>
        )}
        <Button variant="outline" size="default" className="px-4">
          <ApperIcon name="Heart" size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

export default ProgramCard;
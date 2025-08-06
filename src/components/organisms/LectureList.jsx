import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const LectureList = ({ lectures, programType }) => {
  const groupedLectures = lectures.reduce((acc, lecture) => {
    const category = lecture.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lecture);
    return acc;
  }, {});

  const getLevelBadge = (level) => {
    if (level === "master_common") return <Badge variant="featured">Master Common</Badge>;
    if (level?.includes("intermediate")) return <Badge variant="primary">Intermediate</Badge>;
    return <Badge>Basic</Badge>;
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedLectures).map(([category, categoryLectures]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <ApperIcon name="FolderOpen" size={20} className="text-blue-400" />
            <span>{category}</span>
            <span className="text-sm text-gray-400 font-normal">
              ({categoryLectures.length} lectures)
            </span>
          </h3>
          
          <div className="space-y-3">
            {categoryLectures.map((lecture, index) => (
              <motion.div
                key={lecture.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-navy p-4 hover:bg-navy-700 transition-colors duration-200"
              >
                <Link to={`/lecture/${lecture.Id}`} className="block">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg">
                        <span className="text-blue-400 font-semibold text-sm">
                          {lecture.order}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{lecture.title}</h4>
                        <div className="flex items-center space-x-3">
                          {getLevelBadge(lecture.level)}
                          <div className="flex items-center space-x-1 text-sm text-gray-400">
                            <ApperIcon name="Clock" size={14} />
                            <span>{lecture.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Play" size={16} className="text-blue-400" />
                      <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LectureList;
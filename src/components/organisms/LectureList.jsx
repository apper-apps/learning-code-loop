import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
const LectureList = ({ 
  lectures, 
  programType, 
  currentUser, 
  selectedCohort, 
  courseType, 
  accordionOpen, 
  setAccordionOpen, 
  hasMasterAccess 
}) => {
  const hasAccess = hasMasterAccess || (currentUser && (currentUser.role === "member" || currentUser.role === "both"));
  const isFirstLecture = (index) => index === 0;
// Filter lectures based on cohort and course type
const filteredLectures = lectures.filter(lecture => {
    // If no cohort selected, show all lectures
    if (!selectedCohort) return true;
    
    // Filter by course type if program has common course
    if (courseType === "common") {
      return lecture.level === "master_common";
    } else if (courseType === "cohort") {
      return lecture.level === "master" && lecture.cohort_number === selectedCohort;
    }
    
    return true;
  });

  const groupedLectures = filteredLectures.reduce((acc, lecture) => {
    const category = lecture.category || lecture.cohort || "General";
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

  const toggleAccordion = (category) => {
    setAccordionOpen(accordionOpen === category ? null : category);
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedLectures).map(([category, categoryLectures]) => (
        <div key={category} className="card-navy">
          <button
            onClick={() => toggleAccordion(category)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-navy-700 transition-colors rounded-t-lg"
          >
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <ApperIcon name="FolderOpen" size={20} className="text-blue-400" />
              <span>{category}</span>
              <span className="text-sm text-gray-400 font-normal">
                ({categoryLectures.length} lectures)
              </span>
            </h3>
            <ApperIcon 
              name={accordionOpen === category ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              className="text-gray-400" 
            />
          </button>
          
{accordionOpen === category && (
            <div className="border-t border-navy-700">
              <div className="p-4 space-y-3">
                {categoryLectures.map((lecture, lectureIndex) => {
                  const canAccess = hasAccess || isFirstLecture(lectureIndex);
                  const isBlocked = !canAccess;
                  
                  return (
                    <motion.div
                      key={lecture.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: lectureIndex * 0.1 }}
                      className={`bg-navy-800 p-4 rounded-lg transition-colors duration-200 relative ${
                        canAccess ? 'hover:bg-navy-700' : 'opacity-60'
                      }`}
                    >
                      {canAccess ? (
                        <Link to={`/lecture/${lecture.Id}`} className="block">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg">
                                <span className="text-blue-400 font-semibold text-sm">
                                  {lectureIndex + 1}
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
                      ) : (
                        <div className="block filter blur-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg">
                                <span className="text-blue-400 font-semibold text-sm">
                                  {lectureIndex + 1}
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
                              <ApperIcon name="Lock" size={16} className="text-gray-400" />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {isBlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-navy-800/80 rounded-lg backdrop-blur-sm">
                          <div className="text-center">
                            <ApperIcon name="Lock" size={24} className="text-blue-400 mx-auto mb-2" />
                            <p className="text-white font-semibold text-sm mb-1">Master access required</p>
                            <p className="text-gray-400 text-xs">Upgrade to access content</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LectureList;
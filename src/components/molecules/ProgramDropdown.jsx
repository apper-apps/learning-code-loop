import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ProgramDropdown = ({ programs = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
      >
        <span>Program</span>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-72 bg-navy-800 border border-blue-400/20 rounded-lg shadow-xl z-50"
          >
            <div className="p-2">
              <Link
                to="/program"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-navy-700 rounded-md transition-colors duration-150"
              >
                <ApperIcon name="BookOpen" size={18} />
                <div>
                  <div className="font-medium">All Programs</div>
                  <div className="text-sm text-gray-400">Browse all available courses</div>
                </div>
              </Link>
              
              <div className="my-2 border-t border-gray-700"></div>
              
              {programs.map((program) => (
                <Link
                  key={program.Id}
                  to={`/program/${program.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-navy-700 rounded-md transition-colors duration-150"
                >
                  <ApperIcon 
                    name={program.type === "master" ? "Crown" : "Users"} 
                    size={18}
                    className={program.type === "master" ? "text-yellow-400" : "text-blue-400"}
                  />
                  <div>
                    <div className="font-medium">{program.title}</div>
                    <div className="text-sm text-gray-400">{program.type} level</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgramDropdown;
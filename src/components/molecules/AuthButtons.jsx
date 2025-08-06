import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
const AuthButtons = () => {
const { user: currentUser, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="flex items-center space-x-3">
        <Link to="/login">
          <Button variant="ghost" size="sm">
            Log In
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="primary" size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-navy-800/50 transition-colors duration-200"
      >
<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          {currentUser.picture ? (
            <img
              src={currentUser.picture}
              alt={`${currentUser.firstName} ${currentUser.lastName}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {currentUser.firstName?.charAt(0) || "U"}
            </span>
          )}
        </div>
        <ApperIcon
          name="ChevronDown" 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-navy-800 border border-blue-400/20 rounded-lg shadow-xl z-50"
          >
<div className="p-4 border-b border-gray-700">
              <p className="text-white font-medium">{currentUser.firstName} {currentUser.lastName}</p>
              <p className="text-gray-400 text-sm">{currentUser.emailAddress}</p>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-navy-700 rounded-md transition-colors duration-150">
                <ApperIcon name="User" size={16} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-navy-700 rounded-md transition-colors duration-150"
              >
                <ApperIcon name="LogOut" size={16} />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthButtons;
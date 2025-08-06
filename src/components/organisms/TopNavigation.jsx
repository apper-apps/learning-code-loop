import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getPrograms } from "@/services/api/programService";
import ProgramDropdown from "@/components/molecules/ProgramDropdown";
import AuthButtons from "@/components/molecules/AuthButtons";
import ApperIcon from "@/components/ApperIcon";

const TopNavigation = () => {
  const location = useLocation();
  const { currentUser, isLoggedIn, isAdmin } = useCurrentUser();
  const [programs, setPrograms] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await getPrograms();
        setPrograms(data);
      } catch (error) {
        console.error("Failed to load programs:", error);
      }
    };
    loadPrograms();
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Insight", path: "/insight" },
    { name: "Reviews", path: "/reviews" }
  ];

  const conditionalItems = [
    ...(isLoggedIn ? [{ name: "Profile", path: "/profile" }] : []),
    ...(isAdmin ? [{ name: "Admin", path: "/admin" }] : [])
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">Learning Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? "text-blue-400 bg-navy-800"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <ProgramDropdown programs={programs} />
            
            {conditionalItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? "text-blue-400 bg-navy-800"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:block">
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-navy-800 transition-colors duration-200"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-700"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-blue-400 bg-navy-800"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <Link
                to="/program"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive("/program")
                    ? "text-blue-400 bg-navy-800"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Programs
              </Link>
              
              {conditionalItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-blue-400 bg-navy-800"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-700">
                <AuthButtons />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default TopNavigation;
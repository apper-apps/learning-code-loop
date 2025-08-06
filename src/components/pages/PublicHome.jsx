import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const PublicHome = () => {
  useEffect(() => {
    document.title = "Learning Code Loop | Home";
  }, []);

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Navigation */}
      <nav className="glass-nav fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold text-white">Learning Code Loop</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-navy-900"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Welcome to Learning Code Loop
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform your coding skills through expertly designed courses and hands-on projects. 
              Join our community of developers and start building the future with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/login">
                <Button size="lg" className="px-8 py-4 text-lg">
                  <ApperIcon name="Code" size={20} className="mr-2" />
                  Start Learning
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <ApperIcon name="Play" size={20} className="mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-navy-800/50 to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Why Choose Learning Code Loop?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                We provide comprehensive learning experiences designed for developers at every level
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-navy p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Code2" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Expert-Led Courses</h3>
              <p className="text-gray-300 leading-relaxed">
                Learn from industry professionals with years of real-world experience building production applications.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-navy p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Users" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Community Support</h3>
              <p className="text-gray-300 leading-relaxed">
                Join a vibrant community of learners and mentors who support each other throughout the journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card-navy p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Trophy" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Practical Projects</h3>
              <p className="text-gray-300 leading-relaxed">
                Build real applications and create a portfolio that showcases your skills to potential employers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                5,000+
              </div>
              <p className="text-gray-300 text-lg">Active Students</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                98%
              </div>
              <p className="text-gray-300 text-lg">Completion Rate</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                25+
              </div>
              <p className="text-gray-300 text-lg">Expert Instructors</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy-800/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Begin Your Coding Journey?
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Join thousands of developers who have transformed their careers with Learning Code Loop. 
              Start building amazing applications today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/login">
                <Button size="lg" className="px-8 py-4 text-lg">
                  <ApperIcon name="ArrowRight" size={20} className="mr-2" />
                  Get Started Now
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <ApperIcon name="MessageCircle" size={20} className="mr-2" />
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-navy-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold text-white">Learning Code Loop</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering developers to build the future, one line of code at a time.
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 Learning Code Loop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;
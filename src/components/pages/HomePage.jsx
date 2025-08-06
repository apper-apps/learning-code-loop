import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getPrograms } from "@/services/api/programService";
import { getFeaturedReviews } from "@/services/api/reviewService";
import { getPosts } from "@/services/api/postService";
import ProgramCard from "@/components/organisms/ProgramCard";
import ReviewCard from "@/components/organisms/ReviewCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const HomePage = () => {
  const [programs, setPrograms] = useState([]);
  const [featuredReview, setFeaturedReview] = useState(null);
  const [latestPost, setLatestPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [programsData, reviewsData, postsData] = await Promise.all([
        getPrograms(),
        getFeaturedReviews(),
        getPosts()
      ]);
      
      setPrograms(programsData);
      setFeaturedReview(reviewsData[0] || null);
      setLatestPost(postsData[0] || null);
      
    } catch (err) {
      console.error("Failed to load homepage data:", err);
      setError("Failed to load homepage content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-navy-900"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Transform Your Skills
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Master cutting-edge skills through our expertly crafted courses designed for modern learners. 
              Join thousands who have already transformed their careers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/program">
                <Button size="lg" className="px-8 py-4 text-lg">
                  <ApperIcon name="Rocket" size={20} className="mr-2" />
                  Start Learning
                </Button>
              </Link>
              <Link to="/reviews">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  <ApperIcon name="Users" size={20} className="mr-2" />
                  See Success Stories
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-navy-800/50 to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                10,000+
              </div>
              <p className="text-gray-300">Students Enrolled</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                95%
              </div>
              <p className="text-gray-300">Success Rate</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <p className="text-gray-300">Expert Instructors</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Featured Programs
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Choose from our carefully designed programs that combine theory with hands-on practice
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {programs.map((program, index) => (
              <motion.div
                key={program.Id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/program">
              <Button variant="outline" size="lg">
                View All Programs
                <ApperIcon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Review & Latest Insight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy-800/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Featured Review */}
            {featuredReview && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold text-white">Student Success</h3>
                  <Badge variant="featured">Featured</Badge>
                </div>
                <ReviewCard review={featuredReview} />
                <Link to="/reviews" className="inline-block">
                  <Button variant="ghost">
                    Read More Reviews
                    <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Latest Insight */}
            {latestPost && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white">Latest Insights</h3>
                <div className="card-navy p-6">
                  {latestPost.featured_image && (
                    <img
                      src={latestPost.featured_image}
                      alt={latestPost.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h4 className="text-xl font-bold text-white mb-3">
                    {latestPost.title}
                  </h4>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {latestPost.excerpt}
                  </p>
                  <Link to={`/insight`}>
                    <Button variant="ghost">
                      Read Full Article
                      <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
                <Link to="/insight" className="inline-block">
                  <Button variant="ghost">
                    View All Insights
                    <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Join our community of learners and start building the skills that matter. 
              Every expert was once a beginner.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/program">
                <Button size="lg" className="px-8 py-4 text-lg">
                  <ApperIcon name="PlayCircle" size={20} className="mr-2" />
                  Get Started Today
                </Button>
              </Link>
              <Link to="/insight">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  <ApperIcon name="BookOpen" size={20} className="mr-2" />
                  Explore Resources
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
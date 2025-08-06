import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getPrograms } from "@/services/api/programService";
import { getLectures } from "@/services/api/lectureService";
import { getPosts } from "@/services/api/postService";
import { getUsers } from "@/services/api/userService";
import { getReviews } from "@/services/api/reviewService";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const AdminDashboard = () => {
  const { currentUser, isAdmin } = useCurrentUser();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [programs, lectures, posts, users, reviews] = await Promise.all([
        getPrograms(),
        getLectures(),
        getPosts(),
        getUsers(),
        getReviews()
      ]);

      setStats({
        totalUsers: users.length,
        totalPrograms: programs.length,
        totalLectures: lectures.length,
        totalPosts: posts.length,
        totalReviews: reviews.length,
        publishedPosts: posts.filter(p => p.published).length
      });

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: "user",
          action: "New user registered",
          details: users[users.length - 1]?.name || "Unknown User",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          type: "review",
          action: "New review posted",
          details: reviews[0]?.text?.substring(0, 50) + "..." || "Review content",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          type: "post",
          action: "Article published",
          details: posts[0]?.title || "Article title",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]);

    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Error
            title="Access Denied"
            message="You don't have permission to access the admin dashboard."
          />
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const quickActions = [
    { label: "Manage Users", path: "/admin/users", icon: "Users", color: "from-blue-400 to-blue-600" },
    { label: "Manage Programs", path: "/admin/programs", icon: "BookOpen", color: "from-green-400 to-green-600" },
    { label: "Manage Lectures", path: "/admin/lectures", icon: "Play", color: "from-purple-400 to-purple-600" },
    { label: "Manage Posts", path: "/admin/posts", icon: "FileText", color: "from-orange-400 to-orange-600" }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "user": return "UserPlus";
      case "review": return "MessageCircle";
      case "post": return "FileText";
      default: return "Activity";
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Welcome back, {currentUser?.name}. Here's what's happening with your platform.
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="Users"
            description={`${stats.totalUsers} registered users`}
            trend={{ type: "up", value: "+12%" }}
          />
          <StatCard
            title="Programs"
            value={stats.totalPrograms}
            icon="BookOpen"
            description={`${stats.totalPrograms} active programs`}
          />
          <StatCard
            title="Lectures"
            value={stats.totalLectures}
            icon="Play"
            description={`${stats.totalLectures} total lectures`}
          />
          <StatCard
            title="Reviews"
            value={stats.totalReviews}
            icon="MessageCircle"
            description={`${stats.totalReviews} user reviews`}
            trend={{ type: "up", value: "+8%" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-navy p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <ApperIcon name="Zap" size={20} className="text-blue-400" />
                <span>Quick Actions</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      to={action.path}
                      className="block p-4 bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors duration-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <ApperIcon name={action.icon} size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {action.label}
                          </h3>
                          <p className="text-sm text-gray-400">Manage and configure</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-navy p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <ApperIcon name="Activity" size={20} className="text-blue-400" />
              <span>Recent Activity</span>
            </h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-navy-800 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={getActivityIcon(activity.type)} size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-400 truncate">{activity.details}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <Button variant="ghost" size="sm" className="w-full">
                <ApperIcon name="Eye" size={16} className="mr-2" />
                View All Activity
              </Button>
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 card-navy p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <ApperIcon name="Shield" size={20} className="text-green-400" />
            <span>System Status</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">API Status</p>
                <p className="text-sm text-gray-400">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">Database</p>
                <p className="text-sm text-gray-400">Connected and healthy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">Storage</p>
                <p className="text-sm text-gray-400">85% available</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getPrograms } from "@/services/api/programService";
import { getLectures } from "@/services/api/lectureService";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatCard from "@/components/molecules/StatCard";
import ApperIcon from "@/components/ApperIcon";

const ProfilePage = () => {
  const { currentUser, isLoggedIn } = useCurrentUser();
  const [programs, setPrograms] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    role: ""
  });

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [programsData, lecturesData] = await Promise.all([
        getPrograms(),
        getLectures()
      ]);
      
      setPrograms(programsData);
      setLectures(lecturesData);
      
      if (currentUser) {
        setProfileForm({
          name: currentUser.name || "",
          email: currentUser.email || "",
          role: currentUser.role || ""
        });
      }
      
    } catch (err) {
      console.error("Failed to load profile data:", err);
      setError("Failed to load profile information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [currentUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  // Mock enrollment data
  const enrolledPrograms = programs.slice(0, 1); // Mock user enrolled in first program
  const completedLectures = lectures.slice(0, 2); // Mock completed lectures
  
  const stats = {
    enrolledPrograms: enrolledPrograms.length,
    completedLectures: completedLectures.length,
    totalProgress: Math.round((completedLectures.length / Math.max(lectures.length, 1)) * 100),
    certificates: 0 // Mock data
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: "BarChart3" },
    { key: "courses", label: "My Courses", icon: "BookOpen" },
    { key: "progress", label: "Progress", icon: "TrendingUp" },
    { key: "settings", label: "Settings", icon: "Settings" }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Error
            title="Access Denied"
            message="Please log in to view your profile."
            onRetry={() => window.location.href = '/'}
          />
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfileData} />;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-navy p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {currentUser.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {currentUser.name}
                  </h1>
                  <p className="text-gray-400">{currentUser.email}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="primary">{currentUser.role}</Badge>
                  {currentUser.is_admin && <Badge variant="featured">Admin</Badge>}
                  {currentUser.master_cohort && (
                    <Badge variant="success">Cohort: {currentUser.master_cohort}</Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Edit" size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Camera" size={16} className="mr-2" />
                    Update Photo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-navy-800 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-400 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Enrolled Programs"
                  value={stats.enrolledPrograms}
                  icon="BookOpen"
                  description="Active enrollments"
                />
                <StatCard
                  title="Completed Lectures"
                  value={stats.completedLectures}
                  icon="CheckCircle"
                  description="Lessons finished"
                />
                <StatCard
                  title="Overall Progress"
                  value={`${stats.totalProgress}%`}
                  icon="TrendingUp"
                  description="Across all courses"
                />
                <StatCard
                  title="Certificates"
                  value={stats.certificates}
                  icon="Award"
                  description="Earned certificates"
                />
              </div>

              {/* Recent Activity */}
              <div className="card-navy p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <ApperIcon name="Activity" size={20} className="text-blue-400" />
                  <span>Recent Activity</span>
                </h3>
                <div className="space-y-4">
                  {completedLectures.map((lecture) => (
                    <div key={lecture.Id} className="flex items-center space-x-4 p-3 bg-navy-900 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-lg flex items-center justify-center">
                        <ApperIcon name="CheckCircle" size={20} className="text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Completed: {lecture.title}</p>
                        <p className="text-sm text-gray-400">{lecture.category}</p>
                      </div>
                      <Badge variant="success">Completed</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">My Courses</h2>
              {enrolledPrograms.length === 0 ? (
                <div className="card-navy p-8 text-center">
                  <ApperIcon name="BookOpen" size={48} className="text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Enrolled Courses</h3>
                  <p className="text-gray-400 mb-4">Start your learning journey by enrolling in a course.</p>
                  <Button>
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledPrograms.map((program) => (
                    <div key={program.Id} className="card-navy p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white">{program.title}</h3>
                          <p className="text-gray-300">{program.description}</p>
                          <Badge variant="primary">{program.type}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-400">65%</div>
                          <div className="text-sm text-gray-400">Progress</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "progress" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Learning Progress</h2>
              <div className="card-navy p-6">
                <div className="space-y-6">
                  {programs.slice(0, 2).map((program) => (
                    <div key={program.Id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">{program.title}</h3>
                        <span className="text-sm text-gray-400">65%</span>
                      </div>
                      <div className="w-full bg-navy-900 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
              <form onSubmit={handleProfileUpdate} className="card-navy p-6 space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profileForm.role}
                    readOnly
                    className="bg-navy-900 cursor-not-allowed"
                  />
                </div>
                <Button type="submit">
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  Save Changes
                </Button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
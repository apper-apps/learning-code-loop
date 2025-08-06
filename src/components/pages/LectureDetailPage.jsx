import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { getProgramById } from "@/services/api/programService";
import { getLectureById, getLecturesByProgramId } from "@/services/api/lectureService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const LectureDetailPage = () => {
  const { id } = useParams();
const [lecture, setLecture] = useState(null);
  const [program, setProgram] = useState(null);
  const [programLectures, setProgramLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
const loadLectureData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const lectureData = await getLectureById(id);
      setLecture(lectureData);
      
      // Load all lectures from the same program for category navigation
      if (lectureData.programId) {
        const programLecturesData = await getLecturesByProgramId(lectureData.programId);
        setProgramLectures(programLecturesData);
      }
      
    } catch (err) {
      console.error("Failed to load lecture:", err);
      setError("Failed to load lecture details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectureData();
  }, [id]);

  const getLevelBadge = (level) => {
    if (level === "master_common") return <Badge variant="featured">Master Common</Badge>;
    if (level?.includes("intermediate")) return <Badge variant="primary">Intermediate</Badge>;
    return <Badge>Basic</Badge>;
  };

  // Group lectures by category for navigation
  const groupedLectures = programLectures.reduce((acc, lecture) => {
    const category = lecture.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lecture);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLectureData} />;
  if (!lecture) return <Error title="Lecture not found" message="The lecture you're looking for doesn't exist." />;

return (
    <div className="min-h-screen">
      {/* Desktop Layout (≥1024px): 280px sidebar + 1fr main content */}
      <div className="lg:flex lg:h-screen">
        {/* Category Sidebar - Desktop Only */}
        <div className="hidden lg:block w-[280px] bg-navy-800 border-r border-blue-400/10 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <ApperIcon name="BookOpen" size={20} className="text-blue-400" />
              <span>Course Content</span>
            </h2>
            
            {/* Category Accordion */}
            <div className="space-y-2">
              {Object.entries(groupedLectures).map(([category, categoryLectures]) => (
                <div key={category}>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-navy-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="FolderOpen" size={16} className="text-blue-400" />
                      <span className="text-white font-medium">{category}</span>
                      <span className="text-xs text-gray-400">({categoryLectures.length})</span>
                    </div>
                    <ApperIcon 
                      name={expandedCategory === category ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-gray-400" 
                    />
                  </button>
                  
                  {expandedCategory === category && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-2 space-y-1"
                    >
                      {categoryLectures.map((categoryLecture) => (
                        <Link
                          key={categoryLecture.Id}
                          to={`/lecture/${categoryLecture.Id}`}
                          className={`block p-3 rounded-lg transition-colors ${
                            parseInt(id) === categoryLecture.Id
                              ? 'bg-blue-400/20 border border-blue-400/30'
                              : 'hover:bg-navy-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded">
                              <span className="text-blue-400 text-xs font-semibold">
                                {categoryLecture.order}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {categoryLecture.title}
                              </p>
                              <p className="text-xs text-gray-400">{categoryLecture.duration}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            {/* Mobile Category Dropdown */}
            <div className="lg:hidden mb-6">
              <div className="relative">
                <button
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className="w-full card-navy p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="BookOpen" size={16} className="text-blue-400" />
                    <span className="text-white font-medium">Course Content</span>
                  </div>
                  <ApperIcon 
                    name={isMobileDropdownOpen ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-gray-400" 
                  />
                </button>
                
                {isMobileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-2 card-navy border border-blue-400/20 rounded-lg overflow-hidden"
                  >
                    {Object.entries(groupedLectures).map(([category, categoryLectures]) => (
                      <div key={category} className="border-b border-gray-700 last:border-b-0">
                        <div className="p-3 bg-navy-900">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="FolderOpen" size={14} className="text-blue-400" />
                            <span className="text-white text-sm font-medium">{category}</span>
                            <span className="text-xs text-gray-400">({categoryLectures.length})</span>
                          </div>
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                          {categoryLectures.map((categoryLecture) => (
                            <Link
                              key={categoryLecture.Id}
                              to={`/lecture/${categoryLecture.Id}`}
                              onClick={() => setIsMobileDropdownOpen(false)}
                              className={`block p-3 hover:bg-navy-700 transition-colors ${
                                parseInt(id) === categoryLecture.Id ? 'bg-blue-400/10' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded">
                                  <span className="text-blue-400 text-xs font-semibold">
                                    {categoryLecture.order}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-white">{categoryLecture.title}</p>
                                  <p className="text-xs text-gray-400">{categoryLecture.duration}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                  <ApperIcon name="ChevronRight" size={16} />
                  <Link to="/programs" className="hover:text-white transition-colors">Programs</Link>
                  <ApperIcon name="ChevronRight" size={16} />
                  <span className="text-white">{lecture.title}</span>
                </div>
              </nav>

              {/* Lecture Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-navy p-8 mb-8"
              >
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl">
                          <span className="text-blue-400 font-bold text-lg">
                            {lecture.order}
                          </span>
                        </div>
                        <div>
                          <h1 className="text-3xl md:text-4xl font-bold text-white">
                            {lecture.title}
                          </h1>
                          <p className="text-gray-400 mt-1">{lecture.category}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {getLevelBadge(lecture.level)}
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <ApperIcon name="Clock" size={16} />
                          <span>{lecture.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <ApperIcon name="Calendar" size={16} />
                          <span>{formatDistanceToNow(new Date(lecture.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Bookmark" size={16} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Share2" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-navy p-8 mb-8"
              >
                <div className="aspect-video bg-navy-900 rounded-lg overflow-hidden">
                  {lecture.videoUrl ? (
                    <iframe
                      src={lecture.videoUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={lecture.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                          <ApperIcon name="Play" size={32} className="text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">Video Not Available</h3>
                          <p className="text-gray-400">
                            Video content will be added soon
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Lecture Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-navy p-8 mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <ApperIcon name="FileText" size={24} className="text-blue-400" />
                  <span>Lecture Content</span>
                </h2>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {lecture.description}
                  </p>
                </div>
              </motion.div>

              {/* Lecture Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between"
              >
                <Button variant="outline">
                  <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
                  Previous Lecture
                </Button>
                
                <div className="flex items-center space-x-3">
                  <Button variant="ghost">
                    <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                    Replay
                  </Button>
                  <Button>
                    <ApperIcon name="CheckCircle" size={16} className="mr-2" />
                    Mark Complete
                  </Button>
                </div>
                
                <Button>
                  Next Lecture
                  <ApperIcon name="ChevronRight" size={16} className="ml-2" />
                </Button>
              </motion.div>

              {/* Additional Resources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 card-navy p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <ApperIcon name="Download" size={20} className="text-blue-400" />
                  <span>Resources</span>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-navy-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="FileText" size={20} className="text-blue-400" />
                      <div>
                        <p className="text-white font-medium">Lecture Notes</p>
                        <p className="text-sm text-gray-400">PDF • 2.3 MB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Download" size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-navy-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Code" size={20} className="text-blue-400" />
                      <div>
                        <p className="text-white font-medium">Practice Exercise</p>
                        <p className="text-sm text-gray-400">ZIP • 1.8 MB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Download" size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureDetailPage;
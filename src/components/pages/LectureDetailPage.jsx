import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getLectureById } from "@/services/api/lectureService";
import { getProgramById } from "@/services/api/programService";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const LectureDetailPage = () => {
  const { id } = useParams();
  const [lecture, setLecture] = useState(null);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLectureData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const lectureData = await getLectureById(id);
      setLecture(lectureData);
      
      // Note: We don't have a getProgramById service, so we'll skip loading program details
      // In a real app, you would implement this service method
      
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLectureData} />;
  if (!lecture) return <Error title="Lecture not found" message="The lecture you're looking for doesn't exist." />;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ApperIcon name="ChevronRight" size={16} />
            <Link to="/program" className="hover:text-white transition-colors">Programs</Link>
            <ApperIcon name="ChevronRight" size={16} />
            <span className="text-white">Lecture {lecture.order}</span>
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

        {/* Video Player Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-navy p-8 mb-8"
        >
          <div className="aspect-video bg-navy-900 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="Play" size={32} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Video Content</h3>
                <p className="text-gray-400">
                  Video player would be integrated here in a production environment
                </p>
              </div>
            </div>
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
              {lecture.content}
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
  );
};

export default LectureDetailPage;
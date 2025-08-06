import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getProgramBySlug } from "@/services/api/programService";
import { getLecturesByProgramId } from "@/services/api/lectureService";
import { addToWaitlist } from "@/services/api/waitlistService";
import LectureList from "@/components/organisms/LectureList";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const ProgramDetailPage = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);

  const loadProgramData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const programData = await getProgramBySlug(slug);
      const lecturesData = await getLecturesByProgramId(programData.Id);
      
      setProgram(programData);
      setLectures(lecturesData);
      
    } catch (err) {
      console.error("Failed to load program:", err);
      setError("Failed to load program details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgramData();
  }, [slug]);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setSubmittingWaitlist(true);
      await addToWaitlist(waitlistEmail.trim(), program.slug);
      toast.success("Successfully added to waitlist! We'll notify you when enrollment opens.");
      setWaitlistEmail("");
      setShowWaitlist(false);
    } catch (err) {
      console.error("Failed to add to waitlist:", err);
      toast.error(err.message || "Failed to add to waitlist");
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProgramData} />;
  if (!program) return <Error title="Program not found" message="The program you're looking for doesn't exist." />;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ApperIcon name="ChevronRight" size={16} />
            <Link to="/program" className="hover:text-white transition-colors">Programs</Link>
            <ApperIcon name="ChevronRight" size={16} />
            <span className="text-white">{program.title}</span>
          </div>
        </nav>

        {/* Program Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-navy p-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex-1 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl">
                    <ApperIcon 
                      name={program.type === "master" ? "Crown" : "Users"} 
                      size={32} 
                      className={program.type === "master" ? "text-yellow-400" : "text-blue-400"}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-white">
                        {program.title}
                      </h1>
                      <Badge variant={program.type === "master" ? "featured" : "primary"}>
                        {program.type.toUpperCase()}
                      </Badge>
                    </div>
                    {program.has_common_course && (
                      <Badge variant="success" className="mb-4">
                        Includes Common Course
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed">
                  {program.description}
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <ApperIcon name="Clock" size={20} />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <ApperIcon name="BarChart" size={20} />
                    <span>{program.level}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <ApperIcon name="BookOpen" size={20} />
                    <span>{lectures.length} Lectures</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-80 space-y-4">
                <div className="text-center lg:text-right">
                  <div className="text-4xl font-bold text-white mb-2">${program.price}</div>
                  <p className="text-gray-400">One-time payment</p>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Button size="lg" className="w-full">
                    <ApperIcon name="CreditCard" size={20} className="mr-2" />
                    Enroll Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setShowWaitlist(true)}
                    className="w-full"
                  >
                    <ApperIcon name="Mail" size={20} className="mr-2" />
                    Join Waitlist
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Course Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Course Content</h2>
              <div className="text-gray-400">
                {lectures.length} lectures • {lectures.reduce((acc, lecture) => acc + parseInt(lecture.duration), 0)} minutes
              </div>
            </div>

            {lectures.length === 0 ? (
              <Empty
                title="No lectures available"
                message="This program doesn't have any lectures yet. Check back soon!"
                icon="BookOpen"
              />
            ) : (
              <LectureList lectures={lectures} programType={program.type} />
            )}
          </motion.div>
        </div>

        {/* Waitlist Modal */}
        {showWaitlist && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy-800 rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Join Waitlist</h3>
                <button
                  onClick={() => setShowWaitlist(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <p className="text-gray-300 mb-6">
                Get notified when enrollment for {program.title} opens up.
              </p>
              
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="waitlist-email">Email Address</Label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowWaitlist(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingWaitlist}
                    className="flex-1"
                  >
                    {submittingWaitlist ? "Adding..." : "Join Waitlist"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramDetailPage;
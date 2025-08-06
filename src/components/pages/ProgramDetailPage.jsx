import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getProgramBySlug } from "@/services/api/programService";
import { addToWaitlist } from "@/services/api/waitlistService";
import { getLecturesByProgramId } from "@/services/api/lectureService";
import ApperIcon from "@/components/ApperIcon";
import LectureList from "@/components/organisms/LectureList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
const ProgramDetailPage = () => {
  const { slug } = useParams();
  const { currentUser, isAdmin } = useCurrentUser();
  const [program, setProgram] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState("");
  const [courseType, setCourseType] = useState("common"); // "common" or "cohort"
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);

  // Check if user has master access
  const getUserRole = () => {
    if (!currentUser?.accounts?.[0]) return null;
    return currentUser.accounts[0].role || currentUser.accounts[0].userRole;
  };

  const hasMasterAccess = () => {
    const role = getUserRole();
    return role === "master" || role === "both";
};

  const loadProgramData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const programData = await getProgramBySlug(slug);
      const lecturesData = await getLecturesByProgramId(programData.Id);
      
      setProgram(programData);
      setLectures(lecturesData);
      
      // For demo purposes, set mock cohort data
      // In real implementation, fetch from cohort service
      setCohorts([
        { Id: 1, Name: "Cohort 2024-Q1" },
        { Id: 2, Name: "Cohort 2024-Q2" },
        { Id: 3, Name: "Cohort 2024-Q3" }
      ]);
      
      // Set default cohort if user has master access
      if (hasMasterAccess() && currentUser?.master_cohort) {
        setSelectedCohort(currentUser.master_cohort);
      }
      
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
            {hasMasterAccess() ? (
              // Master/Both users - Full interface
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl">
                    <ApperIcon 
                      name="Crown" 
                      size={32} 
                      className="text-yellow-400"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        {program.title}
                      </h1>
                      {isAdmin && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2">
                          <ApperIcon name="Plus" size={16} />
                          <span>Add Lecture</span>
                        </Button>
                      )}
                    </div>
                    <Badge variant="featured" className="mb-4">
                      MASTER PROGRAM
                    </Badge>
                  </div>
                </div>

                {/* Cohort Selection */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="cohort-select" className="text-white mb-2 block">Select Cohort</Label>
                    <select
                      id="cohort-select"
                      value={selectedCohort}
                      onChange={(e) => setSelectedCohort(e.target.value)}
                      className="w-full px-3 py-2 bg-navy-800 border border-blue-400/20 rounded-md text-white focus:outline-none focus:border-blue-400"
                    >
                      <option value="">Select a cohort</option>
                      {cohorts.map(cohort => (
                        <option key={cohort.Id} value={cohort.Name}>
                          {cohort.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Course Type Toggle */}
                  {program.has_common_course && (
                    <div className="flex-1">
                      <Label className="text-white mb-2 block">Course Type</Label>
                      <div className="flex bg-navy-800 rounded-md border border-blue-400/20 p-1">
                        <button
                          onClick={() => setCourseType("common")}
                          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                            courseType === "common"
                              ? "bg-blue-600 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          Common Course
                        </button>
                        <button
                          onClick={() => setCourseType("cohort")}
                          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                            courseType === "cohort"
                              ? "bg-blue-600 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          Cohort Course
                        </button>
                      </div>
                    </div>
                  )}
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
            ) : (
              // Non-master users - Simple header + Join Waitlist
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl">
                    <ApperIcon name="Crown" size={32} className="text-yellow-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {program.title}
                    </h1>
                    <Badge variant="featured">MASTER PROGRAM</Badge>
                  </div>
                </div>
                
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  {program.description}
                </p>

                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                  onClick={() => setShowWaitlist(true)}
                >
                  <ApperIcon name="Mail" size={24} className="mr-3" />
                  Join Wait-list
                </Button>
              </div>
            )}
          </motion.div>
</div>

        {/* Course Content - Only show for master users */}
        {hasMasterAccess() && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Course Content</h2>
                  <div className="text-gray-400">
                    {lectures.length} lectures • {lectures.reduce((acc, lecture) => acc + parseInt(lecture.duration || 0), 0)} minutes
                  </div>
                </div>
              </div>

              {lectures.length === 0 ? (
                <Empty
                  title="No lectures available"
                  message="This program doesn't have any lectures yet. Check back soon!"
                  icon="BookOpen"
                />
              ) : (
                <LectureList 
                  lectures={lectures} 
                  programType={program.type} 
                  currentUser={currentUser}
                  selectedCohort={selectedCohort}
                  courseType={courseType}
                  accordionOpen={accordionOpen}
                  setAccordionOpen={setAccordionOpen}
                  hasMasterAccess={hasMasterAccess()}
                />
              )}
            </motion.div>
          </div>
        )}
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
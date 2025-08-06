import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getPrograms } from "@/services/api/programService";
import { addToWaitlist } from "@/services/api/waitlistService";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProgramCard from "@/components/organisms/ProgramCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const ProgramMasterPage = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  const { currentUser, isLoggedIn, isAdmin } = useCurrentUser();

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPrograms();
      
      // Filter out programs with slug "membership"
      const masterPrograms = data.filter(program => program.slug !== "membership");
      
      setPrograms(masterPrograms);
      setFilteredPrograms(masterPrograms);
    } catch (err) {
      console.error("Error loading programs:", err);
      setError(err.message || "Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    let filtered = programs;

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(program => program.type === selectedType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPrograms(filtered);
  }, [programs, selectedType, searchQuery]);

  const typeFilters = [
    { key: "all", label: "All Programs", count: programs.length },
    { key: "member", label: "Member", count: programs.filter(p => p.type === "member").length },
    { key: "master", label: "Master", count: programs.filter(p => p.type === "master").length }
  ];

  const handleJoinWaitlist = (program) => {
    setSelectedProgram(program);
    setWaitlistEmail(currentUser?.emailAddress || "");
    setShowWaitlistModal(true);
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setWaitlistLoading(true);
      await addToWaitlist(waitlistEmail, selectedProgram.slug);
      toast.success(`Successfully joined waitlist for ${selectedProgram.title}!`);
      setShowWaitlistModal(false);
      setWaitlistEmail("");
      setSelectedProgram(null);
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error(error.message || "Failed to join waitlist");
    } finally {
      setWaitlistLoading(false);
    }
  };

  const closeWaitlistModal = () => {
    setShowWaitlistModal(false);
    setWaitlistEmail("");
    setSelectedProgram(null);
  };

  const getUserRole = () => {
    if (!currentUser?.accounts?.[0]) return null;
    return currentUser.accounts[0].role || currentUser.accounts[0].userRole;
  };

  const canEnterCourse = () => {
    const role = getUserRole();
    return role === "master" || role === "both";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPrograms} />;

  return (
    <div className="min-h-screen bg-navy-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Master Programs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl"
          >
            Explore our comprehensive master-level programs designed to advance your skills and expertise.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search programs..."
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((filter) => (
                <Badge
                  key={filter.key}
                  variant={selectedType === filter.key ? "default" : "outline"}
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedType(filter.key)}
                >
                  {filter.label} ({filter.count})
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              {isAdmin ? (
                <div className="max-w-md mx-auto">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="card-navy p-8 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-blue-400 transition-colors"
                  >
                    <Link to="/admin/programs" className="block">
                      <ApperIcon name="Plus" size={48} className="text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Add New Program</h3>
                      <p className="text-gray-400">Create a new master program to get started</p>
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <Empty
                  title="No master programs found"
                  message={
                    searchQuery || selectedType !== "all"
                      ? "No programs match your search criteria. Try adjusting your filters or search terms."
                      : "There are no master programs available at the moment. Check back soon!"
                  }
                  icon="GraduationCap"
                />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.Id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProgramCard 
                    program={program} 
                    showRoleBasedButtons={true}
                    canEnterCourse={canEnterCourse()}
                    onJoinWaitlist={() => handleJoinWaitlist(program)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-navy-800 rounded-lg p-6 w-full max-w-md border border-gray-600"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Join Waitlist</h3>
              <button
                onClick={closeWaitlistModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <p className="text-gray-300 mb-6">
              Join the waitlist for <strong>{selectedProgram?.title}</strong> and we'll notify you when it becomes available.
            </p>
            
            <form onSubmit={handleWaitlistSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeWaitlistModal}
                  className="flex-1"
                  disabled={waitlistLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={waitlistLoading}
                >
                  {waitlistLoading ? "Joining..." : "Join Waitlist"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProgramMasterPage;
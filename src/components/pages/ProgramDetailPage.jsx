import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getProgramBySlug } from "@/services/api/programService";
import { addToWaitlist } from "@/services/api/waitlistService";
import { getLecturesByProgramId } from "@/services/api/lectureService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";

const ProgramDetailPage = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCohort, setSelectedCohort] = useState("");
  const [courseType, setCourseType] = useState("common");
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  const { currentUser, isLoggedIn, isAdmin } = useCurrentUser();

  const getUserRole = () => {
    if (!currentUser?.accounts?.[0]) return null;
    return currentUser.accounts[0].role || currentUser.accounts[0].userRole;
  };

  const canAccessMasterContent = () => {
    const role = getUserRole();
    return role === "master" || role === "both";
  };

  const loadProgramData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const programData = await getProgramBySlug(slug);
      if (!programData) {
        setError("Program not found");
        return;
      }
      
      setProgram(programData);
      
      // Load lectures for this program
      const lecturesData = await getLecturesByProgramId(programData.Id);
      setLectures(lecturesData || []);
      
      // Set default cohort from user's master_cohort
      if (currentUser?.master_cohort) {
        setSelectedCohort(currentUser.master_cohort);
      }
    } catch (err) {
      console.error("Error loading program data:", err);
      setError(err.message || "Failed to load program data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadProgramData();
    }
  }, [slug]);

  const filteredLectures = lectures.filter(lecture => {
    if (courseType === "common") {
      return lecture.level === "master_common";
    } else if (courseType === "cohort") {
      return lecture.level === "master" && lecture.cohort_number === selectedCohort;
    }
    return false;
  });

  const toggleAccordion = (lectureId) => {
    setOpenAccordionId(openAccordionId === lectureId ? null : lectureId);
  };

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setWaitlistLoading(true);
      await addToWaitlist(waitlistEmail, program.slug);
      toast.success(`Successfully joined waitlist for ${program.title}!`);
      setWaitlistEmail("");
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error(error.message || "Failed to join waitlist");
    } finally {
      setWaitlistLoading(false);
    }
  };

  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return "";
    // Convert various video URLs to embed format
    if (videoUrl.includes("youtube.com/watch")) {
      const videoId = videoUrl.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (videoUrl.includes("youtu.be/")) {
      const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return videoUrl; // Return as-is if already an embed URL
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProgramData} />;
  if (!program) return <Error message="Program not found" />;

  return (
    <div className="min-h-screen bg-navy-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {canAccessMasterContent() ? (
          // Master/Both role view
          <>
            {/* Blue Gradient Banner with Program Title */}
            <div className="relative mb-8 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 px-8 py-12">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                      {program.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl text-blue-100 max-w-3xl"
                    >
                      {program.description}
                    </motion.p>
                  </div>
                  
                  {/* Admin Only: Add Lecture Button */}
                  {isAdmin && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link to={`/admin/lectures?programId=${program.Id}`}>
                        <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-2 transition-all">
                          <ApperIcon name="Plus" size={18} className="mr-2" />
                          강의 추가
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls: Cohort Dropdown and Course Type Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 p-6 bg-navy-800 rounded-xl border border-gray-600"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Cohort Dropdown */}
                <div className="flex-1">
                  <label htmlFor="cohort" className="block text-sm font-medium text-gray-300 mb-2">
                    기수 (Cohort)
                  </label>
                  <select
                    id="cohort"
                    value={selectedCohort}
                    onChange={(e) => setSelectedCohort(e.target.value)}
                    className="w-full md:w-48 px-3 py-2 bg-navy-900 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="">기수를 선택하세요</option>
                    <option value="1">1기</option>
                    <option value="2">2기</option>
                    <option value="3">3기</option>
                    <option value="4">4기</option>
                    <option value="5">5기</option>
                  </select>
                </div>

                {/* Course Type Toggle - Hide if has_common_course is false */}
                {program.has_common_course && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      과정 유형
                    </label>
                    <div className="flex bg-navy-900 rounded-md border border-gray-600 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setCourseType("common")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          courseType === "common"
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-navy-700"
                        }`}
                      >
                        공통 과정
                      </button>
                      <button
                        type="button"
                        onClick={() => setCourseType("cohort")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          courseType === "cohort"
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-navy-700"
                        }`}
                      >
                        해당 기수 과정
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Lectures Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {filteredLectures.length === 0 ? (
                <div className="text-center py-12 bg-navy-800 rounded-xl border border-gray-600">
                  <ApperIcon name="BookOpen" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">강의가 없습니다</h3>
                  <p className="text-gray-400">
                    {courseType === "cohort" && !selectedCohort
                      ? "기수를 선택해주세요."
                      : "선택된 조건에 맞는 강의가 없습니다."}
                  </p>
                </div>
              ) : (
                filteredLectures.map((lecture, index) => (
                  <motion.div
                    key={lecture.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-navy-800 rounded-xl border border-gray-600 overflow-hidden"
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleAccordion(lecture.Id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-navy-700 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{lecture.title}</h3>
                          {lecture.duration && (
                            <p className="text-sm text-gray-400">길이: {lecture.duration}</p>
                          )}
                        </div>
                      </div>
                      <ApperIcon
                        name={openAccordionId === lecture.Id ? "ChevronUp" : "ChevronDown"}
                        size={20}
                        className="text-gray-400"
                      />
                    </button>

                    {/* Accordion Content */}
                    {openAccordionId === lecture.Id && (
                      <div className="px-6 pb-6 border-t border-gray-600">
                        {/* Lecture Description */}
                        {lecture.description && (
                          <div className="mb-4 pt-4">
                            <p className="text-gray-300">{lecture.description}</p>
                          </div>
                        )}

                        {/* Video Embed */}
                        {lecture.videoUrl && (
                          <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <iframe
                              src={getEmbedUrl(lecture.videoUrl)}
                              title={lecture.title}
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </>
        ) : (
          // Free/Member role view - Only show description and waitlist button
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {program.title}
              </h1>
              
              <div className="bg-navy-800 rounded-xl p-8 border border-gray-600 mb-8">
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  {program.description}
                </p>
                
                {program.description_long && (
                  <p className="text-gray-400 leading-relaxed">
                    {program.description_long}
                  </p>
                )}
              </div>

              {/* Join Waitlist Form */}
              <div className="bg-navy-800 rounded-xl p-8 border border-gray-600">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  프로그램 참여하기
                </h3>
                <p className="text-gray-300 mb-6">
                  이 프로그램에 참여하려면 대기자 명단에 등록하세요.
                </p>
                
                <form onSubmit={handleJoinWaitlist} className="max-w-md mx-auto">
                  <div className="mb-4">
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-navy-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="이메일 주소를 입력하세요"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
                    disabled={waitlistLoading}
                  >
                    {waitlistLoading ? "등록 중..." : "대기자 등록 (Join Wait-list)"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgramDetailPage;
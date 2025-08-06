import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getLectures, createLecture, updateLecture, deleteLecture } from "@/services/api/lectureService";
import { getPrograms } from "@/services/api/programService";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const AdminLectures = () => {
  const { isAdmin } = useCurrentUser();
  const [lectures, setLectures] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
const [lectureForm, setLectureForm] = useState({
    programId: "",
    program_slug: "",
    title: "",
    category: "",
    level: "",
    cohort_number: "",
    embed_url: "",
    sort_order: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [lecturesData, programsData] = await Promise.all([
        getLectures(),
        getPrograms()
      ]);
      setLectures(lecturesData);
      setPrograms(programsData);
      setFilteredLectures(lecturesData);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load lectures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = lectures;

    if (selectedProgram !== "all") {
      filtered = filtered.filter(lecture => lecture.program_id === parseInt(selectedProgram));
    }

    if (searchQuery) {
      filtered = filtered.filter(lecture =>
        lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLectures(filtered);
  }, [lectures, selectedProgram, searchQuery]);

const handleCreateLecture = async (e) => {
    e.preventDefault();
    
    // Validate embed_url starts with https://
    if (lectureForm.embed_url && !lectureForm.embed_url.startsWith('https://')) {
      toast.error("Video URL must start with https://");
      return;
    }
    
    try {
      const formData = {
        ...lectureForm,
        programId: parseInt(lectureForm.programId),
        cohort_number: lectureForm.cohort_number ? parseInt(lectureForm.cohort_number) : null,
        sort_order: parseInt(lectureForm.sort_order)
      };
      const newLecture = await createLecture(formData);
      setLectures(prev => [newLecture, ...prev]);
      setLectureForm({
        programId: "",
        program_slug: "",
        title: "",
        category: "",
        level: "",
        cohort_number: "",
        embed_url: "",
        sort_order: ""
      });
      setShowCreateModal(false);
      toast.success("Lecture created successfully!");
    } catch (err) {
      console.error("Failed to create lecture:", err);
      toast.error("Failed to create lecture");
    }
  };

const handleUpdateLecture = async (e) => {
    e.preventDefault();
    if (!editingLecture) return;
    
    // Validate embed_url starts with https://
    if (lectureForm.embed_url && !lectureForm.embed_url.startsWith('https://')) {
      toast.error("Video URL must start with https://");
      return;
    }
    
    try {
      const formData = {
        ...lectureForm,
        programId: parseInt(lectureForm.programId),
        cohort_number: lectureForm.cohort_number ? parseInt(lectureForm.cohort_number) : null,
        sort_order: parseInt(lectureForm.sort_order)
      };
      const updatedLecture = await updateLecture(editingLecture.Id, formData);
      setLectures(prev => prev.map(lecture => 
        lecture.Id === editingLecture.Id ? updatedLecture : lecture
      ));
      setEditingLecture(null);
      setLectureForm({
        programId: "",
        program_slug: "",
        title: "",
        category: "",
        level: "",
        cohort_number: "",
        embed_url: "",
        sort_order: ""
      });
      toast.success("Lecture updated successfully!");
    } catch (err) {
      console.error("Failed to update lecture:", err);
      toast.error("Failed to update lecture");
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    
    try {
      await deleteLecture(lectureId);
      setLectures(prev => prev.filter(lecture => lecture.Id !== lectureId));
      toast.success("Lecture deleted successfully!");
    } catch (err) {
      console.error("Failed to delete lecture:", err);
      toast.error("Failed to delete lecture");
    }
  };

const openEditModal = (lecture) => {
    setEditingLecture(lecture);
    setLectureForm({
      programId: lecture.programId?.toString() || "",
      program_slug: lecture.program_slug || "",
      title: lecture.title || "",
      category: lecture.category || "",
      level: lecture.level || "",
      cohort_number: lecture.cohort_number?.toString() || "",
      embed_url: lecture.embed_url || "",
      sort_order: lecture.sort_order?.toString() || ""
    });
  };

const closeModals = () => {
    setShowCreateModal(false);
    setEditingLecture(null);
    setLectureForm({
      programId: "",
      program_slug: "",
      title: "",
      category: "",
      level: "",
      cohort_number: "",
      embed_url: "",
      sort_order: ""
    });
  };

const getProgramTitle = (programId) => {
    const program = programs.find(p => p.Id === programId);
    return program ? program.title : "Unknown Program";
  };

  const handleProgramSelect = (programId) => {
    const program = programs.find(p => p.Id === parseInt(programId));
    if (program) {
      setLectureForm(prev => ({
        ...prev,
        programId: programId,
        program_slug: program.slug || "",
        level: program.type === 'master' ? 'master' : 'member'
      }));
    }
  };

  const getLevelBadge = (level) => {
    if (level === "master_common") return <Badge variant="featured">Master Common</Badge>;
    if (level?.includes("intermediate")) return <Badge variant="primary">Intermediate</Badge>;
    return <Badge>Basic</Badge>;
  };

  const programFilters = [
    { key: "all", label: "All Programs", count: lectures.length },
    ...programs.map(program => ({
      key: program.Id.toString(),
      label: program.title,
      count: lectures.filter(l => l.program_id === program.Id).length
    }))
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Error
            title="Access Denied"
            message="You don't have permission to manage lectures."
          />
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Lecture Management</h1>
            <p className="text-gray-400 mt-2">Create and manage course lectures</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Lecture
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-2 max-w-2xl">
              {programFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={selectedProgram === filter.key ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedProgram(filter.key)}
                  className="flex items-center space-x-2"
                >
                  <span className="truncate max-w-[150px]">{filter.label}</span>
                  <Badge variant={selectedProgram === filter.key ? "default" : "primary"}>
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
            <div className="w-full md:w-80">
              <SearchBar
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Lectures List */}
        {filteredLectures.length === 0 ? (
          <Empty
            title="No lectures found"
            message="No lectures match your current filters."
            icon="Play"
            actionLabel="Create Lecture"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {filteredLectures.map((lecture, index) => (
              <motion.div
                key={lecture.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-navy p-6 hover:bg-navy-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg flex-shrink-0">
                      <span className="text-blue-400 font-bold">
                        {lecture.order}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-white truncate">
                          {lecture.title}
                        </h3>
                        {getLevelBadge(lecture.level)}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-400">
                        <span>{getProgramTitle(lecture.program_id)}</span>
                        <span>•</span>
                        <span>{lecture.category}</span>
                        <span>•</span>
                        <span>{lecture.duration}</span>
                      </div>
                      
                      <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                        {lecture.content}
                      </p>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Created {formatDistanceToNow(new Date(lecture.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(lecture)}
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLecture(lecture.Id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
{(showCreateModal || editingLecture) && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingLecture ? "Edit Lecture" : "Add Lecture"}
                </h3>
                <button
                  onClick={closeModals}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <form onSubmit={editingLecture ? handleUpdateLecture : handleCreateLecture} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lecture-program">Program</Label>
                    <select
                      id="lecture-program"
                      value={lectureForm.programId}
                      onChange={(e) => handleProgramSelect(e.target.value)}
                      className="w-full h-12 px-4 py-3 bg-navy-900 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                      required
                    >
                      <option value="">Select Program</option>
                      {programs.map(program => (
                        <option key={program.Id} value={program.Id}>
                          {program.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="lecture-program-slug">Program Slug (Read Only)</Label>
                    <Input
                      id="lecture-program-slug"
                      value={lectureForm.program_slug}
                      disabled
                      placeholder="Auto-filled from program"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lecture-level">Level (Read Only)</Label>
                    <Input
                      id="lecture-level"
                      value={lectureForm.level}
                      disabled
                      placeholder="Auto-filled from program type"
                    />
                  </div>
                  {lectureForm.level === 'master' && (
                    <div>
                      <Label htmlFor="lecture-cohort">Cohort Number</Label>
                      <Input
                        id="lecture-cohort"
                        type="number"
                        min="1"
                        value={lectureForm.cohort_number}
                        onChange={(e) => setLectureForm(prev => ({ ...prev, cohort_number: e.target.value }))}
                        placeholder="e.g., 1"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lecture-category">Category</Label>
                    <Input
                      id="lecture-category"
                      value={lectureForm.category}
                      onChange={(e) => setLectureForm(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Fundamentals"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lecture-title">Lecture Title</Label>
                    <Input
                      id="lecture-title"
                      value={lectureForm.title}
                      onChange={(e) => setLectureForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter lecture title"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lecture-embed-url">Video URL (must start with https://)</Label>
                  <Input
                    id="lecture-embed-url"
                    type="url"
                    value={lectureForm.embed_url}
                    onChange={(e) => setLectureForm(prev => ({ ...prev, embed_url: e.target.value }))}
                    placeholder="https://example.com/video"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lecture-sort-order">Sort Order</Label>
                  <Input
                    id="lecture-sort-order"
                    type="number"
                    min="1"
                    value={lectureForm.sort_order}
                    onChange={(e) => setLectureForm(prev => ({ ...prev, sort_order: e.target.value }))}
                    placeholder="e.g., 1"
                    required
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={closeModals}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingLecture ? "Update" : "Create"}
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

export default AdminLectures;
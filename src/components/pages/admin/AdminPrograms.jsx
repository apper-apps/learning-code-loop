import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatDistanceToNow } from "date-fns";
import { createProgram, deleteProgram, getPrograms, updateProgram } from "@/services/api/programService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";

const AdminPrograms = () => {
  const { isAdmin } = useCurrentUser();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [programForm, setProgramForm] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnail_url: "",
    description_short: "",
    description_long: "",
    type: "member",
    price: "",
    duration: "",
    level: "",
    has_common_course: false
  });

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPrograms();
      setPrograms(data);
      setFilteredPrograms(data);
    } catch (err) {
      console.error("Failed to load programs:", err);
      setError("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    let filtered = programs;

    if (selectedType !== "all") {
      filtered = filtered.filter(program => program.type === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPrograms(filtered);
  }, [programs, selectedType, searchQuery]);

const handleCreateProgram = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...programForm,
        price: parseInt(programForm.price),
        has_common_course: programForm.has_common_course
      };
      const newProgram = await createProgram(formData);
      setPrograms(prev => [newProgram, ...prev]);
      setProgramForm({
        title: "",
        slug: "",
        description: "",
        thumbnail_url: "",
        description_short: "",
        description_long: "",
        type: "member",
        price: "",
        duration: "",
        level: "",
        has_common_course: false
      });
      setShowCreateModal(false);
      toast.success("Program created successfully!");
toast.success("Program created successfully!");
      
      // Dispatch custom event to refresh program dropdowns and listings
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new window.CustomEvent('programsUpdated', { 
          detail: { newProgram, action: 'created' } 
        }));
      }
      // Auto-navigate to the master program page if type is master
      if (formData.type === "master") {
        navigate(`/program/master/${formData.slug}`);
      }
    } catch (err) {
      console.error("Failed to create program:", err);
      toast.error("Failed to create program");
    }
  };

  const handleUpdateProgram = async (e) => {
    e.preventDefault();
    if (!editingProgram) return;
    
    try {
      const formData = {
        ...programForm,
        price: parseInt(programForm.price),
        has_common_course: programForm.has_common_course
      };
      const updatedProgram = await updateProgram(editingProgram.Id, formData);
      setPrograms(prev => prev.map(program => 
        program.Id === editingProgram.Id ? updatedProgram : program
      ));
      setEditingProgram(null);
      setProgramForm({
        title: "",
        slug: "",
        description: "",
        thumbnail_url: "",
        description_short: "",
        description_long: "",
        type: "member",
        price: "",
        duration: "",
        level: "",
        has_common_course: false
      });
      toast.success("Program updated successfully!");
    } catch (err) {
      console.error("Failed to update program:", err);
      toast.error("Failed to update program");
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    
    try {
      await deleteProgram(programId);
      setPrograms(prev => prev.filter(program => program.Id !== programId));
      toast.success("Program deleted successfully!");
    } catch (err) {
      console.error("Failed to delete program:", err);
      toast.error("Failed to delete program");
    }
  };

  const openEditModal = (program) => {
    setEditingProgram(program);
    setProgramForm({
      title: program.title,
      slug: program.slug,
      description: program.description,
      thumbnail_url: program.thumbnail_url || "",
      description_short: program.description_short || "",
      description_long: program.description_long || "",
      type: program.type,
      price: program.price.toString(),
      duration: program.duration,
      level: program.level,
      has_common_course: program.has_common_course
    });
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setEditingProgram(null);
    setProgramForm({
      title: "",
      slug: "",
      description: "",
      thumbnail_url: "",
      description_short: "",
      description_long: "",
      type: "member",
      price: "",
      duration: "",
      level: "",
      has_common_course: false
    });
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const typeFilters = [
    { key: "all", label: "All Programs", count: programs.length },
    { key: "member", label: "Member", count: programs.filter(p => p.type === "member").length },
    { key: "master", label: "Master", count: programs.filter(p => p.type === "master").length }
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Error
            title="Access Denied"
            message="You don't have permission to manage programs."
          />
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPrograms} />;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Program Management</h1>
            <p className="text-gray-400 mt-2">Create and manage educational programs</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Program
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-2">
              {typeFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={selectedType === filter.key ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedType(filter.key)}
                  className="flex items-center space-x-2"
                >
                  <span>{filter.label}</span>
                  <Badge variant={selectedType === filter.key ? "default" : "primary"}>
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
            <div className="w-full md:w-80">
              <SearchBar
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <Empty
            title="No programs found"
            message="No programs match your current filters."
            icon="BookOpen"
            actionLabel="Create Program"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-navy p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl">
                      <ApperIcon 
                        name={program.type === "master" ? "Crown" : "Users"} 
                        size={24} 
                        className={program.type === "master" ? "text-yellow-400" : "text-blue-400"}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{program.title}</h3>
                      <p className="text-gray-400 text-sm">/{program.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={program.type === "master" ? "featured" : "primary"}>
                      {program.type.toUpperCase()}
                    </Badge>
                    {program.has_common_course && (
                      <Badge variant="success">Common</Badge>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                  {program.description_short || program.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>${program.price}</span>
                    <span>•</span>
                    <span>{program.duration}</span>
                    <span>•</span>
                    <span>{program.level}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(program.created_at), { addSuffix: true })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Program ID: {program.Id}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(program)}
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProgram(program.Id)}
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
        {(showCreateModal || editingProgram) && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingProgram ? "Edit Program" : "Add Program"}
                </h3>
                <button
                  onClick={closeModals}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <form onSubmit={editingProgram ? handleUpdateProgram : handleCreateProgram} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="program-title">Title</Label>
                    <Input
                      id="program-title"
                      value={programForm.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setProgramForm(prev => ({ 
                          ...prev, 
                          title,
                          slug: generateSlug(title) 
                        }));
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="program-slug">Slug</Label>
                    <Input
                      id="program-slug"
                      value={programForm.slug}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="program-thumbnail">Thumbnail URL</Label>
                  <Input
                    id="program-thumbnail"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={programForm.thumbnail_url}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="program-description">Main Description</Label>
                  <textarea
                    id="program-description"
                    rows={4}
                    value={programForm.description}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-navy-900 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="program-description-short">Short Description</Label>
                    <textarea
                      id="program-description-short"
                      rows={3}
                      placeholder="Brief overview for cards and previews"
                      value={programForm.description_short}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, description_short: e.target.value }))}
                      className="w-full px-4 py-3 bg-navy-900 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="program-description-long">Long Description</Label>
                    <textarea
                      id="program-description-long"
                      rows={3}
                      placeholder="Detailed description for program pages"
                      value={programForm.description_long}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, description_long: e.target.value }))}
                      className="w-full px-4 py-3 bg-navy-900 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="program-type">Type</Label>
                    <select
                      id="program-type"
                      value={programForm.type}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full h-12 px-4 py-3 bg-navy-900 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                    >
                      <option value="member">Member</option>
                      <option value="master">Master</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="program-price">Price ($)</Label>
                    <Input
                      id="program-price"
                      type="number"
                      min="0"
                      value={programForm.price}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="program-duration">Duration</Label>
                    <Input
                      id="program-duration"
                      placeholder="e.g., 8 weeks"
                      value={programForm.duration}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, duration: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="program-level">Level</Label>
                  <Input
                    id="program-level"
                    placeholder="e.g., Beginner to Intermediate"
                    value={programForm.level}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, level: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="has-common-course"
                    checked={programForm.has_common_course}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, has_common_course: e.target.checked }))}
                    className="w-4 h-4 text-blue-400 border-gray-600 rounded focus:ring-blue-400 focus:ring-2 bg-navy-900"
                  />
                  <Label htmlFor="has-common-course" className="mb-0">Has Common Course</Label>
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
                    {editingProgram ? "Update" : "Create"}
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

export default AdminPrograms;
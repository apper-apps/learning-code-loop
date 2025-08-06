import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPrograms } from "@/services/api/programService";
import ProgramCard from "@/components/organisms/ProgramCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPrograms} />;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                All Programs
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore our comprehensive collection of courses designed to help you master new skills 
              and advance your career.
            </p>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-3">
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
            message={
              searchQuery
                ? "No programs match your search criteria. Try adjusting your filters or search terms."
                : "There are no programs available at the moment. Check back soon!"
            }
            icon="GraduationCap"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.Id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 p-8 card-navy">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                {programs.length}
              </div>
              <p className="text-gray-400">Total Programs</p>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-gray-400">Access Available</p>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                100+
              </div>
              <p className="text-gray-400">Hours of Content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
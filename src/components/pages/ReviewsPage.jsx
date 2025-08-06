import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getReviews } from "@/services/api/reviewService";
import ReviewCard from "@/components/organisms/ReviewCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StatCard from "@/components/molecules/StatCard";
import ApperIcon from "@/components/ApperIcon";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getReviews();
      setReviews(data);
      setFilteredReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    let filtered = reviews;

    // Filter by type
    if (filterType === "featured") {
      filtered = filtered.filter(review => review.featured);
    } else if (filterType === "recent") {
      filtered = filtered.slice(0, 10);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(review =>
        review.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.author_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, filterType, searchQuery]);

  const handleReviewUpdate = (updatedReview) => {
    setReviews(prev => prev.map(review => 
      review.Id === updatedReview.Id ? updatedReview : review
    ));
  };

  const stats = {
    total: reviews.length,
    featured: reviews.filter(r => r.featured).length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : 0,
    totalLikes: reviews.reduce((sum, r) => sum + (r.likes?.length || 0), 0)
  };

  const filterOptions = [
    { key: "all", label: "All Reviews", count: stats.total },
    { key: "featured", label: "Featured", count: stats.featured },
    { key: "recent", label: "Recent", count: Math.min(10, stats.total) }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReviews} />;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Student Reviews
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Hear from our community of learners about their transformative experiences 
              with our programs and courses.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Reviews"
            value={stats.total}
            icon="MessageCircle"
            description="From our community"
          />
          <StatCard
            title="Featured Reviews"
            value={stats.featured}
            icon="Star"
            description="Highlighted experiences"
          />
          <StatCard
            title="Average Rating"
            value={`${stats.averageRating}/5`}
            icon="Award"
            description="Across all reviews"
          />
          <StatCard
            title="Total Likes"
            value={stats.totalLikes}
            icon="Heart"
            description="Community engagement"
          />
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-3">
              {filterOptions.map((filter) => (
                <Button
                  key={filter.key}
                  variant={filterType === filter.key ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterType(filter.key)}
                  className="flex items-center space-x-2"
                >
                  <span>{filter.label}</span>
                  <Badge variant={filterType === filter.key ? "default" : "primary"}>
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
            <div className="w-full md:w-80">
              <SearchBar
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        {filteredReviews.length === 0 ? (
          <Empty
            title="No reviews found"
            message={
              searchQuery
                ? "No reviews match your search criteria. Try different keywords."
                : "There are no reviews available at the moment."
            }
            icon="MessageCircle"
          />
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ReviewCard 
                  review={review} 
                  onReviewUpdate={handleReviewUpdate}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 card-navy p-8 text-center"
        >
          <div className="max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="PenTool" size={32} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Share Your Experience</h3>
            <p className="text-gray-400">
              Help other learners by sharing your journey and insights from our programs.
            </p>
            <Button size="lg">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Write a Review
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewsPage;
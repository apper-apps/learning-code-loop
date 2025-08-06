import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getPosts } from "@/services/api/postService";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const InsightPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPosts();
      const publishedPosts = data.filter(post => post.published);
      setPosts(publishedPosts);
      setFilteredPosts(publishedPosts);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredPosts(filtered);
  }, [posts, searchQuery]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPosts} />;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Insights & Articles
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover expert insights, learning strategies, and industry trends to enhance your 
              educational journey and professional growth.
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Posts */}
        {filteredPosts.length === 0 ? (
          <Empty
            title={searchQuery ? "No articles found" : "No articles available"}
            message={
              searchQuery
                ? "No articles match your search criteria. Try different keywords."
                : "There are no published articles at the moment. Check back soon for new insights!"
            }
            icon="FileText"
          />
        ) : (
          <div className="space-y-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.Id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-navy p-6 hover:bg-navy-700 transition-colors duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  {post.featured_image && (
                    <div className="md:w-48 flex-shrink-0">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-32 md:h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant="primary">Article</Badge>
                        <span className="text-sm text-gray-400">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-white leading-tight">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-300 leading-relaxed">
                        {post.excerpt || post.content.substring(0, 200) + "..."}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-sm text-gray-400">
                            <ApperIcon name="Clock" size={14} />
                            <span>{Math.ceil(post.content.length / 250)} min read</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-400">
                            <ApperIcon name="Eye" size={14} />
                            <span>{Math.floor(Math.random() * 500) + 100} views</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-navy-800">
                            <ApperIcon name="Bookmark" size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-navy-800">
                            <ApperIcon name="Share2" size={16} />
                          </button>
                          <Link
                            to="#"
                            className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                          >
                            <span>Read more</span>
                            <ApperIcon name="ArrowRight" size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 card-navy p-8 text-center"
        >
          <div className="max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="Mail" size={32} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Stay Updated</h3>
            <p className="text-gray-400">
              Get the latest insights and learning resources delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-navy-800 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InsightPage;
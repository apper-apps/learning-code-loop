import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toggleReviewLike } from "@/services/api/reviewService";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const ReviewCard = ({ review, onReviewUpdate, className }) => {
  const { currentUser, isLoggedIn } = useCurrentUser();
  const [isLiking, setIsLiking] = useState(false);
  const [localLikes, setLocalLikes] = useState(review.likes || []);

  const handleLike = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.info("Please log in to like reviews");
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);
      const updatedReview = await toggleReviewLike(review.Id, currentUser.Id);
      setLocalLikes(updatedReview.likes);
      
      if (onReviewUpdate) {
        onReviewUpdate(updatedReview);
      }
      
      const isLiked = updatedReview.likes.includes(currentUser.Id);
      toast.success(isLiked ? "Review liked!" : "Like removed");
      
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const isLiked = isLoggedIn && localLikes.includes(currentUser?.Id);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`card-navy p-6 ${className}`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
            {review.author_avatar ? (
              <img
                src={review.author_avatar}
                alt={review.author_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold">
                {review.author_name?.charAt(0) || "U"}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-white">{review.author_name}</h4>
              {review.featured && <Badge variant="featured">Featured</Badge>}
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <ApperIcon
                  key={i}
                  name="Star"
                  size={14}
                  className={`${
                    i < (review.rating || 5)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-gray-300 mb-4 leading-relaxed">{review.text}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                isLiked
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-gray-700/50 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400"
              }`}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <ApperIcon 
                  name="Heart" 
                  size={14} 
                  className={isLiked ? "fill-current" : ""}
                />
              </motion.div>
              <span>{localLikes.length}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
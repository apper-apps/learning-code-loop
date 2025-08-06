import reviewsData from "@/services/mockData/reviews.json";

let reviews = [...reviewsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getReviews = async () => {
  await delay(250);
  return reviews
    .map(review => ({ ...review }))
    .sort((a, b) => b.featured - a.featured || new Date(b.created_at) - new Date(a.created_at));
};

export const getFeaturedReviews = async () => {
  await delay(200);
  return reviews
    .filter(r => r.featured)
    .map(review => ({ ...review }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const getReviewById = async (id) => {
  await delay(150);
  const review = reviews.find(r => r.Id === parseInt(id));
  if (!review) {
    throw new Error(`Review with id ${id} not found`);
  }
  return { ...review };
};

export const toggleReviewLike = async (reviewId, userId) => {
  await delay(200);
  const review = reviews.find(r => r.Id === parseInt(reviewId));
  if (!review) {
    throw new Error(`Review with id ${reviewId} not found`);
  }
  
  const userLikedIndex = review.likes.indexOf(userId);
  if (userLikedIndex > -1) {
    review.likes.splice(userLikedIndex, 1);
  } else {
    review.likes.push(userId);
  }
  
  return { ...review };
};

export const createReview = async (reviewData) => {
  await delay(400);
  const newReview = {
    ...reviewData,
    Id: Math.max(...reviews.map(r => r.Id)) + 1,
    likes: [],
    created_at: new Date().toISOString()
  };
  reviews.push(newReview);
  return { ...newReview };
};

export const updateReview = async (id, reviewData) => {
  await delay(350);
  const index = reviews.findIndex(r => r.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Review with id ${id} not found`);
  }
  reviews[index] = { ...reviews[index], ...reviewData };
  return { ...reviews[index] };
};

export const deleteReview = async (id) => {
  await delay(250);
  const index = reviews.findIndex(r => r.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Review with id ${id} not found`);
  }
  reviews.splice(index, 1);
  return true;
};
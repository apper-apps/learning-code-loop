import postsData from "@/services/mockData/posts.json";

let posts = [...postsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data object to simulate the required API format
const data = {
  select: (table) => ({
    order: (field, direction) => ({
      list: async () => {
        await delay(250);
        if (table === "Post") {
          const sorted = [...posts].sort((a, b) => {
            if (direction === "desc") {
              return new Date(b[field]) - new Date(a[field]);
            }
            return new Date(a[field]) - new Date(b[field]);
          });
          return sorted.map(post => ({ ...post }));
        }
        return [];
      }
    }),
    where: (conditions) => ({
      single: async () => {
        await delay(200);
        if (table === "Post") {
          const post = posts.find(p => 
            Object.keys(conditions).every(key => p[key] === conditions[key])
          );
          if (!post) {
            throw new Error("Post not found");
          }
          return { ...post };
        }
        return null;
      }
    })
  }),
  insert: async (table, data) => {
    await delay(400);
    if (table === "Post") {
      const newPost = {
        ...data,
        Id: Math.max(...posts.map(p => p.Id)) + 1,
        created_at: new Date().toISOString()
      };
      posts.push(newPost);
      return { ...newPost };
    }
    return null;
  },
  update: async (table, id, data) => {
    await delay(350);
    if (table === "Post") {
      const index = posts.findIndex(p => p.Id === parseInt(id));
      if (index === -1) {
        throw new Error(`Post with id ${id} not found`);
      }
      posts[index] = { ...posts[index], ...data };
      return { ...posts[index] };
    }
    return null;
  }
};

export const getPosts = async () => data.select("Post").order("created_at", "desc").list();
export const getPostBySlug = async (slug) => data.select("Post").where({ slug }).single();
export const createPost = async (p) => data.insert("Post", p);
export const updatePost = async (id, p) => data.update("Post", id, p);

// Additional helper functions
export const deletePost = async (id) => {
  await delay(250);
  const index = posts.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Post with id ${id} not found`);
  }
  posts.splice(index, 1);
  return true;
};
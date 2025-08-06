import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { getPosts, createPost, updatePost, deletePost } from '@/services/api/postService'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { formatDistanceToNow } from 'date-fns'
import { Search, Plus, Edit, Trash2, Eye, Calendar, User, FileText } from 'lucide-react'

export default function AdminPosts() {
  const { user: currentUser } = useCurrentUser()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft',
    category: '',
    tags: ''
  })

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      setError('Access denied. Admin privileges required.')
      setLoading(false)
      return
    }
    loadPosts()
  }, [currentUser])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPosts()
      setPosts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error loading posts:', err)
      setError(err.message || 'Failed to load posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        author: currentUser.name,
        authorId: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const newPost = await createPost(postData)
      setPosts(prev => [newPost, ...prev])
      setShowCreateModal(false)
      setFormData({
        title: '',
        content: '',
        status: 'draft',
        category: '',
        tags: ''
      })
      toast.success('Post created successfully!')
    } catch (err) {
      console.error('Error creating post:', err)
      toast.error(err.message || 'Failed to create post')
    }
  }

  const handleUpdatePost = async (e) => {
    e.preventDefault()
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        updatedAt: new Date().toISOString()
      }
      
      const updatedPost = await updatePost(editingPost.id, postData)
      setPosts(prev => prev.map(post => 
        post.id === editingPost.id ? updatedPost : post
      ))
      setShowEditModal(false)
      setEditingPost(null)
      setFormData({
        title: '',
        content: '',
        status: 'draft',
        category: '',
        tags: ''
      })
      toast.success('Post updated successfully!')
    } catch (err) {
      console.error('Error updating post:', err)
      toast.error(err.message || 'Failed to update post')
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    
    try {
      await deletePost(postId)
      setPosts(prev => prev.filter(post => post.id !== postId))
      toast.success('Post deleted successfully!')
    } catch (err) {
      console.error('Error deleting post:', err)
      toast.error(err.message || 'Failed to delete post')
    }
  }

  const openEditModal = (post) => {
    setEditingPost(post)
    setFormData({
      title: post.title || '',
      content: post.content || '',
      status: post.status || 'draft',
      category: post.category || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : ''
    })
    setShowEditModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setEditingPost(null)
    setFormData({
      title: '',
      content: '',
      status: 'draft',
      category: '',
      tags: ''
    })
  }

  const getStatusBadge = (status) => {
    const variants = {
      published: 'success',
      draft: 'warning',
      archived: 'secondary'
    }
    
    return (
      <Badge variant={variants[status] || 'secondary'} className="text-xs">
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Draft'}
      </Badge>
    )
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPosts} />

  const filteredPosts = posts.filter(post => {
    if (!post) return false
    
    const matchesSearch = !searchTerm || 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const statusFilters = [
    { key: 'all', label: 'All Posts', count: posts.length },
    { key: 'published', label: 'Published', count: posts.filter(p => p.status === 'published').length },
    { key: 'draft', label: 'Drafts', count: posts.filter(p => p.status === 'draft').length },
    { key: 'archived', label: 'Archived', count: posts.filter(p => p.status === 'archived').length }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Posts Management
          </h1>
          <p className="text-gray-400 mt-1">Manage blog posts and articles</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search posts by title, content, category, or author..."
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === filter.key
                  ? 'bg-blue-400 text-white'
                  : 'bg-navy-800 text-gray-300 hover:bg-navy-700'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <Empty 
          message="No posts found" 
          description={searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first post to get started'}
        />
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-navy p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                    {getStatusBadge(post.status)}
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {post.content?.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author || 'Unknown Author'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Unknown date'}
                    </div>
                    {post.category && (
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                  
                  {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-navy-700 text-gray-300 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(post)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-navy-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-white mb-4">Create New Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Post title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Post category"
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="javascript, react, tutorial"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content here..."
                  rows={8}
                  className="w-full px-3 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-vertical"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="submit">Create Post</Button>
                <Button type="button" variant="secondary" onClick={closeModals}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-navy-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-white mb-4">Edit Post</h2>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Post title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Post category"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="javascript, react, tutorial"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="edit-content">Content</Label>
                <textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content here..."
                  rows={8}
                  className="w-full px-3 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-vertical"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="submit">Update Post</Button>
                <Button type="button" variant="secondary" onClick={closeModals}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
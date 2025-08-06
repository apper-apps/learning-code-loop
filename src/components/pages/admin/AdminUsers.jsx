import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getUsers, createUser, updateUser, deleteUser } from "@/services/api/userService";
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

const AdminUsers = () => {
  const { isAdmin } = useCurrentUser();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "free"
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (selectedRole !== "all") {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, selectedRole, searchQuery]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const newUser = await createUser(userForm);
      setUsers(prev => [newUser, ...prev]);
      setUserForm({ name: "", email: "", role: "free" });
      setShowCreateModal(false);
      toast.success("User created successfully!");
    } catch (err) {
      console.error("Failed to create user:", err);
      toast.error("Failed to create user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      const updatedUser = await updateUser(editingUser.Id, userForm);
      setUsers(prev => prev.map(user => 
        user.Id === editingUser.Id ? updatedUser : user
      ));
      setEditingUser(null);
      setUserForm({ name: "", email: "", role: "free" });
      toast.success("User updated successfully!");
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(user => user.Id !== userId));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setEditingUser(null);
    setUserForm({ name: "", email: "", role: "free" });
  };

  const getRoleBadge = (role, isAdmin) => {
    if (isAdmin) return <Badge variant="featured">Admin</Badge>;
    
    switch (role) {
      case "master": return <Badge variant="primary">Master</Badge>;
      case "member": return <Badge variant="success">Member</Badge>;
      case "both": return <Badge variant="featured">Both</Badge>;
      default: return <Badge>Free</Badge>;
    }
  };

  const roleFilters = [
    { key: "all", label: "All Users", count: users.length },
    { key: "free", label: "Free", count: users.filter(u => u.role === "free").length },
    { key: "member", label: "Member", count: users.filter(u => u.role === "member").length },
    { key: "master", label: "Master", count: users.filter(u => u.role === "master").length },
    { key: "both", label: "Both", count: users.filter(u => u.role === "both").length }
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Error
            title="Access Denied"
            message="You don't have permission to manage users."
          />
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUsers} />;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-2">Manage user accounts and permissions</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add User
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-2">
              {roleFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={selectedRole === filter.key ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedRole(filter.key)}
                  className="flex items-center space-x-2"
                >
                  <span>{filter.label}</span>
                  <Badge variant={selectedRole === filter.key ? "default" : "primary"}>
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
            <div className="w-full md:w-80">
              <SearchBar
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <Empty
            title="No users found"
            message="No users match your current filters."
            icon="Users"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-navy overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Cohort</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-navy-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-sm font-medium">
                                {user.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role, user.is_admin)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">
                          {user.master_cohort || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">
                          {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(user)}
                          >
                            <ApperIcon name="Edit" size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.Id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || editingUser) && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy-800 rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingUser ? "Edit User" : "Add User"}
                </h3>
                <button
                  onClick={closeModals}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
                <div>
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input
                    id="user-name"
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="user-role">Role</Label>
                  <select
                    id="user-role"
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full h-12 px-4 py-3 bg-navy-900 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  >
                    <option value="free">Free</option>
                    <option value="member">Member</option>
                    <option value="master">Master</option>
                    <option value="both">Both</option>
                  </select>
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
                    {editingUser ? "Update" : "Create"}
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

export default AdminUsers;
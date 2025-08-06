import { useState, useEffect } from "react";

// Mock current user state
export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Simulate loading user from localStorage or API
    const mockUser = {
      Id: 1,
      email: "admin@example.com",
      name: "Admin User",
      role: "both",
      master_cohort: "2024-spring",
      is_admin: true,
      avatar: null
    };
    
    // Uncomment to simulate logged in admin user
    // setCurrentUser(mockUser);
  }, []);

  const login = (user) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return {
    currentUser,
    login,
    logout,
    isLoggedIn: currentUser !== null,
    isAdmin: currentUser?.is_admin || false
  };
};
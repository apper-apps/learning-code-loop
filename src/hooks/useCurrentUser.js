import { useSelector } from 'react-redux';

// Hook to get current user from Redux store
export const useCurrentUser = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return {
    currentUser: user,
    isLoggedIn: isAuthenticated,
    isAdmin: user?.accounts?.[0]?.isAdmin || false
  };
};
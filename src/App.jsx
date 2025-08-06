import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Layout
import Layout from "@/components/organisms/Layout";

// Pages
import HomePage from "@/components/pages/HomePage";
import ProgramsPage from "@/components/pages/ProgramsPage";
import ProgramDetailPage from "@/components/pages/ProgramDetailPage";
import LectureDetailPage from "@/components/pages/LectureDetailPage";
import InsightPage from "@/components/pages/InsightPage";
import ReviewsPage from "@/components/pages/ReviewsPage";
import ProfilePage from "@/components/pages/ProfilePage";
import AdminDashboard from "@/components/pages/admin/AdminDashboard";
import AdminUsers from "@/components/pages/admin/AdminUsers";
import AdminPrograms from "@/components/pages/admin/AdminPrograms";
import AdminLectures from "@/components/pages/admin/AdminLectures";
import AdminPosts from "@/components/pages/admin/AdminPosts";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-navy-900">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="program" element={<ProgramsPage />} />
            <Route path="program/:slug" element={<ProgramDetailPage />} />
            <Route path="lecture/:id" element={<LectureDetailPage />} />
            <Route path="insight" element={<InsightPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/programs" element={<AdminPrograms />} />
            <Route path="admin/lectures" element={<AdminLectures />} />
            <Route path="admin/posts" element={<AdminPosts />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
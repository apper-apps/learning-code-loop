import React from "react";
import { Outlet } from "react-router-dom";
import TopNavigation from "@/components/organisms/TopNavigation";

const Layout = () => {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <TopNavigation />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
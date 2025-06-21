// src/components/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 pt-16 md:pt-0 md:ml-64 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

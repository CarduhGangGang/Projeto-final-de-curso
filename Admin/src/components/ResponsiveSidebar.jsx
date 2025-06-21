import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const ResponsiveSidebar = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      {/* Mobile menu */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setOpen(true)} className="text-white">
          <Menu size={32} />
        </button>
      </div>

      {/* Fullscreen Sidebar on mobile */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40" onClick={() => setOpen(false)}>
          <div
            className="bg-white dark:bg-gray-900 w-64 h-full shadow-lg p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Menu</h2>
              <button onClick={() => setOpen(false)} className="text-gray-700 dark:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto w-full">{children}</div>
    </div>
  );
};

export default ResponsiveSidebar;

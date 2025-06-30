import React from "react";
import { UserAuth } from "../context/Authcontext";
import Sidebar from "../components/Sidebar";
import ModalConfigAdmin from "../components/ModalConfigAdmin";

const Modal = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Conteúdo principal */}
      <div className="flex-1 p-6">
        <div className="w-full max-w-7xl mx-auto">
          <ModalConfigAdmin />
        </div>
      </div>
    </div>
  );
};

export default Modal;

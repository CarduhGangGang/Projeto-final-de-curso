import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/Authcontext";

const PrivateRoute = ({ children }) => {
  const { session } = UserAuth();

  if (session === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Loading...</p>
      </div>
    );
  }

  return session ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
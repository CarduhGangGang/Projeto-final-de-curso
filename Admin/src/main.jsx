import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { router } from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/Authcontext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  </StrictMode>
);

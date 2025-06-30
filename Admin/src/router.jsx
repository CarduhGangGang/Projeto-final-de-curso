import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Signin from "./components/Signin";
import Dashboard from "./routes/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import Newsletter from "./routes/Newsletter";
import Orcamentos from "./routes/Orcamentos";
import Pages from "./routes/Pages";
import Profile from "./routes/Profile";
import Layout from "./components/Layout";
import Unauthorized from "./components/Unauthorized";
import Notificacoes from "./routes/Notificacoes";
import Modal from "./routes/Modal";
import Website from "./routes/Website"; // ✅ Nova rota que renderiza Navbar

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signin", element: <Signin /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/newsletter", element: <Newsletter /> },
      { path: "/orcamentos", element: <Orcamentos /> },
      { path: "/pages", element: <Pages /> },
      { path: "/website", element: <Website /> }, 
      { path: "/modal", element: <Modal /> },
      { path: "/notificacoes", element: <Notificacoes /> },
      { path: "/profile", element: <Profile /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

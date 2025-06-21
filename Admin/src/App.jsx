import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Signin from "./components/Signin";
import { UserAuth } from "./context/Authcontext"; 

function App() {
  const { user } = UserAuth();

  // ✅ ENV VAR CHECK
  console.log("✅ Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log("✅ Supabase KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

  return (
    <>
      <Signin />
    </>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/Authcontext";
import { verifyToken } from "../utils/auth";
import { LogOut } from "lucide-react";
import backgroundImage from "../assets/construction-bg.jpg";

const Signin = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = UserAuth();
  const { signInUser, signOut } = auth || {};

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      const result = await verifyToken(token);
      if (!result.valid) {
        navigate("/dashboard");
      } else {
        setAuthorized(true);
      }
    };

    verify();
  }, [navigate]);

  if (!authorized) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await signInUser(email, password);
      if (signInError) {
        setError(signInError);
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Erro inesperado ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
    const redirectUrl = import.meta.env.VITE_PUBLIC_URL || "/";
    window.location.href = redirectUrl;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-200 relative px-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0" />

      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-12 min-h-[500px] relative z-10">
        <div className="text-3xl font-extrabold text-gray-900 tracking-wide mb-6 text-center">
          ADMIN
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Bem Vindo Sr.Quental!
        </h2>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
          </div>

          {error && <p className="text-red-600 text-center mt-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-black text-black py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "ENTRAR"}
          </button>
        </form>

        {/* Botão Sair abaixo */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
            title="Sair"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;

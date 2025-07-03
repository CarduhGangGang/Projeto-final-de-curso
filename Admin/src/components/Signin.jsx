import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/Authcontext";
import backgroundImage from "../assets/construction-bg.jpg";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = UserAuth();
  const { signInUser } = auth || {};

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

  const handleSignOut = () => {
    navigate(-1); // Voltar para a página anterior
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

        {/* Botão SAIR no canto superior direito */}
        <button
          onClick={handleSignOut}
          className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition z-20"
        >
          SAIR
        </button>

        <div className="flex justify-center mb-6 mt-4">
          <div className="text-3xl font-extrabold text-gray-900 tracking-wide">
            ADMIN
          </div>
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
            className="mt-4 w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "ENTRAR"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;

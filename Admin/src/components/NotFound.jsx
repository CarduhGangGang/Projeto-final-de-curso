import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-6 text-center">
      <h1 className="text-7xl font-bold text-black tracking-widest mb-2">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! Página não encontrada.</p>
      <p className="text-sm text-gray-500 mb-8 max-w-md">
        Parece que você tentou acessar algo que não existe. Verifique a URL ou clique no botão abaixo para voltar à página inicial.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-black text-black px-6 py-2 rounded-lg hover:bg-gray-800 transition shadow"
      >
        Ir para o Início
      </button>
    </div>
  );
};

export default NotFound;

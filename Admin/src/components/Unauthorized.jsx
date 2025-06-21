import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Acesso não autorizado
      </h1>
      <p className="text-gray-700 text-lg mb-8 max-w-md">
        Você não tem permissão para acessar esta página. Por favor, volte para a página inicial.
      </p>
    </div>
  );
};

export default Unauthorized;

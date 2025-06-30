import React from "react";
import Navbar from "../components/Navbar"; // ajuste se necessário

const Website = () => {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-xl font-semibold">Página Website com a Navbar</h1>
      </div>
    </div>
  );
};

export default Website;

import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";

const Separador = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("separador")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (!error && data) {
        setData(data);
      } else {
        console.error("Erro ao buscar separador:", error?.message);
      }
    };

    fetchData();
  }, []);

  if (!data) return null;

  return (
    <section className="bg-gray-50 py-12 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800">{data.titulo}</h2>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">{data.subtitulo}</h3>
        <p className="text-sm text-gray-700 mt-4">{data.texto}</p>
      </div>
    </section>
  );
};

export default Separador;

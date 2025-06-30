import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";

const HeroSobre = () => {
  const [heroData, setHeroData] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    imagem_url: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      const { data, error } = await supabase
        .from("hero_sobre")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const final = data.find((h) => h.is_final) || data[0];
        setHeroData(final);
        setForm({
          titulo: final.titulo || "",
          descricao: final.descricao || "",
          imagem_url: final.imagem_url || "",
        });
      }
    };

    fetchHero();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveChanges = async () => {
    if (!heroData) return;

    if (!form.titulo || !form.imagem_url) {
      setNotification("❌ Preenche todos os campos obrigatórios.");
      return;
    }

    const { error } = await supabase
      .from("hero_sobre")
      .update(form)
      .eq("id", heroData.id);

    if (!error) {
      setNotification("✅ Atualizado com sucesso!");
      setEditMode(false);
      setHeroData({ ...heroData, ...form });
    } else {
      setNotification("❌ Erro ao atualizar.");
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const deleteHero = async () => {
    if (!heroData) return;

    await supabase.from("hero_sobre").delete().eq("id", heroData.id);
    setHeroData(null);
    setForm({ titulo: "", descricao: "", imagem_url: "" });
    setNotification("🗑️ Eliminado.");
  };

  const setAsFinalHero = async () => {
    if (!heroData) return;

    const { error: clearOthers } = await supabase
      .from("hero_sobre")
      .update({ is_final: false })
      .neq("id", heroData.id);

    const { error: setFinal } = await supabase
      .from("hero_sobre")
      .update({ is_final: true })
      .eq("id", heroData.id);

    if (!clearOthers && !setFinal) {
      setNotification("⭐ Este conteúdo está agora ativo!");
      setHeroData({ ...heroData, is_final: true });
    } else {
      setNotification("❌ Erro ao guardar como final.");
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {editMode ? (
        <div className="space-y-4">
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Título"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Descrição (ex: Home / Sobre Nós)"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="imagem_url"
            value={form.imagem_url}
            onChange={handleChange}
            placeholder="URL da imagem"
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex gap-4 flex-wrap mt-4">
            <button
              onClick={saveChanges}
              className="bg-black text-black px-4 py-2 rounded"
            >
              💾 Guardar
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : heroData ? (
        <div className="bg-gray-50 p-6 rounded-xl shadow flex flex-col md:flex-row gap-8 items-center justify-between">
          {/* IMAGEM */}
          <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow">
            <img
              src={heroData.imagem_url}
              alt="Imagem de capa"
              className="w-full h-60 md:h-80 object-cover"
            />
          </div>

          {/* TEXTO */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">{heroData.titulo}</h1>
            <p className="text-gray-500 text-sm">
              <span className="text-black">Home</span> / {heroData.descricao}
            </p>

            <div className="flex gap-3 mt-6 flex-wrap justify-center md:justify-start">
              <button onClick={() => setEditMode(true)} className="text-blue-600 underline">✏️ Editar</button>
              <button onClick={deleteHero} className="text-red-600 underline">🗑️ Eliminar</button>
              <button
                onClick={setAsFinalHero}
                className={`px-3 py-1 text-sm rounded border ${heroData.is_final
                  ? "bg-yellow-100 text-yellow-700"
                  : "text-yellow-600 border-yellow-600"
                  }`}
              >
                ⭐ {heroData.is_final ? "Guardar" : "Guardado"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Nenhum conteúdo disponível.</p>
      )}

      {notification && (
        <div className="text-green-600 bg-green-100 px-4 py-2 rounded text-sm mt-4">
          {notification}
        </div>
      )}
    </div>
  );
};

export default HeroSobre;

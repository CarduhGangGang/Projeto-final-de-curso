import React, { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { supabase } from "../../../supabase-client";

const Contacto = ({ adminMode = false }) => {
  const [infos, setInfos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    tipo: "",
    titulo: "",
    linha1: "",
    linha2: "",
    icone: "",
  });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInfos();
  }, []);

  const fetchInfos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_infos")
      .select("*")
      .order("created_at", { ascending: true });
    setInfos(data || []);
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveInfo = async () => {
    if (!form.tipo || !form.titulo || !form.linha1 || !form.icone) {
      setNotification("❌ Preenche todos os campos obrigatórios.");
      return;
    }

    if (editingId) {
      await supabase.from("contact_infos").update(form).eq("id", editingId);
      setNotification("✅ Atualizado com sucesso.");
    } else {
      await supabase.from("contact_infos").insert({ ...form });
      setNotification("✅ Criado com sucesso.");
    }

    setForm({ tipo: "", titulo: "", linha1: "", linha2: "", icone: "" });
    setEditingId(null);
    fetchInfos();
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteInfo = async (id) => {
    await supabase.from("contact_infos").delete().eq("id", id);
    fetchInfos();
    setNotification("🗑️ Eliminado.");
    setTimeout(() => setNotification(null), 3000);
  };

  const setAsFinal = async (id, tipo) => {
    await supabase.from("contact_infos").update({ is_final: false }).eq("tipo", tipo);
    await supabase.from("contact_infos").update({ is_final: true }).eq("id", id);
    fetchInfos();
    setNotification("⭐ Guardado com sucesso.");
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        A carregar conteúdo...
      </div>
    );
  }

  // PREVIEW no modo admin igual ao do site
  const renderPreview = () => (
    <section className="bg-white py-24 px-6 sm:px-10">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {infos
            .filter((i) => i.is_final)
            .map((info) => {
              const Icon = Icons[info.icone] || Icons.MapPin;
              return (
                <div className="flex flex-col items-center" key={info.id}>
                  <Icon className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-xl font-bold text-black mb-2">
                    {info.titulo}
                  </h3>
                  <p className="text-gray-800">{info.linha1}</p>
                  {info.linha2 && <p className="text-gray-800">{info.linha2}</p>}
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );

  if (!adminMode) return renderPreview();

  return (
    <div className="w-full">
      {/* Preview mesmo em modo admin */}
      {renderPreview()}

      {/* Formulário de criação/edição */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        <div className="space-y-4">
          <input
            name="tipo"
            placeholder="Tipo (ex: morada, horario)"
            className="w-full border px-3 py-2 rounded"
            value={form.tipo}
            onChange={handleChange}
          />
          <input
            name="titulo"
            placeholder="Título"
            className="w-full border px-3 py-2 rounded"
            value={form.titulo}
            onChange={handleChange}
          />
          <input
            name="linha1"
            placeholder="Linha 1"
            className="w-full border px-3 py-2 rounded"
            value={form.linha1}
            onChange={handleChange}
          />
          <input
            name="linha2"
            placeholder="Linha 2 (opcional)"
            className="w-full border px-3 py-2 rounded"
            value={form.linha2}
            onChange={handleChange}
          />
          <input
            name="icone"
            placeholder="Ícone (ex: Phone, Clock, Info, MapPin)"
            className="w-full border px-3 py-2 rounded"
            value={form.icone}
            onChange={handleChange}
          />
          <button onClick={saveInfo} className="bg-black text-black px-4 py-2 rounded">
            {editingId ? "💾 Guardar Alterações" : "➕ Criar"}
          </button>
        </div>

        {/* Lista de Registos */}
        <div className="space-y-4 mt-10">
          {infos.map((info) => (
            <div
              key={info.id}
              className="border rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <p className="font-semibold">
                  {info.titulo} ({info.tipo}) - {info.icone}
                </p>
                <p>{info.linha1}</p>
                {info.linha2 && <p>{info.linha2}</p>}
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => {
                    setEditingId(info.id);
                    setForm({
                      tipo: info.tipo,
                      titulo: info.titulo,
                      linha1: info.linha1,
                      linha2: info.linha2 || "",
                      icone: info.icone,
                    });
                  }}
                  className="text-blue-600 underline"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => deleteInfo(info.id)}
                  className="text-red-600 underline"
                >
                  🗑️ Eliminar
                </button>
                <button
                  onClick={() => setAsFinal(info.id, info.tipo)}
                  className={`px-3 py-1 text-sm rounded border ${
                    info.is_final
                      ? "bg-yellow-100 text-yellow-700"
                      : "text-yellow-600 border-yellow-600"
                  }`}
                >
                  ⭐ {info.is_final ? "Guardado" : "Guardar"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {notification && (
          <div className="text-green-600 bg-green-100 px-4 py-2 rounded text-sm mt-4">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacto;

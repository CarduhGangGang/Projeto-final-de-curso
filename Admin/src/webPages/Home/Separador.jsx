import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";

const Separador = ({ adminMode = false }) => {
  const [registos, setRegistos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("separador")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error) setRegistos(data);
      else console.error("Erro ao carregar separador:", error.message);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("separador")
      .update({
        titulo: form.titulo,
        subtitulo: form.subtitulo,
        texto: form.texto,
      })
      .eq("id", form.id);

    if (!error) {
      setRegistos((prev) =>
        prev.map((item) => (item.id === form.id ? form : item))
      );
      setEditingId(null);
      setNotification("✅ Conteúdo atualizado com sucesso!");
    } else {
      setNotification("❌ Erro ao atualizar.");
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from("separador")
      .insert([
        {
          titulo: "Novo Título",
          subtitulo: "Novo Subtítulo",
          texto: "Novo texto descritivo aqui.",
        },
      ])
      .select()
      .single();

    if (!error) {
      setRegistos((prev) => [...prev, data]);
      setForm(data);
      setEditingId(data.id);
      setNotification("✅ Novo separador criado!");
    } else {
      setNotification("❌ Erro ao criar novo separador.");
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("separador").delete().eq("id", id);

    if (!error) {
      setRegistos((prev) => prev.filter((item) => item.id !== id));
      setNotification("🗑️ Separador eliminado.");
      if (editingId === id) setEditingId(null);
    } else {
      setNotification("❌ Erro ao eliminar.");
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <section className="bg-gray-50 py-8 px-8 text-center w-full">
      <div className="w-full space-y-8">
        {registos.map((item) =>
          editingId === item.id ? (
            <div key={item.id} className="space-y-2 border p-6 rounded shadow bg-white">
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                name="subtitulo"
                value={form.subtitulo}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-lg font-bold"
              />
              <textarea
                name="texto"
                value={form.texto}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
                rows={4}
              />
              <div className="flex justify-center gap-3 mt-2 flex-wrap">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-black px-4 py-2 rounded text-sm"
                >
                  ✅ Guardar
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 px-4 py-2 rounded text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              className="space-y-2 border p-6 rounded bg-white shadow w-full"
            >
              <h2 className="text-3xl font-semibold text-gray-800">{item.titulo}</h2>
              <h3 className="text-4xl font-bold text-gray-900">{item.subtitulo}</h3>
              <p className="text-base text-gray-700">{item.texto}</p>

              {adminMode && (
                <div className="flex justify-center gap-3 mt-3 text-sm flex-wrap">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setForm(item);
                    }}
                    className="text-blue-600 underline"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 underline"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {adminMode && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleCreate}
              className="text-sm bg-purple-600 text-black px-6 py-2 rounded hover:bg-purple-700 shadow"
            >
              ➕ Novo Separador
            </button>
          </div>
        )}

        {notification && (
          <div className="mt-6 text-center text-green-700 bg-green-100 px-4 py-2 rounded text-sm">
            {notification}
          </div>
        )}
      </div>
    </section>
  );
};

export default Separador;

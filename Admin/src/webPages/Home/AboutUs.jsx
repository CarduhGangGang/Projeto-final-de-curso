import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";

const AboutUs = () => {
  const [aboutItems, setAboutItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutUs = async () => {
      const { data } = await supabase
        .from("about_us")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setAboutItems(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
          setForm(data[0]);
        }
      }

      setIsLoading(false);
    };

    fetchAboutUs();
  }, []);

  const currentItem = aboutItems.find(i => i.id === selectedId);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveChanges = async () => {
    const { error } = await supabase
      .from("about_us")
      .update(form)
      .eq("id", form.id);

    if (!error) {
      setNotification({ type: "success", message: "Atualizado com sucesso!" });
      setAboutItems(prev => prev.map(i => i.id === form.id ? form : i));
      setEditing(false);
    } else {
      setNotification({ type: "error", message: "Erro ao atualizar." });
    }

    setTimeout(() => setNotification(null), 4000);
  };

  const createNew = async () => {
    const { data, error } = await supabase
      .from("about_us")
      .insert([{
        title: "Novo título",
        subtitle: "Novo subtítulo",
        description: "Nova descrição...",
        image_url: "https://source.unsplash.com/1600x900/?office",
        is_main: false
      }])
      .select()
      .single();

    if (!error) {
      setAboutItems([data, ...aboutItems]);
      setSelectedId(data.id);
      setForm(data);
      setEditing(true);
    }

    setTimeout(() => setNotification(null), 4000);
  };

  const deleteItem = async () => {
    const { error } = await supabase
      .from("about_us")
      .delete()
      .eq("id", selectedId);

    if (!error) {
      const updated = aboutItems.filter(i => i.id !== selectedId);
      setAboutItems(updated);
      if (updated.length > 0) {
        setSelectedId(updated[0].id);
        setForm(updated[0]);
      } else {
        setSelectedId(null);
        setForm({});
      }
      setNotification({ type: "success", message: "Eliminado com sucesso!" });
    }

    setTimeout(() => setNotification(null), 4000);
  };

  const setAsMain = async () => {
    const { error: clearError } = await supabase
      .from("about_us")
      .update({ is_main: false })
      .neq("id", currentItem.id);

    const { error: setError } = await supabase
      .from("about_us")
      .update({ is_main: true })
      .eq("id", currentItem.id);

    if (!clearError && !setError) {
      setNotification({ type: "success", message: "Guardado com sucesso!" });
      setAboutItems(prev =>
        prev.map(i => ({ ...i, is_main: i.id === currentItem.id }))
      );
    } else {
      setNotification({ type: "error", message: "Erro ao guardar." });
    }

    setTimeout(() => setNotification(null), 4000);
  };

  if (isLoading || !currentItem) {
    return <div className="p-4 text-center text-gray-500">A carregar conteúdo...</div>;
  }

  return (
    <section className="bg-gray-50 py-12 px-4 font-[Poppins]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Imagem */}
        <div>
          <img
            src={currentItem.image_url}
            alt="Imagem sobre"
            className="w-full h-auto object-cover rounded-xl shadow"
          />
        </div>

        {/* Texto */}
        <div>
          {editing ? (
            <div className="bg-white/50 backdrop-blur p-4 rounded shadow-md space-y-2 text-sm">
              <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" />
              <input name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full p-2 border rounded" />
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" />
              <input name="image_url" value={form.image_url} onChange={handleChange} className="w-full p-2 border rounded" />
              <div className="flex gap-2 mt-2">
                <button onClick={saveChanges} className="bg-black text-black px-4 py-1 rounded">💾 Guardar</button>
                <button onClick={() => setEditing(false)} className="bg-gray-200 px-4 py-1 rounded">Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm uppercase text-gray-500 mb-1">{currentItem.title}</p>
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">{currentItem.subtitle}</h2>
              <h3 className="text-4xl font-light text-gray-700 mb-4">Sobre Nós</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{currentItem.description}</p>
              <div className="flex flex-wrap gap-2 items-center">
                <button onClick={() => setEditing(true)} className="text-xs underline text-blue-600">✏️ Editar</button>
                <button onClick={createNew} className="text-xs text-green-700 border border-green-700 px-2 py-1 rounded hover:bg-green-100">➕ Novo</button>
                <button onClick={deleteItem} className="text-xs text-red-700 border border-red-700 px-2 py-1 rounded hover:bg-red-100">🗑️ Eliminar</button>
                <button
                  onClick={setAsMain}
                  className={`text-xs px-2 py-1 rounded border ${
                    currentItem.is_main
                      ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                      : "text-yellow-600 border-yellow-500 hover:bg-yellow-50"
                  }`}
                >
                  ⭐ Guardar
                </button>
                <select
                  value={selectedId}
                  onChange={(e) => {
                    const found = aboutItems.find(i => i.id === e.target.value);
                    setSelectedId(found.id);
                    setForm(found);
                    setEditing(false);
                  }}
                  className="border px-2 py-1 text-xs rounded"
                >
                  {aboutItems.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.title?.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {notification && (
            <div className={`mt-4 px-3 py-2 rounded text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {notification.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";

const Brands = ({ adminMode = false }) => {
  const [brands, setBrands] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error) setBrands(data);
    };

    fetchBrands();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("brands")
      .update(form)
      .eq("id", form.id);

    if (!error) {
      setBrands((prev) => prev.map((b) => (b.id === form.id ? form : b)));
      setEditingId(null);
      setNotification({ id: form.id, type: "success", message: "Marca atualizada com sucesso!" });
    } else {
      setNotification({ id: form.id, type: "error", message: "Erro ao atualizar marca." });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("brands").delete().eq("id", id);

    if (!error) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      setNotification({ id, type: "success", message: "Marca eliminada." });
    } else {
      setNotification({ id, type: "error", message: "Erro ao eliminar marca." });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteAll = async () => {
    const { error } = await supabase.from("brands").delete().neq("id", 0); // Apaga todas
    if (!error) {
      setBrands([]);
      setNotification({ id: null, type: "success", message: "Todas as marcas foram eliminadas!" });
    } else {
      setNotification({ id: null, type: "error", message: "Erro ao eliminar todas as marcas." });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from("brands")
      .insert([
        {
          name: "Nova Marca",
          image_url: "https://via.placeholder.com/150",
          is_main: false,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setBrands((prev) => [data, ...prev]);
      setEditingId(data.id);
      setForm(data);
      setNotification({ id: null, type: "success", message: "Marca criada!" });

      setTimeout(() => {
        const el = document.getElementById(`brand-${data.id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    } else {
      setNotification({ id: null, type: "error", message: "Erro ao criar marca." });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const setAsMainBrand = async (id) => {
    const { error: clearError } = await supabase
      .from("brands")
      .update({ is_main: false })
      .neq("id", id);

    const { error: setError } = await supabase
      .from("brands")
      .update({ is_main: true })
      .eq("id", id);

    if (!clearError && !setError) {
      setBrands((prev) =>
        prev.map((b) => ({
          ...b,
          is_main: b.id === id,
        }))
      );
      setNotification({ id, type: "success", message: "Marca guardada!" });
    } else {
      setNotification({ id, type: "error", message: "Erro ao guardar marca." });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full bg-white py-4 px-2">
      <div className="flex flex-wrap justify-center items-start gap-20">
        {brands.map((brand) => (
          <div
            key={brand.id}
            id={`brand-${brand.id}`}
            className="flex flex-col justify-between items-center min-h-[180px] w-[150px] pb-2"
          >
            {editingId === brand.id ? (
              <div className="flex flex-col gap-1 items-center w-full">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="text-sm border px-2 py-1 rounded w-full"
                  placeholder="Nome"
                />
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  className="text-sm border px-2 py-1 rounded w-full"
                  placeholder="URL da imagem"
                />
                <div className="flex gap-1 mt-1 flex-row">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-black text-[10px] px-2 py-0.5 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 text-[10px] px-2 py-0.5 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={brand.image_url}
                  alt={brand.name}
                  className={`object-contain mb-4 ${
                    brand.name.toLowerCase() === "daikin"
                      ? "w-[210px] h-[96px]"
                      : brand.name.toLowerCase() === "lg"
                      ? "w-[120px] h-[48px]"
                      : "w-[140px] h-[56px]"
                  }`}
                />
                {adminMode && (
                  <>
                    <div className="flex gap-1 mt-1 flex-row items-center justify-center">
                      <button
                        onClick={() => {
                          setEditingId(brand.id);
                          setForm(brand);
                        }}
                        className="bg-white text-blue-600 border rounded px-1.5 py-0.5 text-[10px]"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="bg-white text-red-600 border rounded px-1.5 py-0.5 text-[10px]"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => setAsMainBrand(brand.id)}
                        className={`bg-white border rounded px-1.5 py-0.5 text-[10px] ${
                          brand.is_main ? "text-yellow-600 font-bold" : "text-yellow-500"
                        }`}
                      >
                        ⭐
                      </button>
                    </div>

                    {notification?.id === brand.id && (
                      <div
                        className={`mt-2 text-[13px] font-medium px-3 py-2 rounded text-center ${
                          notification.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {notification.message}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Botões adicionais no modo admin */}
      {adminMode && (
        <div className="flex flex-col items-center justify-center mt-6 gap-3">
          <button
            onClick={handleCreate}
            className="bg-purple-600 hover:bg-purple-700 text-black px-3 py-1 text-[11px] rounded shadow"
          >
            ➕ Nova Marca
          </button>


          {notification && notification.id === null && (
            <div
              className={`mt-1 text-[13px] font-medium px-3 py-2 rounded text-center ${
                notification.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {notification.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Brands;

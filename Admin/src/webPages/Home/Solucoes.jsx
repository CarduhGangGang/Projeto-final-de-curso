import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../supabase-client";
import * as LucideIcons from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 1.8,
      ease: "easeOut",
    },
  }),
};

const initialVariants = {
  hiddenLeft: { opacity: 0, x: -100 },
  visibleLeft: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
  hiddenRight: { opacity: 0, x: 100 },
  visibleRight: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: 0.3 },
  },
};

const Solucoes = ({ adminMode = false }) => {
  const [solucoes, setSolucoes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [notification, setNotification] = useState(null);
  const [intro, setIntro] = useState({ titulo: "", subtitulo: "", img_url: "" });
  const [editIntro, setEditIntro] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("solucoes_home")
        .select("*")
        .order("ordem", { ascending: true });

      if (!error) setSolucoes(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchIntro = async () => {
      const { data, error } = await supabase
        .from("solucoes_intro")
        .select("id, titulo, subtitulo, img_url")
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (!error && data) setIntro(data);
    };
    fetchIntro();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("solucoes_home")
      .update(form)
      .eq("id", form.id);

    if (!error) {
      setSolucoes((prev) => prev.map((s) => (s.id === form.id ? form : s)));
      setEditingId(null);
      setNotification("✅ Atualizado com sucesso!");
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from("solucoes_home")
      .insert([
        {
          titulo: "Nova Solução",
          descricao: "Descrição da nova solução",
          icone: "Wrench",
          ordem: solucoes.length + 1,
        },
      ])
      .select()
      .single();

    if (!error) {
      setSolucoes((prev) => [...prev, data]);
      setEditingId(data.id);
      setForm(data);
      setNotification("✅ Criado com sucesso!");
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("solucoes_home").delete().eq("id", id);
    if (!error) {
      setSolucoes((prev) => prev.filter((s) => s.id !== id));
      setNotification("🗑️ Eliminado com sucesso.");
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteAll = async () => {
    const confirmed = confirm("Tens a certeza que queres apagar todas as soluções?");
    if (!confirmed) return;

    const { error } = await supabase.from("solucoes_home").delete().neq("id", 0);

    if (!error) {
      setSolucoes([]);
      setNotification("🧹 Todas as soluções foram eliminadas.");
    } else {
      setNotification("❌ Erro ao apagar todas as soluções.");
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <section className="bg-white px-6 py-12 space-y-16">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        <motion.div
          className="w-full md:w-1/2"
          initial="hiddenLeft"
          animate="visibleLeft"
          variants={initialVariants}
        >
          <img
            src={intro.img_url || "https://via.placeholder.com/300x200"}
            alt="Ilustração de soluções"
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          initial="hiddenRight"
          animate="visibleRight"
          variants={initialVariants}
        >
          {editIntro ? (
            <div className="space-y-2 mb-4">
              <input
                value={intro.titulo}
                onChange={(e) => setIntro({ ...intro, titulo: e.target.value })}
                className="w-full border px-3 py-1 rounded text-lg font-semibold"
              />
              <input
                value={intro.subtitulo}
                onChange={(e) => setIntro({ ...intro, subtitulo: e.target.value })}
                className="w-full border px-3 py-1 rounded text-sm"
              />
              <input
                value={intro.img_url || ""}
                onChange={(e) => setIntro({ ...intro, img_url: e.target.value })}
                className="w-full border px-3 py-1 rounded text-sm"
                placeholder="URL da imagem"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={async () => {
                    const { error } = await supabase
                      .from("solucoes_intro")
                      .update({
                        titulo: intro.titulo,
                        subtitulo: intro.subtitulo,
                        img_url: intro.img_url,
                      })
                      .eq("id", intro.id);

                    if (!error) {
                      setEditIntro(false);
                      setNotification("✅ Texto atualizado!");
                    }
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="bg-black text-black px-4 py-2 rounded text-sm"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditIntro(false)}
                  className="bg-gray-300 px-4 py-2 rounded text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                {intro.titulo}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{intro.subtitulo}</p>

              {adminMode && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <button
                    onClick={() => setEditIntro(true)}
                    className="bg-purple-600 text-black px-4 py-2 rounded hover:bg-purple-700 shadow text-sm"
                  >
                    ✏️ Editar texto
                  </button>
                  <button
                    onClick={handleCreate}
                    className="bg-purple-600 text-black px-4 py-2 rounded hover:bg-purple-700 shadow text-sm"
                  >
                    ➕ Nova Solução
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    className="bg-red-600 text-black px-4 py-2 rounded hover:bg-red-700 shadow text-sm"
                  >
                    🧹 Apagar Tudo
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {solucoes.map((s, index) => {
          const Icon = LucideIcons[s.icone] || LucideIcons.CircleHelp;
          return (
            <motion.div
              key={s.id}
              className="bg-white rounded-2xl shadow-md p-6 text-center"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={index}
            >
              {editingId === s.id ? (
                <div className="space-y-2">
                  <input
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-1 text-sm"
                  />
                  <input
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-1 text-sm"
                  />
                  <input
                    name="icone"
                    value={form.icone}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-1 text-sm"
                  />
                  <div className="flex justify-center gap-2">
                    <button onClick={handleSave} className="bg-black text-black px-4 py-2 rounded text-sm">
                      ✅ Guardar
                    </button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-300 px-4 py-2 rounded text-sm">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {s.image_url && (
                    <img
                      src={s.image_url}
                      alt={s.titulo}
                      className="mx-auto mb-3 rounded w-16 h-16 object-cover"
                    />
                  )}
                  <Icon className="mx-auto text-black w-8 h-8 mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">{s.titulo}</h3>
                  <p className="text-sm text-gray-700 mb-2">{s.descricao}</p>
                  {adminMode && (
                    <div className="flex justify-center gap-2 text-sm">
                      <button
                        onClick={() => {
                          setEditingId(s.id);
                          setForm(s);
                        }}
                        className="text-blue-600 underline"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-600 underline"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {notification && (
        <div className="mt-6 text-center text-green-700 bg-green-100 px-4 py-2 rounded text-[14px] font-medium">
          {notification}
        </div>
      )}
    </section>
  );
};

export default Solucoes;

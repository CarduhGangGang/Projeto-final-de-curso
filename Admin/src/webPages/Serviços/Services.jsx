import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RequestOrc from "../../components/RequestOrc";
import { supabase } from "../../../supabase-client";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Services = ({ adminMode = false }) => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image_url: "" });
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showOrcamentoModal, setShowOrcamentoModal] = useState(false);

  const [header, setHeader] = useState({ title: "", subtitle: "" });
  const [editingHeader, setEditingHeader] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchHeader();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from("services_works")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setServices(data);
  };

  const fetchHeader = async () => {
    const { data } = await supabase
      .from("services_header")
      .select("*")
      .limit(1)
      .single();
    if (data) setHeader(data);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveService = async () => {
    if (!form.title || !form.description || !form.image_url) {
      setNotification("❌ Preenche todos os campos.");
      return;
    }

    if (editingId) {
      await supabase.from("services_works").update(form).eq("id", editingId);
      setNotification("✅ Serviço atualizado!");
    } else {
      await supabase.from("services_works").insert(form);
      setNotification("✅ Serviço criado!");
    }

    setForm({ title: "", description: "", image_url: "" });
    setEditingId(null);
    fetchServices();
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteService = async (id) => {
    await supabase.from("services_works").delete().eq("id", id);
    setNotification("🗑️ Serviço removido!");
    fetchServices();
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      image_url: service.image_url,
    });
  };

  const handleOpenOrcamento = () => setShowOrcamentoModal(true);
  const handleCloseOrcamento = () => setShowOrcamentoModal(false);

  const saveHeader = async () => {
    const { id, ...rest } = header;
    if (id) {
      await supabase.from("services_header").update(rest).eq("id", id);
    } else {
      const { data } = await supabase.from("services_header").insert(rest).select().single();
      if (data) setHeader(data);
    }
    setEditingHeader(false);
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-700 px-4 sm:px-6 lg:px-32 py-12">
      {/* Header com edição dinâmica */}
      <header className="text-center border-b pb-10">
        {adminMode && editingHeader ? (
          <div className="space-y-4 max-w-xl mx-auto">
            <input
              className="w-full border px-3 py-2 rounded text-center"
              value={header.title}
              onChange={(e) => setHeader({ ...header, title: e.target.value })}
              placeholder="Título"
            />
            <input
              className="w-full border px-3 py-2 rounded text-center"
              value={header.subtitle}
              onChange={(e) => setHeader({ ...header, subtitle: e.target.value })}
              placeholder="Subtítulo"
            />
            <button
              onClick={saveHeader}
              className="bg-black text-black px-4 py-2 rounded"
            >
              💾 Guardar Cabeçalho
            </button>
          </div>
        ) : (
          <>
            <p className="uppercase text-xs tracking-widest text-gray-400">{header.title}</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-1">
              {header.subtitle}
            </h1>
            {adminMode && (
              <button
                onClick={() => setEditingHeader(true)}
                className="mt-2 text-sm text-black underline"
              >
                ✏️ Editar Cabeçalho
              </button>
            )}
          </>
        )}
      </header>

      {/* Admin Panel para serviços */}
      {adminMode && (
        <div className="max-w-3xl mx-auto my-10 space-y-4">
          <input
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="image_url"
            placeholder="URL da imagem"
            value={form.image_url}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            onClick={saveService}
            className="bg-black text-black px-4 py-2 rounded"
          >
            {editingId ? "💾 Guardar Alterações" : "➕ Criar"}
          </button>
          {notification && (
            <p className="text-sm text-green-600 mt-2">{notification}</p>
          )}
        </div>
      )}

      {/* Lista de Serviços */}
      <main className="py-16 space-y-20 md:space-y-32">
        {services.map((service, index) => (
          <motion.section
            key={service.id}
            className={`flex flex-col md:flex-row ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            } items-center gap-8 md:gap-20`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="w-full md:w-1/2">
              <img
                src={service.image_url}
                alt={service.title}
                className="rounded-lg w-full max-h-[320px] object-cover shadow-md"
              />
            </div>
            <div className="w-full md:w-1/2 text-justify">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900">
                {service.title}
              </h2>
              <p className="mb-6 text-sm sm:text-base leading-relaxed">
                {service.description}
              </p>
              <motion.button
                onClick={handleOpenOrcamento}
                className="inline-flex items-center gap-2 bg-gray-800 text-black px-5 py-2 rounded"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Pedir Orçamento <span className="text-lg">→</span>
              </motion.button>

              {adminMode && (
                <div className="flex gap-4 mt-4 text-sm">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-600 underline"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="text-red-600 underline"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        ))}
      </main>

      {showOrcamentoModal && <RequestOrc onClose={handleCloseOrcamento} />}
    </div>
  );
};

export default Services;

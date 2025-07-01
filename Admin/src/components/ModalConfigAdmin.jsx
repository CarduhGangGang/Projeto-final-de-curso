import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ModalConfigAdmin = () => {
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    imagem_url: "",
    servicos: "",
    label_nome: "",
    label_email: "",
    label_contacto: "",
    label_servico: "",
    label_detalhes: "",
    placeholder_nome: "",
    placeholder_email: "",
    placeholder_contacto: "",
    placeholder_servico: "",
    placeholder_detalhes: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true); // Novo estado
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchConfigs = async () => {
      const { data, error } = await supabase.from("modal_config").select("*");
      if (!error && data.length > 0) {
        setConfigs(data);
        const config = data[0];
        setSelectedConfig(config);
        setFormData({
          titulo: config.titulo,
          imagem_url: config.imagem_url || "",
          servicos: (config.servicos || []).join(", "),
          label_nome: config.label_nome || "Nome",
          label_email: config.label_email || "Email",
          label_contacto: config.label_contacto || "Contacto",
          label_servico: config.label_servico || "Tipo de Serviço",
          label_detalhes: config.label_detalhes || "Mais detalhes",
          placeholder_nome: config.placeholder_nome || "Insira o seu nome",
          placeholder_email: config.placeholder_email || "Insira o seu email",
          placeholder_contacto: config.placeholder_contacto || "Insira o seu contacto",
          placeholder_servico: config.placeholder_servico || "Selecione um serviço",
          placeholder_detalhes: config.placeholder_detalhes || "Descreva o projeto",
        });
      }
      setLoading(false); // Fim do loading
    };
    fetchConfigs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const updatedData = {
      titulo: formData.titulo,
      imagem_url: formData.imagem_url,
      servicos: formData.servicos.split(",").map((s) => s.trim()),
      label_nome: formData.label_nome,
      label_email: formData.label_email,
      label_contacto: formData.label_contacto,
      label_servico: formData.label_servico,
      label_detalhes: formData.label_detalhes,
      placeholder_nome: formData.placeholder_nome,
      placeholder_email: formData.placeholder_email,
      placeholder_contacto: formData.placeholder_contacto,
      placeholder_servico: formData.placeholder_servico,
      placeholder_detalhes: formData.placeholder_detalhes,
    };

    let result;
    if (selectedConfig) {
      result = await supabase
        .from("modal_config")
        .update(updatedData)
        .eq("id", selectedConfig.id);
    } else {
      result = await supabase.from("modal_config").insert([updatedData]);
    }

    setSaving(false);
    setMessage(result.error ? "❌ Erro ao guardar." : "✅ Configurações salvas com sucesso.");
  };

  const handleActivate = async () => {
    if (!selectedConfig) return;
    await supabase.from("modal_config").update({ ativo: false }).neq("id", selectedConfig.id);
    await supabase.from("modal_config").update({ ativo: true }).eq("id", selectedConfig.id);
    setMessage("✅ Modal ativado com sucesso.");
  };

  return (
    <div className="w-full flex items-center justify-center relative min-h-[400px]">
      {/* Spinner animado enquanto carrega */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="spinner"
            className="absolute inset-0 flex items-center justify-center bg-white z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Loader2 className="animate-spin text-gray-600" size={40} />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="w-full max-w-7xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Imagem Preview */}
          {formData.imagem_url ? (
            <div
              className="lg:w-1/2 w-full h-64 lg:h-auto bg-cover bg-center"
              style={{ backgroundImage: `url('${formData.imagem_url}')` }}
            />
          ) : (
            <div className="lg:w-1/2 w-full h-64 lg:h-auto bg-gray-100 flex items-center justify-center text-gray-400 text-sm italic">
              Sem imagem
            </div>
          )}

          {/* Formulário */}
          <div className="lg:w-1/2 w-full p-10 sm:p-12 text-gray-800 flex flex-col gap-6">
            <h2 className="text-3xl font-extrabold text-center">Configurar Modal</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {[
                ["Título do Modal", "titulo"],
                ["URL da Imagem", "imagem_url"],
                ["Serviços", "servicos"],
                ["Label 1", "label_nome"],
                ["Placeholder: Label 1", "placeholder_nome"],
                ["Label 2", "label_email"],
                ["Placeholder: Label 2", "placeholder_email"],
                ["Label 3", "label_contacto"],
                ["Placeholder: Label 3", "placeholder_contacto"],
                ["Label 4", "label_servico"],
                ["Placeholder: Label 4", "placeholder_servico"],
                ["Label 5", "label_detalhes"],
                ["Placeholder: Label 5", "placeholder_detalhes"],
              ].map(([label, name]) => (
                <Input key={name} label={label} name={name} value={formData[name]} onChange={handleChange} />
              ))}

              <div className="flex flex-col gap-4 mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-gray-700 font-semibold transition ${
                    saving ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {saving ? <><Loader2 className="animate-spin" size={16} /> A guardar...</> : "Guardar"}
                </button>

                {selectedConfig && (
                  <button
                    type="button"
                    onClick={handleActivate}
                    className="w-full py-3 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition font-semibold"
                  >
                    Ativar Modal
                  </button>
                )}
              </div>

              {message && (
                <div className="text-sm text-center mt-2 text-green-600">{message}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Input reutilizável
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm mb-1 font-medium">{label}</label>
    <input
      name={name}
      type="text"
      required
      value={value}
      onChange={onChange}
      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);

export default ModalConfigAdmin;

import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { Loader2 } from "lucide-react";

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
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Imagem Preview Condicional */}
        {formData.imagem_url ? (
          <div
            className="lg:w-1/2 w-full h-64 lg:h-auto bg-cover bg-center"
            style={{ backgroundImage: `url('${formData.imagem_url}')` }}
          ></div>
        ) : (
          <div className="lg:w-1/2 w-full h-64 lg:h-auto bg-gray-100 flex items-center justify-center text-gray-400 text-sm italic">
            Sem imagem
          </div>
        )}

        {/* Formulário */}
        <div className="lg:w-1/2 w-full p-10 sm:p-12 text-gray-800 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-center">Configurar Modal</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input label="Título do Modal" name="titulo" value={formData.titulo} onChange={handleChange} />
            <Input label="URL da Imagem" name="imagem_url" value={formData.imagem_url} onChange={handleChange} />
            <Input label="Serviços" name="servicos" value={formData.servicos} onChange={handleChange} />

            <Input label="Label 1" name="label_nome" value={formData.label_nome} onChange={handleChange} />
            <Input label="Placeholder: Label 1" name="placeholder_nome" value={formData.placeholder_nome} onChange={handleChange} />

            <Input label="Label 2" name="label_email" value={formData.label_email} onChange={handleChange} />
            <Input label="Placeholder: Label 2" name="placeholder_email" value={formData.placeholder_email} onChange={handleChange} />

            <Input label="Label 3" name="label_contacto" value={formData.label_contacto} onChange={handleChange} />
            <Input label="Placeholder: Label 3" name="placeholder_contacto" value={formData.placeholder_contacto} onChange={handleChange} />

            <Input label="Label 4" name="label_servico" value={formData.label_servico} onChange={handleChange} />
            <Input label="Placeholder: Label 4" name="placeholder_servico" value={formData.placeholder_servico} onChange={handleChange} />

            <Input label="Label 5" name="label_detalhes" value={formData.label_detalhes} onChange={handleChange} />
            <Input label="Placeholder: Label 5" name="placeholder_detalhes" value={formData.placeholder_detalhes} onChange={handleChange} />

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
    </div>
  );
};

// Input auxiliar
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

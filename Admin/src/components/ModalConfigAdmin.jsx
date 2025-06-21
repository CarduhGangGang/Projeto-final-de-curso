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
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchConfigs = async () => {
      const { data, error } = await supabase.from("modal_config").select("*");
      if (!error && data.length > 0) {
        const config = data[0];
        setConfigs(data);
        setSelectedConfig(config);
        setFormData({
          titulo: config.titulo,
          imagem_url: config.imagem_url || "",
          servicos: (config.servicos || []).join(", "),
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
      imagem_url: "", // ignorado
      servicos: formData.servicos.split(",").map((s) => s.trim()),
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

        {/* Left - Image */}
        <div
          className="lg:w-1/2 w-full h-64 lg:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url('/static/blueprint.jpg')` }}
        ></div>

        {/* Right - Form */}
        <div className="lg:w-1/2 w-full p-10 sm:p-12 text-gray-800 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-center tracking-wide">
            Configurar Modal
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm mb-1 font-medium">Título</label>
              <input
                name="titulo"
                type="text"
                required
                value={formData.titulo}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Serviços (separados por vírgula)
              </label>
              <input
                name="servicos"
                type="text"
                required
                value={formData.servicos}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-black font-semibold transition ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> A guardar...
                  </>
                ) : (
                  "Guardar Configurações"
                )}
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

export default ModalConfigAdmin;

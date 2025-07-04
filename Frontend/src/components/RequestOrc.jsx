import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha"; // NOVO

const RECAPTCHA_SITE_KEY = "6LcEBHcrAAAAAKL8ew6xgOLOW2Qc8E3BGXl-UrQI";

const RequestOrc = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    contacto: "",
    tiposervico: "",
    detalhes: "",
  });

  const [recaptchaToken, setRecaptchaToken] = useState(null); // NOVO
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalConfig, setModalConfig] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSuccessMessage("");

    if (!recaptchaToken) {
      alert("Por favor confirme que não é um robô.");
      setIsSending(false);
      return;
    }

    try {
      const { error: dbError } = await supabase.from("orcamentos").insert([
        {
          nome: formData.nome,
          email: formData.email,
          contacto: formData.contacto,
          tiposervico: formData.tiposervico,
          detalhes: formData.detalhes,
          file_url: null,
        },
      ]);

      if (dbError) {
        alert("Erro ao guardar o pedido:\n" + dbError.message);
        setIsSending(false);
        return;
      }

      const response = await fetch(
        "https://snsvmoozjvnlhkqazbbp.functions.supabase.co/send-orcamento-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, recaptchaToken }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro na função.");

      setSuccessMessage("Pedido de orçamento enviado com sucesso!");
      setFormData({ nome: "", email: "", contacto: "", tiposervico: "", detalhes: "" });
      setRecaptchaToken(null); // Reseta token após envio
      setTimeout(onClose, 2500);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar pedido.");
    }

    setIsSending(false);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from("modal_config")
        .select("*")
        .eq("ativo", true)
        .single();

      if (!error && data) setModalConfig(data);
      else console.error("Erro ao buscar modal_config:", error);

      setLoading(false);
    };

    fetchConfig();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex bg-white rounded-xl max-w-4xl w-full max-md:mx-4 relative"
        >
          {modalConfig?.imagem_url && (
            <img
              src={modalConfig.imagem_url}
              alt="Imagem"
              className="w-1/2 rounded-l-xl hidden md:block object-cover"
            />
          )}

          <div className="relative flex flex-col items-center justify-center w-full md:w-1/2 p-4 md:p-6 text-sm">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
              aria-label="Fechar Modal"
            >
              ×
            </button>

            <p className="text-xl font-semibold mb-6 text-center">
              {modalConfig?.titulo || "Pedido de Orçamento"}
            </p>

            {successMessage && (
              <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
                {successMessage}
              </div>
            )}

            {["nome", "email", "contacto"].map((field) => (
              <div key={field} className="w-full mb-4">
                <label className="block font-medium text-gray-600 mb-1">
                  {modalConfig?.[`label_${field}`] || field}
                </label>
                <input
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  placeholder={
                    modalConfig?.[`placeholder_${field}`] || `Insira o seu ${field}`
                  }
                  className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm"
                  required
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="w-full mb-4">
              <label className="block font-medium text-gray-600 mb-1">
                {modalConfig?.label_servico || "Tipo de Serviço"}
              </label>
              <select
                name="tiposervico"
                className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm"
                required
                value={formData.tiposervico}
                onChange={handleChange}
              >
                <option value="">
                  {modalConfig?.placeholder_servico || "Selecione uma opção"}
                </option>
                {modalConfig?.servicos?.map((servico, i) => (
                  <option key={i} value={servico}>
                    {servico}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full mb-4">
              <label className="block font-medium text-gray-600 mb-1">
                {modalConfig?.label_detalhes || "Mais detalhes"}
              </label>
              <textarea
                name="detalhes"
                placeholder={modalConfig?.placeholder_detalhes || "Descreva o projeto"}
                className="border border-gray-300 rounded w-full px-2 py-1.5 h-24 resize-none text-sm"
                required
                value={formData.detalhes}
                onChange={handleChange}
              />
            </div>

            {/* reCAPTCHA v2 */}
            <div className="mb-5">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(token) => setRecaptchaToken(token)}
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className={`w-full text-white font-semibold rounded px-6 py-2 transition ${
                isSending ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
            >
              {isSending ? "A Enviar..." : "Enviar"}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default RequestOrc;

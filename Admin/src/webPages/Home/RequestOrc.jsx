import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase-client';

const RequestOrc = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    contacto: '',
    tiposervico: '',
    detalhes: ''
  });

  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalConfig, setModalConfig] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSuccessMessage('');

    const { error: dbError } = await supabase.from('orcamentos').insert([{
      nome: formData.nome,
      email: formData.email,
      contacto: formData.contacto,
      tiposervico: formData.tiposervico,
      detalhes: formData.detalhes,
      file_url: null
    }]);

    if (dbError) {
      alert('Erro ao guardar o pedido:\n' + dbError.message);
      setIsSending(false);
      return;
    }

    try {
      await fetch("/functions/v1/send-orcamento-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error("Erro ao enviar email:", err);
    }

    setSuccessMessage('Pedido de orçamento enviado com sucesso!');
    setFormData({
      nome: '',
      email: '',
      contacto: '',
      tiposervico: '',
      detalhes: ''
    });

    setTimeout(onClose, 2500);
    setIsSending(false);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from('modal_config')
        .select('*')
        .eq('ativo', true)
        .single();

      if (!error && data) {
        setModalConfig(data);
      } else {
        console.error('Erro ao buscar modal_config:', error);
      }
    };

    fetchConfig();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <form
        onSubmit={handleSubmit}
        className="flex bg-white rounded-xl max-w-4xl w-full max-md:mx-4 relative"
      >
        {/* Imagem lateral (dinâmica) */}
        {modalConfig?.imagem_url && (
          <img
            src={modalConfig.imagem_url}
            alt="Imagem"
            className="w-1/2 rounded-l-xl hidden md:block object-cover"
          />
        )}

        <div className="relative flex flex-col items-center justify-center w-full md:w-1/2 p-4 md:p-6 text-sm">
          {/* Botão de fechar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold focus:outline-none"
            aria-label="Fechar Modal"
          >
            ×
          </button>

          {/* Título do modal */}
          <p className="text-xl font-semibold mb-8 text-center">
            {modalConfig?.titulo || 'Pedido de Orçamento'}
          </p>

          {/* Mensagem de sucesso */}
          {successMessage && (
            <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
              {successMessage}
            </div>
          )}

          {/* Campos Nome, Email, Contacto */}
          {['nome', 'email', 'contacto'].map((field) => (
            <div key={field} className="w-full mb-4">
              <label className="block font-medium text-gray-600 mb-1">
                {modalConfig?.[`label_${field}`] || field}
              </label>
              <input
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                placeholder={modalConfig?.[`placeholder_${field}`] || `Insira o seu ${field}`}
                className="border border-gray-300 rounded w-full px-2 py-1.5 text-sm"
                required
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Tipo de Serviço */}
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
              <option value="">{modalConfig?.placeholder_servico || "Selecione uma opção"}</option>
              {modalConfig?.servicos?.map((servico, i) => (
                <option key={i} value={servico}>{servico}</option>
              ))}
            </select>
          </div>

          {/* Mais detalhes */}
          <div className="w-full mb-6">
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

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={isSending}
            className={`w-full text-white font-semibold rounded px-6 py-2 transition ${
              isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {isSending ? 'A Enviar...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestOrc;

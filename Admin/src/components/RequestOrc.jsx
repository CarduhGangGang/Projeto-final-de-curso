import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { supabase } from '../../supabase-client';

const RequestOrc = ({ onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    contacto: '',
    tipoServico: '',
    detalhes: ''
  });

  const [modalConfig, setModalConfig] = useState(null);

  useEffect(() => {
    setFormData({
      nome: initialData.nome || '',
      email: initialData.email || '',
      contacto: initialData.contacto || '',
      tipoServico: initialData.tiposervico || '',
      detalhes: initialData.detalhes || ''
    });
  }, [initialData]);

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
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-8">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white rounded-xl w-full max-w-2xl p-6 relative"
      >
        <img
          src={assets.closeIcon}
          alt="Fechar"
          className="absolute top-3 right-3 h-4 w-4 cursor-pointer"
          onClick={onClose}
        />

        <p className="text-xl font-semibold mb-8 text-center">
          {modalConfig?.titulo || 'Visualizar Pedido'}
        </p>

        {['nome', 'email', 'contacto'].map((field) => (
          <div key={field} className="w-full mb-4">
            <label className="block font-medium text-gray-600 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <div className="w-full px-2 py-1.5 rounded text-sm bg-green-100 text-green-800 border border-green-400">
              {formData[field] || '—'}
            </div>
          </div>
        ))}

        <div className="w-full mb-4">
          <label className="block font-medium text-gray-600 mb-1">Tipo de Serviço</label>
          <div className="w-full px-2 py-1.5 rounded text-sm bg-green-100 text-green-800 border border-green-400">
            {formData.tipoServico || '—'}
          </div>
        </div>

        <div className="w-full mb-2">
          <label className="block font-medium text-gray-600 mb-1">Mais detalhes</label>
          <div className="w-full px-2 py-1.5 rounded text-sm bg-green-100 text-green-800 border border-green-400 whitespace-pre-line overflow-y-auto max-h-60">
            {formData.detalhes || '—'}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RequestOrc;

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase-client';

const Footer = () => {
  const [footerInfo, setFooterInfo] = useState({
    descricao: '',
    telefone: '',
    email: '',
    direitos: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchFooterInfo = async () => {
      const { data } = await supabase
        .from('footer_info')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (data) setFooterInfo(data);
    };

    fetchFooterInfo();
  }, []);

  const handleChange = (e) => {
    setFooterInfo({ ...footerInfo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('footer_info')
      .update({
        descricao: footerInfo.descricao,
        telefone: footerInfo.telefone,
        email: footerInfo.email,
        direitos: footerInfo.direitos,
      })
      .eq('id', footerInfo.id);

    if (!error) {
      setNotification('✅ Rodapé atualizado com sucesso!');
      setEditMode(false);
    } else {
      setNotification('❌ Erro ao guardar. Verifica o Supabase.');
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {editMode ? (
        <div className="space-y-4">
          <textarea
            name="descricao"
            value={footerInfo.descricao}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            rows={4}
            placeholder="Descrição do rodapé"
          />
          <input
            name="telefone"
            value={footerInfo.telefone}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            placeholder="Telefone"
          />
          <input
            name="email"
            value={footerInfo.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            placeholder="Email"
          />
          <input
            name="direitos"
            value={footerInfo.direitos}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            placeholder="Texto de direitos"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 bg-gray-100 p-6 rounded">
          <h2 className="text-lg font-bold">Preview:</h2>
          <p className="text-sm text-gray-700">{footerInfo.descricao}</p>
          <p className="text-sm text-gray-700">📞 {footerInfo.telefone}</p>
          <p className="text-sm text-gray-700">📧 {footerInfo.email}</p>
          <p className="text-xs text-center text-gray-500 mt-4">
            {footerInfo.direitos}
          </p>
          <div className="text-center mt-4">
            <button
              onClick={() => setEditMode(true)}
              className="text-sm text-blue-600 underline"
            >
              ✏️ Editar rodapé
            </button>
          </div>
        </div>
      )}

      {notification && (
        <p className="mt-4 text-green-600 text-sm text-center">{notification}</p>
      )}

      {/* Footer real para visualização final */}
      <hr className="my-10" />
      <h2 className="text-center text-lg font-semibold mb-2">Pré-visualização final</h2>
      <RealFooter />
    </div>
  );
};

export default Footer;

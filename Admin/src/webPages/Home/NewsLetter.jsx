import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';
import { supabase } from '../../../supabase-client';

const Title = ({ title, subTitle }) => (
  <div className="text-center mb-4">
    <h2 className="text-2xl font-bold text-black">{title}</h2>
    <p className="text-gray-400 mt-1 text-sm">{subTitle}</p>
  </div>
);

const NewsLetter = ({ adminMode = false }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [info, setInfo] = useState({ titulo: '', subtitulo: '' });
  const [editInfo, setEditInfo] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const { data, error } = await supabase
        .from('newsletter_info')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (!error && data) setInfo(data);
    };

    fetchInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Por favor, insira um email válido.');
      return;
    }

    setStatus('loading');
    try {
      const { data: existing } = await supabase
        .from('newsletter')
        .select('id')
        .eq('email', email);

      if (existing.length > 0) {
        setStatus('success');
        setEmail('');
        return;
      }

      const { error: insertError } = await supabase
        .from('newsletter')
        .insert([{ email }]);

      if (insertError) throw insertError;

      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Erro ao subscrever:', error);
      setStatus('error');
    }
  };

  const handleUpdateInfo = async () => {
    const { error } = await supabase
      .from('newsletter_info')
      .update({
        titulo: info.titulo,
        subtitulo: info.subtitulo,
      })
      .eq('id', info.id);

    if (!error) {
      setEditInfo(false);
      setNotification('✅ Título atualizado com sucesso!');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full h-auto flex items-center justify-center px-4 py-8 bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="flex flex-col items-center w-full max-w-4xl bg-gray bg-opacity-90 px-6 py-8 text-black rounded-xl shadow-sm"
      >
        {editInfo ? (
          <div className="w-full max-w-2xl mb-4 space-y-2">
            <input
              className="w-full border px-3 py-2 rounded text-sm"
              value={info.titulo}
              onChange={(e) => setInfo({ ...info, titulo: e.target.value })}
            />
            <input
              className="w-full border px-3 py-2 rounded text-sm"
              value={info.subtitulo}
              onChange={(e) => setInfo({ ...info, subtitulo: e.target.value })}
            />
            <div className="flex gap-2 mt-1">
              <button onClick={handleUpdateInfo} className="bg-black text-black px-4 py-1 rounded text-sm">Guardar</button>
              <button onClick={() => setEditInfo(false)} className="bg-gray-300 px-4 py-1 rounded text-sm">Cancelar</button>
            </div>
          </div>
        ) : (
          <>
            <Title title={info.titulo} subTitle={info.subtitulo} />
            {adminMode && (
              <button
                onClick={() => setEditInfo(true)}
                className="text-sm text-blue-600 underline mb-3"
              >
                ✏️ Editar título
              </button>
            )}
          </>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4 w-full max-w-2xl"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/10 px-4 py-2 border rounded outline-none flex-grow text-sm"
            placeholder="O teu email"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-2 group bg-gray-600 text-black px-5 py-2 rounded transition-all disabled:opacity-50 text-sm"
          >
            {status === 'loading' ? 'Enviando...' : 'SUBSCREVER'}
            <img
              src={assets.arrowIcon}
              alt="arrow-icon"
              className="w-3 group-hover:translate-x-1 transition-all"
            />
          </button>
        </form>

        {status === 'success' && (
          <p className="text-green-500 mt-3 text-xs">Email subscrito com sucesso!</p>
        )}
        {status === 'error' && (
          <p className="text-red-500 mt-3 text-xs">Erro ao subscrever. Tenta novamente.</p>
        )}
        {notification && (
          <p className="text-green-600 mt-3 text-xs">{notification}</p>
        )}

        <p className="text-gray-400 mt-4 text-xs text-center max-w-md">
          Ao subscrever, estás a concordar com a nossa Política de Privacidade e a receber novidades por email.
        </p>
      </motion.div>
    </div>
  );
};

export default NewsLetter;

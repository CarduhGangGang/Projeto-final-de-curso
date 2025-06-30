import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase-client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Connects = ({ adminMode = true }) => {
  const [connect, setConnect] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchLink();
  }, []);

  const fetchLink = async () => {
    const { data } = await supabase
      .from('connects_links')
      .select('*')
      .eq('is_active', true)
      .order('ordem', { ascending: true })
      .limit(1)
      .single();

    if (data) setConnect(data);
  };

  const handleChange = (field, val) => {
    setConnect(prev => ({ ...prev, [field]: val }));
  };

  const handleNew = () => {
    setConnect({
      id: `temp-${Date.now()}`,
      titulo: 'Novo Título',
      subtitulo: 'Novo Subtítulo',
      link_url: '/novo-link',
      ordem: 1,
      is_active: true,
    });
  };

  const handleDelete = async () => {
    if (!confirm('Eliminar este link?')) return;

    if (!connect?.id) return;

    if (!String(connect.id).startsWith('temp')) {
      await supabase.from('connects_links').delete().eq('id', connect.id);
    }

    setConnect(null);
    setNotification('❌ Connect eliminado.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async () => {
    const payload = {
      titulo: connect.titulo,
      subtitulo: connect.subtitulo,
      link_url: connect.link_url,
      ordem: 1,
      is_active: true,
    };

    if (String(connect.id).startsWith('temp')) {
      await supabase.from('connects_links').insert(payload);
    } else {
      await supabase.from('connects_links').update(payload).eq('id', connect.id);
    }

    fetchLink();
    setNotification('✅ Guardado com sucesso.');
    setTimeout(() => setNotification(null), 3000);
  };

  if (!adminMode) {
    return (
      <section className="bg-white py-20 px-0 flex items-center justify-center">
        {connect && (
          <motion.div
            className="text-center cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link to={connect.link_url} className="group">
              <motion.div
                className="text-4xl sm:text-5xl font-light text-gray-400 group-hover:text-gray-600 transition"
                whileHover={{ y: -4 }}
              >
                {connect.subtitulo}
              </motion.div>
              <motion.div
                className="text-5xl sm:text-6xl font-bold text-gray-800 group-hover:text-black transition"
                whileHover={{ y: 2 }}
              >
                {connect.titulo}
              </motion.div>
            </Link>
          </motion.div>
        )}
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Editor */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white border rounded-xl p-6 shadow space-y-4"
        >
          {connect ? (
            <>
              <input
                value={connect.subtitulo}
                onChange={(e) => handleChange('subtitulo', e.target.value)}
                className="border px-3 py-2 rounded text-sm w-full"
                placeholder="Subtítulo"
              />
              <input
                value={connect.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                className="border px-3 py-2 rounded text-lg font-semibold w-full"
                placeholder="Título"
              />
              <input
                value={connect.link_url}
                onChange={(e) => handleChange('link_url', e.target.value)}
                className="border px-3 py-2 rounded text-sm w-full"
                placeholder="URL do link"
              />
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={handleDelete}
                  className="text-red-600 text-sm font-medium"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Nenhum connect ainda. Clique em "Novo Connect".</p>
          )}

          <div className="flex flex-col items-center gap-3 pt-6">
            <button onClick={handleNew} className="text-purple-700 font-semibold">
              ➕ Novo Connect
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-black rounded font-semibold"
              disabled={!connect}
            >
              💾 Guardar
            </button>
            {notification && (
              <p className="text-center text-green-600 text-sm">{notification}</p>
            )}
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white border rounded-xl shadow flex items-center justify-center min-h-[300px]"
        >
          {connect && (
            <Link to={connect.link_url} className="group text-center">
              <motion.div
                className="text-4xl sm:text-5xl font-light text-gray-400 group-hover:text-gray-600 transition"
                whileHover={{ y: -4 }}
              >
                {connect.subtitulo}
              </motion.div>
              <motion.div
                className="text-5xl sm:text-6xl font-bold text-gray-800 group-hover:text-black transition"
                whileHover={{ y: 2 }}
              >
                {connect.titulo}
              </motion.div>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Connects;

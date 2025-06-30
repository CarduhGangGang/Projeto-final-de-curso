import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase-client';
import { motion } from 'framer-motion';

const Oquefazemos = () => {
  const [cards, setCards] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({});
  const [tituloSecao, setTituloSecao] = useState('O que fazemos?');
  const [subtitulo, setSubtitulo] = useState('');
  const [tituloId, setTituloId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tituloData } = await supabase
        .from('titulo_oque')
        .select('*')
        .eq('is_active', true)
        .single();
      if (tituloData) {
        setTituloSecao(tituloData.titulo);
        setSubtitulo(tituloData.subtitulo || '');
        setTituloId(tituloData.id);
      }

      const { data: cardsData } = await supabase
        .from('oquefazemos')
        .select('*')
        .order('ordem');
      if (cardsData?.length) {
        setCards(cardsData);
        setSelectedId(cardsData[0].id);
        setForm(cardsData[0]);
      }
    };
    fetchData();
  }, []);

  const currentCard = cards.find(i => i.id === selectedId);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveChanges = async () => {
    const { error } = await supabase.from('oquefazemos').update(form).eq('id', form.id);
    if (!error) {
      setCards(prev => prev.map(i => i.id === form.id ? form : i));
      setNotification({ type: 'success', message: 'Guardado com sucesso!' });
    } else {
      setNotification({ type: 'error', message: 'Erro ao guardar.' });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const createNew = async () => {
    const { data, error } = await supabase.from('oquefazemos').insert([{
      img_url: '',
      title: 'Novo título',
      text: 'Novo texto',
      ordem: cards.length + 1,
      is_active: true
    }]).select().single();

    if (!error && data) {
      setCards([data, ...cards]);
      setSelectedId(data.id);
      setForm(data);
      setNotification({ type: 'success', message: 'Card criado.' });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const deleteCard = async () => {
    const { error } = await supabase.from('oquefazemos').delete().eq('id', selectedId);
    if (!error) {
      const updated = cards.filter(c => c.id !== selectedId);
      setCards(updated);
      if (updated.length) {
        setSelectedId(updated[0].id);
        setForm(updated[0]);
      } else {
        setSelectedId(null);
        setForm({});
      }
      setNotification({ type: 'success', message: 'Eliminado com sucesso.' });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const saveTitulo = async () => {
    if (tituloId) {
      const { error } = await supabase
        .from('titulo_oque')
        .update({ titulo: tituloSecao, subtitulo: subtitulo })
        .eq('id', tituloId);
      if (!error) {
        setNotification({ type: 'success', message: 'Título e subtítulo guardados.' });
      }
    }
    setTimeout(() => setNotification(null), 4000);
  };

  if (!currentCard) return <div className="p-6">Nenhum card disponível.</div>;

  return (
    <section className="bg-gray-50 py-12 px-4 font-[Poppins]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-10">
          <input
            value={tituloSecao}
            onChange={(e) => setTituloSecao(e.target.value)}
            className="text-3xl text-center border rounded px-4 py-2 w-full max-w-lg"
            placeholder="Título principal"
          />
          <textarea
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            className="text-sm text-center border rounded px-4 py-2 w-full max-w-3xl"
            rows={3}
            placeholder="Subtítulo descritivo"
          />
          <button
            onClick={saveTitulo}
            className="text-xs text-green-700 border border-green-700 px-3 py-1 rounded hover:bg-green-100"
          >
            💾 Guardar Títulos
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-white rounded-xl shadow p-4 space-y-2"
          >
            <input
              name="img_url"
              value={form.img_url}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="URL da imagem"
            />
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Título"
            />
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Texto"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={saveChanges} className="bg-black text-black px-4 py-1 rounded">💾 Guardar</button>
              <button onClick={createNew} className="text-xs text-green-700 border border-green-700 px-2 py-1 rounded hover:bg-green-100">➕ Novo</button>
              <button onClick={deleteCard} className="text-xs text-red-700 border border-red-700 px-2 py-1 rounded hover:bg-red-100">🗑️ Eliminar</button>
              <select
                value={selectedId}
                onChange={(e) => {
                  const found = cards.find(i => i.id === parseInt(e.target.value));
                  setSelectedId(found.id);
                  setForm(found);
                }}
                className="border px-2 py-1 text-xs rounded"
              >
                {cards.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.title?.slice(0, 30)}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="rounded-xl overflow-hidden shadow bg-white"
          >
            <img src={form.img_url} alt="Preview" className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{form.title}</h3>
              <p className="text-gray-600 text-sm">{form.text}</p>
            </div>
          </motion.div>
        </div>

        {notification && (
          <div className={`mt-6 text-center text-sm ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {notification.message}
          </div>
        )}
      </div>
    </section>
  );
};

export default Oquefazemos;

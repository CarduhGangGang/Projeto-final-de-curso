import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase-client';
import { motion } from 'framer-motion';

const HeroHome = ({ adminMode = false }) => {
  const [heroes, setHeroes] = useState([]);
  const [selectedHeroId, setSelectedHeroId] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      const { data } = await supabase
        .from('hero_section')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setHeroes(data);
        if (data.length > 0) {
          setSelectedHeroId(data[0].id);
          setForm(data[0]);
        }
      }
    };
    fetchHeroes();
  }, []);

  const currentHero = heroes.find(h => h.id === selectedHeroId);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveChanges = async () => {
    const { error } = await supabase
      .from('hero_section')
      .update(form)
      .eq('id', form.id);

    if (error) {
      setNotification({ type: 'error', message: 'Erro ao atualizar.' });
    } else {
      setNotification({ type: 'success', message: 'Atualizado com sucesso!' });
      setHeroes(prev => prev.map(h => (h.id === form.id ? form : h)));
      setEditing(false);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const createNewHero = async () => {
    const { data, error } = await supabase
      .from('hero_section')
      .insert([{
        title: 'Novo título',
        subtitle: 'Novo subtítulo',
        description: 'Nova descrição...',
        image_url: 'https://source.unsplash.com/1600x900/?technology',
        button_text: 'Botão',
        button_url: '/',
        is_final: false
      }])
      .select()
      .single();

    if (!error) {
      setHeroes([data, ...heroes]);
      setSelectedHeroId(data.id);
      setForm(data);
      setEditing(true);
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const deleteHero = async () => {
    if (!selectedHeroId) return;

    const { error } = await supabase
      .from('hero_section')
      .delete()
      .eq('id', selectedHeroId);

    if (!error) {
      const updated = heroes.filter(h => h.id !== selectedHeroId);
      setHeroes(updated);
      if (updated.length > 0) {
        setSelectedHeroId(updated[0].id);
        setForm(updated[0]);
      } else {
        setSelectedHeroId(null);
        setForm({});
      }
      setNotification({ type: 'success', message: 'Eliminado com sucesso!' });
    }

    setTimeout(() => setNotification(null), 4000);
  };

  const setAsFinalHero = async () => {
    const { error: clearError } = await supabase
      .from('hero_section')
      .update({ is_final: false })
      .neq('id', currentHero.id);

    const { error: setError } = await supabase
      .from('hero_section')
      .update({ is_final: true })
      .eq('id', currentHero.id);

    if (!clearError && !setError) {
      setNotification({ type: 'success', message: 'Guardado com sucesso!' });
      setHeroes(prev =>
        prev.map(h => ({ ...h, is_final: h.id === currentHero.id }))
      );
    } else {
      setNotification({ type: 'error', message: 'Erro ao guardar.' });
    }

    setTimeout(() => setNotification(null), 4000);
  };

  if (!currentHero) return <div className="p-6">Nenhum conteúdo ainda.</div>;

  const Wrapper = adminMode ? 'div' : motion.div;

  return (
    <div
      className="w-full min-h-screen overflow-auto bg-cover bg-center bg-no-repeat pt-12 pb-8"
      style={{ backgroundImage: `url(${currentHero.image_url})` }}
    >
      <div className="flex items-center justify-center w-full">
        <Wrapper
          className="w-full max-w-screen-md px-4 sm:px-6 md:px-8 flex flex-col items-center text-center lg:text-left lg:items-start"
          {...(!adminMode && {
            initial: { y: -60, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: { duration: 1, ease: 'easeOut' }
          })}
        >
          {editing ? (
            <div className="w-full bg-white/30 backdrop-blur-md p-4 rounded-lg shadow">
              <textarea name="title" value={form.title} onChange={handleChange} className="w-full text-sm p-2 rounded border mb-2" />
              <input name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full text-sm p-2 rounded border mb-2" />
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full text-sm p-2 rounded border mb-2" />
              <input name="image_url" value={form.image_url} onChange={handleChange} className="w-full text-sm p-2 rounded border mb-2" />
              <input name="button_text" value={form.button_text} onChange={handleChange} className="w-full text-sm p-2 rounded border mb-2" />
              <input name="button_url" value={form.button_url} onChange={handleChange} className="w-full text-sm p-2 rounded border mb-4" />
              <div className="flex gap-2 flex-wrap justify-center">
                <button onClick={saveChanges} className="bg-white text-black px-3 py-1 rounded text-sm shadow">💾 Guardar</button>
                <button onClick={() => setEditing(false)} className="bg-white text-black px-3 py-1 rounded text-sm shadow">Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3 leading-snug" dangerouslySetInnerHTML={{ __html: currentHero.title }} />
              <h2 className="text-base sm:text-lg font-semibold text-gray-100 mb-3">{currentHero.subtitle}</h2>
              <p className="text-sm sm:text-base text-white mb-4 max-w-2xl">{currentHero.description}</p>
              <a href={currentHero.button_url}>
                <button className="bg-white text-black font-medium py-2 px-4 rounded text-sm shadow hover:bg-gray-200 transition">
                  {currentHero.button_text}
                </button>
              </a>
              <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
                <button onClick={() => setEditing(true)} className="text-xs underline text-blue-600">✏️ Editar</button>
                <button onClick={createNewHero} className="text-xs text-green-700 border px-2 py-1 rounded border-green-700 hover:bg-green-100">➕ Novo</button>
                <button onClick={deleteHero} className="text-xs text-red-700 border px-2 py-1 rounded border-red-700 hover:bg-red-100">🗑️ Eliminar</button>
                <button
                  onClick={setAsFinalHero}
                  className={`text-xs px-2 py-1 rounded border ${
                    currentHero.is_final
                      ? 'border-yellow-500 text-yellow-700 bg-yellow-100'
                      : 'border-yellow-500 text-yellow-500 hover:bg-yellow-100'
                  }`}
                >
                  ⭐ Guardar
                </button>
                <select
                  value={selectedHeroId}
                  onChange={(e) => {
                    const found = heroes.find(h => h.id === e.target.value);
                    setSelectedHeroId(found.id);
                    setForm(found);
                    setEditing(false);
                  }}
                  className="border px-2 py-1 text-xs rounded"
                >
                  {heroes.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.title.replace(/<[^>]+>/g, '').slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {notification && (
            <div className={`mt-4 px-3 py-2 rounded text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {notification.message}
            </div>
          )}
        </Wrapper>
      </div>
    </div>
  );
};

export default HeroHome;

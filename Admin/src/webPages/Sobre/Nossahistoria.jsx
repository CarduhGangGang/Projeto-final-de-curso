import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase-client';

const Nossahistoria = ({ adminMode = true }) => {
  const [historias, setHistorias] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true); // Novo estado de carregamento

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('nossahistoria').select('*').order('created_at');
    if (data) {
      setHistorias(data);
      const final = data.find((h) => h.is_final);
      setSelected(final || data[0]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setSelected({ ...selected, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!selected?.id) return;
    const { error } = await supabase
      .from('nossahistoria')
      .update({
        titulo: selected.titulo,
        subtitulo: selected.subtitulo,
        paragrafo1: selected.paragrafo1,
        paragrafo2: selected.paragrafo2,
        paragrafo3: selected.paragrafo3,
      })
      .eq('id', selected.id);

    if (!error) {
      setNotification('✅ Guardado com sucesso.');
      fetchData();
      setEditing(false);
    } else {
      setNotification('❌ Erro ao guardar.');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleNew = async () => {
    const { data, error } = await supabase
      .from('nossahistoria')
      .insert({
        titulo: 'Novo Título',
        subtitulo: 'Novo Subtítulo',
        paragrafo1: '',
        paragrafo2: '',
        paragrafo3: '',
        is_final: false,
      })
      .select()
      .single();

    if (!error && data) {
      setHistorias([...historias, data]);
      setSelected(data);
      setEditing(true);
      setNotification('🆕 Nova versão criada.');
    } else {
      setNotification('❌ Erro ao criar.');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    const confirm = window.confirm('⚠️ Eliminar esta versão?');
    if (!confirm) return;

    await supabase.from('nossahistoria').delete().eq('id', selected.id);
    fetchData();
    setNotification('🗑️ Eliminado.');
    setTimeout(() => setNotification(null), 3000);
  };

  const setAsFinal = async (id) => {
    await supabase.from('nossahistoria').update({ is_final: false }).neq('id', id);
    await supabase.from('nossahistoria').update({ is_final: true }).eq('id', id);
    fetchData();
    setNotification('⭐ Definido como principal.');
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading || !selected) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-gray-600 text-sm">
        A carregar conteúdo...
      </div>
    );
  }

  return (
    <section className="bg-white px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-left">
          <p className="text-sm text-gray-500 uppercase">{selected.subtitulo}</p>

          {editing ? (
            <>
              <input
                name="titulo"
                value={selected.titulo}
                onChange={handleChange}
                className="text-3xl font-bold text-gray-800 mb-3 w-full border rounded px-2 py-1"
              />
              <textarea
                name="paragrafo1"
                value={selected.paragrafo1}
                onChange={handleChange}
                className="text-gray-700 text-base mb-2 w-full border rounded px-2 py-1"
                rows={3}
              />
              <textarea
                name="paragrafo2"
                value={selected.paragrafo2}
                onChange={handleChange}
                className="text-gray-700 text-base mb-2 w-full border rounded px-2 py-1"
                rows={3}
              />
              <textarea
                name="paragrafo3"
                value={selected.paragrafo3}
                onChange={handleChange}
                className="text-gray-700 text-base mb-4 w-full border rounded px-2 py-1"
                rows={3}
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{selected.titulo}</h1>
              <p className="text-gray-700 text-base mb-4 text-justify">{selected.paragrafo1}</p>
              <p className="text-gray-700 text-base mb-4 text-justify">{selected.paragrafo2}</p>
              <p className="text-gray-700 text-base text-justify">{selected.paragrafo3}</p>
            </>
          )}
        </div>

        {adminMode && (
          <div className="mt-6 flex flex-wrap justify-start items-center gap-3">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="text-blue-600 font-semibold">
                ✏️ Editar
              </button>
            ) : (
              <button onClick={handleSave} className="text-green-600 font-semibold">
                💾 Guardar
              </button>
            )}
            <button onClick={handleNew} className="text-purple-700 font-semibold">
              ➕ Novo
            </button>
            <button onClick={handleDelete} className="text-red-600 font-semibold">
              🗑️ Eliminar
            </button>
            <button onClick={() => setAsFinal(selected.id)} className="text-yellow-600 font-semibold">
              ⭐ Guardar como final
            </button>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={selected.id}
              onChange={(e) =>
                setSelected(historias.find((h) => h.id === e.target.value))
              }
            >
              {historias.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.titulo} ({h.created_at?.slice(0, 10)}) {h.is_final ? '⭐' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {notification && (
          <p className="mt-4 text-sm text-green-600">{notification}</p>
        )}
      </div>
    </section>
  );
};

export default Nossahistoria;

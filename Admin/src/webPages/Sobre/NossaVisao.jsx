import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase-client';

const NossaVisao = ({ adminMode = true }) => {
  const [visoes, setVisoes] = useState([]);
  const [formData, setFormData] = useState([]);
  const [tituloSecao, setTituloSecao] = useState("A Nossa Visão");
  const [editingTitulo, setEditingTitulo] = useState(false);
  const [tituloId, setTituloId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchTitulo();
      await fetchVisoes();
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchTitulo = async () => {
    const { data } = await supabase
      .from('titulo_visao')
      .select('*')
      .eq('is_active', true)
      .single();

    if (data) {
      setTituloSecao(data.titulo);
      setTituloId(data.id);
    }
  };

  const fetchVisoes = async () => {
    const { data } = await supabase
      .from('nossavisao')
      .select('*')
      .order('ordem');

    if (data) {
      setVisoes(data);
      setFormData(data);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
  };

  const handleNew = () => {
    const nova = {
      id: `temp-${Date.now()}`,
      titulo: '',
      conteudo: '',
      ordem: formData.length + 1,
      is_active: true,
      isNew: true,
    };
    setFormData([...formData, nova]);
    setOpenIndex(formData.length);
  };

  const handleDelete = (id) => {
    const confirmar = window.confirm('⚠️ Tens a certeza que queres eliminar esta visão?');
    if (!confirmar) return;
    setFormData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveAll = async () => {
    const saveOps = formData.map(async (item, i) => {
      const payload = {
        titulo: item.titulo,
        conteudo: item.conteudo,
        ordem: i + 1,
        is_active: true,
      };

      if (String(item.id).startsWith("temp")) {
        return supabase.from('nossavisao').insert(payload);
      } else {
        return supabase.from('nossavisao').update(payload).eq('id', item.id);
      }
    });

    await Promise.all(saveOps);

    if (tituloId) {
      await supabase.from('titulo_visao').update({ titulo: tituloSecao }).eq('id', tituloId);
    }

    fetchVisoes();
    setNotification('✅ Alterações guardadas com sucesso.');
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">
        A carregar conteúdo...
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-gray-50 py-24 px-6 sm:px-10">
      <div className="w-full">
        {/* TÍTULO */}
        <div className="mb-12 text-center">
          {editingTitulo ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <input
                value={tituloSecao}
                onChange={(e) => setTituloSecao(e.target.value)}
                className="text-4xl font-bold text-center text-gray-800 border rounded px-4 py-2 w-full sm:max-w-lg"
              />
              <button
                onClick={() => setEditingTitulo(false)}
                className="text-green-600 font-semibold"
              >
                ✅ Guardar
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900">
                <span className="font-semibold">{tituloSecao}</span>
              </h2>
              {adminMode && (
                <button
                  onClick={() => setEditingTitulo(true)}
                  className="flex items-center gap-1 text-blue-600 text-sm font-medium bg-white px-3 py-1 rounded-full shadow border border-blue-200 hover:bg-blue-50 transition"
                >
                  ✏️ Editar
                </button>
              )}
            </div>
          )}
        </div>

        {/* VISÕES (Acordeão em tela cheia) */}
        <div className="space-y-4 w-full">
          {formData.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 mx-auto"
            >
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleAccordion(index)}>
                <input
                  value={item.titulo}
                  onChange={(e) => handleChange(index, 'titulo', e.target.value)}
                  className="text-lg sm:text-xl font-semibold text-gray-900 w-full bg-transparent border-none focus:outline-none"
                  placeholder="Título"
                />
                <div className="flex items-center gap-2">
                  <button className="text-xl">
                    {openIndex === index ? '▼' : '▶'}
                  </button>
                  {adminMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="text-red-600 text-sm"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              {/* Conteúdo */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index ? 'max-h-[300px] mt-3' : 'max-h-0'
                }`}
              >
                <textarea
                  value={item.conteudo}
                  onChange={(e) => handleChange(index, 'conteudo', e.target.value)}
                  className="w-full px-3 py-2 border rounded text-gray-700 mt-2"
                  rows={4}
                  placeholder="Conteúdo"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ADMIN ACTIONS */}
        {adminMode && (
          <div className="flex flex-col items-center gap-4 mt-12">
            <button
              onClick={handleNew}
              className="text-purple-700 font-semibold hover:underline"
            >
              ➕ Novo
            </button>

            <button
              onClick={handleSaveAll}
              className="px-6 py-3 bg-green-600 text-black rounded-xl shadow font-semibold hover:bg-green-700"
            >
              💾 Guardar alterações
            </button>
          </div>
        )}

        {notification && (
          <p className="mt-6 text-sm text-green-600 text-center">{notification}</p>
        )}
      </div>
    </section>
  );
};

export default NossaVisao;

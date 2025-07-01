import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase-client';

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [notification, setNotification] = useState(null);
  const [intro, setIntro] = useState({ titulo: '', subtitulo: '' });
  const [editIntro, setEditIntro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: testiData } = await supabase
        .from('testimonial')
        .select('*')
        .order('ordem', { ascending: true });

      const { data: introData } = await supabase
        .from('testimonial_intro')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (testiData) setTestimonials(testiData);
      if (introData) setIntro(introData);

      setLoading(false);
    };

    fetchAll();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const { error } = await supabase.from('testimonial').update(form).eq('id', form.id);
    if (!error) {
      setTestimonials((prev) => prev.map((t) => (t.id === form.id ? form : t)));
      setEditing(null);
      setNotification('✅ Atualizado com sucesso!');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from('testimonial')
      .insert([{
        name: 'Novo Cliente',
        title: 'Cargo ou tipo de cliente',
        message: 'Depoimento do cliente',
        image: 'https://via.placeholder.com/80',
        rating: 5,
        ordem: testimonials.length + 1,
      }])
      .select()
      .single();

    if (!error) {
      setTestimonials((prev) => [...prev, data]);
      setEditing(data.id);
      setForm(data);
      setNotification('✅ Testemunho criado!');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('testimonial').delete().eq('id', id);
    if (!error) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setNotification('🗑️ Testemunho eliminado.');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm('Tem a certeza que deseja apagar TODOS os testemunhos e a introdução? Esta ação é irreversível.');
    if (!confirmed) return;

    const { error: err1 } = await supabase.from('testimonial').delete().neq('id', 0);
    const { error: err2 } = await supabase.from('testimonial_intro').delete().neq('id', 0);

    if (!err1 && !err2) {
      setTestimonials([]);
      setIntro({ titulo: '', subtitulo: '' });
      setNotification('🧹 Todos os testemunhos e o conteúdo introdutório foram eliminados.');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleIntroSave = async () => {
    const { error } = await supabase
      .from('testimonial_intro')
      .update({
        titulo: intro.titulo,
        subtitulo: intro.subtitulo,
      })
      .eq('id', intro.id);

    if (!error) {
      setEditIntro(false);
      setNotification('✅ Título atualizado!');
    }
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading || !intro) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-gray-600 text-sm">
        A carregar conteúdo...
      </div>
    );
  }

  return (
    <section className="bg-[#f8fbfd] px-6 py-12 space-y-12">
      {/* Título da secção */}
      <div className="text-center max-w-2xl mx-auto">
        {editIntro ? (
          <div className="space-y-2">
            <input
              className="border px-4 py-2 rounded w-full text-lg font-semibold"
              value={intro.titulo}
              onChange={(e) => setIntro({ ...intro, titulo: e.target.value })}
              placeholder="Título principal"
            />
            <input
              className="border px-4 py-2 rounded w-full text-sm"
              value={intro.subtitulo}
              onChange={(e) => setIntro({ ...intro, subtitulo: e.target.value })}
              placeholder="Subtítulo"
            />
            <div className="flex justify-center gap-2 mt-2">
              <button onClick={handleIntroSave} className="bg-black text-black px-4 py-1 rounded text-sm">Guardar</button>
              <button onClick={() => setEditIntro(false)} className="bg-gray-300 px-4 py-1 rounded text-sm">Cancelar</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{intro.titulo}</h2>
            <p className="text-gray-500 text-sm mt-2">{intro.subtitulo}</p>
            <button onClick={() => setEditIntro(true)} className="text-blue-600 text-sm underline mt-2">✏️ Editar título</button>
          </>
        )}
      </div>

      {/* Botões de ação */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleCreate}
          className="bg-purple-600 text-black px-5 py-2 rounded shadow hover:bg-purple-700 text-sm"
        >
          ➕ Novo Testemunho
        </button>
        <button
          onClick={handleDeleteAll}
          className="bg-red-600 text-black px-5 py-2 rounded shadow hover:bg-red-700 text-sm"
        >
          🧹 Apagar Todos
        </button>
      </div>

      {/* Testemunhos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-md p-6 space-y-3 border">
            {editing === t.id ? (
              <div className="space-y-2">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" className="w-full border px-3 py-1 rounded" />
                <input name="title" value={form.title} onChange={handleChange} placeholder="Título" className="w-full border px-3 py-1 rounded" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="URL da imagem" className="w-full border px-3 py-1 rounded" />
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Mensagem" className="w-full border px-3 py-1 rounded" />
                <input name="rating" value={form.rating} type="number" min="1" max="5" onChange={handleChange} className="w-full border px-3 py-1 rounded" />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="bg-black text-black px-4 py-1 rounded text-sm">Guardar</button>
                  <button onClick={() => setEditing(null)} className="bg-gray-300 px-4 py-1 rounded text-sm">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-red-500 text-lg">{'★'.repeat(t.rating)}</div>
                <p className="text-gray-800 text-sm">{t.message}</p>
                <div className="flex items-center mt-3 gap-3">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.title}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-sm mt-2">
                  <button onClick={() => { setEditing(t.id); setForm(t); }} className="text-blue-600 underline">Editar</button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 underline">Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Notificação */}
      {notification && (
        <div className="mt-6 text-center text-green-700 bg-green-100 px-4 py-2 rounded text-sm">
          {notification}
        </div>
      )}
    </section>
  );
};

export default Testimonial;

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [form, setForm] = useState({
    logo_url: '',
    descricao: '',
    contacto_telefone: '',
    contacto_email: '',
    links_coluna1: [],
    titulo_coluna1: '',
    titulo_coluna2: '',
    copyright: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true); // <-- Novo

  useEffect(() => {
    const fetchFooter = async () => {
      setLoading(true); // <-- Inicia carregamento

      const { data } = await supabase
        .from('footer_info')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const final = data.find(f => f.is_final) || data[0];
        setFooterData(final);
        setForm({
          logo_url: final.logo_url || '',
          descricao: final.descricao || '',
          contacto_telefone: final.contacto_telefone || '',
          contacto_email: final.contacto_email || '',
          links_coluna1: final.links_coluna1 || [],
          titulo_coluna1: final.titulo_coluna1 || '',
          titulo_coluna2: final.titulo_coluna2 || '',
          copyright: final.copyright || ''
        });
      }

      setLoading(false); // <-- Finaliza carregamento
    };

    fetchFooter();
  }, []);

    if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-gray-600 text-sm">
        A carregar conteúdo...
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...form.links_coluna1];
    updatedLinks[index][field] = value;
    setForm({ ...form, links_coluna1: updatedLinks });
  };

  const addLink = () => {
    setForm({ ...form, links_coluna1: [...form.links_coluna1, { label: '', url: '' }] });
  };

  const removeLink = (index) => {
    const updated = form.links_coluna1.filter((_, i) => i !== index);
    setForm({ ...form, links_coluna1: updated });
  };

  const saveChanges = async () => {
    if (!footerData) return;

    const safeForm = {
      ...form,
      links_coluna1: Array.isArray(form.links_coluna1) ? form.links_coluna1 : [],
    };

    const { error } = await supabase
      .from('footer_info')
      .update(safeForm)
      .eq('id', footerData.id);

    if (!error) {
      setNotification('✅ Rodapé atualizado com sucesso!');
      setEditMode(false);
      setFooterData({ ...footerData, ...safeForm });
    } else {
      console.error("Erro Supabase:", error);
      setNotification('❌ Erro ao atualizar rodapé.');
    }

    setTimeout(() => setNotification(null), 4000);
  };

  const deleteFooter = async () => {
    if (footerData) {
      await supabase.from('footer_info').delete().eq('id', footerData.id);
      setFooterData(null);
      setForm({
        logo_url: '',
        descricao: '',
        contacto_telefone: '',
        contacto_email: '',
        links_coluna1: [],
        titulo_coluna1: '',
        titulo_coluna2: '',
        copyright: ''
      });
      setNotification('🗑️ Rodapé eliminado.');
    }
  };

  const setAsFinalFooter = async () => {
    if (!footerData) return;

    await supabase.from('footer_info').update({ is_final: false }).neq('id', footerData.id);
    const { error } = await supabase.from('footer_info').update({ is_final: true }).eq('id', footerData.id);

    if (!error) {
      setNotification('⭐ Este rodapé está agora ativo!');
      setFooterData({ ...footerData, is_final: true });
    } else {
      setNotification('❌ Erro ao definir como final.');
    }

    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <footer className="bg-gray-100 text-gray-700 px-6 py-10 mt-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Coluna 1 */}
        <div>
          <h2 className="text-xl font-bold">KENTACENTRO, LDA</h2>
          {editMode ? (
            <>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                className="w-full mt-2 border px-3 py-2 rounded text-sm"
              />
              <input
                name="logo_url"
                value={form.logo_url}
                onChange={handleChange}
                className="w-full mt-2 border px-3 py-2 rounded text-sm"
                placeholder="URL do logo"
              />
            </>
          ) : (
            <p className="text-sm mt-2 text-gray-600">{footerData?.descricao}</p>
          )}
        </div>

        {/* Coluna 2 */}
        <div>
          {editMode ? (
            <input
              name="titulo_coluna1"
              value={form.titulo_coluna1}
              onChange={handleChange}
              className="text-lg font-semibold mb-2 border px-2 py-1 rounded w-full"
              placeholder="Título da coluna"
            />
          ) : (
            <h3 className="text-lg font-semibold">{footerData?.titulo_coluna1 || 'Company'}</h3>
          )}
          <ul className="space-y-1 mt-2 text-sm">
            {editMode ? (
              form.links_coluna1.map((link, i) => (
                <li key={i} className="flex gap-2 items-center">
                  <input
                    value={link.label}
                    onChange={(e) => handleLinkChange(i, 'label', e.target.value)}
                    className="border px-2 py-1 rounded w-1/2"
                    placeholder="Texto"
                  />
                  <input
                    value={link.url}
                    onChange={(e) => handleLinkChange(i, 'url', e.target.value)}
                    className="border px-2 py-1 rounded w-1/2"
                    placeholder="URL"
                  />
                  <button onClick={() => removeLink(i)} className="text-red-600">🗑️</button>
                </li>
              ))
            ) : (
              footerData?.links_coluna1?.map((link, i) => (
                <li key={i}>
                  <Link to={link.url} className="hover:underline">{link.label}</Link>
                </li>
              ))
            )}
            {editMode && (
              <li>
                <button onClick={addLink} className="text-blue-600 text-sm">➕ Adicionar link</button>
              </li>
            )}
          </ul>
        </div>

        {/* Coluna 3 */}
        <div>
          {editMode ? (
            <input
              name="titulo_coluna2"
              value={form.titulo_coluna2}
              onChange={handleChange}
              className="text-lg font-semibold mb-2 border px-2 py-1 rounded w-full"
              placeholder="Título da coluna"
            />
          ) : (
            <h3 className="text-lg font-semibold">{footerData?.titulo_coluna2 || 'Contactos'}</h3>
          )}
          {editMode ? (
            <>
              <input
                name="contacto_telefone"
                value={form.contacto_telefone}
                onChange={handleChange}
                className="w-full mt-2 border px-3 py-2 rounded text-sm"
                placeholder="Telefone"
              />
              <input
                name="contacto_email"
                value={form.contacto_email}
                onChange={handleChange}
                className="w-full mt-2 border px-3 py-2 rounded text-sm"
                placeholder="Email"
              />
            </>
          ) : (
            <ul className="space-y-1 mt-2 text-sm text-gray-600">
              <li>{footerData?.contacto_telefone}</li>
              <li>{footerData?.contacto_email}</li>
            </ul>
          )}
        </div>
      </div>

      {/* Controlo admin */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-wrap gap-4 items-center">
        {editMode ? (
          <>
            <input
              name="copyright"
              value={form.copyright}
              onChange={handleChange}
              className="text-xs text-gray-500 w-full border px-3 py-2 rounded"
              placeholder="Copyright"
            />
            <button onClick={saveChanges} className="bg-black text-black px-4 py-2 rounded">💾 Guardar</button>
            <button onClick={() => setEditMode(false)} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditMode(true)} className="text-blue-600 underline">✏️ Editar rodapé</button>
            <button onClick={deleteFooter} className="text-red-600 underline">🗑️ Eliminar</button>
            <button
              onClick={setAsFinalFooter}
              className={`px-3 py-1 text-sm rounded border ${footerData?.is_final ? 'bg-yellow-100 text-yellow-700' : 'text-yellow-600 border-yellow-600'}`}
            >
              ⭐ {footerData?.is_final ? 'Ativo' : 'Definir como final'}
            </button>
          </>
        )}
      </div>

      {/* Copyright */}
      {!editMode && (
        <div className="text-center mt-10 text-xs text-gray-500 border-t pt-4">
          {footerData?.copyright || '© 2025 Kentacentro. All rights reserved.'}
        </div>
      )}

      {notification && (
        <div className="text-green-600 bg-green-100 px-4 py-2 rounded text-sm mt-6 max-w-xl mx-auto text-center">
          {notification}
        </div>
      )}
    </footer>
  );
};

export default Footer;

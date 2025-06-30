import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';

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

  useEffect(() => {
    const fetchFooter = async () => {
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
    };

    fetchFooter();
  }, []);

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
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {editMode ? (
        <div className="space-y-4">
          <input name="logo_url" value={form.logo_url} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Logo URL" />
          <textarea name="descricao" value={form.descricao} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Descrição" />
          <input name="contacto_telefone" value={form.contacto_telefone} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Telefone" />
          <input name="contacto_email" value={form.contacto_email} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Email" />
          <input name="titulo_coluna1" value={form.titulo_coluna1} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Título Coluna 1" />
          <input name="titulo_coluna2" value={form.titulo_coluna2} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Título Coluna 2" />
          <input name="copyright" value={form.copyright} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Copyright" />

          <div className="space-y-2">
            <h3 className="font-medium">Links</h3>
            {form.links_coluna1.map((link, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input value={link.label} onChange={(e) => handleLinkChange(index, 'label', e.target.value)} className="border px-2 py-1 rounded w-1/3" placeholder="Texto" />
                <input value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} className="border px-2 py-1 rounded w-2/3" placeholder="URL" />
                <button onClick={() => removeLink(index)} className="text-red-600 text-sm">🗑️</button>
              </div>
            ))}
            <button onClick={addLink} className="text-sm text-blue-600 underline">➕ Adicionar link</button>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={saveChanges} className="bg-black text-black px-4 py-2 rounded">💾 Guardar</button>
            <button onClick={() => setEditMode(false)} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Logo:</strong> {footerData?.logo_url}</p>
          <p><strong>Descrição:</strong> {footerData?.descricao}</p>
          <p><strong>Telefone:</strong> {footerData?.contacto_telefone}</p>
          <p><strong>Email:</strong> {footerData?.contacto_email}</p>
          <p><strong>Título Coluna 1:</strong> {footerData?.titulo_coluna1}</p>
          <p><strong>Título Coluna 2:</strong> {footerData?.titulo_coluna2}</p>
          <p><strong>Copyright:</strong> {footerData?.copyright}</p>
          <ul className="list-disc ml-5">
            {footerData?.links_coluna1?.map((link, i) => (
              <li key={i}>{link.label} → {link.url}</li>
            ))}
          </ul>

          <div className="flex gap-3 mt-4">
            <button onClick={() => setEditMode(true)} className="text-blue-600 underline">✏️ Editar</button>
            <button onClick={deleteFooter} className="text-red-600 underline">🗑️ Eliminar</button>
            <button onClick={setAsFinalFooter} className={`px-3 py-1 text-sm rounded border ${footerData?.is_final ? 'bg-yellow-100 text-yellow-700' : 'text-yellow-600 border-yellow-600'}`}>
              ⭐ {footerData?.is_final ? 'Guardado' : 'Guardar como final'}
            </button>
          </div>
        </div>
      )}

      {notification && (
        <div className="text-green-600 bg-green-100 px-4 py-2 rounded text-sm mt-4">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Footer;
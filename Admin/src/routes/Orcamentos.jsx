import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../supabase-client";
import { Trash2, Pencil } from "lucide-react";
import RequestOrc from "../components/RequestOrc";

function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    contacto: "",
    tiposervico: "",
    detalhes: "",
  });
  const [recentAddedId, setRecentAddedId] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const tableRef = useRef();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  const fetchOrcamentos = async () => {
    const { data, error } = await supabase
      .from("orcamentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrcamentos(data);
    else console.error("Erro ao buscar orçamentos:", error.message);
  };

  const addOrcamento = async () => {
    const { nome, email, contacto, tiposervico, detalhes } = form;
    if (!nome || !email || !contacto || !tiposervico || !detalhes) {
      alert("Preencha todos os campos");
      return;
    }

    const { data, error } = await supabase
      .from("orcamentos")
      .insert([{ nome, email, contacto, tiposervico, detalhes }])
      .select()
      .single();

    if (!error) {
      setOrcamentos((prev) => [data, ...prev]);
      setForm({ nome: "", email: "", contacto: "", tiposervico: "", detalhes: "" });
      setRecentAddedId(data.id);
      setTimeout(() => setRecentAddedId(null), 3000);
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      alert("Erro ao adicionar: " + error.message);
    }
  };

  const updateOrcamento = async (id, field, value) => {
    const { error } = await supabase
      .from("orcamentos")
      .update({ [field]: value })
      .eq("id", id);

    if (!error) {
      setOrcamentos((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
      );
    }
  };

  const deleteOrcamento = async (id) => {
    const deleted = orcamentos.find((o) => o.id === id);
    const { error } = await supabase.from("orcamentos").delete().eq("id", id);

    if (!error) {
      setOrcamentos((prev) => prev.filter((r) => r.id !== id));
      await supabase.from("notifications").insert([
        {
          mensagem: `Orçamento de ${deleted.nome} (${deleted.tiposervico}) foi excluído.`,
          lido: false,
        },
      ]);
    }
  };

  const filtered = orcamentos.filter((item) =>
    item.nome.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase()) ||
    item.tiposervico.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrcamentos = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden ml-20 md:ml-0">
        <div className="flex-1 p-4 md:p-8 space-y-6">

          <h1 className="text-3xl font-bold text-gray-800">📋 Gestão de Orçamentos</h1>

          <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {["nome", "email", "contacto", "tiposervico", "detalhes"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              ))}
              <button
                onClick={addOrcamento}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:opacity-90"
              >
                ➕ Adicionar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-auto max-h-[60vh]" ref={tableRef}>
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Nome</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Contacto</th>
                    <th className="p-3">Tipo de Serviço</th>
                    <th className="p-3">Detalhes</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrcamentos.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-t ${recentAddedId === item.id ? "bg-green-100" : ""}`}
                    >
                      {["nome", "email", "contacto", "tiposervico", "detalhes"].map((field) => (
                        <td key={field} className="p-3">
                          <input
                            type="text"
                            value={item[field]}
                            readOnly={editingRowId !== item.id}
                            onChange={(e) =>
                              setOrcamentos((prev) =>
                                prev.map((r) =>
                                  r.id === item.id ? { ...r, [field]: e.target.value } : r
                                )
                              )
                            }
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                await updateOrcamento(item.id, field, item[field]);
                                setEditingRowId(null);
                              }
                            }}
                            className={`w-full bg-transparent focus:outline-none ${
                              editingRowId === item.id ? "border-b border-gray-400" : ""
                            }`}
                          />
                        </td>
                      ))}
                      <td className="p-3 flex gap-2 text-sm">
                        <button onClick={() => setEditingRowId((prev) => (prev === item.id ? null : item.id))} className="text-blue-500 hover:underline">✏️</button>
                        <button onClick={() => deleteOrcamento(item.id)} className="text-red-500 hover:underline">🗑️</button>
                        <button onClick={() => {
                          setModalInitialData(item);
                          setShowRequestModal(true);
                        }} className="text-green-500 hover:underline">📧</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between p-3 text-sm bg-gray-100">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="text-blue-600 disabled:text-gray-400"
                >
                  ◀ Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="text-blue-600 disabled:text-gray-400"
                >
                  Próxima ▶
                </button>
              </div>
            )}
          </div>

          {showRequestModal && (
            <RequestOrc
              onClose={() => {
                setShowRequestModal(false);
                fetchOrcamentos();
              }}
              initialData={modalInitialData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Orcamentos;

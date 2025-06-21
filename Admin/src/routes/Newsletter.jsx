import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase-client.js";
import { Plus, X, Mail } from "lucide-react";
import Sidebar from "../components/Sidebar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Newsletter = () => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 20;

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    const { data } = await supabase
      .from("newsletter")
      .select("*")
      .order("id", { ascending: true });
    if (data) setEmails(data);
  };

  const handleAdd = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email) return toast.error("Insira um email válido.");

    const { data: existing } = await supabase
      .from("newsletter")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existing) return toast.warning("Este email já está na lista.");

    const { data, error } = await supabase
      .from("newsletter")
      .insert([{ email }])
      .select()
      .single();
    if (!error && data) {
      await supabase
        .from("notifications")
        .insert([
          {
            mensagem: `📧 Novo email adicionado à newsletter: ${data.email}`,
          },
        ]);
      toast.success("Email adicionado com sucesso.");
      setNewEmail("");
      fetchEmails();
    } else {
      toast.error("Erro ao adicionar email.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja mesmo apagar este email?")) return;
    await supabase.from("newsletter").delete().eq("id", id);
    toast.success("Email removido.");
    fetchEmails();
  };

  const handleEdit = async (id, email) => {
    if (!email) return toast.error("Email inválido.");
    await supabase.from("newsletter").update({ email }).eq("id", id);
    setEditingId(null);
    setEditedEmail("");
    toast.success("Email atualizado.");
    fetchEmails();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(emails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Newsletter");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "newsletter-emails.xlsx");
  };

  const filteredEmails = emails.filter((entry) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      entry.id.toString().includes(term) ||
      entry.email.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmails = filteredEmails.slice(startIndex, endIndex);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Conteúdo principal com scroll externo */}
      <div className="flex-1 flex flex-col overflow-y-auto ml-20 md:ml-0 items-center justify-start p-6 h-screen">
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <Mail className="text-blue-500" size={50} /> Newsletter
          </h1>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <input
              type="email"
              placeholder="Novo email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border text-sm px-4 py-2 rounded w-full sm:w-1/2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
              >
                <Plus size={16} className="inline-block mr-1" /> Adicionar
              </button>
              <button
                onClick={exportToExcel}
                className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
              >
                📄 Excel
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[600px] border rounded-md">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="sticky top-0 z-10 bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmails.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{entry.id}</td>
                    <td className="p-3">
                      {editingId === entry.id ? (
                        <input
                          type="text"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          onBlur={() => handleEdit(entry.id, editedEmail)}
                          className="border w-full px-2 py-1 rounded"
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setEditingId(entry.id);
                            setEditedEmail(entry.email);
                          }}
                          className="cursor-pointer"
                        >
                          {entry.email}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="text-blue-600 disabled:text-gray-400"
              >
                ◀ Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
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
      </div>
    </div>
  );
};

export default Newsletter;

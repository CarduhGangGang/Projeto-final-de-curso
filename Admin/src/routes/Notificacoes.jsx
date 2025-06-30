import React, { useState, useEffect, Fragment } from "react";
import { UserAuth } from "../context/Authcontext";
import { supabase } from "../../supabase-client";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const Notificacoes = () => {
  const { logout, user } = UserAuth();
  const [notifications, setNotifications] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("id, mensagem, lido, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) setNotifications(data);
  };

  useEffect(() => {
    let channel;
    let interval;

    if (user) {
      fetchNotifications();
      interval = setInterval(fetchNotifications, 10000);

      try {
        channel = supabase
          .channel("notifications-realtime")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
            },
            (payload) => {
              const nova = payload.new;
              if (!notifications.some((n) => n.id === nova.id)) {
                setNotifications((prev) => [nova, ...prev]);
                toast.info(nova.mensagem); // <-- sem emoji
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn("Realtime indisponível, usando polling:", err.message);
      }
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (interval) clearInterval(interval);
    };
  }, [user, notifications]);

  const marcarComoLido = async (id) => {
    const { error } = await supabase
      .from("notifications")
      .update({ lido: true })
      .eq("id", id);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lido: true } : n))
      );
    }
  };

  const apagarNotificacao = async (id) => {
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (!error) {
      toast.success("Notificação apagada.");
      await fetchNotifications();
    } else {
      toast.error("Erro ao apagar.");
    }
  };

  const apagarTodasNotificacoes = async () => {
    const { error } = await supabase.from("notifications").delete().neq("id", 0);
    if (!error) {
      toast.success("Todas as notificações foram apagadas.");
      await fetchNotifications();
    } else {
      toast.error("Erro ao apagar todas.");
    }
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <ToastContainer position="top-right" autoClose={4000} />
        <div className="flex-1 overflow-auto ml-20 md:ml-0 p-4 sm:p-6 transition-colors duration-300 space-y-6 text-[10px] sm:text-base">
          <h1 className="text-[11px] sm:text-2xl font-bold text-gray-800 dark:text-white">
            Notificações
          </h1>

          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] sm:text-lg font-semibold text-gray-700 dark:text-white">
                Mantém-te a par das novidades!
              </h2>
              {notifications.length > 0 && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-3 py-1 text-xs sm:text-sm rounded bg-red-600 text-black hover:bg-red-700 transition"
                >
                  Apagar Todas
                </button>
              )}
            </div>

            <ul className="pl-2 sm:pl-4 space-y-2">
              {notifications.length > 0 ? (
                notifications.map((note) => (
                  <li
                    key={note.id}
                    className={`flex justify-between items-start p-2 rounded ${
                      note.lido
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-500"
                        : "bg-blue-100 dark:bg-blue-900 text-black dark:text-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-1">
                      <span className="text-[9px] sm:text-sm">{note.mensagem}</span>
                      <div className="flex gap-2 justify-end">
                        {!note.lido && (
                          <button
                            onClick={() => marcarComoLido(note.id)}
                            className="text-blue-700 text-[8px] sm:text-xs hover:underline"
                          >
                            Marcar como lida
                          </button>
                        )}
                        <button
                          onClick={() => apagarNotificacao(note.id)}
                          className="text-red-600 text-[8px] sm:text-xs hover:underline"
                        >
                          Apagar
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="italic text-gray-400 text-[9px] sm:text-sm">
                  Sem notificações no momento
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      <Transition.Root show={showConfirmModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowConfirmModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-4 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6">
                <div className="flex items-center mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
                  <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white">
                    Confirmar Ação
                  </Dialog.Title>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  Tem certeza que deseja apagar todas as notificações? Esta ação não pode ser desfeita.
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={apagarTodasNotificacoes}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Apagar Todas
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default Notificacoes;

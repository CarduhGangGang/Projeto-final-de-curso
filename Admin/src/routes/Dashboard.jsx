import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/Authcontext";
import Sidebar from "../components/Sidebar";
import ModalConfigAdmin from "../components/ModalConfigAdmin";
import { supabase } from "../../supabase-client";

const Dashboard = () => {
  const { session } = UserAuth();
  const [darkMode] = useState(false);
  const userEmail = session?.user?.email;
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [orcamentosCount, setOrcamentosCount] = useState(0);
  const [newsletterCount, setNewsletterCount] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      const { count: notifCount } = await supabase
        .from("notifications")
        .select("id", { count: "exact" });

      const { count: orcCount } = await supabase
        .from("orcamentos")
        .select("id", { count: "exact" });

      const { count: newsCount } = await supabase
        .from("newsletter")
        .select("id", { count: "exact" });

      setNotificationsCount(notifCount || 0);
      setOrcamentosCount(orcCount || 0);
      setNewsletterCount(newsCount || 0);
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col items-center justify-start px-4 py-10 md:px-10 gap-8">
        {/* Sessão ativa pequena e à direita, respeitando Sidebar */}
        <div className="w-full flex justify-end">
          <div className="max-w-sm bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 sm:p-6 text-left w-full">
            <p className="text-gray-600 dark:text-gray-300 mb-0 text-sm sm:text-base">
              Sessão ativa como:{" "}
              <span className="font-semibold text-black dark:text-white break-words">
                {userEmail || "Usuário desconhecido"}
              </span>
            </p>
          </div>
        </div>

        {/* Cartões de métricas */}
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl bg-gradient-to-r from-pink-400 to-orange-300 p-6 text-white shadow-lg">
            <p className="text-sm">Notificações</p>
            <p className="text-3xl font-bold">{notificationsCount}</p>
            <p className="text-xs mt-2">Total registradas</p>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white shadow-lg">
            <p className="text-sm">Pedidos de Orçamento</p>
            <p className="text-3xl font-bold">{orcamentosCount}</p>
            <p className="text-xs mt-2">Total recebidos</p>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-green-400 to-teal-500 p-6 text-white shadow-lg">
            <p className="text-sm">Newsletter</p>
            <p className="text-3xl font-bold">{newsletterCount}</p>
            <p className="text-xs mt-2">Subscrições totais</p>
          </div>
        </div>

        {/* Configuração do Modal */}
        <div className="w-full max-w-7xl">
          <ModalConfigAdmin />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

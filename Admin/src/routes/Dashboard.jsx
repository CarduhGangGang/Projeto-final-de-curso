import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/Authcontext";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../supabase-client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();

  const [notificationsCount, setNotificationsCount] = useState(0);
  const [orcamentosCount, setOrcamentosCount] = useState(0);
  const [newsletterCount, setNewsletterCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const userEmail = session?.user?.email;

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 10000); // Atualiza a cada 10 segundos

    fetchData();
    return () => clearInterval(interval);
  }, []);

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

    const { data: recentNotifs } = await supabase
      .from("notifications")
      .select("id, mensagem, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    setNotificationsCount(notifCount || 0);
    setOrcamentosCount(orcCount || 0);
    setNewsletterCount(newsCount || 0);
    setRecentNotifications(recentNotifs || []);
  };

  const chartData = [
    { name: "Notificações", valor: notificationsCount },
    { name: "Orçamentos", valor: orcamentosCount },
    { name: "Newsletter", valor: newsletterCount },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-10 px-6 py-10">
        {/* Sessão ativa como estava antes */}
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

        {/* Cartões de métrica com navegação */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Notificações", count: notificationsCount, color: "from-pink-400 to-orange-300", path: "/notificacoes" },
            { title: "Orçamentos", count: orcamentosCount, color: "from-blue-400 to-blue-600", path: "/orcamentos" },
            { title: "Newsletter", count: newsletterCount, color: "from-green-400 to-teal-500", path: "/newsletter" },
          ].map(({ title, count, color, path }) => (
            <motion.div
              key={title}
              className={`rounded-xl bg-gradient-to-r ${color} p-6 text-white shadow-lg cursor-pointer`}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(path)}
            >
              <p className="text-sm">{title}</p>
              <p className="text-3xl font-bold">{count}</p>
              <p className="text-xs mt-2">Total registrado</p>
            </motion.div>
          ))}
        </div>

        {/* Gráfico ocupando a tela toda */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
            Atividade Geral
          </h2>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#82ca9d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimas notificações */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
            Últimas Notificações
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            {recentNotifications.map((notif) => (
              <li key={notif.id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                {notif.mensagem}
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

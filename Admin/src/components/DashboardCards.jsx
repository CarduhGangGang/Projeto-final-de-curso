import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";

const DashboardCards = () => {
  const [stats, setStats] = useState({
    notificacoes: 0,
    notificacoesNaoLidas: 0,
    newsletter: 0,
    modals: 0,
    modalAtivo: null,
    orcamentos: 0,
    visitasSemanais: 0 // Simulação
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [notif, unread, nl, modalAll, modalActive, orcs] = await Promise.all([
        supabase.from("notifications").select("*"),
        supabase.from("notifications").select("*").eq("lido", false),
        supabase.from("newsletter").select("*"),
        supabase.from("modal_config").select("*"),
        supabase.from("modal_config").select("*").eq("ativo", true).single(),
        supabase.from("orcamentos").select("*")
      ]);

      setStats({
        notificacoes: notif.data?.length || 0,
        notificacoesNaoLidas: unread.data?.length || 0,
        newsletter: nl.data?.length || 0,
        modals: modalAll.data?.length || 0,
        modalAtivo: modalActive.data?.titulo || "Nenhum",
        orcamentos: orcs.data?.length || 0,
        visitasSemanais: Math.floor(Math.random() * 2000 + 1000) // Simulação
      });
    };

    fetchStats();
  }, []);

  const cardStyle = "flex-1 bg-gradient-to-r rounded-xl p-4 text-white shadow-lg";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
      <div className={`${cardStyle} from-pink-400 to-red-400`}>
        <h3 className="text-sm">Notificações</h3>
        <p className="text-2xl font-bold">{stats.notificacoes}</p>
        <p className="text-xs mt-1">{stats.notificacoesNaoLidas} não lidas</p>
      </div>

      <div className={`${cardStyle} from-blue-400 to-indigo-400`}>
        <h3 className="text-sm">Subscrições Newsletter</h3>
        <p className="text-2xl font-bold">{stats.newsletter}</p>
        <p className="text-xs mt-1">Total de subscritores</p>
      </div>

      <div className={`${cardStyle} from-green-400 to-teal-400`}>
        <h3 className="text-sm">Visitantes Semanais</h3>
        <p className="text-2xl font-bold">{stats.visitasSemanais}</p>
        <p className="text-xs mt-1">Estimado</p>
      </div>

      <div className={`${cardStyle} from-yellow-500 to-orange-500`}>
        <h3 className="text-sm">Orçamentos Feitos</h3>
        <p className="text-2xl font-bold">{stats.orcamentos}</p>
        <p className="text-xs mt-1">Total pedidos</p>
      </div>

      <div className={`${cardStyle} from-purple-500 to-fuchsia-500`}>
        <h3 className="text-sm">Modal Ativo</h3>
        <p className="text-xl font-semibold">{stats.modalAtivo}</p>
        <p className="text-xs mt-1">{stats.modals} modais no total</p>
      </div>
    </div>
  );
};

export default DashboardCards;

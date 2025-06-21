// supabase/functions/send-admin-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/std@0.168.0/dotenv/load.ts";

serve(async (req) => {
  const body = await req.json();
  const { nome, email, contacto, tiposervico, detalhes } = body;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Vai buscar o email do admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("new_email")
    .eq("username", "admin")
    .single();

  const adminEmail = profile?.new_email;
  if (!adminEmail) {
    return new Response("Email do admin não encontrado", { status: 400 });
  }

  // Envia com Resend
  const send = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "notificacoes@teusite.com", // Podes customizar
      to: adminEmail,
      subject: "📩 Novo pedido de orçamento recebido",
      html: `
        <h3>Detalhes do pedido:</h3>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contacto:</strong> ${contacto}</p>
        <p><strong>Serviço:</strong> ${tiposervico}</p>
        <p><strong>Detalhes:</strong> ${detalhes}</p>
      `,
    }),
  });

  if (!send.ok) {
    const error = await send.text();
    return new Response(`Erro ao enviar email: ${error}`, { status: 500 });
  }

  return new Response("Email enviado com sucesso!", { status: 200 });
});

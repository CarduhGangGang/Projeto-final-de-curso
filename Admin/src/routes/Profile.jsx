import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import Sidebar from "../components/Sidebar";
import avatarPlaceholder from "../assets/avatar.png";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    username: "",
    bio: "",
    avatar_url: "",
    new_email: "",
    new_password: "",
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authUpdating, setAuthUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setProfile((prev) => ({ ...prev, ...data }));
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      username: profile.username,
      bio: profile.bio,
      avatar_url: profile.avatar_url, // permanece inalterado
      updated_at: new Date(),
    });

    setSaving(false);
    if (error) toast.error("Erro ao guardar: " + error.message);
    else toast.success("Perfil atualizado!");
  };

  const handleAuthUpdate = async () => {
    if (!profile.new_email && !profile.new_password) {
      toast.error("Preencha o novo email ou nova senha.");
      return;
    }

    if (profile.new_password && profile.new_password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setAuthUpdating(true);

    const updates = {};
    if (profile.new_email) updates.email = profile.new_email;
    if (profile.new_password) updates.password = profile.new_password;

    const { error } = await supabase.auth.updateUser(updates);

    setAuthUpdating(false);

    if (error) toast.error("Erro ao atualizar: " + error.message);
    else {
      toast.success("Confirmação enviada para o novo email!");
      setProfile((prev) => ({ ...prev, new_email: "", new_password: "" }));
    }
  };

  if (loading) return <div className="p-10">A carregar...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <Toaster position="top-right" />

      <div className="flex-1 overflow-auto p-2 sm:p-6 ml-20 md:ml-0">
        <div className="bg-white p-2 sm:p-6 rounded shadow">
          {/* Avatar Fixo + Info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-gray-300">
                <img
                  src={profile.avatar_url || avatarPlaceholder}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-sm sm:text-xl font-bold text-gray-800">
                  {profile.username || "Utilizador"}
                </h2>
                <p className="text-[10px] sm:text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Dados do Perfil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <label className="block text-[10px] sm:text-sm mb-1 text-gray-600">Primeiro Nome:</label>
              <input
                type="text"
                name="first_name"
                value={profile.first_name}
                onChange={handleChange}
                className="w-full border px-2 sm:px-4 py-1 sm:py-2 rounded text-[10px] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-sm mb-1 text-gray-600">Último Nome:</label>
              <input
                type="text"
                name="last_name"
                value={profile.last_name}
                onChange={handleChange}
                className="w-full border px-2 sm:px-4 py-1 sm:py-2 rounded text-[10px] sm:text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] sm:text-sm mb-1 text-gray-600">Nome de Utilizador:</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                className="w-full border px-2 sm:px-4 py-1 sm:py-2 rounded text-[10px] sm:text-sm"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-[10px] sm:text-sm mb-1 text-gray-600">Bio:</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="3"
              className="w-full border px-2 sm:px-4 py-1 sm:py-2 rounded text-[10px] sm:text-sm"
            />
          </div>

          {/* Credenciais */}
          <div className="mb-4 sm:mb-6 border-t pt-4 sm:pt-6">
            <h2 className="text-[11px] sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">Credenciais de Acesso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label className="block text-[10px] sm:text-sm mb-1 text-gray-600">Novo Email:</label>
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  value={profile.new_email || ""}
                  onChange={(e) => setProfile({ ...profile, new_email: e.target.value })}
                  className="w-full border px-2 sm:px-4 py-1 sm:py-2 rounded text-[10px] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-sm mb-1 text-gray-600">Nova Senha:</label>
                <input
                  type="password"
                  placeholder="******"
                  value={profile.new_password || ""}
                  onChange={(e) => setProfile({ ...profile, new_password: e.target.value })}
                  className="w-full border px-2 sm:px-4 py-1 sm:py-2 rounded text-[10px] sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 sm:px-6 py-1 sm:py-2 rounded text-[10px] sm:text-sm text-black font-semibold ${
                saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "A guardar..." : "Guardar Dados do Perfil"}
            </button>

            <button
              onClick={handleAuthUpdate}
              disabled={authUpdating}
              className={`px-4 sm:px-6 py-1 sm:py-2 rounded text-[10px] sm:text-sm text-black font-semibold ${
                authUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {authUpdating ? "Atualizando..." : "Atualizar Email ou Senha"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

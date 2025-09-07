"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const supabase = createClient() 
  const { user, setUser } = useUser();
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [photo, setPhoto] = useState(user?.user_metadata?.photo || "/default-profile.png");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Debes iniciar sesión para ver tu perfil.
      </div>
    );
  }

  // Subir nueva foto
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    try {
      setLoading(true);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      if (data?.publicUrl) {
        setPhoto(data.publicUrl);

        // Actualizar perfil en auth metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { photo: data.publicUrl },
        });
        if (updateError) throw updateError;

        setUser({ ...user, user_metadata: { ...user.user_metadata, photo: data.publicUrl } });
      }
    } catch (err) {
      console.error("Error al subir la foto:", err);
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios de nombre
  const handleSave = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        data: { name },
      });
      if (error) throw error;

      setUser({ ...user, user_metadata: { ...user.user_metadata, name } });
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-br from-emerald-900/80 to-emerald-800/60 rounded-2xl shadow-xl border border-emerald-500/30 text-white mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Mi Perfil</h1>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <Image
            src={photo}
            alt="Foto de perfil"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full border-4 border-emerald-400/70 object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-yellow-400 text-black p-1 rounded-full cursor-pointer hover:bg-yellow-300 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={loading}
            />
            📷
          </label>
        </div>
        <p className="mt-2 text-sm text-emerald-300">{user.email}</p>
      </div>

      {/* Formulario */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            type="text"
            className="w-full p-2 rounded-lg bg-black/40 border border-emerald-400/50 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

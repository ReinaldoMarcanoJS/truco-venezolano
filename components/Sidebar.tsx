"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Edit3 } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { user, setUser } = useUser();
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [photo, setPhoto] = useState(user?.user_metadata?.avatar_url || "/default-profile.png");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Actualiza los inputs cuando el user cambia
  useEffect(() => {
    setName(user?.user_metadata?.name || "");
    setPhoto(user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "/default-profile.png");
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    try {
      setLoading(true);
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      if (data?.publicUrl) setPhoto(data.publicUrl);
    } catch (err) {
      console.error("Error al subir la foto:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      setLoading(true);

      let avatarUrl = photo;

      // 1️⃣ Subir foto si es nueva
      if (photo && photo !== user.user_metadata.avatar_url) {
        const file = await fetch(photo).then(r => r.blob()); // Si photo es un File directamente, no hace falta fetch
        const fileExt = "png"; // o extrae de photo.name si es File
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        if (data?.publicUrl) avatarUrl = data.publicUrl;
      }

      // 2️⃣ Actualizar auth.user
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name,
          avatar_url: avatarUrl,
        },
      });
      if (authError) throw authError;

      // 3️⃣ Actualizar tabla jugadores
      const { error: jugadorError } = await supabase
        .from("jugadores")
        .update({ nombre: name, avatar_url: avatarUrl })
        .eq("id", user.id);
      if (jugadorError) throw jugadorError;


      // 4️⃣ Actualizar contexto
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          name,
          avatar_url: avatarUrl,
        },
      });

      setEditOpen(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <motion.button
        onClick={() => setOpen(!open)}
        initial={{ x: 0 }}
        animate={{ x: open ? 260 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="fixed top-2 left-4 z-50 p-2 h-12 bg-emerald-900/80 text-white shadow-lg rounded-lg"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed top-0 left-0 w-64 h-full z-40 bg-black/70 backdrop-blur-xl border-r border-emerald-700/40 shadow-2xl"
          >
            {/* Perfil */}
            <div className="flex flex-col items-center mt-10 mb-6 relative">
              <Image
                src={photo}
                width={80}
                height={80}
                alt="Foto de perfil"
                className="w-20 h-20 rounded-full border-2 border-emerald-800 shadow-lg object-cover"
              />
              {/* Icono de editar */}
              <button
                onClick={() => setEditOpen(true)}
                className="absolute top-0 right-0 bg-yellow-400 p-1 rounded-full hover:bg-yellow-300 transition"
              >
                <Edit3 size={16} />
              </button>
              <span className="mt-3 text-lg font-bold text-yellow-400">
                {name || "Invitado"}
              </span>
            </div>

            {/* Opciones */}
            <ul className="flex flex-col mt-2">
              {["Home", "Profile", "Settings", "Logout"].map((item, i) => (
                <li key={i} className="relative group border-b border-white/10 w-full">
                  <a
                    href={`/protected/${item}`}
                    onClick={item === "Logout" ? handleLogout : undefined}
                    className={`block text-lg font-semibold px-3 py-2 rounded-lg transition
                      ${item === "Logout"
                        ? "text-red-500 hover:text-red-400"
                        : "text-emerald-300 hover:text-yellow-400"
                      } hover:bg-white/10`}
                  >
                    {item}
                  </a>
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full
                      ${item === "Logout"
                        ? "bg-gradient-to-r from-red-500 to-red-700"
                        : "bg-gradient-to-r from-emerald-400 to-yellow-400"
                      }`}
                  />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para editar perfil */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-black/90 p-6 rounded-2xl max-w-sm w-full text-white relative"
            >
              <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Image
                    src={photo}
                    width={80}
                    height={80}
                    alt="Foto de perfil"
                    className="w-20 h-20 rounded-full border-2 border-emerald-400 object-cover"
                  />
                  <label className="absolute bottom-0 right-0 bg-yellow-400 p-1 rounded-full cursor-pointer hover:bg-yellow-300 transition">
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
                <input
                  type="text"
                  className="w-full p-2 rounded-lg bg-black/40 border border-emerald-400/50 text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                />
                <div className="flex justify-between w-full mt-4">
                  <button
                    className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
                    onClick={() => setEditOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

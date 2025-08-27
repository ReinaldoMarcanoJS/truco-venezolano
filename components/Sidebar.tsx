"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import profileImage from "../public/default-profile.png"
import { useUser } from "@/context/UserContext";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const user = useUser();
  useEffect(() => {
    // Cerrar el sidebar al cambiar de usuario (login/logout)
    console.log(user?.user_metadata);

  })

  return (
    <>
      {/* Botón hamburguesa en el topmenu */}
      <motion.button
        onClick={() => setOpen(!open)}
        initial={{ x: 0 }}
        animate={{ x: open ? 260 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="fixed top-2 left-4 z-50 p-2 h-12
          bg-emerald-900/80 text-white shadow-lg rounded-lg"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </motion.button>

      {/* Sidebar modal absoluto/fijo */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed top-0 left-0 w-64 h-full z-40 
              bg-black/70 backdrop-blur-xl border-r border-emerald-700/40 shadow-2xl"
          >
            {/* Perfil del jugador */}
            <div className="flex flex-col items-center mt-10 mb-6">
              <Image
                src={profileImage}
                width={30}
                height={30}
                alt="Foto de perfil"
                className="w-20 h-20 rounded-full border-2 border-emerald-800 shadow-lg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/default-profile.png";
                }}
              />
              <span className="mt-3 text-lg font-bold text-yellow-400">
                {user?.user_metadata.name || "Invitado"}
              </span>
            </div>
            {/* Opciones */}
            <ul className="flex flex-col mt-2">
              {["Home", "Profile", "Settings", "Logout"].map((item, i) => (
                <li
                  key={i}
                  className="relative group border-b border-white/10 w-full"
                >
                  <a
                    href="#"
                    className={`block text-lg font-semibold px-3 py-2 rounded-lg transition
                      ${item === "Logout"
                        ? "text-red-500 hover:text-red-400"
                        : "text-emerald-300 hover:text-yellow-400"
                      } hover:bg-white/10`}
                  >
                    {item}
                  </a>
                  {/* Subrayado animado */}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 
                      transition-all duration-300 group-hover:w-full
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
    </>
  );
}

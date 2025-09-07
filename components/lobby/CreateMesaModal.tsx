import { Mesa } from "@/types";
import { createClient } from "../../lib/supabase/client";
import { useState, useEffect } from "react";

interface CreateMesaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  puntos: 12 | 24;
  setPuntos: (v: 12 | 24) => void;
  apuesta: string;
  setApuesta: (v: string) => void;
  loading: boolean;
  mesaId: string;
  creador_id: string;
}

export default function CreateMesaModal({
  open,
  onClose,
  onSubmit,
  puntos,
  setPuntos,
  apuesta,
  setApuesta,
  loading,
  mesaId,
  creador_id,
}: CreateMesaModalProps) {
  const supabase = createClient();

  const [mesas, setMesas] = useState<Mesa[]>([]);
  console.log(mesas);

  // Función para manejar la creación de la mesa
  const handleCreateMesa = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("mesas").insert([{ puntos, apuesta }]);
    await supabase.from("mesa_jugadores").insert([
      {
        mesa_id: mesaId,
        user_id: creador_id,
        posicion: 0,
        equipo: 1,
      },
    ]);
    onSubmit(e);
  };

  useEffect(() => {
    const fetchMesas = async () => {
      const { data: mesas } = await supabase
        .from("mesas")
        .select(`
          *,
          mesa_jugadores (
            posicion,
            equipo,
            user_id,
            jugadores (
              id,
              name,
              photo
            )
          )
        `);
      if (mesas) setMesas(mesas);
    };
    fetchMesas();
  }, [supabase]);

  // 👇 El condicional para el render va después de los hooks
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Crear Nueva Mesa</h2>
          <p className="text-emerald-100 text-sm mt-1">
            Configura los parámetros de tu mesa
          </p>
        </div>
        <form onSubmit={handleCreateMesa} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Puntos del Juego
            </label>
            <select
              value={puntos}
              onChange={(e) => setPuntos(Number(e.target.value) as 12 | 24)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            >
              <option value={12}>12 puntos (1 vs 1)</option>
              <option value={24}>24 puntos (2 vs 2)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Apuesta (Bs)
            </label>
            <select
              value={apuesta || "500"}
              onChange={(e) => setApuesta(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            >
              {[500, 800, 1000, 1500, 2000, 3000, 4000, 5000, 10000, 20000, 50000].map(
                (monto) => (
                  <option key={monto} value={monto}>
                    {monto.toLocaleString()} Bs
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando...
                </span>
              ) : (
                "Crear Mesa"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

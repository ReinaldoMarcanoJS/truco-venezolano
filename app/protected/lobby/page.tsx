"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import MyHeader from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { nanoid } from "nanoid";

type Jugador = {
  name: string;
  photo?: string;
};

type Mesa = {
  id: number;
  puntos: number;
  apuesta: number;
  jugadores?: Jugador[];
  creador_id?: string;
};

export default function ProtectedPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [puntos, setPuntos] = useState(24);
  const [apuesta, setApuesta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("mesas")
      .select("*")
      .then(({ data }) => setMesas(data || []));
  }, []);

  const handleMesaCreated = (mesa: Mesa) => {
    setMesas((prev) => [...prev, mesa]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const id = nanoid(6); // id de 6 caracteres

    const { error, data } = await supabase
      .from("mesas")
      .insert([{ id, puntos, apuesta: Number(apuesta), creador_id: user?.id }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    handleMesaCreated(data);
    setModalOpen(false);
    setPuntos(24);
    setApuesta("");
  };

  // Helper para obtener posiciones según puntos
  const getPositions = (mesa: Mesa) => {
    return mesa.puntos === 12
      ? [0, 1] // 1vs1
      : [0, 1, 2, 3]; // 2vs2
  };

  // Render de cada posición
  const renderPosition = (mesa: Mesa, idx: number) => {
    const jugador = mesa.jugadores?.[idx];
    if (jugador) {
      return (
        <div className="flex items-center gap-2 bg-black/60 border border-emerald-400 rounded-lg h-8 w-full px-2">
          <img
            src={jugador.photo || "/default-profile.png"}
            alt={jugador.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-white text-xs">{jugador.name}</span>
        </div>
      );
    }
    // Si es la primera posición y el usuario es el creador
    if (idx === 0 && mesa.creador_id === user?.id) {
      return (
        <div className="flex items-center gap-2 bg-yellow-400 border border-emerald-400 rounded-lg h-8 w-full px-2">
          <img
            src={user?.user_metadata?.photo || "/default-profile.png"}
            alt={user?.user_metadata?.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-black text-xs font-bold">{user?.user_metadata?.name || "Tú"}</span>
        </div>
      );
    }
    // Botón para unirse
    return (
      <button
        className="bg-black/60 border border-emerald-400 rounded-lg h-8 w-full flex items-center justify-center text-white hover:bg-emerald-700 transition text-xs"
        onClick={() => {/* lógica para unirse */}}
      >
        <span className="mr-2">+</span> Unirse
      </button>
    );
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm bg-naipes min-h-screen">
      <main className="max-w-2xl m-auto bg-black/70 backdrop-blur-xl border-r border-emerald-700/40 shadow-2xl min-h-svh w-full">
        <MyHeader />
        <div className="bg-black/20 backdrop-blur-sm border border-white/20 shadow-2xl w-full min-h-svh p-4">
          <h3 className="w-full text-center text-emerald-300 font-semibold text-xl rounded-t-2xl pt-1 mb-4">
            Mesas disponibles
          </h3>

          <button
            className="mb-4 px-4 py-2 bg-yellow-400 text-black font-bold rounded shadow"
            onClick={() => setModalOpen(true)}
          >
            Crear Mesa
          </button>

          {modalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm"
              >
                <h2 className="text-xl font-bold mb-4 text-emerald-700">
                  Crear Mesa
                </h2>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Puntos</label>
                  <select
                    value={puntos}
                    onChange={(e) => setPuntos(Number(e.target.value))}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value={12}>12 puntos</option>
                    <option value={24}>24 puntos</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Apuesta (dinero)</label>
                  <select
                    value={apuesta}
                    onChange={(e) => setApuesta(e.target.value)}
                    required
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Selecciona el monto</option>
                    {[500, 800, 1000, 1500, 2000, 3000, 4000, 5000, 10000, 20000, 50000].map((monto) => (
                      <option key={monto} value={monto}>
                        {monto.toLocaleString()} Bs
                      </option>
                    ))}
                  </select>
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-300"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-emerald-700 text-white font-bold"
                    disabled={loading}
                  >
                    {loading ? "Creando..." : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2 text-sm">
            {mesas.map((mesa) => (
              <div
                key={mesa.id}
                className="bg-emerald-900/80 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center h-40"
              >
                <h4 className="text-lg font-bold text-white mb-4">
                  Mesa {mesa.id}
                </h4>
                <div className={`grid grid-cols-${mesa.puntos === 12 ? "2" : "3"}  w-full max-w-xs`}>
                  {/* Equipo 1 */}
                  <div className="col-span-1 flex  items-center">
                    {/* <span className="text-emerald-300 mb-1">Equipo 1</span> */}
                    {getPositions(mesa)
                      .filter((i) => i < (mesa.puntos === 12 ? 1 : 2))
                      .map((idx) => (
                        <div key={idx} className="mb-2 w-full m-1">
                          {renderPosition(mesa, idx)}
                        </div>
                      ))}
                  </div>
                  {/* VS */}
                  <div className="flex items-center justify-center">
                    <span className="bg-gradient-to-r from-emerald-400 via-white to-emerald-400 text-black font-bold px-4 py-1 rounded-full shadow-md text-lg tracking-wide">
                      VS
                    </span>
                  </div>
                  {/* Equipo 2 */}
                  <div className="col-span-1 flex  items-center">
                    {/* <span className="text-emerald-300 mb-1">Equipo 2</span> */}
                    {getPositions(mesa)
                      .filter((i) => i >= (mesa.puntos === 12 ? 1 : 2))
                      .map((idx) => (
                        <div key={idx} className="mb-2 w-full m-1">
                          {renderPosition(mesa, idx)}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

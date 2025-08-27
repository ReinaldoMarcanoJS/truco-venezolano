"use client";
import { useState, useEffect } from "react";
import MyHeader from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { nanoid } from "nanoid";
import { mesaUtils } from "@/lib/mesa-utils";
import { Mesa } from "@/types";

export default function ProtectedPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [puntos, setPuntos] = useState<12 | 24>(24);
  const [apuesta, setApuesta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userMesa, setUserMesa] = useState<string | null>(null);
  const user = useUser();

  // Limpiar mensaje de error después de 3 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    loadMesas();
    checkUserMesa();
  }, [user?.id]);

  const loadMesas = async () => {
    const mesasData = await mesaUtils.getMesas();
    setMesas(mesasData);
  };

  const checkUserMesa = async () => {
    if (!user?.id) return;
    const mesaId = await mesaUtils.getUserMesa(user.id);
    setUserMesa(mesaId);
  };

  const handleMesaCreated = (mesa: Mesa) => {
    setMesas((prev) => [mesa, ...prev]);
    setUserMesa(mesa.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verificar que el usuario no esté ya en una mesa
    if (userMesa) {
      setError("Ya estás en una mesa. Debes salir antes de crear una nueva.");
      setLoading(false);
      return;
    }

    if (!user?.id) {
      setError("Debes estar autenticado para crear una mesa.");
      setLoading(false);
      return;
    }

    try {
      const mesaId = nanoid(6);
      const result = await mesaUtils.createMesa({
        id: mesaId,
        puntos,
        apuesta: Number(apuesta),
        creador_id: user.id
      });

      if (result.success && result.mesa) {
        handleMesaCreated(result.mesa);
        setModalOpen(false);
        setPuntos(24);
        setApuesta("");
      } else {
        setError(result.error || "Error al crear la mesa. Intenta de nuevo.");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const joinMesa = async (mesaId: string, posicion: number) => {
    if (!user?.id) return;

    try {
      const result = await mesaUtils.joinMesa(mesaId, user.id, posicion);
      if (result.success) {
        setUserMesa(mesaId);
        await loadMesas();
        await checkUserMesa();
      } else {
        setError(result.error || "Error al unirse a la mesa. Intenta de nuevo.");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const leaveMesa = async () => {
    if (!user?.id || !userMesa) {
      console.log("leaveMesa: No hay usuario o mesa:", { userId: user?.id, userMesa });
      return;
    }

    try {
      console.log("Intentando salir de la mesa:", userMesa);
      console.log("Usuario ID:", user.id);
      
      const success = await mesaUtils.leaveMesa(user.id);
      console.log("Resultado de salir:", success);
      
      if (success) {
        console.log("Salida exitosa, actualizando estado...");
        setUserMesa(null);
        await loadMesas();
        setError("Has salido de la mesa exitosamente");
        console.log("Estado actualizado correctamente");
      } else {
        console.log("Error al salir de la mesa");
        setError("Error al salir de la mesa. Intenta de nuevo.");
      }
    } catch (error: any) {
      console.error("Error en leaveMesa:", error);
      setError(error.message);
    }
  };

  // Helper para obtener posiciones según puntos
  const getPositions = (mesa: Mesa) => {
    return mesa.puntos === 12
      ? [0, 1] // 1vs1
      : [0, 1, 2, 3]; // 2vs2
  };

  // Render de cada posición
  const renderPosition = (mesa: Mesa, idx: number) => {
    const jugadorMesa = mesa.jugadores_mesas?.find((jm) => jm.posicion === idx);
    const jugador = jugadorMesa?.jugadores;

    if (jugador) {
      const isCurrentUser = jugador.id === user?.id;
      return (
        <div className={`flex items-center gap-3 p-3 border border-emerald-400/50 rounded-xl w-full transition-all duration-200 ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg' 
            : 'bg-black/40 text-white hover:bg-black/60'
        }`}>
          <img
            src={jugador.photo || "/default-profile.png"}
            alt={jugador.name}
            className="w-8 h-8 rounded-full border-2 border-emerald-400/50 flex-shrink-0"
          />
          <span className={`text-sm font-medium flex-1 truncate ${isCurrentUser ? 'font-bold' : ''}`}>
            {isCurrentUser ? 'Tú' : jugador.name}
          </span>
          {isCurrentUser && (
            <button
              onClick={() => leaveMesa()}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors duration-200 flex-shrink-0"
              title="Salir de la mesa"
            >
              <span className="text-lg">✕</span>
            </button>
          )}
        </div>
      );
    }

    // Si es la primera posición y el usuario es el creador
    if (idx === 0 && mesa.creador_id === user?.id) {
      return (
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 border border-emerald-400/50 rounded-xl w-full shadow-lg">
          <img
            src={user?.user_metadata?.photo || "/default-profile.png"}
            alt={user?.user_metadata?.name}
            className="w-8 h-8 rounded-full border-2 border-emerald-400/50 flex-shrink-0"
          />
          <span className="text-black text-sm font-bold flex-1">Tú (Creador)</span>
          <button
            onClick={() => leaveMesa()}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors duration-200 flex-shrink-0"
            title="Salir de la mesa"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>
      );
    }

    // Botón para unirse
    return (
      <button
        className="w-full p-3 bg-gradient-to-r from-emerald-600/60 to-emerald-700/60 border border-emerald-400/50 rounded-xl text-white hover:from-emerald-500/80 hover:to-emerald-600/80 hover:border-emerald-300/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        onClick={() => joinMesa(mesa.id, idx)}
        disabled={!!userMesa}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">+</span>
          <span className="font-medium">Unirse</span>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/90 via-emerald-900/20 to-black/90">
      <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MyHeader />
        
        {/* Contenedor principal */}
        <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl p-6 sm:p-8">
          
          {/* Header de la página */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              Mesas Disponibles
            </h1>
            <p className="text-emerald-300/80 text-sm sm:text-base">
              Únete a una mesa o crea una nueva para comenzar a jugar
            </p>
          </div>

          {/* Mensaje de error con auto-hide */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center animate-fade-in">
              {error}
            </div>
          )}

          {/* Estado del usuario */}
          {userMesa && (
            <div className="mb-6 p-4 bg-emerald-800/40 border border-emerald-400/50 rounded-xl backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-emerald-200 text-sm sm:text-base">
                    Estás en la mesa: <span className="font-bold text-yellow-400">{userMesa}</span>
                  </p>
                </div>
                <button
                  onClick={leaveMesa}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
                  title="Salir de la mesa actual"
                >
                  <span className="text-lg">✕</span>
                  Salir de la mesa
                </button>
              </div>
            </div>
          )}

          {/* Botón crear mesa */}
          <div className="flex justify-center mb-8">
            <button
              className={`px-6 py-3 rounded-xl shadow-lg font-bold text-sm sm:text-base transition-all duration-200 ${
                userMesa 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-60' 
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 active:scale-95'
              }`}
              onClick={() => !userMesa && setModalOpen(true)}
              disabled={!!userMesa}
            >
              {userMesa ? 'Ya estás en una mesa' : 'Crear Nueva Mesa'}
            </button>
          </div>

          {/* Modal de crear mesa */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
                  <h2 className="text-2xl font-bold">Crear Nueva Mesa</h2>
                  <p className="text-emerald-100 text-sm mt-1">Configura los parámetros de tu mesa</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Puntos del Juego</label>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Apuesta (Bs)</label>
                    <select
                      value={apuesta}
                      onChange={(e) => setApuesta(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Selecciona el monto</option>
                      {[500, 800, 1000, 1500, 2000, 3000, 4000, 5000, 10000, 20000, 50000].map((monto) => (
                        <option key={monto} value={monto}>
                          {monto.toLocaleString()} Bs
                        </option>
                      ))}
                    </select>
                  </div>
                   
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
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
                        'Crear Mesa'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Grid de mesas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {mesas.map((mesa) => (
              <div
                key={mesa.id}
                className="bg-gradient-to-br from-emerald-900/80 to-emerald-800/60 rounded-2xl shadow-xl border border-emerald-500/30 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                {/* Header de la mesa */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-200">
                    Mesa {mesa.id}
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      {mesa.puntos} pts
                    </span>
                    <span className="flex items-center gap-1 text-yellow-300">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      {mesa.apuesta.toLocaleString()} Bs
                    </span>
                  </div>
                </div>

                {/* Layout del juego */}
                <div className="space-y-4">
                  {/* Equipo 1 */}
                  <div className="space-y-2">
                    <div className="text-xs text-emerald-300 text-center mb-2">Equipo 1</div>
                    {getPositions(mesa)
                      .filter((i) => i < (mesa.puntos === 12 ? 1 : 2))
                      .map((idx) => (
                        <div key={idx} className="w-full">
                          {renderPosition(mesa, idx)}
                        </div>
                      ))}
                  </div>

                  {/* Separador VS */}
                  <div className="flex items-center justify-center">
                    <div className="bg-gradient-to-r from-emerald-400 via-white to-emerald-400 text-black font-bold px-4 py-1 rounded-full shadow-lg text-sm">
                      VS
                    </div>
                  </div>

                  {/* Equipo 2 */}
                  <div className="space-y-2">
                    <div className="text-xs text-emerald-300 text-center mb-2">Equipo 2</div>
                    {getPositions(mesa)
                      .filter((i) => i >= (mesa.puntos === 12 ? 1 : 2))
                      .map((idx) => (
                        <div key={idx} className="w-full">
                          {renderPosition(mesa, idx)}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estado vacío */}
          {mesas.length === 0 && (
            <div className="text-center py-12">
              <div className="text-emerald-400 text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-emerald-300 mb-2">No hay mesas disponibles</h3>
              <p className="text-emerald-300/70">Sé el primero en crear una mesa y comenzar a jugar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

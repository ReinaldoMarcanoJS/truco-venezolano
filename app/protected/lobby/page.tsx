"use client";
import { useState, useEffect, useCallback } from "react";
import MyHeader from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { nanoid } from "nanoid";
import { mesaUtils } from "@/lib/mesa-utils";
import { Mesa } from "@/types";
import ErrorAlert from "@/components/lobby/ErrorAlert";
import MesaCard from "@/components/lobby/MesaCard";
import CreateMesaModal from "@/components/lobby/CreateMesaModal";
import UserMesaStatus from "@/components/lobby/UserMesaStatus";

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

  const loadMesas = useCallback(async () => {
    const mesasData = await mesaUtils.getMesas();
    setMesas(mesasData);
  }, []);

  const checkUserMesa = useCallback(async () => {
    if (!user?.user?.id) return;
    const mesaId = await mesaUtils.getUserMesa(user.user.id);
    setUserMesa(mesaId);
  }, [user?.user?.id]);

  // Cargar mesas y verificar mesa del usuario
  useEffect(() => {
    loadMesas();
    checkUserMesa();
  }, [loadMesas, checkUserMesa]);

  const handleMesaCreated = (mesa: Mesa) => {
    setMesas((prev) => [mesa, ...prev]);
    setUserMesa(mesa.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (userMesa) {
      setError("Ya estás en una mesa. Debes salir antes de crear una nueva.");
      setLoading(false);
      return;
    }

    if (!user?.user?.id) {
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
        creador_id: user?.user?.id,
      });

      if (result.success && result.mesa) {
        handleMesaCreated(result.mesa);
        setModalOpen(false);
        setPuntos(24);
        setApuesta("");
      } else {
        setError(result.error || "Error al crear la mesa. Intenta de nuevo.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const joinMesa = async (mesaId: string, posicion: number) => {
    if (!user?.user?.id) return;

    try {
      const result = await mesaUtils.joinMesa(mesaId, user.user.id, posicion);
      if (result.success) {
        setUserMesa(mesaId);
        await loadMesas();
        await checkUserMesa();
      } else {
        setError(result.error || "Error al unirse a la mesa. Intenta de nuevo.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
    }
  };

  const leaveMesa = async () => {
    if (!user?.user?.id || !userMesa) return;
    try {
      const success = await mesaUtils.leaveMesa(user.user.id);
      if (success) {
        setUserMesa(null);
        await loadMesas();
        setError("Has salido de la mesa exitosamente");
      } else {
        setError("Error al salir de la mesa. Intenta de nuevo.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/90 via-emerald-900/20 to-black/90">
      <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MyHeader />

        <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              Mesas Disponibles
            </h1>
            <p className="text-emerald-300/80 text-sm sm:text-base">
              Únete a una mesa o crea una nueva para comenzar a jugar
            </p>
          </div>

          {error && <ErrorAlert message={error} />}

          {userMesa && (
            <UserMesaStatus userMesa={userMesa} leaveMesa={leaveMesa} />
          )}

          <div className="flex justify-center mb-8">
            <button
              className={`px-6 py-3 rounded-xl shadow-lg font-bold text-sm sm:text-base transition-all duration-200 ${userMesa
                ? "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 active:scale-95"
                }`}
              onClick={() => !userMesa && setModalOpen(true)}
              disabled={!!userMesa}
            >
              {userMesa ? "Ya estás en una mesa" : "Crear Nueva Mesa"}
            </button>
          </div>

          <CreateMesaModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmit}
            puntos={puntos}
            setPuntos={setPuntos}
            apuesta={apuesta}
            setApuesta={setApuesta}
            loading={loading}
            mesaId={nanoid(6)}
            creador_id={user?.user?.id || ""}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {mesas.map((mesa) => (
              <MesaCard
                key={mesa.id}
                mesa={mesa}
                userMesa={userMesa}
                joinMesa={joinMesa}
                leaveMesa={leaveMesa}
              />
            ))}
          </div>

          {mesas.length === 0 && (
            <div className="text-center py-12">
              <div className="text-emerald-400 text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-emerald-300 mb-2">
                No hay mesas disponibles
              </h3>
              <p className="text-emerald-300/70">
                Sé el primero en crear una mesa y comenzar a jugar
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

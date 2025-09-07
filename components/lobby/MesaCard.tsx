import Image from "next/image";
import { Mesa } from "@/types";
import { useUser } from "@/context/UserContext";


interface MesaCardProps {
    mesa: Mesa;
    userMesa: string | null;
    joinMesa: (mesaId: string, posicion: number) => void;
    leaveMesa: () => void;
}

export default function MesaCard({ mesa, userMesa, joinMesa, leaveMesa }: MesaCardProps) {
    const user = useUser();
    // Helper para obtener posiciones según puntos
    const getPositions = (mesa: Mesa) => {
        return mesa.puntos === 12 ? [0, 1] : [0, 1, 2, 3];
    };

    // Render de cada posición
    const renderPosition = (mesa: Mesa, idx: number) => {
        const jugadorMesa = mesa.mesa_jugadores?.find((jm) => jm.posicion === idx);
        const jugador = jugadorMesa?.jugadores;
        const isCurrentUser = jugador?.id === user?.user?.id;

        if (jugador) {
            return (
                <div
                    className={`flex items-center gap-3 p-3 border border-emerald-400/50 rounded-xl w-full transition-all duration-200 ${isCurrentUser
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg"
                        : "bg-black/40 text-white hover:bg-black/60"
                        }`}
                >
                    <Image
                        width={32}
                        height={32}
                        src={jugador.photo || "/default-profile.png"}
                        alt={jugador.nombre}
                        className="w-8 h-8 rounded-full border-2 border-emerald-400/50 flex-shrink-0"
                    />
                    <span
                        className={`text-sm font-medium flex-1 truncate ${isCurrentUser ? "font-bold" : ""
                            }`}
                    >
                        {isCurrentUser ? "Tú" : jugador.nombre}
                    </span>
                    {isCurrentUser && (
                        <button
                            onClick={leaveMesa}
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
        if (idx === 0 && mesa.creador_id === user?.user?.id) {
            return (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 border border-emerald-400/50 rounded-xl w-full shadow-lg">
                    <Image
                        width={32}
                        height={32}
                        src={user?.user?.user_metadata?.photo || "/default-profile.png"}
                        alt={user?.user?.user_metadata?.name || "Usuario"}
                        className="w-8 h-8 rounded-full border-2 border-emerald-400/50 flex-shrink-0"
                    />
                    <span className="text-black text-sm font-bold flex-1">
                        {user?.user?.user_metadata.name}
                    </span>
                    <button
                        onClick={leaveMesa}
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
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                        +
                    </span>
                    <span className="font-medium">Unirse</span>
                </div>
            </button>
        );
    };

    return (
        <div className="bg-gradient-to-br from-emerald-900/80 to-emerald-800/60 rounded-2xl shadow-xl border border-emerald-500/30 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
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
                    <div className="text-xs text-emerald-300 text-center mb-2">
                        Equipo 1
                    </div>
                    {getPositions(mesa)
                        .filter((i) => i < (mesa.puntos === 12 ? 1 : 2))
                        .map((idx) => {
                            const jugadorMesa = mesa.mesa_jugadores?.find((jm) => jm.posicion === idx);
                            const jugador = jugadorMesa?.jugadores;
                            const isCurrentUser = jugador?.id === user?.user?.id;

                            return (
                                <div key={idx} className="w-full">
                                    {jugador ? (
                                        <div
                                            className={`flex items-center gap-3 p-3 border rounded-xl w-full transition-all duration-200 ${isCurrentUser
                                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg border-yellow-400"
                                                : "bg-black/40 text-white hover:bg-black/60 border-emerald-400/50"
                                                }`}
                                        >
                                            <Image
                                                width={32}
                                                height={32}
                                                src={jugador.photo || "/default-profile.png"}
                                                alt={jugador.nombre}
                                                className="w-8 h-8 rounded-full border-2 border-emerald-400/50 flex-shrink-0"
                                            />
                                            <span
                                                className={`text-sm font-medium flex-1 truncate ${isCurrentUser ? "font-bold" : ""
                                                    }`}
                                            >
                                                {isCurrentUser ? "Tú" : jugador.nombre}
                                            </span>

                                            {/* Botón de salir si soy yo */}
                                            {isCurrentUser && (
                                                <button
                                                    onClick={leaveMesa}
                                                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors duration-200 flex-shrink-0"
                                                    title="Salir de la mesa"
                                                >
                                                    <span className="text-lg">✕</span>
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        renderPosition(mesa, idx) // botón de unirse si no hay jugador
                                    )}
                                </div>
                            );
                        })}
                </div>

                {/* Separador VS */}
                <div className="flex items-center justify-center">
                    <div className="bg-gradient-to-r from-emerald-400 via-white to-emerald-400 text-black font-bold px-4 py-1 rounded-full shadow-lg text-sm">
                        VS
                    </div>
                </div>

                {/* Equipo 2 */}
                <div className="space-y-2">
                    <div className="text-xs text-emerald-300 text-center mb-2">
                        Equipo 2
                    </div>
                    {getPositions(mesa)
                        .filter((i) => i >= (mesa.puntos === 12 ? 1 : 2))
                        .map((idx) => {
                            const jugadorMesa = mesa.mesa_jugadores?.find((jm) => jm.posicion === idx);
                            const jugador = jugadorMesa?.jugadores;
                            const isCurrentUser = jugador?.id === user?.user?.id;

                            return (
                                <div key={idx} className="w-full">
                                    {jugador ? (
                                        <div
                                            className={`flex items-center gap-3 p-3 border rounded-xl w-full transition-all duration-200 ${isCurrentUser
                                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg border-yellow-400"
                                                : "bg-black/40 text-white hover:bg-black/60 border-emerald-400/50"
                                                }`}
                                        >
                                            <Image
                                                width={32}
                                                height={32}
                                                src={jugador.photo || "/default-profile.png"}
                                                alt={jugador.nombre}
                                                className="w-8 h-8 rounded-full border-2 border-emerald-400/50 flex-shrink-0"
                                            />
                                            <span
                                                className={`text-sm font-medium flex-1 truncate ${isCurrentUser ? "font-bold" : ""
                                                    }`}
                                            >
                                                {isCurrentUser ? "Tú" : jugador.nombre}
                                            </span>

                                            {/* Botón de salir si soy yo */}
                                            {isCurrentUser && (
                                                <button
                                                    onClick={leaveMesa}
                                                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors duration-200 flex-shrink-0"
                                                    title="Salir de la mesa"
                                                >
                                                    <span className="text-lg">✕</span>
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        renderPosition(mesa, idx)
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}   

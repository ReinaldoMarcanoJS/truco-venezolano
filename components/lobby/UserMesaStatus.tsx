interface UserMesaStatusProps {
  userMesa: string;
  leaveMesa: () => void;
}

export default function UserMesaStatus({ userMesa, leaveMesa }: UserMesaStatusProps) {
  return (
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
  );
}
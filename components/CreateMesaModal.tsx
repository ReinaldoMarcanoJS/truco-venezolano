"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Mesa = {
  id: number;
  puntos: number;
  apuesta: number;
};

export default function MesasPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [puntos, setPuntos] = useState(24);
  const [apuesta, setApuesta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const { error, data } = await supabase
      .from("mesas")
      .insert([{ puntos, apuesta: Number(apuesta) }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    handleMesaCreated(data); // Actualiza la lista local
    setModalOpen(false);
    setPuntos(24);
    setApuesta("");
  };

  return (
    <div className="p-4">
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
              <input
                type="number"
                min={0}
                step={1}
                required
                value={apuesta}
                onChange={(e) => setApuesta(e.target.value)}
                className="w-full border rounded px-2 py-1"
                placeholder="Monto de la apuesta"
              />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 text-sm">
        {mesas.map((mesa) => (
          <div
            key={mesa.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col"
          >
            <span className="text-lg font-semibold text-emerald-700">
              Mesa #{mesa.id}
            </span>
            <span className="text-gray-700">
              Puntos:{" "}
              <span className="font-medium">{mesa.puntos}</span>
            </span>
            <span className="text-gray-700">
              Apuesta:{" "}
              <span className="font-medium">${mesa.apuesta}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
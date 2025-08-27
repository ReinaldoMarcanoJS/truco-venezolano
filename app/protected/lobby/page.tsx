import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import MyHeader from "@/components/Header";
export default async function ProtectedPage() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    return (
        <div className=" bg-black/20 backdrop-blur-sm bg-naipes ">
            <main className="bg-black/70 backdrop-blur-xl border-r border-emerald-700/40 shadow-2xl min-h-svh w-full md:p-10  ">
                <MyHeader />
                <div className="bg-black/20 backdrop-blur-sm border border-white/20 shadow-2xl  w-full max-w-md h-full">
                    <h3 className="w-full text-center text-emerald-300 font-semibold text-xl rounded-t-2xl pt-1 ">
                        Mesas disponibles
                    </h3>
                    <div className="grid grid-cols-1 gap-6 p-2 text-sm">
                        {[1, 2, 3].map((mesaId) => (
                            <div
                                key={mesaId}
                                className="bg-emerald-900/80 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center h-40"
                            >
                                <h4 className="text-lg font-bold text-white mb-4">Mesa {mesaId}</h4>
                                <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                                    {/* Equipo 1 */}
                                    <div className="col-span-1 row-span-1 flex flex-col items-center">
                                        <span className="text-emerald-300 mb-1">Equipo 1</span>
                                        <button
                                            className="bg-black/60 border border-emerald-400 rounded-lg h-8 w-full flex items-center justify-center text-white hover:bg-emerald-700 transition mb-2"
                                        >
                                            Posición 1
                                        </button>
                                        <button
                                            className="bg-black/60 border border-emerald-400 rounded-lg h-8 w-full flex items-center justify-center text-white hover:bg-emerald-700 transition"
                                        >
                                            Posición 2
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="bg-gradient-to-r from-emerald-400 via-white to-emerald-400 text-black font-bold px-4 py-1 rounded-full shadow-md text-lg tracking-wide">
                                            VS
                                        </span>
                                    </div>
                                    {/* Equipo 2 */}
                                    <div className="col-span-1 row-span-1 flex flex-col items-center">
                                        <span className="text-emerald-300 mb-1">Equipo 2</span>
                                        <button
                                            className="bg-black/60 border border-emerald-400 rounded-lg h-8 w-full flex items-center justify-center text-white hover:bg-emerald-700 transition mb-2"
                                        >
                                            Posición 3
                                        </button>
                                        <button
                                            className="bg-black/60 border border-emerald-400 rounded-lg h-8 w-full flex items-center justify-center text-white hover:bg-emerald-700 transition"
                                        >
                                            Posición 4
                                        </button>
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

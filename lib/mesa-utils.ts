import { createClient } from "@/lib/supabase/client";
import { Mesa, Jugador } from "@/types";

export const mesaUtils = {
  // Obtener todas las mesas con sus jugadores
  async getMesas(): Promise<Mesa[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("mesas")
      .select("*");

    if (error) {
      console.error('Error fetching mesas:', error.message);
      return [];
    }

    return data || [];
  },

  // Crear una nueva mesa
  async createMesa(mesaData: {
    id: string;
    puntos: 12 | 24;
    apuesta: number;
    creador_id: string;
  }): Promise<{ success: boolean; mesa?: Mesa; error?: string }> {
    const supabase = createClient();
    
    try {
      // Verificar si el creador ya está en otra mesa
      const currentMesa = await this.getUserMesa(mesaData.creador_id);
      if (currentMesa) {
        return { success: false, error: "Ya estás en otra mesa. Debes salir antes de crear una nueva." };
      }

      // Crear la mesa
      const { error: mesaError, data: mesa } = await supabase
        .from("mesas")
        .insert([{
          ...mesaData,
          estado: 'esperando'
        }])
        .select()
        .single();

      if (mesaError) throw mesaError;

      // Agregar el creador a la mesa
      const { error: jugadorError } = await supabase
        .from("jugadores_mesas")
        .insert([{
          mesa_id: mesaData.id,
          jugador_id: mesaData.creador_id,
          posicion: 0
        }]);

      if (jugadorError) {
        // Si falla al agregar el jugador, eliminar la mesa creada
        await supabase.from("mesas").delete().eq("id", mesaData.id);
        throw jugadorError;
      }

      return { success: true, mesa };
    } catch (error: unknown) {
      console.error('Error creating mesa:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, error: errorMessage };
    }
  },

  // Unirse a una mesa
  async joinMesa(mesaId: string, jugadorId: string, posicion: number): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    
    try {
      // Verificar si el jugador ya está en otra mesa
      const currentMesa = await this.getUserMesa(jugadorId);
      if (currentMesa && currentMesa !== mesaId) {
        // Salir de la mesa actual primero
        await this.leaveMesa(jugadorId);
      }

      // Verificar si la posición está ocupada
      const { data: posicionOcupada } = await supabase
        .from("jugadores_mesas")
        .select("jugador_id")
        .eq("mesa_id", mesaId)
        .eq("posicion", posicion)
        .single();

      if (posicionOcupada) {
        return { success: false, error: "Esta posición ya está ocupada" };
      }

      // Unirse a la nueva mesa
      const { error } = await supabase
        .from("jugadores_mesas")
        .insert([{
          mesa_id: mesaId,
          jugador_id: jugadorId,
          posicion: posicion
        }]);

      if (error) {
        if (error.code === '23505') { // Código de error de restricción única
          return { success: false, error: "Ya estás en otra mesa" };
        }
        throw error;
      }
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Error joining mesa:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, error: errorMessage };
    }
  },

  // Salir de una mesa
  async leaveMesa(jugadorId: string): Promise<boolean> {
    const supabase = createClient();
    
    try {
      console.log("leaveMesa: Iniciando proceso para jugador:", jugadorId);
      
      // Obtener la mesa del jugador antes de salir
      const { data: jugadorMesa, error: fetchError } = await supabase
        .from("jugadores_mesas")
        .select("mesa_id")
        .eq("jugador_id", jugadorId)
        .single();

      if (fetchError) {
        console.log("leaveMesa: No se encontró mesa para el jugador:", fetchError.message);
        return true; // Ya no está en ninguna mesa
      }

      if (!jugadorMesa) {
        console.log("leaveMesa: No hay mesa para el jugador");
        return true;
      }

      const mesaId = jugadorMesa.mesa_id;
      console.log("leaveMesa: Jugador está en mesa:", mesaId);

      // Salir de la mesa
      const { error: leaveError } = await supabase
        .from("jugadores_mesas")
        .delete()
        .eq("jugador_id", jugadorId);

      if (leaveError) {
        console.error("leaveMesa: Error al salir:", leaveError);
        throw leaveError;
      }

      console.log("leaveMesa: Jugador salió exitosamente de la mesa");

      // Verificar si la mesa quedó vacía
      const { data: jugadoresRestantes, error: checkError } = await supabase
        .from("jugadores_mesas")
        .select("id")
        .eq("mesa_id", mesaId);

      if (checkError) {
        console.error("leaveMesa: Error al verificar jugadores restantes:", checkError);
        return true; // Ya salimos, no es crítico
      }

      // Si no quedan jugadores, eliminar la mesa
      if (!jugadoresRestantes || jugadoresRestantes.length === 0) {
        console.log("leaveMesa: Mesa quedó vacía, eliminándola");
        const { error: deleteError } = await supabase
          .from("mesas")
          .delete()
          .eq("id", mesaId);
        
        if (deleteError) {
          console.error("leaveMesa: Error al eliminar mesa vacía:", deleteError);
        } else {
          console.log("leaveMesa: Mesa eliminada exitosamente");
        }
      }

      return true;
    } catch (error) {
      console.error('Error leaving mesa:', error);
      return false;
    }
  },

  // Verificar si un jugador está en una mesa
  async getUserMesa(jugadorId: string): Promise<string | null> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from("jugadores_mesas")
        .select("mesa_id")
        .eq("jugador_id", jugadorId)
        .single();

      if (error) return null;
      return data?.mesa_id || null;
    } catch (error) {
      console.error('Error checking user mesa:', error);
      return null;
    }
  },

  // Obtener jugadores de una mesa
  async getMesaJugadores(mesaId: string): Promise<Jugador[]> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from("jugadores_mesas")
        .select(`
          posicion,
          jugadores (
            id,
            name,
            photo
          )
        `)
        .eq("mesa_id", mesaId)
        .order('posicion');

      if (error) throw error;
      
      return data?.map((item: { jugadores: { id: string; name: string; photo?: string }[]; posicion: number }) => ({
        id: item.jugadores[0]?.id || '',
        name: item.jugadores[0]?.name || '',
        photo: item.jugadores[0]?.photo,
        posicion: item.posicion
      })) || [];
    } catch (error) {
      console.error('Error fetching mesa jugadores:', error);
      return [];
    }
  },

  // Verificar si una mesa está llena
  async isMesaFull(mesaId: string): Promise<boolean> {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from("jugadores_mesas")
        .select("id")
        .eq("mesa_id", mesaId);

      if (error) throw error;
      
      // Obtener la mesa para saber cuántos puntos tiene
      const { data: mesa } = await supabase
        .from("mesas")
        .select("puntos")
        .eq("id", mesaId)
        .single();

      const maxJugadores = mesa?.puntos === 12 ? 2 : 4;
      return (data?.length || 0) >= maxJugadores;
    } catch (error) {
      console.error('Error checking if mesa is full:', error);
      return false;
    }
  },

  // Eliminar una mesa (solo el creador)
  async deleteMesa(mesaId: string, creadorId: string): Promise<boolean> {
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from("mesas")
        .delete()
        .eq("id", mesaId)
        .eq("creador_id", creadorId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting mesa:', error);
      return false;
    }
  }
};

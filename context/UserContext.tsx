"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const UserContext = createContext<import('@supabase/supabase-js').User | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user|| null);
    });
    // Opcional: suscribirse a cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
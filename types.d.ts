export type SupabaseUser = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string;
  phone: string;
  is_anonymous: boolean;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  identities: any[]; // Puedes tipar mejor si lo necesitas
  user_metadata: {
    email: string;
    email_verified: boolean;
    name?: string;
    phone_verified?: boolean;
    sub?: string;
    [key: string]: any;
  };
};

export type Jugador = {
  id: string;
  name: string;
  photo?: string;
  mesa_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type Mesa = {
  id: string;
  puntos: 12 | 24;
  apuesta: number;
  creador_id?: string;
  estado: 'esperando' | 'jugando' | 'terminada';
  created_at?: string;
  updated_at?: string;
  jugadores?: Jugador[];
  jugadores_mesas?: JugadorMesa[];
};

export type JugadorMesa = {
  id: number;
  mesa_id: string;
  jugador_id: string;
  posicion: number;
  created_at?: string;
  jugadores?: Jugador;
};

export type UserContextType = {
  user: SupabaseUser | null;
  loading: boolean;
};
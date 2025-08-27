-- Crear tabla de mesas
CREATE TABLE IF NOT EXISTS mesas (
  id TEXT PRIMARY KEY,
  puntos INTEGER NOT NULL CHECK (puntos IN (12, 24)),
  apuesta INTEGER NOT NULL,
  creador_id UUID REFERENCES auth.users(id),
  estado TEXT DEFAULT 'esperando' CHECK (estado IN ('esperando', 'jugando', 'terminada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de relación jugadores-mesas
CREATE TABLE IF NOT EXISTS jugadores_mesas (
  id SERIAL PRIMARY KEY,
  mesa_id TEXT REFERENCES mesas(id) ON DELETE CASCADE,
  jugador_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  posicion INTEGER NOT NULL CHECK (posicion >= 0 AND posicion <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mesa_id, jugador_id), -- Un jugador solo puede estar en una mesa
  UNIQUE(mesa_id, posicion), -- Una posición solo puede ser ocupada por un jugador
  UNIQUE(jugador_id) -- Un jugador solo puede estar en UNA mesa a la vez (a nivel global)
);

-- Crear tabla de jugadores (perfil extendido)
CREATE TABLE IF NOT EXISTS jugadores (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores_mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;

-- Políticas para mesas
CREATE POLICY "Mesas visibles para todos los usuarios autenticados" ON mesas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios pueden crear mesas" ON mesas
  FOR INSERT WITH CHECK (auth.uid() = creador_id);

CREATE POLICY "Creador puede actualizar su mesa" ON mesas
  FOR UPDATE USING (auth.uid() = creador_id);

-- Políticas para jugadores_mesas
CREATE POLICY "Jugadores pueden ver todas las relaciones" ON jugadores_mesas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios pueden unirse a mesas" ON jugadores_mesas
  FOR INSERT WITH CHECK (auth.uid() = jugador_id);

CREATE POLICY "Usuarios pueden salir de mesas" ON jugadores_mesas
  FOR DELETE USING (auth.uid() = jugador_id);

-- Políticas para jugadores
CREATE POLICY "Jugadores visibles para todos los usuarios autenticados" ON jugadores
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios pueden actualizar su perfil" ON jugadores
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden insertar su perfil" ON jugadores
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_mesas_updated_at BEFORE UPDATE ON mesas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jugadores_updated_at BEFORE UPDATE ON jugadores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para sincronizar datos del usuario cuando se registra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO jugadores (id, name, photo)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'photo'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para sincronizar datos del usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_jugadores_mesas_jugador_id ON jugadores_mesas(jugador_id);
CREATE INDEX IF NOT EXISTS idx_jugadores_mesas_mesa_id ON jugadores_mesas(mesa_id);
CREATE INDEX IF NOT EXISTS idx_mesas_estado ON mesas(estado);
CREATE INDEX IF NOT EXISTS idx_mesas_creador_id ON mesas(creador_id);

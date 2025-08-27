# Configuración de la Base de Datos - Truco Venezolano

## Pasos para configurar la base de datos

### 1. Acceder a Supabase
- Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
- Navega a la sección **SQL Editor**

### 2. Ejecutar el script de configuración
- Copia todo el contenido del archivo `database-setup.sql`
- Pégalo en el SQL Editor de Supabase
- Haz clic en **RUN** para ejecutar el script

### 3. Verificar las tablas creadas
Después de ejecutar el script, deberías ver estas tablas en **Table Editor**:

#### Tabla `mesas`
- `id`: Identificador único de la mesa (TEXT)
- `puntos`: Puntos del juego (12 o 24)
- `apuesta`: Cantidad de dinero apostada
- `creador_id`: ID del usuario que creó la mesa
- `estado`: Estado de la mesa (esperando, jugando, terminada)
- `created_at` y `updated_at`: Timestamps automáticos

#### Tabla `jugadores_mesas`
- `id`: ID único de la relación
- `mesa_id`: ID de la mesa
- `jugador_id`: ID del jugador
- `posicion`: Posición del jugador en la mesa (0-3)
- `created_at`: Timestamp de cuando se unió

#### Tabla `jugadores`
- `id`: ID del usuario (referencia a auth.users)
- `name`: Nombre del jugador
- `photo`: URL de la foto de perfil
- `created_at` y `updated_at`: Timestamps automáticos

### 4. Políticas de seguridad (RLS)
El script también configura:
- **Row Level Security** habilitado en todas las tablas
- **Políticas** que permiten a los usuarios autenticados:
  - Ver todas las mesas
  - Crear mesas
  - Unirse/salir de mesas
  - Ver perfiles de otros jugadores

### 5. Funciones automáticas
- **Triggers** para actualizar `updated_at` automáticamente
- **Sincronización automática** de datos del usuario cuando se registra

## Estructura de datos

```
auth.users (tabla de Supabase)
    ↓
jugadores (perfil extendido)
    ↓
jugadores_mesas (relación muchos a muchos)
    ↓
mesas (mesas de juego)
```

## Restricciones importantes

1. **Un jugador solo puede estar en UNA mesa a la vez**
   - Implementado con `UNIQUE(mesa_id, jugador_id)`

2. **Una posición solo puede ser ocupada por un jugador**
   - Implementado con `UNIQUE(mesa_id, posicion)`

3. **Los puntos solo pueden ser 12 o 24**
   - Implementado con `CHECK (puntos IN (12, 24))`

4. **El estado solo puede ser esperando, jugando o terminada**
   - Implementado con `CHECK (estado IN ('esperando', 'jugando', 'terminada'))`

## Solución de problemas

### Error: "relation does not exist"
- Asegúrate de ejecutar el script completo en el SQL Editor
- Verifica que estés en el proyecto correcto de Supabase

### Error: "permission denied"
- Verifica que las políticas RLS estén creadas correctamente
- Asegúrate de que el usuario esté autenticado

### Error: "duplicate key value violates unique constraint"
- Esto significa que un jugador ya está en una mesa
- La aplicación debería manejar esto automáticamente

## Próximos pasos

Después de configurar la base de datos:
1. La aplicación debería funcionar correctamente
2. Los usuarios podrán crear y unirse a mesas
3. Solo podrán estar en una mesa a la vez
4. Se saldrán automáticamente de mesas anteriores al unirse a nuevas

# AgendaGol Frontend

Aplicación frontend de AgendaGol construida con Next.js (App Router), TypeScript y Tailwind CSS.

## Instrucciones de instalación

### 1) Requisitos previos
- Node.js 20+
- npm 10+

### 2) Clonar e instalar dependencias
```bash
git clone https://github.com/DevFajardo/agendaGolFrontend.git
cd agendaGolFrontend
npm install
```

### 3) Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con este contenido base:

```env
NEXT_PUBLIC_BASE_URL_AUTH=http://localhost:8000
NEXT_PUBLIC_BASE_URL_FIELDS=http://localhost:8002
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:8000/admin
NEXT_PUBLIC_FIELDS_API_URL=http://localhost:8002/fields
NEXT_PUBLIC_RESERVATIONS_API_URL=http://localhost:8002/reservations
```

Notas:
- `NEXT_PUBLIC_RESERVATIONS_API_URL` puede omitirse si `NEXT_PUBLIC_BASE_URL_FIELDS` está definida (el frontend usa fallback a `/reservations`).
- Ajusta puertos/hosts según tu backend local.

## Modo demo (sin backend)

Si la API no está disponible, el frontend ahora entra en modo mock automáticamente y usa datos falsos para demo.

También puedes forzarlo con:

```env
NEXT_PUBLIC_USE_MOCK=true
```

Credenciales demo por defecto:

- Admin: `admin@gmail.com` / `123456`
- Usuario: `user@gmail.com` / `123456`

Datos demo incluidos:

- Canchas falsas precargadas
- Reservas falsas precargadas
- Estadísticas admin calculadas en frontend

## Comandos para ejecutar el proyecto

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar build de producción
npm run start

# Lint
npm run lint
```

La app de desarrollo queda disponible en:
- http://localhost:3000

## Decisiones técnicas tomadas

- **Next.js App Router**: se usa estructura por rutas en `app/` para separar claramente módulos de auth, admin y usuario.
- **TypeScript en todo el flujo**: se tiparon servicios, hooks y estados para reducir errores en runtime y mejorar mantenibilidad.
- **Arquitectura por capas**:
  - `services/` para llamadas HTTP y normalización de respuestas.
  - `hooks/` para lógica reutilizable de estado, side effects y acciones de dominio.
  - `components/` para UI compartida y componentes de presentación.
- **Gestión de sesión con Zustand + persistencia**: `useAuthStore` centraliza usuario/token y simplifica acceso global al estado de autenticación.
- **Validación de formularios con React Hook Form + Zod**: validación declarativa y consistente para login/registro.
- **Feedback de UI desacoplado**: hooks como `useStatusFeedback` y `useTimedStatusFeedback` unifican mensajes de éxito/error y reducen duplicación.
- **Control de acceso por rutas**: se protege navegación según autenticación/rol mediante `proxy.ts` y layouts de dashboard.
- **Refactor progresivo sin romper funcionalidad**: se priorizó extraer componentes y hooks reutilizables manteniendo comportamiento existente.

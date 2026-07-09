# SportClub SPA

## Descripción
SportClub SPA es una aplicación web desarrollada con React y Vite para la gestión de clases deportivas, reservas, usuarios y módulos administrativos. Incluye autenticación por roles, dashboards diferenciados para administrador, coach y usuario, CRUD de usuarios, salas, asignaciones y horarios, además de reservas de clases.

## Integrante
- Erik Lopez

## Tecnologías utilizadas
- React 19
- Vite
- React Router DOM
- Bootstrap
- React-Bootstrap
- SweetAlert2

## Requisitos
- Node.js 18 o superior
- npm

## Instalación
1. Instalar dependencias del frontend:
   ```bash
   npm install
   ```

2. Instalar dependencias del backend (si se ejecuta localmente):
   ```bash
   cd backend-sportclub
   npm install
   ```

## Ejecución del frontend
1. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
2. Abrir la app en `http://localhost:5173`

## Ejecución del backend
1. Desde la carpeta `backend-sportclub`, iniciar el backend:
   ```bash
   cd backend-sportclub
   npm run dev
   ```
2. El backend queda disponible en `http://localhost:3000` por defecto.
3. Asegurar que el frontend tenga la siguiente variable en el archivo `.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

## Funcionalidades principales
- Login funcional con autenticación por rol.
- Registro de usuarios.
- Rutas protegidas y autorización por rol.
- Dashboards diferenciados para administrador, coach y usuario.
- Gestión administrativa de usuarios, deportes, salas, asignaciones y horarios.
- Visualización de clases disponibles para reserva.
- Gestión de reservas activas y cancelación por el usuario.
- Validaciones de formularios y mensajes de confirmación con SweetAlert2.

## Estructura del proyecto
- `src/components`
- `src/layouts`
- `src/pages`
- `src/routes`
- `src/services`
- `src/App.jsx`
- `src/main.jsx`
- `backend-sportclub` (backend local)

## Usuarios DEMO
- Administrador: `admin@demo.cl` / `12345678`
- Coach: `coach1@demo.cl` / `12345678`
- Usuario: `user1@demo.cl` / `12345678`

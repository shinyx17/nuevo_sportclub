# SportClub SPA

## Descripción
Proyecto SPA SportClub desarrollado con React, React Router, Bootstrap y React-Bootstrap. Incluye autenticación, autorización por roles, dashboards diferenciados y un módulo administrativo CRUD de usuarios.

## Integrante
- Erik Lopez

## Tecnologías utilizadas
- React 19
- Vite
- React Router DOM
- Bootstrap
- React-Bootstrap
- SweetAlert2

## Instalación
1. Instalar dependencias:
   ```bash
   npm install
   ```

## Ejecución del frontend
1. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
2. Abrir en el navegador en `http://localhost:5173`

## Ejecución del backend
- El proyecto está configurado para usar el backend público:
  - `https://backend-1-eevt.onrender.com`
- La URL del backend se configura desde el archivo `.env` con `VITE_API_URL`.
- Si desea ejecutar un backend local, actualice `VITE_API_URL` en `.env` o en `src/services/*` según corresponda.

## Funcionalidades principales
- Login funcional con backend y fallback offline.
- Registro funcional con backend y modo offline.
- Validación básica de formularios.
- Persistencia de sesión con `localStorage`.
- Cierre de sesión funcional.
- Rutas protegidas y autorización por rol.
- Dashboards diferenciados para usuario, coach y admin.
- Módulo administrativo de usuarios con CRUD y modales React-Bootstrap.
- Confirmaciones y mensajes con SweetAlert2.

## Estructura del proyecto
- `src/components`
- `src/layouts`
- `src/pages`
- `src/routes`
- `src/services`
- `src/App.jsx`
- `src/main.jsx`

## Usuarios DEMO
- Administrador	admin@demo.cl	123456
- Coach	coach@demo.cl	123456
- Usuario	user@demo.cl	123456
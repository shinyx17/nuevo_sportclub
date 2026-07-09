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
- El proyecto debe usar el backend local ubicado en la carpeta `Backend`.
- Iniciar el backend local desde la carpeta `Backend`:
  ```bash
  cd Backend
  npm install
  npm run dev
  ```
- El backend local corre por defecto en `http://localhost:3000`.
- Configure la URL del backend en el archivo `.env` de la aplicación frontend:
  ```env
  VITE_API_URL=http://localhost:3000
  ```
- No use el backend público, el proyecto está pensado para ejecutarse con el backend local.
- Si despliegas solo el frontend en GitHub Pages, el backend debe estar desplegado en una URL pública distinta y esa URL debe ser la que se ponga en `VITE_API_URL` antes de compilar.

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
- Administrador	admin@demo.cl	12345678
- Coach	coach@demo.cl	12345678
- Usuario	user@demo.cl	12345678
# TutorMatch — Guía del Repositorio

## Estructura de carpetas

```
tutormatch/
│
├── backend/                    # API REST (Node.js + Express)
│   ├── data/
│   │   └── db.js               # Base de datos en memoria (seed data)
│   ├── middleware/
│   │   └── auth.js             # JWT: verificarToken, soloRol
│   ├── routes/
│   │   ├── auth.routes.js      # POST /registro, POST /login
│   │   ├── tutores.routes.js   # GET /tutores, GET /tutores/:id
│   │   └── reservas.routes.js  # GET/POST /reservas, PUT /reservas/:id/estado
│   ├── server.js               # Punto de entrada, middlewares, rutas
│   └── package.json
│
├── frontend/                   # Cliente web (HTML + CSS + JS puro)
│   └── index.html              # App completa responsive (SPA sin framework)
│
├── prototipos/                 # Wireframes / mockups HTML
│   ├── tutormatch-admin.html   # Panel de administración
│   └── tutormatch-mobile.html  # Vista tipo móvil
│
├── docs/                       # Documentación del proyecto
│   ├── vision-general.md       # Entrega 1: Visión
│   └── backlog.md              # Entrega 2: Historias de usuario
│
├── .gitignore
└── README.md
```

---

## Convención de commits (Conventional Commits)

Formato:
```
<tipo>(<alcance>): <descripción corta en imperativo>
```

### Tipos permitidos

| Tipo       | Cuándo usarlo |
|------------|---------------|
| `feat`     | Nueva funcionalidad |
| `fix`      | Corrección de bug |
| `docs`     | Solo documentación |
| `style`    | Formato, espacios (sin cambio de lógica) |
| `refactor` | Refactor sin nueva feature ni fix |
| `test`     | Agregar o corregir tests |
| `chore`    | Tareas de mantenimiento (deps, config) |

### Alcances sugeridos

`auth` · `tutores` · `reservas` · `frontend` · `db` · `middleware` · `config`

---

## Historial de commits bien organizado 

```
git log --oneline

a4f2d91 feat(auth): agregar endpoint POST /registro con hash bcrypt
3c81e02 feat(auth): agregar endpoint POST /login con generación de JWT
7b90c14 feat(tutores): listar tutores con filtros por materia y disponibilidad
d21a983 feat(reservas): crear reserva con cálculo de precio y comisión
0f6c447 feat(reservas): cambiar estado de reserva (cancelar / completar)
e84b112 feat(frontend): pantalla de login y registro con modo demo
9a3d701 feat(frontend): sección búsqueda de tutores con filtro y buscador
c5f2890 feat(frontend): sección mis reservas con estados y filtros
b22a601 feat(frontend): modal de reserva con resumen de precio dinámico
f18e034 fix(auth): corregir extracción del token del header Authorization
2d9c441 feat(frontend): layout responsive: sidebar + bottom nav mobile
8c7e003 refactor(db): mover datos seed a archivo separado data/db.js
6b51a00 docs: agregar README con estructura de carpetas y guía de commits
5f0e928 chore: agregar .gitignore para node_modules y variables de entorno
1a2b3c4 feat(middleware): crear verificarToken y soloRol para rutas protegidas
```

---

## .gitignore recomendado

```
# Dependencias
node_modules/
npm-debug.log*

# Variables de entorno (¡nunca subir al repo!)
.env
.env.local

# Archivos del sistema
.DS_Store
Thumbs.db

# Editores
.vscode/
.idea/

# Logs
*.log
logs/
```

---

## Cómo ejecutar el proyecto

### Backend
```bash
cd backend
npm install
node server.js
# API disponible en http://localhost:3000
```

### Frontend (con backend)
El backend ya sirve el frontend automáticamente.
Abre http://localhost:3000 en tu navegador.

### Frontend (sin backend / solo demo)
Abre directamente `frontend/index.html` en el navegador.
El modo demo funciona sin conexión al servidor.

---

## Endpoints de la API

| Método | Endpoint                        | Auth | Descripción              |
|--------|---------------------------------|------|--------------------------|
| POST   | /api/auth/registro              | No   | Crear cuenta             |
| POST   | /api/auth/login                 | No   | Login → devuelve JWT     |
| GET    | /api/tutores                    | Sí   | Listar tutores           |
| GET    | /api/tutores/:id                | Sí   | Detalle de tutor         |
| GET    | /api/reservas                   | Sí   | Mis reservas             |
| POST   | /api/reservas                   | Sí   | Crear reserva            |
| PUT    | /api/reservas/:id/estado        | Sí   | Cambiar estado           |

**Auth header:** `Authorization: Bearer <token>`

---

## Credenciales de demo

| Usuario          | Email                  | Contraseña |
|------------------|------------------------|------------|
| Carlos Mendoza   | carlos@uni.edu         | 123456     |
| Sofía López      | sofia@uni.edu          | 123456     |
| Admin General    | admin@tutormatch.pe    | admin123   |

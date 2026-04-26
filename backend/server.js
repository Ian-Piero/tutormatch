/**
 * server.js — Punto de entrada principal del backend TutorMatch
 * 
 * Para ejecutar:
 *   npm install
 *   node server.js          (producción)
 *   npm run dev             (desarrollo con nodemon)
 * 
 * La API queda disponible en http://localhost:3000
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes    = require('./routes/auth.routes');
const tutoresRoutes = require('./routes/tutores.routes');
const reservasRoutes = require('./routes/reservas.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ──────────────────────────────────────────────────

// Permite peticiones desde el frontend (cualquier origen en desarrollo)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Servir archivos estáticos del frontend desde la carpeta /frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── Rutas de la API ───────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/tutores', tutoresRoutes);
app.use('/api/reservas', reservasRoutes);

// ── Ruta raíz: estado de la API ───────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    ok: true,
    nombre: 'TutorMatch API',
    version: '1.0.0',
    endpoints: {
      auth:    ['POST /api/auth/registro', 'POST /api/auth/login'],
      tutores: ['GET /api/tutores', 'GET /api/tutores/:id'],
      reservas:['GET /api/reservas', 'POST /api/reservas', 'PUT /api/reservas/:id/estado']
    }
  });
});

// ── Servir el frontend para cualquier otra ruta (SPA fallback) ────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── Manejo global de errores ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err.message);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
});

// ── Iniciar servidor ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 TutorMatch API corriendo en http://localhost:${PORT}`);
  console.log(`📋 Documentación de endpoints: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend:                   http://localhost:${PORT}\n`);
});

/**
 * tutor-panel.routes.js — Rutas exclusivas del panel de tutor
 *
 * GET  /api/tutor/solicitudes          → Ver reservas pendientes del tutor
 * GET  /api/tutor/historial            → Historial completo de sesiones
 * PUT  /api/tutor/reservas/:id/estado  → Aceptar o rechazar una solicitud
 * GET  /api/tutor/perfil               → Ver su propio perfil
 * PUT  /api/tutor/perfil               → Editar bio, materias, precio, disponibilidad
 * PUT  /api/tutor/disponibilidad       → Activar o desactivar disponibilidad rápido
 * GET  /api/tutor/stats                → Estadísticas del tutor (ingresos, sesiones, rating)
 */

const express  = require('express');
const router   = express.Router();
const { tutores, reservas } = require('../data/db');
const { verificarToken, soloRol } = require('../middleware/auth');

// Todas las rutas requieren estar autenticado Y ser tutor
router.use(verificarToken);
router.use(soloRol('tutor'));

// ── Helpers ──────────────────────────────────────────────────────────────

// Enriquece una reserva con el nombre del tutor (para consistencia)
function enriquecerReserva(r) {
  const tutor = tutores.find(t => t.id === r.tutorId);
  return {
    ...r,
    tutorNombre: tutor ? tutor.nombre : 'Desconocido'
  };
}

// ── GET /api/tutor/solicitudes ────────────────────────────────────────────
// Reservas en estado "pendiente" que el tutor aún no ha respondido
router.get('/solicitudes', (req, res) => {
  const solicitudes = reservas
    .filter(r => r.tutorId === req.usuario.id && r.estado === 'pendiente')
    .map(enriquecerReserva)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // más próximas primero

  res.json({ ok: true, total: solicitudes.length, solicitudes });
});

// ── GET /api/tutor/historial ──────────────────────────────────────────────
// Todas las reservas del tutor (cualquier estado), con filtro opcional
router.get('/historial', (req, res) => {
  const { estado } = req.query;

  let historial = reservas.filter(r => r.tutorId === req.usuario.id);

  if (estado && estado !== 'todas') {
    historial = historial.filter(r => r.estado === estado);
  }

  historial = historial
    .map(enriquecerReserva)
    .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));

  res.json({ ok: true, total: historial.length, historial });
});

// ── PUT /api/tutor/reservas/:id/estado ───────────────────────────────────
// El tutor acepta (confirmada) o rechaza (cancelada) una solicitud pendiente
router.put('/reservas/:id/estado', (req, res) => {
  const { estado } = req.body;
  const estadosPermitidos = ['confirmada', 'cancelada', 'completada'];

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({
      ok: false,
      mensaje: `Estado invalido. Usa: ${estadosPermitidos.join(', ')}`
    });
  }

  const reserva = reservas.find(r => r.id === req.params.id);

  if (!reserva) {
    return res.status(404).json({ ok: false, mensaje: 'Reserva no encontrada.' });
  }

  // Verificar que la reserva pertenece a este tutor
  if (reserva.tutorId !== req.usuario.id) {
    return res.status(403).json({ ok: false, mensaje: 'No tienes permiso sobre esta reserva.' });
  }

  // Solo se pueden cambiar reservas pendientes (o confirmar completada)
  if (reserva.estado !== 'pendiente' && reserva.estado !== 'confirmada') {
    return res.status(400).json({
      ok: false,
      mensaje: `No puedes cambiar una reserva en estado "${reserva.estado}".`
    });
  }

  reserva.estado        = estado;
  reserva.actualizadoEn = new Date().toISOString();

  const mensajes = {
    confirmada: 'Solicitud aceptada. El estudiante sera notificado.',
    cancelada:  'Solicitud rechazada.',
    completada: 'Sesion marcada como completada.'
  };

  res.json({ ok: true, mensaje: mensajes[estado], reserva });
});

// ── GET /api/tutor/perfil ─────────────────────────────────────────────────
router.get('/perfil', (req, res) => {
  const perfil = tutores.find(t => t.id === req.usuario.id);

  if (!perfil) {
    return res.status(404).json({ ok: false, mensaje: 'Perfil de tutor no encontrado.' });
  }

  res.json({ ok: true, perfil });
});

// ── PUT /api/tutor/perfil ─────────────────────────────────────────────────
// El tutor actualiza su bio, materias, precio y horarios
router.put('/perfil', (req, res) => {
  const { bio, materias, precioPorHora, horariosDisponibles } = req.body;

  const perfil = tutores.find(t => t.id === req.usuario.id);

  if (!perfil) {
    return res.status(404).json({ ok: false, mensaje: 'Perfil de tutor no encontrado.' });
  }

  // Validaciones
  if (precioPorHora !== undefined && (isNaN(precioPorHora) || precioPorHora < 1)) {
    return res.status(400).json({ ok: false, mensaje: 'El precio por hora debe ser un numero positivo.' });
  }

  if (materias !== undefined && (!Array.isArray(materias) || materias.length === 0)) {
    return res.status(400).json({ ok: false, mensaje: 'Debes incluir al menos una materia.' });
  }

  // Actualizar solo los campos que se enviaron
  if (bio               !== undefined) perfil.bio                = bio.trim();
  if (materias          !== undefined) perfil.materias           = materias;
  if (precioPorHora     !== undefined) perfil.precioPorHora      = Number(precioPorHora);
  if (horariosDisponibles !== undefined) perfil.horariosDisponibles = horariosDisponibles;

  res.json({ ok: true, mensaje: 'Perfil actualizado correctamente.', perfil });
});

// ── PUT /api/tutor/disponibilidad ─────────────────────────────────────────
// Toggle rápido de disponibilidad (activo / inactivo)
router.put('/disponibilidad', (req, res) => {
  const { disponible } = req.body;

  if (typeof disponible !== 'boolean') {
    return res.status(400).json({ ok: false, mensaje: '"disponible" debe ser true o false.' });
  }

  const perfil = tutores.find(t => t.id === req.usuario.id);

  if (!perfil) {
    return res.status(404).json({ ok: false, mensaje: 'Perfil no encontrado.' });
  }

  perfil.disponible = disponible;

  res.json({
    ok: true,
    mensaje: disponible ? 'Ahora apareces como disponible.' : 'Ahora apareces como no disponible.',
    disponible: perfil.disponible
  });
});

// ── GET /api/tutor/stats ──────────────────────────────────────────────────
// Estadisticas del tutor: sesiones por estado, ingresos, rating
router.get('/stats', (req, res) => {
  const misReservas = reservas.filter(r => r.tutorId === req.usuario.id);

  const completadas = misReservas.filter(r => r.estado === 'completada');
  const pendientes  = misReservas.filter(r => r.estado === 'pendiente');
  const confirmadas = misReservas.filter(r => r.estado === 'confirmada');
  const canceladas  = misReservas.filter(r => r.estado === 'cancelada');

  const ingresoTotal = completadas.reduce((sum, r) => sum + r.precioTotal, 0);

  const perfil = tutores.find(t => t.id === req.usuario.id);

  res.json({
    ok: true,
    stats: {
      totalSesiones:  misReservas.length,
      completadas:    completadas.length,
      pendientes:     pendientes.length,
      confirmadas:    confirmadas.length,
      canceladas:     canceladas.length,
      ingresoTotal:   parseFloat(ingresoTotal.toFixed(2)),
      rating:         perfil ? perfil.rating : null,
      totalResenas:   perfil ? perfil.totalResenas : 0
    }
  });
});

module.exports = router;

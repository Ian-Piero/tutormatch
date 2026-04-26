/**
 * reservas.routes.js — Rutas de reservas
 * GET  /api/reservas          → Ver mis reservas (del usuario autenticado)
 * POST /api/reservas          → Crear nueva reserva
 * PUT  /api/reservas/:id/estado → Cambiar estado (cancelar, confirmar, completar)
 */

const express  = require('express');
const router   = express.Router();
const { reservas, tutores, uuidv4 } = require('../data/db');
const { verificarToken }            = require('../middleware/auth');

// Todas las rutas de reservas requieren estar autenticado
router.use(verificarToken);

// ── GET /api/reservas ────────────────────────────────────────────────────
// Devuelve las reservas del usuario autenticado, enriquecidas con datos del tutor
router.get('/', (req, res) => {
  const { estado } = req.query;

  // El usuario solo ve SUS reservas (req.usuario viene del JWT)
  let misReservas = reservas.filter(r => r.estudianteId === req.usuario.id);

  // Filtrar por estado si se especifica: ?estado=pendiente
  if (estado) {
    misReservas = misReservas.filter(r => r.estado === estado);
  }

  // Enriquecer cada reserva con datos del tutor
  const resultado = misReservas.map(r => {
    const tutor = tutores.find(t => t.id === r.tutorId);
    return {
      ...r,
      tutor: tutor
        ? { id: tutor.id, nombre: tutor.nombre, precioPorHora: tutor.precioPorHora }
        : null
    };
  });

  // Ordenar por fecha más reciente primero
  resultado.sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));

  res.json({ ok: true, total: resultado.length, reservas: resultado });
});

// ── POST /api/reservas ───────────────────────────────────────────────────
router.post('/', (req, res) => {
  const { tutorId, materia, fecha, hora, duracionMinutos, nota } = req.body;

  // Validaciones
  if (!tutorId || !materia || !fecha || !hora || !duracionMinutos) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos: tutorId, materia, fecha, hora, duracionMinutos.'
    });
  }

  // Verificar que el tutor exista
  const tutor = tutores.find(t => t.id === tutorId);
  if (!tutor) {
    return res.status(404).json({ ok: false, mensaje: 'Tutor no encontrado.' });
  }

  // Verificar disponibilidad simple (sin solapamiento de horarios en este MVP)
  if (!tutor.disponible) {
    return res.status(409).json({ ok: false, mensaje: 'El tutor no está disponible en este momento.' });
  }

  // Calcular precio: (duracion / 60) * precioPorHora + 10% comisión
  const horas = duracionMinutos / 60;
  const subtotal = horas * tutor.precioPorHora;
  const comision = subtotal * 0.10;
  const precioTotal = parseFloat((subtotal + comision).toFixed(2));

  const nuevaReserva = {
    id: uuidv4(),
    estudianteId: req.usuario.id,
    tutorId,
    materia,
    fecha,
    hora,
    duracionMinutos: Number(duracionMinutos),
    nota: nota || '',
    estado: 'pendiente',
    precioTotal,
    creadoEn: new Date().toISOString()
  };

  reservas.push(nuevaReserva);

  res.status(201).json({
    ok: true,
    mensaje: 'Reserva creada exitosamente.',
    reserva: {
      ...nuevaReserva,
      tutor: { id: tutor.id, nombre: tutor.nombre }
    }
  });
});

// ── PUT /api/reservas/:id/estado ─────────────────────────────────────────
// Estados válidos: pendiente → confirmada → completada | cancelada
router.put('/:id/estado', (req, res) => {
  const { estado } = req.body;
  const estadosValidos = ['pendiente', 'confirmada', 'completada', 'cancelada'];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({
      ok: false,
      mensaje: `Estado inválido. Usa uno de: ${estadosValidos.join(', ')}`
    });
  }

  const reserva = reservas.find(r => r.id === req.params.id);

  if (!reserva) {
    return res.status(404).json({ ok: false, mensaje: 'Reserva no encontrada.' });
  }

  // El estudiante solo puede modificar SUS reservas
  if (reserva.estudianteId !== req.usuario.id && req.usuario.rol !== 'admin') {
    return res.status(403).json({ ok: false, mensaje: 'No tienes permiso para modificar esta reserva.' });
  }

  reserva.estado = estado;
  reserva.actualizadoEn = new Date().toISOString();

  res.json({ ok: true, mensaje: `Reserva actualizada a "${estado}".`, reserva });
});

module.exports = router;

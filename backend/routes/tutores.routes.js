/**
 * tutores.routes.js — Rutas de tutores
 * GET  /api/tutores          → Listar tutores (con filtros opcionales)
 * GET  /api/tutores/:id      → Obtener un tutor por ID
 */

const express  = require('express');
const router   = express.Router();
const { tutores } = require('../data/db');
const { verificarToken } = require('../middleware/auth');

// ── GET /api/tutores ─────────────────────────────────────────────────────
// Parámetros opcionales: ?materia=Python  ?disponible=true  ?q=rafael
router.get('/', verificarToken, (req, res) => {
  const { materia, disponible, q } = req.query;

  let resultado = [...tutores];

  // Filtrar por materia (busca dentro del array de materias)
  if (materia) {
    const m = materia.toLowerCase();
    resultado = resultado.filter(t =>
      t.materias.some(mat => mat.toLowerCase().includes(m))
    );
  }

  // Filtrar por disponibilidad
  if (disponible !== undefined) {
    const disp = disponible === 'true';
    resultado = resultado.filter(t => t.disponible === disp);
  }

  // Búsqueda por nombre o materia (texto libre)
  if (q) {
    const query = q.toLowerCase();
    resultado = resultado.filter(t =>
      t.nombre.toLowerCase().includes(query) ||
      t.materias.some(m => m.toLowerCase().includes(query)) ||
      t.bio.toLowerCase().includes(query)
    );
  }

  // Ordenar por rating descendente
  resultado.sort((a, b) => b.rating - a.rating);

  res.json({ ok: true, total: resultado.length, tutores: resultado });
});

// ── GET /api/tutores/:id ─────────────────────────────────────────────────
router.get('/:id', verificarToken, (req, res) => {
  const tutor = tutores.find(t => t.id === req.params.id);
  if (!tutor) {
    return res.status(404).json({ ok: false, mensaje: 'Tutor no encontrado.' });
  }
  res.json({ ok: true, tutor });
});

module.exports = router;

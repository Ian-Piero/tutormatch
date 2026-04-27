/**
 * auth.routes.js — Rutas de autenticación
 * POST /api/auth/registro  → Crear cuenta
 * POST /api/auth/login     → Iniciar sesión, obtener JWT
 */

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { usuarios, uuidv4 } = require('../data/db');
const { JWT_SECRET }       = require('../middleware/auth');

// ── POST /api/auth/registro ──────────────────────────────────────────────
router.post('/registro', async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  // Validaciones básicas
  if (!nombre || !email || !password) {
    return res.status(400).json({ ok: false, mensaje: 'Nombre, email y password son obligatorios.' });
  }

  // Verificar que el email no exista
  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(409).json({ ok: false, mensaje: 'Ya existe una cuenta con ese email.' });
  }

  // Hashear contraseña
  const hash = await bcrypt.hash(password, 10);

  const nuevo = {
    id: uuidv4(),
    nombre,
    email,
    password: hash,
    rol: rol || 'estudiante',   // por defecto es estudiante
    creadoEn: new Date().toISOString()
  };

  usuarios.push(nuevo);

  // No devolver la contraseña
  const { password: _, ...datos } = nuevo;
  res.status(201).json({ ok: true, mensaje: 'Cuenta creada correctamente.', usuario: datos });
});

// ── POST /api/auth/login ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, mensaje: 'Email y password son obligatorios.' });
  }

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
  }

  const passwordValido = await bcrypt.compare(password, usuario.password);
  if (!passwordValido) {
    return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
  }

  // Generar token JWT válido por 24 horas
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password: _, ...datos } = usuario;
  res.json({ ok: true, token, usuario: datos });
});

module.exports = router;

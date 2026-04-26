/**
 * db.js — Base de datos simulada en memoria (reemplaza a una BD real)
 * 
 * En producción, esto se reemplazaría con PostgreSQL o MongoDB.
 * Para el MVP usamos arreglos en memoria que se reinician al reiniciar el servidor.
 */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// ─── Usuarios (estudiantes, tutores, admins) ───────────────────────────────
const usuarios = [
  {
    id: 'u1',
    nombre: 'Carlos Mendoza',
    email: 'carlos@uni.edu',
    password: bcrypt.hashSync('123456', 10),   // contraseña hasheada
    rol: 'estudiante',
    creadoEn: '2025-03-12T10:00:00Z'
  },
  {
    id: 'u2',
    nombre: 'Sofía López',
    email: 'sofia@uni.edu',
    password: bcrypt.hashSync('123456', 10),
    rol: 'estudiante',
    creadoEn: '2025-04-05T09:00:00Z'
  },
  {
    id: 'u3',
    nombre: 'Admin General',
    email: 'admin@tutormatch.pe',
    password: bcrypt.hashSync('admin123', 10),
    rol: 'admin',
    creadoEn: '2025-01-01T00:00:00Z'
  }
];

// ─── Tutores ───────────────────────────────────────────────────────────────
const tutores = [
  {
    id: 't1',
    nombre: 'Rafael Gómez',
    email: 'rafael@tutores.pe',
    materias: ['Cálculo Diferencial', 'Álgebra Lineal', 'Estadística'],
    bio: 'Ingeniero matemático con 5 años de experiencia en tutorías universitarias.',
    precioPorHora: 40,
    rating: 4.9,
    totalResenas: 142,
    disponible: true,
    imagen: null
  },
  {
    id: 't2',
    nombre: 'María López',
    email: 'maria@tutores.pe',
    materias: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
    bio: 'Data Scientist con experiencia en enseñanza de programación para ciencias.',
    precioPorHora: 35,
    rating: 4.8,
    totalResenas: 98,
    disponible: true,
    imagen: null
  },
  {
    id: 't3',
    nombre: 'Juan Pérez',
    email: 'juan@tutores.pe',
    materias: ['Física General', 'Termodinámica', 'Mecánica Clásica'],
    bio: 'Físico teórico especializado en preparación para exámenes de ingreso.',
    precioPorHora: 30,
    rating: 4.7,
    totalResenas: 77,
    disponible: false,
    imagen: null
  },
  {
    id: 't4',
    nombre: 'Karen Ríos',
    email: 'karen@tutores.pe',
    materias: ['Inglés B2', 'Conversación', 'IELTS', 'Redacción'],
    bio: 'Certificada Cambridge CELTA. Enfoque en Speaking y Writing para exámenes.',
    precioPorHora: 28,
    rating: 4.9,
    totalResenas: 201,
    disponible: true,
    imagen: null
  }
];

// ─── Reservas ──────────────────────────────────────────────────────────────
const reservas = [
  {
    id: 'r1',
    estudianteId: 'u1',
    tutorId: 't1',
    materia: 'Cálculo Diferencial',
    fecha: '2025-04-26',
    hora: '10:00',
    duracionMinutos: 60,
    nota: 'Repasar integrales por partes',
    estado: 'completada',  // pendiente | confirmada | completada | cancelada
    precioTotal: 44,
    creadoEn: '2025-04-20T12:00:00Z'
  },
  {
    id: 'r2',
    estudianteId: 'u1',
    tutorId: 't2',
    materia: 'Python para Data',
    fecha: '2025-04-28',
    hora: '10:00',
    duracionMinutos: 90,
    nota: 'Quiero aprender Pandas desde cero',
    estado: 'confirmada',
    precioTotal: 52.5,
    creadoEn: '2025-04-25T08:00:00Z'
  }
];

module.exports = { usuarios, tutores, reservas, uuidv4 };

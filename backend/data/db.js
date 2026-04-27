/**
 * db.js — Base de datos simulada en memoria
 * Actualizada: tutores tienen usuario vinculado + reservas enriquecidas
 */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const usuarios = [
  { id:'u1', nombre:'Carlos Mendoza', email:'carlos@uni.edu',     password: bcrypt.hashSync('123456',10),   rol:'estudiante', creadoEn:'2025-03-12T10:00:00Z' },
  { id:'u2', nombre:'Sofia Lopez',    email:'sofia@uni.edu',      password: bcrypt.hashSync('123456',10),   rol:'estudiante', creadoEn:'2025-04-05T09:00:00Z' },
  { id:'t1', nombre:'Rafael Gomez',   email:'rafael@tutores.pe',  password: bcrypt.hashSync('tutor123',10), rol:'tutor',      creadoEn:'2025-01-20T08:00:00Z' },
  { id:'t2', nombre:'Maria Lopez',    email:'maria@tutores.pe',   password: bcrypt.hashSync('tutor123',10), rol:'tutor',      creadoEn:'2025-02-01T08:00:00Z' },
  { id:'t3', nombre:'Juan Perez',     email:'juan@tutores.pe',    password: bcrypt.hashSync('tutor123',10), rol:'tutor',      creadoEn:'2025-01-15T08:00:00Z' },
  { id:'t4', nombre:'Karen Rios',     email:'karen@tutores.pe',   password: bcrypt.hashSync('tutor123',10), rol:'tutor',      creadoEn:'2025-01-10T08:00:00Z' },
  { id:'u3', nombre:'Admin General',  email:'admin@tutormatch.pe',password: bcrypt.hashSync('admin123',10), rol:'admin',      creadoEn:'2025-01-01T00:00:00Z' }
];

const tutores = [
  { id:'t1', nombre:'Rafael Gomez',  email:'rafael@tutores.pe', materias:['Calculo Diferencial','Algebra Lineal','Estadistica'],      bio:'Ingeniero matematico con 5 anos de experiencia en tutorias universitarias.', precioPorHora:40, rating:4.9, totalResenas:142, disponible:true,  horariosDisponibles:['Lunes 8-12','Miercoles 14-18','Viernes 8-12'] },
  { id:'t2', nombre:'Maria Lopez',   email:'maria@tutores.pe',  materias:['Python','Machine Learning','SQL','Pandas'],                bio:'Data Scientist con experiencia en ensenanza de programacion para ciencias.',   precioPorHora:35, rating:4.8, totalResenas:98,  disponible:true,  horariosDisponibles:['Martes 10-14','Jueves 16-20','Sabado 9-13'] },
  { id:'t3', nombre:'Juan Perez',    email:'juan@tutores.pe',   materias:['Fisica General','Termodinamica','Mecanica Clasica'],       bio:'Fisico teorico especializado en preparacion para examenes de ingreso.',        precioPorHora:30, rating:4.7, totalResenas:77,  disponible:false, horariosDisponibles:['Lunes 16-20','Miercoles 8-12'] },
  { id:'t4', nombre:'Karen Rios',    email:'karen@tutores.pe',  materias:['Ingles B2','Conversacion','IELTS','Redaccion'],           bio:'Certificada Cambridge CELTA. Enfoque en Speaking y Writing para examenes.',   precioPorHora:28, rating:4.9, totalResenas:201, disponible:true,  horariosDisponibles:['Lunes a Viernes 7-9','Sabado 10-14'] }
];

const reservas = [
  { id:'r1', estudianteId:'u1', estudianteNombre:'Carlos Mendoza', tutorId:'t1', materia:'Calculo Diferencial', fecha:'2025-04-20', hora:'10:00', duracionMinutos:60,  nota:'Repasar integrales por partes',           estado:'completada', precioTotal:44,   creadoEn:'2025-04-18T12:00:00Z' },
  { id:'r2', estudianteId:'u1', estudianteNombre:'Carlos Mendoza', tutorId:'t2', materia:'Python para Data',    fecha:'2025-04-28', hora:'10:00', duracionMinutos:90,  nota:'Quiero aprender Pandas desde cero',        estado:'confirmada', precioTotal:52.5, creadoEn:'2025-04-25T08:00:00Z' },
  { id:'r3', estudianteId:'u2', estudianteNombre:'Sofia Lopez',    tutorId:'t1', materia:'Algebra Lineal',      fecha:'2025-04-27', hora:'15:00', duracionMinutos:60,  nota:'Necesito entender transformaciones lineales',estado:'pendiente',  precioTotal:44,   creadoEn:'2025-04-26T10:00:00Z' },
  { id:'r4', estudianteId:'u1', estudianteNombre:'Carlos Mendoza', tutorId:'t1', materia:'Estadistica',         fecha:'2025-04-29', hora:'09:00', duracionMinutos:90,  nota:'Distribuciones de probabilidad',           estado:'pendiente',  precioTotal:66,   creadoEn:'2025-04-26T11:00:00Z' },
  { id:'r5', estudianteId:'u2', estudianteNombre:'Sofia Lopez',    tutorId:'t4', materia:'Ingles B2',           fecha:'2025-04-25', hora:'07:00', duracionMinutos:60,  nota:'Preparacion IELTS',                        estado:'completada', precioTotal:30.8, creadoEn:'2025-04-22T09:00:00Z' }
];

module.exports = { usuarios, tutores, reservas, uuidv4 };

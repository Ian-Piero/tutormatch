/**
 * auth.js — Middleware de autenticación con JWT
 * 
 * Verifica que la petición tenga un token válido en el header Authorization.
 * Uso: router.get('/ruta-protegida', verificarToken, (req, res) => { ... })
 */

const jwt = require('jsonwebtoken');

// En producción, guardar en variable de entorno (.env)
const JWT_SECRET = process.env.JWT_SECRET || 'tutormatch_secret_2025';

/**
 * Middleware que verifica el token JWT del header Authorization.
 * Si es válido, adjunta los datos del usuario en req.usuario.
 */
function verificarToken(req, res, next) {
  // El header debe verse así: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Acceso denegado: no se proporcionó un token.'
    });
  }

  const token = authHeader.split(' ')[1]; // Extraer "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Formato de token inválido. Usa: Bearer <token>'
    });
  }

  try {
    // jwt.verify lanza error si el token es inválido o expiró
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload; // { id, email, rol, iat, exp }
    next(); // Continuar al siguiente middleware/handler
  } catch (err) {
    return res.status(403).json({
      ok: false,
      mensaje: 'Token inválido o expirado. Inicia sesión nuevamente.'
    });
  }
}

/**
 * Middleware de autorización por rol.
 * Uso: soloAdmin = soloRol('admin')
 *      router.get('/admin', verificarToken, soloRol('admin'), handler)
 */
function soloRol(rol) {
  return (req, res, next) => {
    if (req.usuario.rol !== rol) {
      return res.status(403).json({
        ok: false,
        mensaje: `Acceso denegado: se requiere rol "${rol}".`
      });
    }
    next();
  };
}

module.exports = { verificarToken, soloRol, JWT_SECRET };

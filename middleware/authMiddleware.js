// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'claveultrasecreta123'; // Usá la misma clave que en route.usuarios.js

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // El token debe enviarse como: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o malformado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded; // Guardamos los datos del usuario en req para usarlos después
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};


import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'claveultrasecreta123';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 HEADER RECIBIDO:", authHeader); 

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("⛔ Token malformado o faltante");
    return res.status(401).json({ error: 'Token no proporcionado o malformado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    console.log("✅ Token válido:", decoded); 
    next();
  } catch (error) {
    console.error('JWT error:', error.message);
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

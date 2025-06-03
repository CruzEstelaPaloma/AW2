import { Router } from 'express';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verificarToken } from '../middleware/authMiddleware.js'; // Ajustá el path según tu estructura

const router = Router();
const archivoUsuarios = './data/usuarios.json';
const archivoVentas = './data/ventas.json';

const SECRET_KEY = 'claveultrasecreta123'; // 🔐 En producción usá variable de entorno

const leerUsuarios = async () => {
  const data = await fs.readFile(archivoUsuarios, 'utf-8');
  return JSON.parse(data);
};

const guardarUsuarios = async (usuarios) => {
  await fs.writeFile(archivoUsuarios, JSON.stringify(usuarios, null, 2));
};

const leerVentas = async () => {
  const data = await fs.readFile(archivoVentas, 'utf-8');
  return JSON.parse(data);
};

// LISTA TODOS LOS USUARIOS (PROTEGIDO)
router.get('/', verificarToken, async (_, res) => {
  try {
    const usuarios = await leerUsuarios();
    res.json(usuarios);
  } catch {
    res.status(500).json({ error: 'Error al leer los datos.' });
  }
});

// LISTA USUARIO POR ID (PROTEGIDO)
router.get('/:id', verificarToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const usuarios = await leerUsuarios();
  const usuario = usuarios.find(u => u.id === id);
  usuario
    ? res.json(usuario)
    : res.status(404).json({ mensaje: 'Usuario no encontrado' });
});

// CREA UN NUEVO USUARIO (ABIERTA)
router.post('/', async (req, res) => {
  try {
    const usuarios = await leerUsuarios();
    const nuevo = req.body;

    if (!nuevo.nombre || !nuevo.apellido || !nuevo.email || !nuevo.contraseña) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    nuevo.id = usuarios.length > 0 ? usuarios.at(-1).id + 1 : 1;

    // Encriptar la contraseña antes de guardar
    const saltRounds = 10;
    nuevo.contraseña = await bcrypt.hash(nuevo.contraseña, saltRounds);

    usuarios.push(nuevo);
    await guardarUsuarios(usuarios);
    res.status(201).json(nuevo);
  } catch {
    res.status(500).json({ error: 'Error al guardar el usuario.' });
  }
});

// BUSCAR USUARIO POR NOMBRE (PROTEGIDO)
router.post('/buscar', verificarToken, async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Falta el campo nombre' });

  const usuarios = await leerUsuarios();
  const encontrados = usuarios.filter(u =>
    u.nombre.toLowerCase() === nombre.toLowerCase()
  );

  res.json(encontrados);
});

// ACTUALIZAR USUARIO (PROTEGIDO)
router.put('/:id', verificarToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const nuevosDatos = req.body;

  let usuarios = await leerUsuarios();
  const index = usuarios.findIndex(u => u.id === id);

  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...nuevosDatos };
    await guardarUsuarios(usuarios);
    res.json(usuarios[index]);
  } else {
    res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
});

// ELIMINAR USUARIO (PROTEGIDO, sólo si no tiene ventas)
router.delete('/:id', verificarToken, async (req, res) => {
  const id = parseInt(req.params.id);
  let usuarios = await leerUsuarios();
  let ventas = await leerVentas();

  const tieneVentas = ventas.some(v => v.id_usuario === id);

  if (tieneVentas) {
    return res.status(400).json({ mensaje: 'No se puede eliminar el usuario porque tiene ventas asociadas.' });
  }

  const index = usuarios.findIndex(u => u.id === id);

  if (index !== -1) {
    const eliminado = usuarios.splice(index, 1);
    await guardarUsuarios(usuarios);
    res.json({ mensaje: 'Usuario eliminado exitosamente', usuario: eliminado[0] });
  } else {
    res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
});

// LOGIN DE USUARIO (ABIERTA)
router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const usuarios = await leerUsuarios();
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Crear un JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        esCliente: usuario.EsCliente,
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// VERIFICAR SI UN EMAIL YA ESTÁ REGISTRADO
router.post('/existeEmail', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Falta el campo email' });

    const usuarios = await leerUsuarios();
    const existe = usuarios.some(u => u.email === email);

    res.json({ existe });
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;

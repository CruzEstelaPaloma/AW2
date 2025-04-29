import { Router } from 'express';
import fs from 'fs/promises';

const router = Router();
const archivoUsuarios = './data/usuarios.json';
const archivoVentas = './data/ventas.json';

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


// GET - Todos los usuarios
router.get('/', async (_, res) => {
  try {
    const usuarios = await leerUsuarios();
    res.json(usuarios);
  } catch {
    res.status(500).json({ error: 'Error al leer los datos.' });
  }
});

// GET - Usuario por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const usuarios = await leerUsuarios();
  const usuario = usuarios.find(u => u.id === id);
  usuario
    ? res.json(usuario)
    : res.status(404).json({ mensaje: 'Usuario no encontrado' });
});

// POST - Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const usuarios = await leerUsuarios();
    const nuevo = req.body;

    if (!nuevo.nombre || !nuevo.apellido || !nuevo.email || !nuevo.contraseña) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    nuevo.id = usuarios.length > 0 ? usuarios.at(-1).id + 1 : 1;
    usuarios.push(nuevo);
    await guardarUsuarios(usuarios);
    res.status(201).json(nuevo);
  } catch {
    res.status(500).json({ error: 'Error al guardar el usuario.' });
  }
});

// POST - Buscar usuario por nombre
router.post('/buscar', async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Falta el campo nombre' });

  const usuarios = await leerUsuarios();
  const encontrados = usuarios.filter(u =>
    u.nombre.toLowerCase() === nombre.toLowerCase()
  );

  res.json(encontrados);
});

// PUT - Editar usuario
router.put('/:id', async (req, res) => {
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
// DELETE - Eliminar usuario solo si no tiene ventas asociadas
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  let usuarios = await leerUsuarios();
  let ventas = await leerVentas();


  console.log('id a eliminar : ', id);
  console.log('Ventas del usuario : ', ventas.filter(v=> v.id_usuario === id ));

  // Verificar si hay ventas asociadas al usuario
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

export default router;
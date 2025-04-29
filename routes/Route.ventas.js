import { Router } from 'express';
import fs from 'fs/promises';

const router = Router();
const archivo = './data/ventas.json';
const archivoUsuarios = './data/usuarios.json';

const leerVentas = async () => {
  const data = await fs.readFile(archivo, 'utf-8');
  return JSON.parse(data);
};

const guardarVentas = async (ventas) => {
  await fs.writeFile(archivo, JSON.stringify(ventas, null, 2));
};

const leerUsuarios = async () => {
  const data = await fs.readFile(archivoUsuarios, 'utf-8');
  return JSON.parse(data);
};

// GET - Todas las ventas
router.get('/', async (_, res) => {
  try {
    const ventas = await leerVentas();
    res.json(ventas);
  } catch {
    res.status(500).json({ error: 'Error al leer las ventas.' });
  }
});

// GET - Venta por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const ventas = await leerVentas();
  const venta = ventas.find(v => v.id === id);
  venta
    ? res.json(venta)
    : res.status(404).json({ mensaje: 'Venta no encontrada' });
});

// POST - Nueva venta
router.post('/', async (req, res) => {
  try {
    const ventas = await leerVentas();
    const nueva = req.body;

    if (!nueva.id_usuario || !nueva.total || !nueva.productos) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    nueva.id = ventas.length > 0 ? ventas.at(-1).id + 1 : 6001;
    nueva.fecha = new Date().toISOString();
    ventas.push(nueva);
    await guardarVentas(ventas);
    res.status(201).json(nueva);
  } catch {
    res.status(500).json({ error: 'Error al guardar la venta.' });
  }
});

// POST - Buscar ventas por id_usuario
router.post('/buscar', async (req, res) => {
  const { id_usuario } = req.body;
  if (!id_usuario) return res.status(400).json({ error: 'Falta id_usuario' });

  const ventas = await leerVentas();
  const resultado = ventas.filter(v => v.id_usuario === id_usuario);
  res.json(resultado);
});

// PUT - Editar venta
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const nuevosDatos = req.body;

  let ventas = await leerVentas();
  const index = ventas.findIndex(v => v.id === id);

  if (index !== -1) {
    ventas[index] = { ...ventas[index], ...nuevosDatos };
    await guardarVentas(ventas);
    res.json(ventas[index]);
  } else {
    res.status(404).json({ mensaje: 'Venta no encontrada' });
  }
});

// DELETE - Eliminar venta
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  let ventas = await leerVentas();
  const index = ventas.findIndex(v => v.id === id);

  if (index !== -1) {
    const eliminado = ventas.splice(index, 1);
    await guardarVentas(ventas);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ mensaje: 'Venta no encontrada' });
  }
});

export default router;
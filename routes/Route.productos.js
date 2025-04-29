import { Router } from 'express';
import fs from 'fs/promises';

const router = Router();
const archivo = './data/productos.json';

const leerProductos = async () => {
  const data = await fs.readFile(archivo, 'utf-8');
  return JSON.parse(data);
};

const guardarProductos = async (productos) => {
  await fs.writeFile(archivo, JSON.stringify(productos, null, 2));
};

// GET - Todos los productos
router.get('/', async (_, res) => {
  try {
    const productos = await leerProductos();
    res.json(productos);
  } catch {
    res.status(500).json({ error: 'Error al leer los datos.' });
  }
});

// GET - Producto por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const productos = await leerProductos();
  const producto = productos.find(p => p.id === id);
  producto
    ? res.json(producto)
    : res.status(404).json({ mensaje: 'Producto no encontrado' });
});

// POST - Crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const productos = await leerProductos();
    const nuevo = req.body;

    if (!nuevo.nombre || !nuevo.precio || !nuevo.categoria) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    nuevo.id = productos.length > 0 ? productos.at(-1).id + 1 : 1;
    productos.push(nuevo);
    await guardarProductos(productos);
    res.status(201).json(nuevo);
  } catch {
    res.status(500).json({ error: 'Error al guardar el producto.' });
  }
});

// POST - Buscar por categoría
router.post('/buscar', async (req, res) => {
  const { categoria } = req.body;
  if (!categoria) return res.status(400).json({ error: 'Falta la categoría' });

  const productos = await leerProductos();
  const encontrados = productos.filter(p =>
    p.categoria.toLowerCase() === categoria.toLowerCase()
  );

  res.json(encontrados);
});

// PUT - Editar producto
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const nuevosDatos = req.body;

  let productos = await leerProductos();
  const index = productos.findIndex(p => p.id === id);

  if (index !== -1) {
    productos[index] = { ...productos[index], ...nuevosDatos };
    await guardarProductos(productos);
    res.json(productos[index]);
  } else {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
});

export default router;
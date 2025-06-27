import ProductoModel from '../models/Productos.js';

// Obtener todos los productos
//export const getProductos = async (req, res) => {
  //try {
   // const productos = await ProductoModel.find();
   // res.json(productos);
  //} catch (error) {
  //  console.error("❌ Error detallado:", error);
  //  res.status(500).json({ error: 'Error al obtener los productos' });
//  }
//};

export const getProductos = async (req, res) => {
  try {
    const productos = await ProductoModel.find();
    res.json(productos);
  } catch (error) {
    console.error("❌ Error en getProductos:", error); // 👈 AGREGÁ ESTO
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Obtener producto por ID
export const getProductoById = async (req, res) => {
  try {
    const producto = await ProductoModel.findById(req.params.id);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el producto' });
  }
};

// Crear un nuevo producto
export const createProducto = async (req, res) => {
  try {
    const nuevoProducto = new ProductoModel(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el producto' });
  }
};

// Actualizar un producto
export const updateProducto = async (req, res) => {
  try {
    const productoActualizado = await ProductoModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
export const deleteProducto = async (req, res) => {
  try {
    await ProductoModel.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

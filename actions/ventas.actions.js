import VentaModel from '../models/ventas.js';
import ProductoModel from '../models/Productos.js'; 
import mongoose from 'mongoose';

export const getVentas = async (req, res) => {
  try {
    const ventas = await VentaModel.find().populate('id_usuario').populate('productos.id');
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
};

export const getVentaById = async (req, res) => {
  try {
    const venta = await VentaModel.findById(req.params.id).populate('id_usuario').populate('productos.id');
    if (venta) {
      res.json(venta);
    } else {
      res.status(404).json({ error: 'Venta no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la venta' });
  }
};

export const createVenta = async (req, res) => {
  try {
    const nuevaVenta = new VentaModel(req.body);
    await nuevaVenta.save();
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la venta' });
  }
};

export const updateVenta = async (req, res) => {
  try {
    const ventaActualizada = await VentaModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(ventaActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la venta' });
  }
};

export const deleteVenta = async (req, res) => {
  try {
    await VentaModel.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Venta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
};


export const realizarCompra = async (req, res) => {
  console.log("📥 Backend recibió:", req.body);
console.log("🔐 Usuario del token:", req.usuario);
  try {

    const { productos, total, direccion } = req.body;
    const id_usuario = req.usuario._id || req.usuario.id;
    



    
    // Validar productos y obtener sus ObjectId reales
    const productosValidados = await Promise.all(productos.map(async (p) => {
      const producto = await ProductoModel.findById(p.id);
      if (!producto) {
        throw new Error(`Producto con ID ${p.id} no encontrado`);
      }
      return {
        id: producto._id,
        cantidad: p.cantidad
      };
    }));

    const nuevaVenta = new VentaModel({
      id_usuario,
      fecha: new Date(),
      total,
      direccion: direccion || 'Sin dirección',
      productos: productosValidados
    });

    await nuevaVenta.save();

    res.status(201).json({ mensaje: 'Venta guardada', venta: nuevaVenta });
  } catch (error) {
    console.error('Error en realizarCompra:', error.message);
    res.status(400).json({ error: 'Error al procesar la compra' });
  }

  console.log("📥 Backend recibió:", req.body);
  console.log("👤 Usuario autenticado:", req.usuario);
};
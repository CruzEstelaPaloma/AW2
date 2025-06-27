import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import Producto from './models/Productos.js';
import Usuario from './models/usuarios.js';
import Venta from './models/ventas.js';

dotenv.config();
const __dirname = path.resolve();

// Leer los archivos JSON
const productosJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/productos.json')));
const usuariosJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/usuarios.json')));
const ventasJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/ventas.json')));

 const importarDatos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Borrar todo
    await Producto.deleteMany();
    await Usuario.deleteMany();
    await Venta.deleteMany();

    
    const productosLimpios = productosJSON.map(({ id, ...rest }) => rest);
    const productosInsertados = await Producto.insertMany(productosLimpios);
    const usuariosLimpios = usuariosJSON.map(({ id, ...rest }) => rest);
    const usuariosInsertados = await Usuario.insertMany(usuariosLimpios);

    
    const mapaUsuarios = {};
    usuariosInsertados.forEach(u => {
      mapaUsuarios[u.id] = u._id;
    });

    const mapaProductos = {};
    productosInsertados.forEach(p => {
      mapaProductos[p.nombre] = p._id; 
    });

    // Adaptar ventas
    const ventasAdaptadas = ventasJSON.map(venta => ({
      id_usuario: mapaUsuarios[venta.id_usuario],
      fecha: venta.fecha,
      direccion: venta.direccion || 'Sin dirección',
      total: venta.total,
      productos: venta.productos
        .filter(p => p.id) 
        .map(p => ({
          id: mapaProductos[productosJSON.find(prod => prod.id === p.id)?.nombre],
          cantidad: p.cantidad
        }))
    }));

    await Venta.insertMany(ventasAdaptadas);

    console.log('✅ Datos importados correctamente');
    process.exit();
  } catch (error) {
    console.error('❌ Error al importar:', error);
    process.exit(1);
  }
};

console.log("📦 Iniciando importación de productos...");
export default importarDatos;
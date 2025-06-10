import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Producto from './models/Productos.js';
import Usuario from './models/usuarios.js';
import Venta from './models/ventas.js';

dotenv.config();
const __dirname = path.resolve();

// Cargar datos originales
const productosJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/productos.json')));

const usuariosJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/usuarios.json')));
const ventasJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/ventas.json')));

const importarDatos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Producto.deleteMany();
    await Usuario.deleteMany();
    await Venta.deleteMany();

    
    const usuariosInsertados = await Usuario.insertMany(usuariosJSON);
    const productosInsertados = await Producto.insertMany(productosJSON);

    
    const mapaUsuarios = {};
    usuariosInsertados.forEach(u => {
      mapaUsuarios[u.id] = u._id;
    });

    const mapaProductos = {};
    productosInsertados.forEach(p => {
      mapaProductos[p.id] = p._id;
    });

  
    const ventasAdaptadas = ventasJSON.map(venta => ({
      id_usuario: mapaUsuarios[venta.id_usuario],
      fecha: venta.fecha,
      total: venta.total,
      productos: venta.productos.map(p => ({
        id: mapaProductos[p.id],
        cantidad: p.cantidad,
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

console.log("Productos a insertar:", productosJSON.length);

importarDatos();

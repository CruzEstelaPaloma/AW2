import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import importarDatos from './importData.js';
import Producto from './models/Productos.js';


import productosRoutes from './routes/Route.productos.js';
import usuariosRoutes from './routes/Route.usuarios.js';
import ventasRoutes from './routes/Route.ventas.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/Productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/Ventas', ventasRoutes);

// Conexión a MongoDB 
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('✅ Conectado a MongoDB');

  const cantidadProductos = await Producto.countDocuments();
  if (cantidadProductos === 0) {
    console.log('🟡 No hay productos en la base de datos. Importando datos iniciales...');
    await importarDatos(); // esta función ya hace el insert de productos, usuarios y ventas
  } else {
    console.log('🟢 Productos ya existentes. No se importó nada.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
})

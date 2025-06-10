import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';



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
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('❌ Error al conectar a MongoDB:', error);
});
app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
  });
  

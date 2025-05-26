
import express from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/Route.usuarios.js';
import productosRoutes from './routes/Route.productos.js';
import ventasRoutes from './routes/Route.ventas.js';

const app = express();
const PORT = 3000;

// Middlewares
app.use (cors());
app.use(express.json());

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
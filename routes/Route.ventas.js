import express from 'express';
import { verificarToken } from '../middleware/authMiddleware.js';
import {
  getVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta,
  realizarCompra
} from '../actions/ventas.actions.js';

const router = express.Router();

router.get('/', getVentas);
router.get('/:id', getVentaById);
router.post('/', createVenta);
router.put('/:id', updateVenta);
router.delete('/:id', deleteVenta);
router.post('/comprar', verificarToken, realizarCompra); 

export default router;

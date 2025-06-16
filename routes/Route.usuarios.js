import express from 'express';
import { verificarToken } from '../middleware/authMiddleware.js';
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  checkEmailExiste,
  loginUsuario,
  deleteUsuario
} from '../actions/usuarios.actions.js';

const router = express.Router();

router.get('/',verificarToken, getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.post('/existeEmail', checkEmailExiste);
router.post('/login', loginUsuario);
router.delete('/:id', deleteUsuario);
router.get('/usuarios', verificarToken, getUsuarios); 


export default router;

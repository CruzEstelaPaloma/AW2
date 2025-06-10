import UsuarioModel from '../models/usuarios.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 




export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await UsuarioModel.findById(req.params.id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el usuario' });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { contraseña, ...otrosDatos } = req.body;
    const contraseñaHasheada = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new UsuarioModel({ ...otrosDatos, contraseña: contraseñaHasheada });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el usuario' });
  }
};
export const updateUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el usuario' });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    await UsuarioModel.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

export const checkEmailExiste = async (req, res) => {
    try {
      const { email } = req.body;
      const usuario = await UsuarioModel.findOne({ email });
      res.json({ existe: !!usuario });
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar el email' });
    }
  };
  
  export const loginUsuario = async (req, res) => {
    const { email, contraseña } = req.body;
  
    try {
      const usuario = await UsuarioModel.findOne({ email });
  
      if (!usuario) {
        return res.status(401).json({ error: 'Email o contraseña incorrectos' });
      }
  
       const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
  
      if (!esValida) {
        return res.status(401).json({ error: 'Email o contraseña incorrectos' });
      }
  
      
      const token = jwt.sign(
        {
          id: usuario._id,
          email: usuario.email,
          esCliente: usuario.EsCliente,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({
        mensaje: 'Login exitoso',
        token,
        usuario: {
            id: usuario._id,
            
          }
      });
    } catch (err) {
      console.error('Error en login:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
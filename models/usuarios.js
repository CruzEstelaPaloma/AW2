import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
  contraseña: String,
  fechaNacimiento: Date,
  EsCliente: Boolean,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;

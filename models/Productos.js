import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    
    nombre: String,
    desc: String,
    precio: Number,
    imagen: String,
    categoria: String,
    stockDisponible: Number
  });
    

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;




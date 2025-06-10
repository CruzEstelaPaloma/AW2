import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  fecha: Date,
  total: Number,
  productos: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
      },
      cantidad: Number,
    },
  ],
});

const Venta = mongoose.model('Venta', ventaSchema);

export default Venta;

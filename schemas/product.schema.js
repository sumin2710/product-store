import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  pid: {
    type: Number,
    required: true,
    unique: true,
  },
});

// ProductSchema.virtual('productId').get(function () {
//   return this._id.toHexString();
// });
// ProductSchema.set('toJSON', {
//   virtuals: true,
// });

export default mongoose.model('Product', ProductSchema);

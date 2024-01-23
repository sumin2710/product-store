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
    enum: ['FOR_SALE', 'SOLD_OUT'],
    default: 'FOR_SALE',
  },
  createdAt: {
    type: Date,
    default: Date.now, // 현재 시간 디폴트
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
  //{timestamps:true}
});

// ProductSchema.virtual('productId').get(function () {
//   return this._id.toHexString();
// });
// ProductSchema.set('toJSON', {
//   virtuals: true,
// });

export default mongoose.model('Product', ProductSchema);

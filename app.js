import express from 'express';
import connect from './schemas/index.js';
import ProductRouter from './routes/product.router.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./assets'));

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'start!' });
});

app.use('/api', [router, ProductRouter]);

app.listen(PORT, () => {
  console.log('서버가 열렸어요.');
});

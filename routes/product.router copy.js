import express from 'express';
import Product from '../schemas/product.schema.js';
import joi from 'joi';

const router = express.Router();

const createdProductSchema = joi.object({
  title: joi.string().min(1).max(50).required(),
  author: joi.string().min(2).max(10).required(),
  password: joi
    .string()
    .pattern(new RegExp('^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{3,30}$'))
    .required()
    .messages({
      'string.pattern.base': `비밀번호는 3-30자의 숫자와 영문자로 이루어지며 특수문자를 최소 한 자 이상 포함해야 합니다.`,
      'string.empty': `빈 문자열은 비밀번호가 될 수 없습니다.`,
      'any.required': `비밀번호는 필수 입력사항입니다.`,
    }),
  content: joi.string().min(1).max(50).required(),
  price: joi.number().integer().greater(999).less(9999999999).required(),
});

const editedProductSchema = joi.object({
  title: joi.string().min(1).max(50).required(),
  content: joi.string().min(1).max(50).required(),
  price: joi.number().integer().greater(999).less(9999999999).required(),
  status: joi.string().valid('FOR_SALE', 'SOLD_OUT').required(),
  password: joi.string(),
});

// 상품 작성 API
router.post('/product', async (req, res, next) => {
  try {
    if (!req.body) {
      throw 400;
    }
    const validation = await createdProductSchema.validateAsync(req.body);
    const { title, author, password, content, price } = validation;

    const latestProduct = await Product.findOne().sort('-pid').exec();
    const newPid = latestProduct ? latestProduct.pid + 1 : 1;

    // 상품 등록
    const newProduct = new Product({
      title,
      author,
      password,
      content,
      price,
      pid: newPid,
    });
    await newProduct.save();

    // 클라이언트에게 반환
    return res
      .status(201)
      .json({ product: newProduct, message: '판매 상품을 등록하였습니다.' });
  } catch (err) {
    next(err);
  }
});

// 상품 목록 조회 API
router.get('/product', async (req, res, next) => {
  try {
    const products = await Product.find()
      .select('title author status createdAt pid')
      .sort('-createdAt')
      .exec();
    return res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
});

// 상품 상세 조회 API
router.get('/product/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const searchedProduct = await Product.findOne({ pid: productId })
      .select('title author content status createdAt price pid')
      .exec();

    if (!searchedProduct) {
      throw 404;
    }
    return res.status(201).json({ searchedProduct });
  } catch (err) {
    next(err);
  }
});

// 상품 정보 수정 API
router.patch('/product/:productId', async (req, res, next) => {
  try {
    if (!req.body || !req.params) {
      throw 400;
    }
    const { productId } = req.params;
    const validation = await editedProductSchema.validateAsync(req.body);
    const { title, content, status, price, password } = validation;

    const currentProduct = await Product.findOne({ pid: productId }).exec();
    if (!currentProduct) {
      throw 404;
    }
    if (currentProduct.password != password) {
      return 401;
    }

    // 수정하기
    currentProduct.title = title;
    currentProduct.content = content;
    currentProduct.status = status;
    currentProduct.price = price;
    await currentProduct.save();
    return res
      .status(200)
      .json({ currentProduct, message: '상품 정보를 수정하였습니다.' });
  } catch (err) {
    next(err);
  }
});

// 상품 삭제 API
router.delete('/product/:productId', async (req, res, next) => {
  try {
    if (!req.body || !req.params) {
      throw 400;
    }
    const { productId } = req.params;
    const { password } = req.body;

    const currentProduct = await Product.findOne({ pid: productId }).exec();
    if (!currentProduct) {
      throw 404;
    }
    if (currentProduct.password != password) {
      return 401;
    }

    await Product.deleteOne({ pid: productId });
    return res.status(200).json({ message: '상품을 삭제하였습니다.' });
  } catch (err) {
    next(err);
  }
});

// 임시 - 전부 삭제 API
// router.delete('/product', async (req, res) => {
//   await Product.deleteMany().exec();
//   return res.status(200).json({});
// });

export default router;

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflitct-error';

export const getProducts = (_req: Request, res: Response) => {
  Product.find({})
    .then((products) => Product.countDocuments()
      .then((total) => {
        res.send({ items: products, total });
      }))
    .catch((_error) => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const createProduct = (req: any, res: any, next: any) => {
  const {
    title, image, category, description, price,
  } = req.body;

  Product.create({
    title,
    image,
    category,
    description,
    price,
  })
    .then((product) => {
      res.send(product);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Validation failed'));
      }
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(
          new ConflictError('Товар с таким заголовком уже существует.'),
        );
      }
      return next(error);
    });
};

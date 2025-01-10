import mongoose, { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/product';

import BadRequestError from '../errors/bad-request-error';

export default (req: Request, res: Response, next: NextFunction) => {
  const { total, items } = req.body;
  const productIds = items.map((id: string) => new Types.ObjectId(id));

  Product.find({
    _id: { $in: productIds },
  })
    .then((products) => {
      const missingProducts = items.filter(
        (id: string) => !products.some((product: IProduct) => product._id!.toString() === id),
      );

      if (missingProducts.length > 0) {
        return Promise.reject(
          new BadRequestError(
            `Товар с id ${missingProducts.join(', ')} не найден`,
          ),
        );
      }

      const unbuyingProducts = items.filter(
        (id: string) => !products.some(
          (product: any) => product._id.toString() === id && product.price !== null,
        ),
      );

      if (unbuyingProducts.length > 0) {
        return Promise.reject(
          new BadRequestError(
            `Товар с id ${unbuyingProducts.join(', ')} не продаётся`,
          ),
        );
      }

      const calculatedTotal = products.reduce(
        (sum: number, product: IProduct) => sum + product.price!,
        0,
      );
      if (calculatedTotal !== total) {
        return Promise.reject(new BadRequestError('Неверная сумма заказа'));
      }

      const orderId = faker.string.uuid();
      return res.send({ id: orderId, total });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Validation failed'));
      }
      return next(error);
    });
};

import mongoose, { Types } from "mongoose";
import { faker } from "@faker-js/faker";
import Product from "../models/product";

import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflitct-error";

// Контроллер для создания заказа
export const createOrder = async (req: any, res: any, next: any) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    const productIds = items.map((id: string) => new Types.ObjectId(id));
    const products = await Product.find({
      _id: { $in: productIds },
      price: { $ne: null },
    });

    const missingProducts = items.filter(
      (id: string) =>
        !products.some((product: any) => product._id.toString() === id)
    );
    if (missingProducts.length > 0) {
      throw new BadRequestError(
        `Товар с id ${missingProducts.join(", ")} не найден`
      );
    }

    const calculatedTotal = products.reduce(
      (sum: number, product: any) => sum + product.price,
      0
    );

    if (calculatedTotal !== total) {
      throw new BadRequestError("Неверная сумма заказа");
    }

    const orderId = faker.string.uuid();

    res.send({ id: orderId, total });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError("Validation failed"));
    }
    if (error instanceof Error && error.message.includes("E11000")) {
      return next(
        new ConflictError("Товар с таким заголовком уже существует.")
      );
    }
    return next(error);
  }
};

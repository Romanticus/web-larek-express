import { Request, Response } from "express";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";
import mongoose from "mongoose";
import ConflictError from "../errors/conflitct-error";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});

    const total = await Product.countDocuments();
    res.send({ items: products, total });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Произошла ошибка" });
  }
};

export const createProduct = async (req: any, res: any, next: any) => {
  try {
    const { title, image, category, description, price } = req.body;

    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });
    res.send(product);
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

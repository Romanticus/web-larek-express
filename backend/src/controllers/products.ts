import { Request, Response } from "express";
import Product from "../models/product";

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

export const createProduct = (req: Request, res: Response) => {
  const {  title, image, category, description, price } = req.body;

  return Product.create({title, image, category, description, price })
    .then((product) => res.send( product ))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

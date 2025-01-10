import { productValidation } from "../middlewares/validation";
import { createProduct, getProducts } from "../controllers/products";
import { Router } from "express";

const router = Router();
router.get('/', getProducts);


router.post('/', productValidation, createProduct);
export default router;

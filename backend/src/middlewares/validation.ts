import { celebrate, Joi } from 'celebrate';

// Схема для создания заказа
export const orderValidation = celebrate({
  body: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(Joi.string().length(24)).min(1).required(), // ObjectId имеет длину 24 символа
  }),
});
import { celebrate, Joi } from 'celebrate';

// Схема для создания заказа
export const orderValidation = celebrate({
  body: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(Joi.string()).min(1).required(),
  }),
});

export const productValidation = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    image: Joi.object()
      .keys({
        fileName: Joi.string().required(),
        originalName: Joi.string().required(),
      })
      .required(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.alternatives()
      .try(Joi.number(), Joi.valid(null))
      .optional()
      .default(null),
  }),
});

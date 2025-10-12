
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi'; // for data validation

// Payment donation schema (aligns with frontend donate params)
export const paymentSchema = Joi.object({
  courseId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().valid('GHS', 'USD').default('GHS'),
  paymentMethod: Joi.string().valid('card', 'mobile_money').required(),
  phone: Joi.string().when('paymentMethod', { is: 'mobile_money', then: Joi.string().required() }),
  donor: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  }).required(),
});

// Enrollment schema
export const enrollmentSchema = Joi.object({
  courseId: Joi.string().required(),
  amount: Joi.number().min(50).required(), // GHS min
  currency: Joi.string().valid('GHS', 'USD').default('GHS'),
});

// General validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
  };
};
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const userScheme = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
});

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = userScheme.validate(req.body);
    if (error)
        return res.status(400).json({
            status: 400,
            message: error.details[0].message,
        });
    next();
};


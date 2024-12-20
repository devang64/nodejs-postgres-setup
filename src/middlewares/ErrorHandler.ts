import { Errback, NextFunction, Request, Response } from "express";

const errorHandling = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

export default errorHandling;
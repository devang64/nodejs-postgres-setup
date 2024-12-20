import { Request, NextFunction, Response } from "express";
const jwt = require('jsonwebtoken');

const verifyToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate' });
        }
        req.user = decoded;
        next();
    });
};


const authorizeRole = (...roles: any) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(401).json({ success: false, message: 'You are not allowed to access resources' });
        }
        next();
    };
}

export { verifyToken, authorizeRole };
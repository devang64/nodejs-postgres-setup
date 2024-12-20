import { Response } from 'express';
import fs from "fs";
import path from "path";
import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
type FormatResponseType = (
    res: Response,
    status: number,
    success: boolean,
    message: string,
    data?: any
) => void;

class Utils {
    static handleResponse: FormatResponseType = (res, status, success, message, data = null) => {
        res.status(status).json({
            success,
            message,
            data,
        });
    };

    static generateToken = ({ id, email }: any) => {
        const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "48h" })
        return token
    }
    static genrateRandomNumber = () => {
        let minm = 10000;
        let maxm = 99999;
        return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    };
    static hashPassword = async (password: string): Promise<string> => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    static verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    };
    
    static removeImage = async (fileName: any, uploadPath: string) => {
        const filePath = path.join(uploadPath, fileName);
        fs.unlink(filePath, () => {
            console.log(`${fileName} Removed`);
        });
    }
    static sendMail = async ({ to, subject, text, html }: any) => {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: `"Your App" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                text,
                html,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent:", info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error: any) {
            console.error("Error sending email:", error);
            return { success: false, error: error.message };
        }
    }
}

export default Utils;
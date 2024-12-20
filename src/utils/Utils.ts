import { Response } from 'express';
import fs from "fs";
import path from "path";
import bcrypt from 'bcrypt';
import pool from '../config/db';
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
    static dynamicGetQuery = async (table: any, filters = {}, sortBy = null, limit = 10, offset = 0) => {
        let baseQuery = `SELECT * FROM ${table}`;
        let conditions = [];
        let values = [];
        let index = 1;

        // Build the WHERE clause dynamically
        Object.keys(filters).forEach((key) => {
            conditions.push(`${key} = $${index}`);
            values.push(filters[key]);
            index++;
        });

        // Append WHERE clause if there are conditions
        if (conditions.length > 0) {
            baseQuery += ' WHERE ' + conditions.join(' AND ');
        }

        // Add sorting if provided
        if (sortBy) {
            baseQuery += ` ORDER BY ${sortBy}`;
        }

        // Add LIMIT and OFFSET
        baseQuery += ` LIMIT $${index} OFFSET $${index + 1}`;
        values.push(limit, offset);

        try {
            const res = await pool.query(baseQuery, values);
            return res.rows;
        } catch (err) {
            console.error('Error executing SELECT query:', err.stack);
        }
    }
    static dynamicInsert = async (table: any, data: any) => {
        let baseQuery = `INSERT INTO ${table} (`;
        let columns = Object.keys(data);
        let values = Object.values(data);
        let placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');

        baseQuery += columns.join(', ') + ') VALUES (' + placeholders + ') RETURNING *';

        try {
            const res = await pool.query(baseQuery, values);
            return res.rows[0];  // Return the inserted row
        } catch (err) {
            console.error('Error executing INSERT query:', err.stack);
        }
    }
    static dynamicUpdate = async (table: any, data: any, condition: any) => {
        let baseQuery = `UPDATE ${table} SET `;
        let setStatements = [];
        let values = [];
        let index = 1;

        // Dynamically add SET conditions
        Object.keys(data).forEach((key) => {
            setStatements.push(`${key} = $${index}`);
            values.push(data[key]);
            index++;
        });

        baseQuery += setStatements.join(', ') + ` WHERE ${condition.column} = $${index}`;
        values.push(condition.value);  // Add condition value

        try {
            const res = await pool.query(baseQuery, values);
            return res.rowCount;  // Return the number of updated rows
        } catch (err) {
            console.error('Error executing UPDATE query:', err.stack);
        }
    }

    static dynamicDelete = async (table: any, condition: any) => {
        let baseQuery = `DELETE FROM ${table} WHERE ${condition.column} = $1`;
        let values = [condition.value];

        try {
            const res = await pool.query(baseQuery, values);
            return res.rowCount;  // Return the number of deleted rows
        } catch (err) {
            console.error('Error executing DELETE query:', err.stack);
        }
    }



}

export default Utils;
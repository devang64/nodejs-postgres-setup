import { NextFunction, Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

import {
    createUserService,
    deleteUserService,
    getAllUsersService,
    getUserByIdService,
    getUserByMailService,
    patchUserService,
    updateUserService,
} from "../models/userModel";
import Utils from "../utils/Utils";



export const createUser = async (req: any, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    try {
        const hashPassword = await Utils.hashPassword(password);
        const newUser = await createUserService({ name, email, password: hashPassword });
        Utils.handleResponse(res, 201, true, "User created successfully", newUser);
    } catch (err) {
        next(err);
    }
};

export const getAllUsers = async (req: any, res: Response, next: NextFunction) => {
    try {
        const users: any = await getAllUsersService();
        Utils.handleResponse(res, 200, true, "Users fetched successfully", users);
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await getUserByIdService(req.user.id);
        if (!user) return Utils.handleResponse(res, 404, false, "User not found");
        Utils.handleResponse(res, 200, true, "User fetched successfully", user);
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req: any, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    try {
        const { id } = req.params;
        // const updatedUser = await updateUserService({ id: req.user.id, name, email });
        const updatedUser = await patchUserService(id, { name, email });
        if (!updatedUser) return Utils.handleResponse(res, 404, false, "User not found");
        Utils.handleResponse(res, 200, true, "User updated successfully", updatedUser);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const deletedUser = await deleteUserService(req.params.id);
        if (!deletedUser) return Utils.handleResponse(res, 404, false, "User not found");
        Utils.handleResponse(res, 200, true, "User deleted successfully", deleteUser);
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req: any, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByMailService(email)
        if (!user) return Utils.handleResponse(res, 404, false, "User not found");

        const isValid = await Utils.verifyPassword(password, user.password)
        if (!isValid) return Utils.handleResponse(res, 401, false, "Invalid credentials");

        const token = Utils.generateToken({ id: user.id, email: user.email })

        Utils.handleResponse(res, 200, true, "Login successful", { token });
    } catch (err) {
        next(err);
    }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Utils.handleResponse(res, 200, true, "Logout successful");
    } catch (err) {
        next(err);
    }
};
//pagination const skip= (page - 1) * limit ,

// dynamicGetQuery('users', { age: 25, status: 'active' }, 'name ASC', 10, 0)
//   .then(rows => console.log(rows));

// dynamicInsert('users', { name: 'John Doe', age: 30, status: 'active' })
//   .then(row => console.log(row));

// dynamicUpdate('users', { status: 'inactive' }, { column: 'id', value: 1 })
//   .then(updated => console.log(updated, 'rows updated'));

// dynamicDelete('users', { column: 'id', value: 1 })
//   .then(deleted => console.log(deleted, 'rows deleted'));
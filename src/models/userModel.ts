import pool from "../config/db";
import { CreateUserType, UpdateUserType } from "../types/userTypes";
import Utils from "../utils/Utils";

export const getAllUsersService = async () => {
    const result = await pool.query("SELECT id, name, email FROM users");
    return result.rows;
};
export const getUserByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM users where id = $1", [id]);
    return result.rows[0];
};
export const createUserService = async ({ name, email, password }: CreateUserType) => {
    const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, password]
    );
    return result.rows[0];
};
export const updateUserService = async ({ id, name, email }: UpdateUserType) => {
    const result = await pool.query(
        "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
        [name, email, id]
    );
    return result.rows[0];
};
export const deleteUserService = async (id) => {
    const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

export const getUserByMailService = async (email: string) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0];
}
const generateUpdateQuery = (
    tableName: string,
    idField: string,
    idValue: number | string,
    fields: Record<string, any>
) => {
    // Get keys and values from the fields object
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    // Throw an error if no fields are provided
    if (keys.length === 0) {
        throw new Error("No fields provided for update");
    }

    // Create the SET clause dynamically
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

    // Add the ID field to the query
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = $${keys.length + 1} RETURNING *`;

    // Add the ID value to the values array
    values.push(idValue);

    return { query, values };
};


export const patchUserService = async (id: number, fields: Partial<{ name: string; email: string; password: string }>) => {
    try {
        const { query, values } = generateUpdateQuery("users", "id", id, fields);

        // Execute the query
        const result = await pool.query(query, values);

        return result.rows[0]; // Return the updated user
    } catch (error) {
        throw error; // Propagate the error
    }
};
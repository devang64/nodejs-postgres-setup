export type CreateUserType = {
    name: string;
    email: string;
    password: string;
};
export type UpdateUserType = {
    id: string; // Required for updates
    name?: string; // Optional, since you might update only specific fields
    email?: string;
    password?: string;
};

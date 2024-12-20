import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// Configure storage
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, "uploads/"); // Destination folder
    },
    filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname); // Get the file extension
        const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
        req.savedFileName = fileName; // Attach the filename to the request object
        cb(null, fileName); // Save the file with the generated name
    },
});

// File filter (for validation)
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed."), false);
    }
};

// Multer setup
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    fileFilter,
});

export const uploadSingle = upload.single("image"); // Middleware for single file uploads

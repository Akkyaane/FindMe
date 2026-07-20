import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIMETYPES = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non supporté. Formats acceptés : JPEG, PNG, WEBP"));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export const resizeImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.file) {
    next();
    return;
  }

  try {
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await sharp(req.file.buffer)
      .resize({
        width: 800,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    req.file.filename = filename;
    req.file.path = path.join("uploads", filename);
    req.file.mimetype = "image/webp";
    req.file.size = fs.statSync(filepath).size;

    next();
  } catch (error) {
    next(error);
  }
};

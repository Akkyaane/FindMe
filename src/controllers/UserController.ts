import { Request, Response } from "express";
import { User } from "../entities/User";
import bcrypt from 'bcrypt';
import crypto from "crypto";

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const password = crypto.randomBytes(12).toString("base64");
      const hashedPassword = await bcrypt.hash(password, 10);

      req.body.password = hashedPassword;

      const user = User.create(req.body);

      const result = await User.save(user);

      return res.status(201).json(result);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      return res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        error: details,
      });
    }
  }
}
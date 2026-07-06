import { Request, Response } from "express";
import { User } from "../entities/User";
import bcrypt from 'bcrypt';
import crypto from "crypto";

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
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
  static async login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    return res.status(200).json(user);
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ message: "Erreur lors de l'identification", error: details });
  }
}
}
import { Request, Response } from "express";
import { User } from "../entities/User";

export class UserController {
  static async create(req: Request, res: Response) {
    try {
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
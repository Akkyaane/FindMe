import { Request, Response } from "express";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validate } from "class-validator";

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const user = new User();

      user.username = req.body.username;

      user.email = req.body.email;

      user.password = await bcrypt.hash(req.body.password, 10);

      validate(user).then((errors) => {
        if (errors.length > 0) {
          console.log("validation failed. errors: ", errors);

          return res.status(400).json({
            message: "Validation failed",
            errors: errors,
          });
        } else {
          console.log("Validation succeeded");
        }
      });

      User.create(user);

      const result = await User.save(user);

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        error: error
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

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const { password: _, ...userWithoutPassword } = user;
return res.status(200).json(userWithoutPassword);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);

      return res
        .status(500)
        .json({ message: "Erreur lors de l'identification", error: details });
    }
  }
}
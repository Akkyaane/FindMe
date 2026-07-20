import { Request, Response } from "express";
import User from "../entities/User";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import { checkUser } from "../middlewares/UserMiddleware";
import jwt from "jsonwebtoken";
import Cookies from "cookies";

export default class UserController {
  public async signUp(req: Request, res: Response) {
    try {
      const user = new User();
      user.username = req.body.username;
      user.email = req.body.email;
      user.password = req.body.password;

      const errors = await validate(user);

      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validation failed.",
          errors,
        });
      }

      const existingUser = await User.findOne({ where: { email: user.email } });

      if (existingUser) {
        return res.status(409).json({
          message: "Un utilisateur avec cet email existe deja.",
        });
      }

      user.password = await bcrypt.hash(req.body.password, 10);

      await user.save();

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        error: error,
      });
    }
  }

  public async signIn(req: Request, res: Response) {
    try {
      if (!req.body.email || !req.body.password) {
        return res
          .status(400)
          .json({ message: "Email et mot de passe requis" });
      }

      const user = await User.findOne({ where: { email: req.body.email } });

      if (!user) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const isValid = await bcrypt.compare(req.body.password, user.password);

      if (!isValid) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const cookies = new Cookies(req, res);

      const decoded = await checkUser(cookies.get("JWT Token"));

      if (
        !cookies.get("JWT Token") ||
        decoded instanceof jwt.TokenExpiredError ||
        decoded instanceof jwt.JsonWebTokenError
      ) {
        const token = jwt.sign(
          { data: user.id },
          process.env.JWT_SECRET || "secret",
          {
            expiresIn: "1d",
          },
        );

        cookies.set("JWT Token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        return res
          .status(200)
          .json({ user: decoded, message: "Utilisateur connecté" });
      } else {
        return res
          .status(200)
          .json({ user: decoded, message: "Utilisateur déjà connecté" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de l'identification", error: error });
    }
  }

  public async signOut(req: Request, res: Response) {
    try {
      const cookies = new Cookies(req, res);

      cookies.set("JWT Token", "", { maxAge: 0 });

      return res.status(200).json({ message: "Utilisateur déconnecté" });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion", error: error });
    }
  }
}
import { Request, Response, NextFunction } from "express";
import User from "../entities/User";
import jwt from "jsonwebtoken";
import Cookies from "cookies";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookies = new Cookies(req, res);
  const token = cookies.get("JWT Token");

  if (!token) {
    return res.status(401).json({ message: "Authentification requise" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { data: number };
    const user = await User.findOne({ where: { id: decoded.data } });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

export async function checkUser(token?: string) {
  if (!token) {
    return new Error("Token is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      data: number;
    };

    const user = await User.findOne({ where: { id: decoded.data } });

    return user;
  } catch (error) {
    return error;
  }
}

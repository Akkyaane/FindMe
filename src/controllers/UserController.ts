import { Request, Response } from "express";
import { AppDataSource } from "../datasource";
import { User } from "../entities/User";

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const user = userRepository.create(req.body);
      const result = await userRepository.save(user);

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error creating user", error });
    }
  }
}
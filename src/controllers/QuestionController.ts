import { Request, Response } from "express";
import Question from "../entities/Question";
import User from "../entities/User";

export default class QuestionController {
  public async create(req: Request, res: Response) {
    try {
      const { content, image, createdBy } = req.body;
      const user = await User.findOneBy({ id: createdBy });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      const newQuestion = Question.create({
        content: content,
        image,
        createdBy: user,
      });
      const result = await Question.save(newQuestion);

      return res.status(201).json(result);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      return res.status(500).json({
        message: "Erreur lors de la création de la question",
        error: details,
      });
    }
  }
}

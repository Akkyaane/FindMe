import { Request, Response } from "express";
import Question from "../entities/Question";
import User from "../entities/User";
import { Media } from "../entities/Media";

//Ajouter validate de classe-validator pour valider les données de la question

export default class QuestionController {
  public async create(req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Corps de la requête manquant. Utilisez multipart/form-data." });
      }
      const { content, createdBy } = req.body;
      const user = await User.findOneBy({ id: createdBy });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      const newQuestion = Question.create({
        content: content,
        createdBy: user,
      });
      const savedQuestion = await Question.save(newQuestion);

      if (req.file) {
        const media = Media.create({
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          mimetype: req.file.mimetype,
          size: req.file.size,
        });
        savedQuestion.media = media;
        await Question.save(savedQuestion);
      }

      const result = await Question.findOne({
        where: { id: savedQuestion.id },
        relations: { createdBy: true, media: true },
      });

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

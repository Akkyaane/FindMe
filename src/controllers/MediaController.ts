import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Media } from "../entities/Media";
import Question from "../entities/Question";

export class MediaController {
  static async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier fourni" });
      }

      const questionId = parseInt(req.params.questionId as string);
      const question = await Question.findOne({ where: { id: questionId } });

      if (!question) {
        fs.unlinkSync(path.join(process.cwd(), req.file.path));
        return res.status(404).json({ message: "Question introuvable" });
      }

      const existing = await Media.findOne({ where: { question: { id: questionId } } });
      if (existing) {
        const oldFile = path.join(process.cwd(), existing.path);
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
        await Media.delete(existing.id);
      }

      const media = Media.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        question,
      });

      const result = await Media.save(media);
      return res.status(201).json(result);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      return res.status(500).json({
        message: "Erreur lors de l'upload de l'image",
        error: details,
      });
    }
  }

  static async deleteMedia(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const media = await Media.findOne({ where: { id } });

      if (!media) {
        return res.status(404).json({ message: "Média introuvable" });
      }

      const filepath = path.join(process.cwd(), media.path);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      await Media.delete(id);
      return res.status(200).json({ message: "Média supprimé avec succès" });
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      return res.status(500).json({
        message: "Erreur lors de la suppression du média",
        error: details,
      });
    }
  }
}

import { Request, Response } from "express";
import { AppDataSource } from "../datasource";
import Questionnaire from "../entities/Questionnaire";
import Question from "../entities/Question";
import User from "../entities/User";
import { Media } from "../entities/Media";

export default class QuestionnaireController {
  public async create(req: Request, res: Response) {
    const { title, createdBy } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Le titre est obligatoire" });
    }

    if (!createdBy) {
      return res.status(400).json({ message: "createdBy est obligatoire" });
    }

    if (!req.body.questions) {
      return res.status(400).json({ message: "Au moins une question est obligatoire" });
    }

    let questions: Array<{ content: string; response: { x: number; y: number }[] }>;
    try {
      questions = typeof req.body.questions === "string"
        ? JSON.parse(req.body.questions)
        : req.body.questions;
    } catch {
      return res.status(400).json({ message: "Format des questions invalide, JSON attendu" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Au moins une question est obligatoire" });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Une image par question est obligatoire" });
    }
    if (files.length !== questions.length) {
      return res.status(400).json({
        message: `Le nombre d'images (${files.length}) doit correspondre au nombre de questions (${questions.length})`,
      });
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]!;
      if (!q.content || typeof q.content !== "string" || q.content.length < 4 || q.content.length > 200) {
        return res.status(400).json({ message: `La question ${i + 1} doit avoir un contenu entre 4 et 200 caractères` });
      }
      if (!Array.isArray(q.response) || q.response.length < 3) {
        return res.status(400).json({ message: `La question ${i + 1} doit avoir au moins 3 coordonnées pour former un polygone` });
      }
      const allValid = q.response.every(
        (p: unknown) => typeof (p as any).x === "number" && typeof (p as any).y === "number"
      );
      if (!allValid) {
        return res.status(400).json({ message: `Les coordonnées de la question ${i + 1} doivent avoir des propriétés x et y numériques` });
      }
    }

    const user = await User.findOneBy({ id: createdBy });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    try {
      const result = await AppDataSource.transaction(async (manager) => {
        const questionnaire = manager.create(Questionnaire, {
          title,
          createdBy: user,
        });
        const savedQuestionnaire = await manager.save(questionnaire);

        const savedQuestions: Question[] = [];
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i]!;
          const file = files[i]!;
          const media = manager.create(Media, {
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
          });
          const question = manager.create(Question, {
            content: q.content,
            response: q.response,
            createdBy: user,
            questionnaire: savedQuestionnaire,
            media,
          });
          savedQuestions.push(await manager.save(question));
        }

        return { ...savedQuestionnaire, questions: savedQuestions };
      });

      return res.status(201).json(result);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      return res.status(500).json({
        message: "Erreur lors de la création du questionnaire",
        error: details,
      });
    }
  }

  public async getAll(_req: Request, res: Response) {
    try {
      const questionnaires = await Questionnaire.find({
        relations: { createdBy: true, questions: true },
      });
      return res.status(200).json(questionnaires);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ message: "Erreur lors de la récupération des questionnaires", error: details });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const questionnaire = await Questionnaire.findOne({
        where: { id },
        relations: { createdBy: true, questions: true },
      });
      if (!questionnaire) {
        return res.status(404).json({ message: "Questionnaire introuvable" });
      }
      return res.status(200).json(questionnaire);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ message: "Erreur lors de la récupération du questionnaire", error: details });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      const questionnaire = await Questionnaire.findOne({
        where: { id },
        relations: { questions: { media: true } },
      });
      if (!questionnaire) {
        return res.status(404).json({ message: "Questionnaire introuvable" });
      }

      // Récupère tous les médias avant suppression des questions
      const medias = questionnaire.questions
        .map((q) => q.media)
        .filter((m): m is Media => m !== null);

      // Supprime les questions (libère la FK mediaId)
      await Question.delete({ questionnaire: { id } });

      // Supprime chaque média en BDD → @AfterRemove supprime le fichier dans uploads/
      for (const media of medias) {
        await media.remove();
      }

      await Questionnaire.delete(id);
      return res.status(200).json({ message: "Questionnaire supprimé avec succès" });
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ message: "Erreur lors de la suppression du questionnaire", error: details });
    }
  }
}


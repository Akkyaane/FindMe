import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { IsString } from "class-validator";
import { Questionnaire } from "./Questionnaire";

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.questions)
  @JoinColumn({ name: "questionnaireId" })
  questionnaire!: Questionnaire;

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdBy" })
  createdBy!: User;

  @Column()
  @IsString()
  content!: string;

  @Column({ nullable: true })
  response!: string;

  @Column({ nullable: true })
  image!: string;
}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { IsDate, IsString } from "class-validator";
import User from "./User";
import Question from "./Question";

@Entity()
export default class Questionnaire extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  title!: string;

  @CreateDateColumn()
  @IsDate()
  createdAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdBy" })
  createdBy!: User;

  @OneToMany(() => Question, (question) => question.questionnaire)
  questions!: Question[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import User from "./User";
import {
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import Questionnaire from "./Questionnaire";
import { Media } from "./Media";

@Entity()
export default class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdBy" })
  createdBy!: User;

  @Column()
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  content!: string;

  @Column({ type: "simple-json", nullable: true })
  response!: { x: number; y: number }[] | null;

  @Column({ nullable: true })
  image!: string;

  @ManyToOne(() => Questionnaire)
  @JoinColumn({ name: "questionnaire" })
  questionnaire!: Questionnaire;

  @OneToOne(() => Media, (media) => media.question, { nullable: true, eager: true, cascade: true })
  @JoinColumn({ name: "mediaId" })
  media!: Media | null;
}

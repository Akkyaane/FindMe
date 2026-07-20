import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import User from "./User";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  ArrayMinSize,
  IsMimeType,
} from "class-validator";
import Questionnaire from "./Questionnaire";

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

  @Column({ nullable: true })
  @ArrayMinSize(4)
  response!: string;

  @Column({ nullable: true })
  @IsMimeType()
  image!: string;

  @ManyToOne(() => Questionnaire)
  @JoinColumn({ name: "questionnaire" })
  questionnaire!: Questionnaire;
}

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
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  ArrayMinSize,
  IsMimeType,
  IsJSON,
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

  @Column({ nullable: true })
  // @IsArray()
  // @ArrayMinSize(4)
  response!: string;

  @Column({ nullable: true })
  @IsJSON()
  @IsMimeType()
  image!: string;

  @ManyToOne(() => Questionnaire)
  @JoinColumn({ name: "questionnaire" })
  questionnaire!: Questionnaire;

  @OneToOne(() => Media, (media) => media.question, { nullable: true, eager: true, cascade: true })
  @JoinColumn({ name: "mediaId" })
  media!: Media | null;
}

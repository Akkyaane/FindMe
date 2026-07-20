import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  AfterRemove,
} from "typeorm";
import Question from "./Question";
import fs from "fs";
import path from "path";

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  filename!: string;

  @Column()
  originalName!: string;

  @Column()
  path!: string;

  @Column()
  mimetype!: string;

  @Column()
  size!: number;

  @OneToOne(() => Question, (question) => question.media)
  question!: Question;

  @AfterRemove()
  removeFile() {
    const fullPath = path.join(process.cwd(), this.path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}

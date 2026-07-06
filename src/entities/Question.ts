import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column({ nullable: true })
  image!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdBy" })
  createdBy!: User;
}
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import {
  IsEmail,
  IsStrongPassword,
  IsString,
  MinLength,
  MaxLength,
} from "class-validator";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column({ select: false })
  @IsStrongPassword()
  password!: string;
}

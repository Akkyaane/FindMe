import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { IsEmail, IsStrongPassword, IsString } from "class-validator";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  username!: string;

  @Column()
  @IsEmail()
  email!: string;

  @Column()
  @IsStrongPassword()
  password!: string;
}

import { Column, Entity } from "typeorm";

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class Users{
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 50 })
  apellido1: string;

  @Column({ length: 50, nullable: true })
  apellido2?: string;

  @Column({ length: 200 })
  password: string;

  @Column({ length: 50, nullable: true, unique: true })
  email: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role = Role.USER;
}
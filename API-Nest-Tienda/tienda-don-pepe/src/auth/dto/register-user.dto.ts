import { IsEmail, IsOptional, IsString, Max, MaxLength, MinLength } from "class-validator";
import { Role } from "../entities/users.entity";

export class RegisterUserDto {
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @MinLength(4, {
    message: 'El nombre debe tener al menos 4 caracteres',
  })
  @MaxLength(50, {
    message: 'El nombre no puede tener más de 50 caracteres',
  })
  nombre: string;

  @IsString({
    message: 'El primer apellido debe ser una cadena de texto',
  })
  @MinLength(4, {
    message: 'El primer apellido debe tener al menos 4 caracteres',
  })
  @MaxLength(50, {
    message: 'El primer apellido no puede tener más de 50 caracteres',
  })
  apellido1: string;

  @IsString({
    message: 'El segundo apellido debe ser una cadena de texto',
  })
  @MinLength(4, {
    message: 'El segundo apellido debe tener al menos 4 caracteres',
  })
  @MaxLength(50, {
    message: 'El segundo apellido no puede tener más de 50 caracteres',
  })
  @IsOptional()
  apellido2?: string;

  @IsString({
    message: 'La fecha de nacimiento debe ser una cadena de texto',
  })
  @IsOptional()
  fecha_nacimiento?: Date| null;

  @IsString({
    message: 'La contraseña debe ser una cadena de texto',
  })
  @MinLength(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  })
  @MaxLength(20, {
    message: 'La contraseña no puede tener más de 20 caracteres',
  })
  password: string;
  
  @IsEmail({}, {
    message: 'El email no es válido',
  })
  @IsString({
    message: 'El email debe ser una cadena de texto',
  })
  email: string;


  @IsString({
    message: 'El rol debe ser una cadena de texto',
  })
  @IsOptional()
  @MaxLength(20, {
    message: 'El rol no puede tener más de 20 caracteres',
  })
  @MinLength(4, {
    message: 'El rol debe tener al menos 4 caracteres',
  })
  role: Role = Role.USER; // Valor por defecto, puedes cambiarlo según tus necesidades
}

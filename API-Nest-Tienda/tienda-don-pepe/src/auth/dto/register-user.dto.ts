import { IsEmail, IsOptional, IsString, Max, MaxLength, MinLength } from "class-validator";
import { Role } from "../entities/users.entity";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    minLength: 4,
    maxLength: 50,
    required: true,
  })
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

  @ApiProperty({
    description: 'Primer apellido del usuario',
    example: 'Pérez',
    minLength: 4,
    maxLength: 50,
    required: true,
  })
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

  @ApiProperty({
    description: 'Segundo apellido del usuario',
    example: 'García',
    minLength: 4,
    maxLength: 50,
    required: false,
  })
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

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-01',
    required: false,
  })
  @IsString({
    message: 'La fecha de nacimiento debe ser una cadena de texto',
  })
  @IsOptional()
  fecha_nacimiento?: Date| null;

  @ApiProperty({
    description: 'Password del usuario',
    example: 'password123',
    minLength: 6,
    maxLength: 20,
    required: true,
  })
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
  
  @ApiProperty({
    description: 'Email del usuario',
    example: 'email@gmail.com',
    required: true,
  })
  @IsEmail({}, {
    message: 'El email no es válido',
  })
  @IsString({
    message: 'El email debe ser una cadena de texto',
  })
  email: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 'user',
    enum: Role,
    required: false,
  })
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

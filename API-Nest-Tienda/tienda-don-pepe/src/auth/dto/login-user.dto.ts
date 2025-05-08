import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'email@gmail.com',
    minLength: 4,
    maxLength: 50,
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
}
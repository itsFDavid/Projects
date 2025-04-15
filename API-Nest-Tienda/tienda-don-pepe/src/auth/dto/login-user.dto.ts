import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
  @IsEmail({}, {
    message: 'El email no es válido',
  })
  @IsString({
    message: 'El email debe ser una cadena de texto',
  })
  email: string;

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
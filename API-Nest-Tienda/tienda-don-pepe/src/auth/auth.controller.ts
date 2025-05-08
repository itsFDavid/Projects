import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterUserDto })
  @Post('register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ) {
    return this.authService.registerUser(registerUserDto);
  }

  @ApiBody({ type: LoginUserDto })
  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
  ) {
    console.log('Login User DTO:', loginUserDto);
    return this.authService.loginUser(loginUserDto);
  }
}

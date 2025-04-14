import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const { user, newToken } = await this.authService.validateToken(token);

      request['user'] = user;

      request['token'] = newToken;

      // Si el token es valido, se puede continuar
      if(!user) {
        throw new UnauthorizedException('Token no valido');
      }
      // Si el token es valido, se puede continuar
      if(!newToken) {
        throw new UnauthorizedException('Token no valido');
      }

      return true;
    } catch {
      throw new UnauthorizedException('El token no es valido');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

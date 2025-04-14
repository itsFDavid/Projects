import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { ValidRoles } from '../interfaces';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    if(!validRoles || validRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if(!user) throw new BadRequestException('Usuario no encontrado');

    if (!user.role) throw new BadRequestException('El usuario no tiene rol');

    // Validar que el rol del usuario sea uno de los roles validos
    if (validRoles.includes(user.role as ValidRoles)) {
      return true;
    }

    throw new ForbiddenException(
      `Usuario no tiene el rol necesario para acceder a este recurso.`,
    )
  }
}

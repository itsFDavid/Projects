import { createParamDecorator, ExecutionContext, InternalServerErrorException, Logger } from "@nestjs/common";

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if(!request.token) {
      Logger.error('Token not found in request', 'UserDecorator');
      throw new InternalServerErrorException('Token no encontrado en la peticion');
    }
    return request.token;
  }
);
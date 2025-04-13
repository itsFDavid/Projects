import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) =>{
        const req = ctx.switchToHttp().getRequest();
        const headers = req.rawHeaders;
        if(!headers)throw new Error('Headers no encontrados en la peticion');

        return headers;
    }
)
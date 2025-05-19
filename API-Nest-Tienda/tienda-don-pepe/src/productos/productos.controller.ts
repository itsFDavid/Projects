import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
// types of multer
import { Express } from 'express';
import { extname } from 'path';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { ValidRoles } from 'src/auth/interfaces';
import { RoleProtected } from 'src/auth/decorators';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiBody({ type: CreateProductoDto })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './imagenes',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, webp)'), false);
        }
        callback(null, true);
      },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductoDto: CreateProductoDto
  ) {
    if (file) {
      createProductoDto.imagen = `imagenes/${file.filename}`;
    }

    return this.productosService.create(createProductoDto);
  }

  @Get('seed')
  @ApiOperation({ summary: 'Crear productos de prueba' })
  @ApiResponse({ status: 201, description: 'Productos creados exitosamente' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.ADMIN)
  seed() {
    return this.productosService.seed();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({
    status: 201,
    description: 'Lista de productos retornada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.USER, ValidRoles.ADMIN)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productosService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Buscar un producto por nombre o ID' })
  @ApiParam({ name: 'term', description: 'Nombre o ID del producto' })
  @ApiResponse({ status: 201, description: 'Producto encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.USER, ValidRoles.ADMIN)
  findOne(@Param('term') id: string) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateProductoDto })
  @ApiResponse({
    status: 201,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    console.log(updateProductoDto);
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 201, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}

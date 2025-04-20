import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  create(@Body() createProductoDto: CreateProductoDto) {
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
  @ApiResponse({ status: 201, description: 'Lista de productos retornada exitosamente' })
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
  @ApiResponse({ status: 201, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductoDto: UpdateProductoDto) {
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

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleProtected } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('tiendas')
@Controller('tiendas')
export class TiendasController {
  constructor(private readonly tiendasService: TiendasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una tienda' })
  @ApiBody({ type: CreateTiendaDto })
  @ApiResponse({ status: 201, description: 'Tienda creada' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.ADMIN)
  create(@Body() createTiendaDto: CreateTiendaDto) {
    return this.tiendasService.create(createTiendaDto);
  }

  @Get('seed')
  @ApiOperation({ summary: 'Crear tiendas de prueba' })
  @ApiResponse({ status: 201, description: 'Tiendas creadas' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.ADMIN)
  seed() {
    return this.tiendasService.seed();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tiendas' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'Tiendas encontradas' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.USER, ValidRoles.ADMIN)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tiendasService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Obtener una tienda por ID o nombre' })
  @ApiParam({ name: 'term', description: 'Nombre o ID de la tienda' })
  @ApiResponse({ status: 200, description: 'Tienda encontrada' })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.USER, ValidRoles.ADMIN)
  findOne(@Param('term') id: string) {
    return this.tiendasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tienda por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: CreateTiendaDto })
  @ApiResponse({ status: 200, description: 'Tienda actualizada' })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTiendaDto: CreateTiendaDto) {
    return this.tiendasService.update(id, updateTiendaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tienda por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Tienda eliminada' })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  @UseGuards(AuthGuard, UserRoleGuard)
  @RoleProtected(ValidRoles.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiendasService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Compras')
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una compra' })
  @ApiBody({ type: CreateCompraDto })
  @ApiResponse({ status: 201, description: 'Compra creada' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  create(@Body() createCompraDto: CreateCompraDto) {
    return this.comprasService.create(createCompraDto);
  }

  @Get('seed')
  @ApiOperation({ summary: 'Crear compras de prueba' })
  @ApiResponse({ status: 201, description: 'Compras creadas' })
  seed() {
    return this.comprasService.seed();
  }

  @Get()
  @ApiOperation({ summary: 'Listar compras' })
  @ApiQuery({ type: PaginationDto })
  @ApiOperation({ summary: 'Listar compras' })
  @ApiResponse({ status: 200, description: 'Listado de compras' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.comprasService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una compra por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Compra encontrada' })
  @ApiResponse({ status: 404, description: 'Compra no encontrada' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una compra' })
  @ApiBody({ type: UpdateCompraDto })
  @ApiResponse({ status: 200, description: 'Compra actualizada' })
  @ApiResponse({ status: 404, description: 'Compra no encontrada' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCompraDto: UpdateCompraDto) {
    return this.comprasService.update(id, updateCompraDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una compra' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Compra eliminada' })
  @ApiResponse({ status: 404, description: 'Compra no encontrada' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.remove(id);
  }
}

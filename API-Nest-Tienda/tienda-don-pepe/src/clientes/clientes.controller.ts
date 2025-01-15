import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiBody({ type: CreateClienteDto })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get('seed')
  @ApiOperation({ summary: 'Crear clientes de prueba' })
  @ApiResponse({ status: 201, description: 'Clientes creados exitosamente' })
  seed(){
    return this.clientesService.seed();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 201, description: 'Lista de clientes retornada exitosamente' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.clientesService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Obtener un cliente por ID o nombre' })
  @ApiParam({ name: 'term', type: 'string' })
  @ApiParam({ name: 'term', type: 'number' })
  @ApiResponse({ status: 201, description: 'Cliente encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  findOne(@Param('term') id: string) {
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateClienteDto })
  @ApiOperation({ summary: 'Actualizar un cliente por ID' })
  @ApiResponse({ status: 201, description: 'Cliente actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({ summary: 'Eliminar un cliente por ID' })
  @ApiResponse({ status: 201, description: 'Cliente eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { readFileSync } from 'fs';


@Injectable()
export class ClientesService {

  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
  ){}

  async create(createClienteDto: CreateClienteDto) {
    try {
      const cliente = this.clientesRepository.create(createClienteDto);
      return await this.clientesRepository.save(cliente);
    } catch (error) {
      // si el error es otro, lanzamos una excepcion generica
      throw new NotFoundException(`Error al crear el cliente: ${error.message}`);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.clientesRepository.find({
      relations: ['compras_', 'compras_.detalles_', 'compras_.detalles_.producto'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string | number) {
    const cliente = await this.clientesRepository.createQueryBuilder('cliente')
      .where('cliente.nombre_cliente = :id', { id })
      .orWhere('cliente.id_cliente = :id', { id })
      .leftJoinAndSelect('cliente.compras_', 'compras_')
      .leftJoinAndSelect('compras_.detalles_', 'detalles_')
      .leftJoinAndSelect('detalles_.producto', 'producto')
      .leftJoinAndSelect('compras_.tienda_', 'tienda_')
      .getOne();
    if (!cliente) {
      throw new NotFoundException(`Cliente con termino ${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    this.clientesRepository.merge(cliente, updateClienteDto);
    return await this.clientesRepository.save(cliente);
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    await this.clientesRepository.remove(cliente);
    return;
  }

  async seed(){
    try{
      const clientesJson = readFileSync('src/common/utils/clientes.seed2.json', 'utf8');
      const clientesData = JSON.parse(clientesJson);
  
      const clientes = clientesData.map((cliente: Cliente) =>{
        const createClienteDto: CreateClienteDto ={
          nombre_cliente: cliente.nombre_cliente,
          apellido1: cliente.apellido1,
          apellido2: cliente.apellido2,
          email: cliente.email,
          fecha_nacimiento: new Date(cliente.fecha_nacimiento).toISOString(),
          puntos_compra: cliente.puntos_compra ?? 0,
        };
        return this.create(createClienteDto);
      });
      return await Promise.all(clientes);
    }catch(error){
      throw new Error(`Error al intentar leer el archivo de seed de clientes: ${error.message}`);
    }
  }

  // async addCompra(id: number, compra: Compra){
  //   const cliente = await this.findOne(id);
  //   cliente.compras_.push(compra);
  //   return await this.clientesRepository.save(cliente);
  // }
}

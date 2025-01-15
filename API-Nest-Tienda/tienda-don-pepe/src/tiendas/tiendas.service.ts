import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { Repository } from 'typeorm';
import { Tienda } from './entities/tienda.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { readFileSync } from 'fs';

@Injectable()
export class TiendasService {
  constructor(
    @InjectRepository(Tienda)
    private readonly tiendasRepository: Repository<Tienda>
  ){}
  
  async create(createTiendaDto: CreateTiendaDto) {
    const tienda = this.tiendasRepository.create(createTiendaDto);
    return await this.tiendasRepository.save(tienda);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit= 10, offset = 0 } = paginationDto;
    return await this.tiendasRepository.find({
      relations: ['compras_'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(term: string | number) {
    const tienda = await this.tiendasRepository.createQueryBuilder('tienda')
      .where('tienda.nombre_tienda = :term', { term })
      .orWhere('tienda.id_tienda = :term', { term })
      .leftJoinAndSelect('tienda.compras_', 'compras_')
      .getOne();

    if(!tienda){
      throw new NotFoundException(`Tienda con termino ${term} no encontrada`);
    }

    return tienda;
  }

  async update(id: number, updateTiendaDto: CreateTiendaDto) {
    const tienda = await this.findOne(id);
    try{
      this.tiendasRepository.merge(tienda, updateTiendaDto);
      return await this.tiendasRepository.save(tienda);
    }catch(error){
      throw new Error(`Error en el update de la tienda: ${error.message}`);
    }
  }

  async remove(id: number) {
    const tienda = await this.findOne(id);
  
    if (!tienda) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }
  

    await this.tiendasRepository.manager.transaction(async (transactionalEntityManager) => {
      // Elimina las compras de la tienda
      await transactionalEntityManager.delete('compra', { tienda_: { id_tienda: id } });

      // Finalmente, elimina la tienda
      await transactionalEntityManager.delete(Tienda, { id_tienda: id });
    });
  
    return;
  }

  async seed(){
    try{
      const tiendasJson = readFileSync('src/common/utils/tiendas.seed.json', 'utf-8');
      const tiendasData = JSON.parse(tiendasJson);

      const tiendas = tiendasData.map((tienda: Tienda) =>{
        const tiendaDto: CreateTiendaDto = {
          nombre_tienda: tienda.nombre_tienda,
        }
        return this.create(tiendaDto);
      })
      return await Promise.all(tiendas);
    }catch(error){
      throw new Error(`Error en el seed de tiendas: ${error.message}`);
    }
  }
}

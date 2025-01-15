import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { DataSource, Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleCompra } from './entities/detallle-compra.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { readFileSync } from 'fs';
import { Tienda } from 'src/tiendas/entities/tienda.entity';

@Injectable()
export class ComprasService {

  constructor(
    @InjectRepository(Compra)
    private readonly comprasRepository: Repository<Compra>,

    @InjectRepository(DetalleCompra)
    private readonly detalleCompraRepository: Repository<DetalleCompra>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    private readonly dataSource: DataSource,
  ){}


  async create(createCompraDto: CreateCompraDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { clienteId, tiendaId ,detalles } = createCompraDto;

      // Verificar si el cliente existe
      const cliente = await queryRunner.manager.findOne(Cliente, {
        where: { id_cliente: clienteId },
      });

      if (!cliente) {
        throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
      }
      const tienda = await queryRunner.manager.findOne(Tienda, { where: { id_tienda: tiendaId } });
      if (!tienda) {
        throw new NotFoundException(`Tienda con ID ${tiendaId} no encontrada`);
      }

      // Crear los detalles de la compra y calcular el precio_unitario
      const detallesCompra = await Promise.all(
        detalles.map(async (detalleDto) => {
          const { productoId, cantidad_productos } = detalleDto;



          // Verificar si el producto existe
          const producto = await queryRunner.manager.findOne(Producto, {
            where: { id_producto: productoId },
          });

          if (!producto) {
            throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
          }

          // Verificar si hay suficiente stock
          if (producto.stock < cantidad_productos) {
            throw new BadRequestException(
              `No hay suficiente stock para el producto ${producto.nombre_producto}. Disponible: ${producto.stock}, solicitado: ${cantidad_productos}`,
            );
          }

          // Actualizar el stock
          producto.stock -= cantidad_productos;
          await queryRunner.manager.save(Producto, producto);

          // Calcular el total basado en el precio del producto
          const total = cantidad_productos * producto.precio;


          // Crear el detalle de la compra
          const detalle = queryRunner.manager.create(DetalleCompra, {
            producto,
            cantidad_productos,
            precio_unitario: producto.precio,
            total
          });

          return detalle;
        }),
      );

      // Crear la compra
      const compra = queryRunner.manager.create(Compra, {
        cliente_: cliente,
        tienda_: tienda,
        detalles_: detallesCompra,
      });

      // Guardar la compra y los detalles
      await queryRunner.manager.save(Compra, compra);
      await queryRunner.commitTransaction();

      return compra;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error al crear la compra: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit= 10, offset = 0 } = paginationDto;
    return await this.comprasRepository.find({
      relations: ['cliente_', 'detalles_', 'detalles_.producto', 'tienda_'],
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number) {
    const compra = await this.comprasRepository.findOne({
      where: { id_compra: id },
      relations: ['cliente_', 'detalles_', 'detalles_.producto', 'tienda_'],
    });

    if (!compra) {
      throw new NotFoundException(`Compra con ID ${id} no encontrada`);
    }

    return compra
  }

  async update(id: number, updateCompraDto: UpdateCompraDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const { clienteId, tiendaId ,detalles } = updateCompraDto;
  
      // Verificar cliente
      const cliente = await queryRunner.manager.findOne(Cliente, { where: { id_cliente: clienteId } });
      if (!cliente) throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
  
      const tienda = await queryRunner.manager.findOne(Tienda, { where: { id_tienda: tiendaId } });
      if (!tienda) throw new NotFoundException(`Tienda con ID ${tiendaId} no encontrada`);
      
      // Verificar compra existente
      const compra = await queryRunner.manager.findOne(Compra, { 
        where: { id_compra: id }, 
        relations: ['cliente_','detalles_', 'detalles_.producto', 'tienda_'] 
      });
      if (!compra) throw new NotFoundException(`Compra con ID ${id} no encontrada`);
  
      // Ajustar detalles y stock
      const detallesActualizados = await Promise.all(detalles.map(async (detalleDto) => {
        const { productoId, cantidad_productos } = detalleDto;


  
        const producto = await queryRunner.manager.findOne(Producto, { where: { id_producto: productoId } });
        if (!producto) throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
  
        // Ajustar stock
        const detalleExistente = compra.detalles_.find(d => d.producto.id_producto === productoId);
        if (detalleExistente) {
          producto.stock += detalleExistente.cantidad_productos; // Revertir stock previo
        }
        if (producto.stock < cantidad_productos) {
          throw new BadRequestException(`Stock insuficiente para el producto ${producto.nombre_producto}`);
        }
        producto.stock -= cantidad_productos;
  
        await queryRunner.manager.save(Producto, producto);
  
        // Crear nuevo detalle
        return queryRunner.manager.create(DetalleCompra, {
          producto,
          cantidad_productos,
          precio_unitario: producto.precio,
          total: cantidad_productos * producto.precio,
        });
      }));
  
      compra.cliente_ = cliente;
      compra.detalles_ = detallesActualizados;
      compra.tienda_ = tienda;
  
      await queryRunner.manager.save(Compra, compra);
      await queryRunner.commitTransaction();
  
      return compra;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error al actualizar la compra: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
  
  

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const compra = await queryRunner.manager.findOne(Compra, {
        where: { id_compra: id },
        relations: ['cliente_', 'detalles_', 'detalles_.producto', 'tienda_'],
      });
      if (!compra) throw new NotFoundException(`Compra con ID ${id} no encontrada`);

      const tienda = await queryRunner.manager.findOne(Tienda, { where: { id_tienda: compra.tienda_.id_tienda } });
      if (!tienda) throw new NotFoundException(`Tienda con ID ${compra.tienda_.id_tienda} no encontrada`);
  
      // Restaurar stock
      for (const detalle of compra.detalles_) {
        const producto = await queryRunner.manager.findOne(Producto, { where: { id_producto: detalle.producto.id_producto } });
        if (producto) {
          producto.stock += detalle.cantidad_productos;
          await queryRunner.manager.save(Producto, producto);
        }
      }
  
      // Eliminar compra y detalles
      await queryRunner.manager.delete(DetalleCompra, { compra_: compra });
      await queryRunner.manager.delete(Compra, { id_compra: id });
      await queryRunner.manager.delete(Tienda, { id_tienda: tienda.id_tienda });

  
      await queryRunner.commitTransaction();
      return { message: `Compra con ID ${id} eliminada correctamente` };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error al eliminar la compra: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
  
  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    let errors: string[] = [];  // Array para almacenar los errores
  
    try {
      // Leer el archivo JSON de compras
      const comprasJson = readFileSync('src/common/utils/compras.seed.json', 'utf-8');
      const comprasData = JSON.parse(comprasJson);
  
      // Crear las compras con los detalles
      for (const compraData of comprasData) {
        const { clienteId, tiendaId, detalles } = compraData;
  
        // Verificar si el cliente existe
        const cliente = await queryRunner.manager.findOne(Cliente, {
          where: { id_cliente: clienteId },
        });
  
        if (!cliente) {
          errors.push(`Cliente con ID ${clienteId} no encontrado`);
        }

        const tienda = await queryRunner.manager.findOne(Tienda, { where: { id_tienda: tiendaId } });
        if (!tienda) {
          errors.push(`Tienda con ID ${tiendaId} no encontrada`);
        }
  
        // Crear los detalles de la compra
        const detallesCompra = await Promise.all(
          detalles.map(async (detalleDto) => {
            const { productoId, cantidad_productos } = detalleDto;
  
            // Verificar si el producto existe
            const producto = await queryRunner.manager.findOne(Producto, {
              where: { id_producto: productoId },
            });
  
            if (!producto) {
              errors.push(`Producto con ID ${productoId} no encontrado`);
              return null;  // No continuar si el producto no se encuentra
            }

            const tienda = await queryRunner.manager.findOne(Tienda, { where: { id_tienda: detalleDto.tiendaId } });
            if (!tienda) {
              errors.push(`Tienda con ID ${detalleDto.tiendaId} no encontrada`);
              return null;  // No continuar si la tienda no se encuentra
            }
  
            // Verificar si hay suficiente stock
            if (producto.stock < cantidad_productos) {
              errors.push(
                `No hay suficiente stock para el producto ${producto.nombre_producto}. Disponible: ${producto.stock}, solicitado: ${cantidad_productos}`,
              );
              return null;  // No continuar si no hay suficiente stock
            }
  
            // Actualizar el stock
            producto.stock -= cantidad_productos;
            await queryRunner.manager.save(Producto, producto);
  
            // Calcular el total
            const total = cantidad_productos * producto.precio;
  
            // Crear el detalle de la compra
            return queryRunner.manager.create(DetalleCompra, {
              producto,
              cantidad_productos,
              precio_unitario: producto.precio,
              total,
            });
          }),
        );
  
        // Filtrar los detalles nulos (cuando hubo un error en el producto)
        const detallesCompraFiltrados = detallesCompra.filter(detalle => detalle !== null);
  
        if (detallesCompraFiltrados.length > 0 && cliente) {
          // Crear la compra si hay detalles válidos y el cliente existe
          const compra = queryRunner.manager.create(Compra, {
            cliente_: cliente,
            tienda_: tienda,
            detalles_: detallesCompraFiltrados,
          });
  
          // Guardar la compra y los detalles
          await queryRunner.manager.save(Compra, compra);
        }
      }
  
      // Confirmar la transacción
      await queryRunner.commitTransaction();
      console.log('Seeding de compras completado');
  
      // Mostrar los errores al final del seed
      if (errors.length > 0) {
        console.error('Errores durante el seed:', errors.join('\n'));
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error al realizar el seed de compras:', error.message);
      throw new Error('Error al realizar el seed de compras');
    } finally {
      await queryRunner.release();
    }
  }
    
}

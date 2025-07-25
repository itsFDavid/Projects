import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';

@Injectable()
export class ProductosService {
  private readonly host: string = process.env.HOST || 'http://localhost:3001';
  constructor(

    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,

  ){}

  async create(createProductoDto: CreateProductoDto) {
    try{
      const producto = this.productosRepository.create(createProductoDto);
      return await this.productosRepository.save(producto);
    }catch(error){
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const productos = await this.productosRepository.find({
      skip: offset,
      take: limit,
    });

    return productos.map(producto => ({
      ...producto,
      imagen: producto.imagen ? `${this.host}/${producto.imagen}` : null,
    }));
  }

  async findOne(term: string | number) {
    const producto = await this.productosRepository.createQueryBuilder('producto')
      .where('producto.nombre_producto = :term', { term })
      .orWhere('producto.id_producto = :term', { term })
      .getOne();
    
    if (!producto) {
      throw new BadRequestException(`Producto con termino ${term} no encontrado`);
    }
    return {
      ...producto,
      imagen: producto.imagen ? `${this.host}/${producto.imagen}` : null,
    };
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    
    try {
      const producto = await this.productosRepository.findOneBy({ id_producto: id });
      if (!producto) {
        throw new BadRequestException(`Producto con termino ${id} no encontrado`);
      }
      this.productosRepository.merge(producto, updateProductoDto);
      return await this.productosRepository.save(producto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return await this.productosRepository.remove(producto);
  }

  async seed() {
    try {
      const productosJson = readFileSync('src/common/utils/productos_imgs.json', 'utf8');
      const productosData = JSON.parse(productosJson);

      const productos = productosData.map(async (producto: any) => {
        const createProductoDto: CreateProductoDto = {
          nombre_producto: producto.nombre_producto,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock,
          imagen: producto.imagen // Asegúrate de que tu DTO incluya el campo imagen
        };

        // Verificar si el producto ya existe
        const existingProducto: Producto = await this.productosRepository.findOne({
          where: { nombre_producto: createProductoDto.nombre_producto },
        });

        if (!existingProducto) {
          // Crear el producto con la imagen
          const newProducto = this.productosRepository.create(createProductoDto);
          // Guardar el producto en la base de datos
          return this.productosRepository.save(newProducto);
        }
        // Si el producto ya existe, actualizar stock y mantener la imagen existente
        else {
          const updatedProducto = this.productosRepository.create({
            ...existingProducto,
            stock: existingProducto.stock + createProductoDto.stock,
            // No actualizamos la imagen para no sobrescribir posibles cambios
          });
          return this.productosRepository.save(updatedProducto);
        }
      });

      return await Promise.all(productos);
    } catch (error) {
      throw new Error(`Error al intentar leer el archivo de seed de productos: ${error.message}`);
    }
  }

  handleExceptions(error: any){
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ConflictException('Ya existe un producto con ese nombre');
    }

    throw new BadRequestException('Error al procesar la solicitud');
  }
  
}

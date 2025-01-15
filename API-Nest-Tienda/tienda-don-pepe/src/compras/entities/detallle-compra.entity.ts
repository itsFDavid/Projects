import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Compra } from "./compra.entity";
import { Producto } from "src/productos/entities/producto.entity";


@Entity()
export class DetalleCompra{
    @PrimaryGeneratedColumn()
    id_detalle_compra: number;
  
    @Column({ type: 'double', precision: 10, scale: 2 })
    total: number;
  
    @Column({ length: 255, nullable: true })
    descripcion?: string;
  
    @Column({ type: 'int' })
    cantidad_productos: number;
  
    @Column({ type: 'double', precision: 10, scale: 2 })
    precio_unitario: number;


  
    @ManyToOne(() => Compra, (compra) => compra.detalles_, { onDelete: 'CASCADE' })
    compra_: Compra;
  
    @ManyToOne(() => Producto, (producto) => producto, { onDelete: 'CASCADE' })
    producto: Producto;
}
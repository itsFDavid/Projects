import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id_producto: number;
  
    @Column({ unique: true, length: 50 })
    nombre_producto: string;
  
    @Column({ length: 255, nullable: true })
    descripcion?: string;
  
    @Column({ type: 'double', precision: 10, scale: 2 })
    precio: number;
  
    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ nullable: true })
    imagen?: string; 
}

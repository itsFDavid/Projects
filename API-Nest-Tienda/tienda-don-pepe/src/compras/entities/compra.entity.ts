import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DetalleCompra } from "./detallle-compra.entity";
import { Cliente } from "src/clientes/entities/cliente.entity";

@Entity()
export class Compra {
    @PrimaryGeneratedColumn()
    id_compra: number;
  
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha_compra: Date;
  
    @ManyToOne(() => Cliente, (cliente) => cliente.compras_, { eager: true })
    cliente_: Cliente;
  
    @OneToMany(() => DetalleCompra, (detalle) => detalle.compra_, { cascade: true })
    detalles_: DetalleCompra[];
}

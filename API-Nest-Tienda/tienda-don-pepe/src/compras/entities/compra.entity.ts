import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DetalleCompra } from "./detallle-compra.entity";
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Tienda } from "src/tiendas/entities/tienda.entity";

@Entity()
export class Compra {
    @PrimaryGeneratedColumn()
    id_compra: number;
  
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha_compra: Date;
  
    @ManyToOne(() => Cliente, (cliente) => cliente.compras_, { eager: true })
    cliente_: Cliente;

    @ManyToOne(()=> Tienda, (tienda) => tienda.compras_, { onDelete: 'CASCADE' })
    tienda_: Tienda;
  
    @OneToMany(() => DetalleCompra, (detalle) => detalle.compra_, { cascade: true })
    detalles_: DetalleCompra[];
}

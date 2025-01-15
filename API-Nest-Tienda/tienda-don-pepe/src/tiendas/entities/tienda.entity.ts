import { Compra } from "src/compras/entities/compra.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Tienda {
    @PrimaryGeneratedColumn()
    id_tienda: number;
  
    @Column({ unique: true, length: 100 })
    nombre_tienda: string;
  
    @OneToMany(() => Compra, (compra) => compra.tienda_, { cascade: true })
    compras_: Compra[];
}

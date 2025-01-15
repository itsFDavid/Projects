import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Tienda {
    @PrimaryGeneratedColumn()
    id_tienda: number;
  
    @Column({ unique: true, length: 100 })
    nombre_tienda: string;
  
}

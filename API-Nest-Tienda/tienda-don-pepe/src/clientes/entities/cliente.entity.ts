import { Compra } from "src/compras/entities/compra.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    id_cliente: number;
  
    @Column({ length: 50 })
    nombre_cliente: string;
  
    @Column({ length: 50 })
    apellido1: string;
  
    @Column({ length: 50, nullable: true })
    apellido2?: string;
  
    @Column({ type: 'date', nullable: true })
    fecha_nacimiento?: Date;

    @Column({ length: 50, unique: true, nullable: false })
    email: string;
  
    @Column({ default: 0 })
    puntos_compra: number;
  
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha_registro: Date;
  
    @OneToMany(() => Compra, (compra) => compra.cliente_, { cascade: true })
    compras_: Compra[];


    @BeforeInsert()
    @BeforeUpdate()
    formatDate(){
        if(this.fecha_nacimiento){
            const date = new Date(new Date(this.fecha_nacimiento).toISOString().split('T')[0]);
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() + 1);
            this.fecha_nacimiento = date;
        }
    }

}

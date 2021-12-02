import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class WeaponComponents{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    weapon : string;

    @Column()
    component : string;

}

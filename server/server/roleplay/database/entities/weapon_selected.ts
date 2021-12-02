import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class WeaponSelected{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    weapon : string;
}
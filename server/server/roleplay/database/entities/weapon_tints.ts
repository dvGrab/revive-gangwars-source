import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class WeaponTints{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    weapon : string;

    @Column()
    tint : number;

}

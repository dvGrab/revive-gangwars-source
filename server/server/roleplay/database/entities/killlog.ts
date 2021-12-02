import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Killlog{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    attacker : string;

    @Column()
    victim : string;

    @Column()
    range : number;

    @Column()
    date : string;

    @Column()
    attackerhp : number;

    @Column()
    weapon : number;
}
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Leveling{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    experience : number;

    @Column()
    level : number;

    @Column()
    tokens : number;

    @Column()
    prestige : number;
}   

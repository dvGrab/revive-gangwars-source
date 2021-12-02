import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Gangzones{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    team : number;

    @Column()
    x : number;

    @Column()
    y : number;

    @Column()
    z : number;

    @Column()
    size : number;

    @Column()
    lastteam : number;

    @Column()
    name : string;
}
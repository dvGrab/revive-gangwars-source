import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Egg{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    x : number;

    @Column()
    y : number;
    
    @Column()
    z : number;

    @Column()
    gift : number;
}
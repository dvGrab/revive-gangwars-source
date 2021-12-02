import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Inventory{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    item : string;

    @Column()
    amount : number;

}
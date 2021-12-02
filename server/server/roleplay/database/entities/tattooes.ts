import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Tattooes{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    hash : string;

    @Column()
    zone : number;
}
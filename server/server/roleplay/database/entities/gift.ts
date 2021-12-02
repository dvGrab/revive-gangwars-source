import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Gift{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;


}
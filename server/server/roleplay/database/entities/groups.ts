import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Groups{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    groupname : string;

}
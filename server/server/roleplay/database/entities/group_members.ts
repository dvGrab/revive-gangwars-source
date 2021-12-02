import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class GroupMembers{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    group : number;

    @Column()
    permission : number;
}
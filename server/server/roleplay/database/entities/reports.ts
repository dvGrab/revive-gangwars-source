import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Reports{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    discord : string;

    @Column()
    reason : string;

    @Column()
    timestamp : string;
}
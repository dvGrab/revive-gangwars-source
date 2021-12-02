import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class Warnings{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    reason : string;

    @Column()
    admin : string;

    @Column()
    expire : number;

    @Column()
    date : string;

}

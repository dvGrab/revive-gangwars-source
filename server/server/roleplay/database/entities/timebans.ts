import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Timebans{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    socialclub : string;

    @Column()
    reason : string;

    @Column()
    hwid : string;

    @Column()
    time : number; 

    @Column()
    admin : string;
}
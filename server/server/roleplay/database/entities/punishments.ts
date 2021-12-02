import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Punishments{
    
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    socialclub : string;

    @Column()
    reason : string;

    @Column()
    date : string;

    @Column()
    admin : string;
}
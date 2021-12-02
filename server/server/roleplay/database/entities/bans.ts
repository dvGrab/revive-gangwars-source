import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Bans{

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
    admin : string;

    @Column()
    socialid : string;
}
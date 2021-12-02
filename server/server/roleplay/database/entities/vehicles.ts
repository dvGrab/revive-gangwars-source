import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Vehicles{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    vehicle : string;

    @Column()
    vehiclename : string;

    @Column()
    first_color : number;

    @Column()
    second_color : number;

    @Column()
    copcar : boolean;

    @Column()
    lostcar : boolean;
}
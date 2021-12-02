import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Clothes {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    team: number;

    @Column()
    bandana: number;

    @Column()
    hair: number;

    @Column()
    torso: number;

    @Column()
    legs: number;

    @Column()
    foots: number;

    @Column()
    accessories: number;

    @Column()
    hat: number;
}
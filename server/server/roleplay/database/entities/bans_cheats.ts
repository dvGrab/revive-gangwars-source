import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class BansCheats{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    socialname : string;

    @Column()
    socialid : string;

    @Column()
    hwid : string;

    @Column()
    directhwid : string;
}
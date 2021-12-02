import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Discord{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    message : string;

    @Column()
    command : string;
    
    @Column()
    mention : boolean;
}
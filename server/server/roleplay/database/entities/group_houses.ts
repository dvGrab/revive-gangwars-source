import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class GroupHouses{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    group : number;

    @Column()
    x : number;

    @Column()
    y : number;
    
    @Column()
    z : number;   

    @Column()
    x2 : number;

    @Column()
    y2 : number;
    
    @Column()
    z2 : number;      

    @Column()
    customizable : boolean;

    @Column()
    price : number;

    @Column()
    team : number;
}
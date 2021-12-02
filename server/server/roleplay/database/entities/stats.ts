import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Stats{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    kills : number;

    @Column()
    deaths : number;

    @Column()
    gwkills : number;

    @Column()
    gwdeaths : number;

    @Column()
    money : number;
    
    @Column()
    playtime : number;

    @Column()
    lastlogin : number;

    @Column()
    expboost : number;

    @Column()
    expboosttime : number;

    @Column()
    bounty : number;

    @Column()
    multiaccount: boolean;

    @Column()
    hitmarker : boolean;

    @Column()
    paintball : number;

    @Column()
    shot_hit : number;

    @Column()
    shot_drop : number;
}
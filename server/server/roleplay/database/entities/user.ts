import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Users{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    password : string;

    @Column()
    salt : string;

    @Column()
    socialclub : string;

    @Column()
    mail : string;
    
    @Column()
    admin : number;

    @Column()
    date : string;

    @Column()
    discord : string;

    @Column()
    donator : number;

    @Column()
    hwid : string;

    @Column()
    ip : string;

    @Column()
    reported : boolean;

    @Column()
    group : number;

    @Column()
    language : boolean;

    @Column()
    daily : number;

    @Column()
    chatmute : boolean;

    @Column()
    voicemute : boolean;

    @Column()
    socialid : string;

    @Column()
    token : number;

    @Column()
    donationtime : number;
}
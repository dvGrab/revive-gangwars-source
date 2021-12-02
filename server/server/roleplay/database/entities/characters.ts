import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Characters{
    
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    gender : boolean;

    @Column()
    father : number;

    @Column()
    mother : number;

    @Column()
    fatherblend : number;

    @Column()
    motherblend : number;

    @Column()
    mixture : number;

    @Column()
    nose_width : number;
    
    @Column()
    nose_height : number;

    @Column()
    nose_length : number;

    @Column()
    nose_bridge : number;

    @Column()
    nose_tip : number;

    @Column()
    nose_shift : number;

    @Column()
    brow_height : number;

    @Column()
    brow_width : number;

    @Column()
    check_height : number;

    @Column()
    check_width : number;

    @Column()
    checks_width : number;

    @Column()
    eyes : number;

    @Column()
    lips : number;

    @Column()
    jaw_width : number;

    @Column()
    jaw_height : number;

    @Column()
    chin_length : number;

    @Column()
    chin_position : number;

    @Column()
    chin_width : number;

    @Column()
    chin_shape : number;

    @Column()
    neck : number;

    @Column()
    blemishes : number;

    @Column()
    facialhair : number;

    @Column()
    eyebrows : number;

    @Column()
    ageing : number;

    @Column()
    makeup : number;

    @Column()
    blush : number;

    @Column()
    complexion : number;

    @Column()
    sundamage : number;

    @Column()
    lipstick : number;

    @Column()
    holes : number;

    @Column()
    bodyhair : number;

    @Column()
    haircolor : number;
}
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class VehiclesTuning{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    vehiclehash : number;

    @Column()
    spoiler : number;

    @Column()
    frontbumper : number;

    @Column()
    rearbumper : number;

    @Column()
    sideskirt : number; 

    @Column()
    exhaust : number;

    @Column()
    frame : number;

    @Column()
    grille : number;

    @Column()
    hood : number;

    @Column()
    leftfender : number;

    @Column()
    roof : number;

    @Column()
    window : number;

    @Column()
    wheeltype : number;

    @Column()
    wheelcolor : number;

    @Column()
    wheel : number;

    @Column()
    xenon : number;

    @Column()
    numberplate : number;

    @Column()
    neon : number;

    @Column()
    neonred : number;

    @Column()
    neongreen : number;

    @Column()
    neonblue : number;

    @Column()
    colorr : number;

    @Column()
    colorg : number;

    @Column()
    colorb : number;

    @Column()
    engine : number;

    @Column()
    brake : number;

    @Column()
    transmission : number;

    @Column()
    suspension : number;

    @Column()
    turbo : number;
}
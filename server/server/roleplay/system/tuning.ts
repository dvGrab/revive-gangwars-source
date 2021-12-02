import { Distance } from "../warflags/flags";
import { Player } from "../account/player";
import { Vehicle } from "../vehicles/shops";
import { Teams } from "../spawning/team";
import { parse } from "path";
import { database } from "../database/manager";
import { VehiclesTuning } from "../database/entities/vehicles_tuning";
import { Connection } from "typeorm";
import { overlayError } from "../utils/utils";



enum VehicleParts {
    Spoilers = 0,
    FrontBumper = 1,
    ReadBumper = 2,
    SideSkirt = 3,
    Exhaust = 4,
    Frame = 5,
    Grille = 6,
    Hood = 7,
    LeftFender = 8,
    RightFender = 9,
    Roof = 10,
    PlateHolder = 25,
    Window = 46,
    Wheels = 23,
    Xenon = 22,
    Engine = 11,
    Brakes = 12,
    Transmission = 13,
    Suspension = 15,
    Turbo = 18
};


class TuningManager {
    positions: Vector3Mp[] = [];

    addEnter(position: Vector3Mp) {
        this.positions.push(position);

        mp.blips.new(72, position, { shortRange: true, name: "Tuner", color: 1 });
        mp.markers.new(1, position, 4.0, { color: [255, 255, 255, 80] });
    }

    canEnter(position: Vector3Mp) {
        var returnValue = false;

        this.positions.forEach(element => {

            if (Distance(position, element) > 6)
                return false;

            returnValue = true;

        });

        return returnValue;
    }

    loadTuning(vehicle: Vehicle | VehicleMp, player: Player) {
        database.then(connection => {

            connection.getRepository(VehiclesTuning).findOne({ where: { name: player.name, vehiclehash: vehicle.model } }).then((element: VehiclesTuning) => {

                if (element) {
                    if (!mp.vehicles.exists(vehicle))
                        return false;

                    if (!mp.players.exists(player))
                        return false;

                    vehicle.setMod(VehicleParts.Spoilers, element.spoiler);
                    vehicle.setMod(VehicleParts.FrontBumper, element.frontbumper);
                    vehicle.setMod(VehicleParts.ReadBumper, element.rearbumper);
                    vehicle.setMod(VehicleParts.SideSkirt, element.sideskirt);
                    vehicle.setMod(VehicleParts.Exhaust, element.exhaust);
                    vehicle.setMod(VehicleParts.Frame, element.frame);
                    vehicle.setMod(VehicleParts.Grille, element.grille);
                    vehicle.setMod(VehicleParts.Hood, element.hood);
                    vehicle.setMod(VehicleParts.LeftFender, element.leftfender);
                    vehicle.setMod(VehicleParts.Roof, element.roof);
                    vehicle.windowTint = element.window;
                    vehicle.wheelType = element.wheeltype;
                    vehicle.wheelColor = element.wheelcolor;
                    vehicle.setMod(VehicleParts.Wheels, element.wheel);
                    vehicle.setMod(VehicleParts.Xenon, element.xenon);
                    vehicle.numberPlateType = element.numberplate;

                    vehicle.setMod(VehicleParts.Engine, element.engine);
                    vehicle.setMod(VehicleParts.Brakes, element.brake);
                    vehicle.setMod(VehicleParts.Transmission, element.transmission);
                    vehicle.setMod(VehicleParts.Suspension, element.suspension);
                    vehicle.setMod(VehicleParts.Turbo, element.turbo);

                    if (element.neon > 0) {
                        vehicle.neonEnabled = true;
                        vehicle.setNeonColor(element.neonred, element.neongreen, element.neonblue);
                    }

                    vehicle.setColorRGB(element.colorr, element.colorg, element.colorb, element.colorr, element.colorg, element.colorb);

                }

            });

        });
    }

    saveTuning(tuningVehicleHash: string, jsonParts: string, player: Player) {
        return new Promise(function (resolve, reject) {
            var choosenParts = JSON.parse(jsonParts);

            if (!choosenParts)
                return false;

            database.then(connection => {

                connection.getRepository(VehiclesTuning).findOne({ where: { name: player.name, vehiclehash: parseInt(tuningVehicleHash) } }).then((element: VehiclesTuning) => {

                    if (!element) {

                        var tuningVehicle = new VehiclesTuning();

                        tuningVehicle.name = player.name;
                        tuningVehicle.vehiclehash = parseInt(tuningVehicleHash);
                        tuningVehicle.spoiler = parseInt(choosenParts.spoiler);
                        tuningVehicle.frontbumper = parseInt(choosenParts.frontbumper);
                        tuningVehicle.rearbumper = parseInt(choosenParts.rearbumper);
                        tuningVehicle.sideskirt = parseInt(choosenParts.sideskirt);
                        tuningVehicle.exhaust = parseInt(choosenParts.exhaust);
                        tuningVehicle.frame = parseInt(choosenParts.frame);
                        tuningVehicle.grille = parseInt(choosenParts.grille);
                        tuningVehicle.hood = parseInt(choosenParts.hood);
                        tuningVehicle.leftfender = parseInt(choosenParts.leftfender);
                        tuningVehicle.roof = parseInt(choosenParts.roof);
                        tuningVehicle.window = parseInt(choosenParts.window);
                        tuningVehicle.wheeltype = parseInt(choosenParts.wheeltype);
                        tuningVehicle.wheelcolor = parseInt(choosenParts.wheelcolor);
                        tuningVehicle.wheel = parseInt(choosenParts.wheel);
                        tuningVehicle.xenon = parseInt(choosenParts.xenon);
                        tuningVehicle.numberplate = parseInt(choosenParts.numberplate);
                        tuningVehicle.neon = parseInt(choosenParts.neon);
                        tuningVehicle.neonred = parseInt(choosenParts.neonred);
                        tuningVehicle.neongreen = parseInt(choosenParts.neongreen);
                        tuningVehicle.neonblue = parseInt(choosenParts.neonblue);
                        tuningVehicle.colorr = parseInt(choosenParts.colorr);
                        tuningVehicle.colorg = parseInt(choosenParts.colorg);
                        tuningVehicle.colorb = parseInt(choosenParts.colorb);
                        tuningVehicle.engine = parseInt(choosenParts.engine);
                        tuningVehicle.brake = parseInt(choosenParts.brake);
                        tuningVehicle.transmission = parseInt(choosenParts.transmission);
                        tuningVehicle.suspension = parseInt(choosenParts.suspension);
                        tuningVehicle.turbo = parseInt(choosenParts.turbo);

                        connection.getRepository(VehiclesTuning).save(tuningVehicle).then(() => {
                            resolve("done");
                        });

                    }
                    else {

                        element.name = player.name;
                        element.vehiclehash = parseInt(tuningVehicleHash);
                        element.spoiler = parseInt(choosenParts.spoiler);
                        element.frontbumper = parseInt(choosenParts.frontbumper);
                        element.rearbumper = parseInt(choosenParts.rearbumper);
                        element.sideskirt = parseInt(choosenParts.sideskirt);
                        element.exhaust = parseInt(choosenParts.exhaust);
                        element.frame = parseInt(choosenParts.frame);
                        element.grille = parseInt(choosenParts.grille);
                        element.hood = parseInt(choosenParts.hood);
                        element.leftfender = parseInt(choosenParts.leftfender);
                        element.roof = parseInt(choosenParts.roof);
                        element.window = parseInt(choosenParts.window);
                        element.wheeltype = parseInt(choosenParts.wheeltype);
                        element.wheelcolor = parseInt(choosenParts.wheelcolor);
                        element.wheel = parseInt(choosenParts.wheel);
                        element.xenon = parseInt(choosenParts.xenon);
                        element.numberplate = parseInt(choosenParts.numberplate);
                        element.neon = parseInt(choosenParts.neon);
                        element.neonred = parseInt(choosenParts.neonred);
                        element.neongreen = parseInt(choosenParts.neongreen);
                        element.neonblue = parseInt(choosenParts.neonblue);
                        element.colorr = parseInt(choosenParts.colorr);
                        element.colorg = parseInt(choosenParts.colorg);
                        element.colorb = parseInt(choosenParts.colorb);
                        element.engine = parseInt(choosenParts.engine);
                        element.brake = parseInt(choosenParts.brake);
                        element.transmission = parseInt(choosenParts.transmission);
                        element.suspension = parseInt(choosenParts.suspension);
                        element.turbo = parseInt(choosenParts.turbo);


                        connection.getRepository(VehiclesTuning).save(element).then(() => {
                            resolve("done");
                        });
                    }
                });
            });
        });
    }

    getTuning(tuningVehicleHash: string, player: Player) {
        return new Promise(function (resolve, rejected) {
            database.then(connection => {

                connection.getRepository(VehiclesTuning).findOne({ where: { name: player.name, vehiclehash: parseInt(tuningVehicleHash) } }).then((element: VehiclesTuning) => {

                    if (element)
                        resolve(JSON.stringify(element));
                    else
                        resolve(JSON.stringify(new VehiclesTuning()));

                });

            });
        }
        );

    }
}

export var Tuning = new TuningManager();

Tuning.addEnter(new mp.Vector3(135.41921997070312, -1050.8072509765625, 28.247703552246094));

mp.events.add("server:TuningRequest", (player: Player) => {

    if (!player.vehicle)
        return false;

    var vehicleHash = player.vehicle.model.toString();

    if (Tuning.canEnter(player.position)) {
        Tuning.getTuning(vehicleHash, player).then((value: string) => {
            player.dimension = player.id;
            player.call("client:StartTuning", [vehicleHash, value]);

            player.isCustomizing = true;

            mp.vehicles.forEach((element: Vehicle) => {

                if (element.user == undefined)
                    return false;

                if (element.user != player)
                    return false;

                if (Tuning.canEnter(element.position))
                    element.destroy();

            });

        });
    }
});

mp.events.add("server:SetCarTuning", (player: Player, tuning: string, tuningVehicleHash: string, costs: string) => {
    player.dimension = 0;
    player.isCustomizing = false;

    var vehicleTemp = mp.vehicles.new(parseInt(tuningVehicleHash), new mp.Vector3(138.83140563964844, -1059.69384765625, 28.268829345703125));
    vehicleTemp.numberPlate = player.name;
    player.putIntoVehicle(vehicleTemp, -1);

    mp.vehicles.forEach((entity: Vehicle) => {
        if (entity.id == vehicleTemp.id) {
            entity.user = player;
            entity.timespawned = 0;
        }
    });

    if (player.inventory.getAmount("Fahrzeugteile") < parseInt(costs)) {
        overlayError(player, "Du hast nicht genügend Fahrzeugteile!", "Fehler!");
        Tuning.loadTuning(vehicleTemp, player);
    }
    else {
        player.inventory.removeAmount("Fahrzeugteile", parseInt(costs));
        player.inventory.saveInventory();

        Tuning.saveTuning(tuningVehicleHash, tuning, player).then(() => {
            if (mp.vehicles.exists(vehicleTemp)) {
                Tuning.loadTuning(vehicleTemp, player);
            }
        });
    }
});

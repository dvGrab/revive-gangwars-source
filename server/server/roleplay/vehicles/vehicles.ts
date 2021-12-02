import { Vehicles } from "../database/entities/vehicles";
import { database } from "../database/manager";
import { Player } from "../account/player";

export class vehicles {

    player: Player;
    list: any = [];

    loadPlayerVehicles() {
        database.then(connection => {

            this.list = [];

            connection.getRepository(Vehicles).find({ where: { name: this.player.name } }).then(element => {
                if (element) {
                    element.forEach((vehicle: Vehicles) => {
                        this.list.push(vehicle);
                    });
                }

            });

        });
    }

    shareVehicle(target: Player, vehicleHash: string) {

        if (!this.player.isLoggedIn)
            return false;

        var gaveVehicle: boolean = false;

        database.then(connection => {

            connection.getRepository(Vehicles).find({ where: { vehicle: vehicleHash, name: this.player.name } }).then((elements) => {

                elements.forEach((element: Vehicles) => {

                    if (!mp.players.exists(this.player))
                        return false;

                    if (!gaveVehicle) {

                        gaveVehicle = true;

                        if (!mp.players.exists(target))
                            return false;

                        var newVehicle = new Vehicles();
                        newVehicle.name = target.name;
                        newVehicle.vehicle = element.vehicle;
                        newVehicle.vehiclename = element.vehiclename;

                        connection.getRepository(Vehicles).save(newVehicle).then(() => {

                            if (!mp.players.exists(target))
                                return false;

                            target.vehicles.loadPlayerVehicles();
                            this.player.vehicles.loadPlayerVehicles();
                        });
                    }

                    connection.getRepository(Vehicles).remove(element);
                });

            });

        });
    }

    getVehicleForCarshop() {
        var tempVehicles: any = {};

        this.list.forEach((element: Vehicles) => {
            if (element.copcar == false && element.lostcar == false)
                tempVehicles = { ...tempVehicles, [element.vehicle]: element.vehiclename };
        });

        return JSON.stringify(tempVehicles);
    }

    getCopVehicleForCarshop() {
        var tempVehicles: any = {};

        this.list.forEach((element: Vehicles) => {
            if (element.copcar == true)
                tempVehicles = { ...tempVehicles, [element.vehicle]: element.vehiclename };
        });

        return JSON.stringify(tempVehicles);
    }

    getLostVehicleForCarshop() {
        var tempVehicles: any = {};

        this.list.forEach((element: Vehicles) => {
            if (element.lostcar == true)
                tempVehicles = { ...tempVehicles, [element.vehicle]: element.vehiclename };
        });

        return JSON.stringify(tempVehicles);
    }
}

class VehicleExtended extends Vehicles {
    price: number;
};

class vehicleToPay {

    list: any = [];

    addVehicle(name: string, preview: string, isCopCar: boolean = false, price = 0, isLostMc: boolean = false) {
        var vehicle: any = new Vehicles();
        vehicle.vehicle = name;
        vehicle.vehiclename = preview;
        vehicle.copcar = isCopCar;
        vehicle.lostcar = isLostMc;
        vehicle.price = price;

        this.list.push(vehicle);
    }

    getVehicleForCarshop() {
        var tempVehicles: any = {};

        this.list.forEach((element: VehicleExtended) => {
            if (element.copcar == false && element.lostcar == false)
                tempVehicles = { ...tempVehicles, [element.vehicle]: element.vehiclename + " | Preis: " + element.price + " Tokens" };
        });

        return JSON.stringify(tempVehicles);
    }

    getCopVehicleForCarshop() {
        var tempVehicles: any = {};

        this.list.forEach((element: VehicleExtended) => {
            if (element.copcar == true)
                tempVehicles = { ...tempVehicles, [element.vehicle]: element.vehiclename + " | Preis: " + element.price + " Tokens" };
        });

        return JSON.stringify(tempVehicles);
    }

    getLostVehicleForCarshop() {
        var tempVehicles: any = {};

        this.list.forEach((element: VehicleExtended) => {
            if (element.lostcar == true)
                tempVehicles = { ...tempVehicles, [element.vehicle]: element.vehiclename + " | Preis: " + element.price + " Tokens" };
        });

        return JSON.stringify(tempVehicles);
    }

    getVehiclePrice(name: string) {
        var returnValue: number = 99999;

        this.list.forEach((element: VehicleExtended) => {
            if (element.vehicle != name) return false;
            returnValue = element.price;
        });

        return returnValue;
    }

    getVehiclePreview(name: string): string {
        var returnValue: any = "Unbekanntes Fahrzeug";

        this.list.forEach((element: VehicleExtended) => {
            if (element.vehicle != name) return false;
            returnValue = element.vehiclename;
        });

        return returnValue;
    }
}

export var VehicleToBuy = new vehicleToPay();

//Gangcars
VehicleToBuy.addVehicle("bmx", "BMX Free For Ride", false, 0);

VehicleToBuy.addVehicle("tornado3", "Tornado", false, 3);
VehicleToBuy.addVehicle("primo", "Primo", false, 3);
VehicleToBuy.addVehicle("ingot", "Ingot", false, 3);

VehicleToBuy.addVehicle("chino2", "Chino 2", false, 10);
VehicleToBuy.addVehicle("buccaneer2", "Buccaneer 2", false, 10);
VehicleToBuy.addVehicle("blade", "Blade", false, 10);
VehicleToBuy.addVehicle("virgo", "Virgo", false, 30);
VehicleToBuy.addVehicle("tampa", "Tampa", false, 30);
VehicleToBuy.addVehicle("tulip", "Tulip", false, 10);
VehicleToBuy.addVehicle("stalion", "Stalion", false, 30);
VehicleToBuy.addVehicle("moonbeam2", "Moonbeam 2", false, 30);


VehicleToBuy.addVehicle("dominator", "Dominator", false, 20);
VehicleToBuy.addVehicle("kuruma", "Kuruma", false, 20);
VehicleToBuy.addVehicle("elegy", "Elegy", false, 20);
VehicleToBuy.addVehicle("baller3", "Baller 3", false, 20);
VehicleToBuy.addVehicle("dubsta2", "Dubsta 2", false, 20);
VehicleToBuy.addVehicle("sultanrs", "Sultan RS", false, 30);
VehicleToBuy.addVehicle("faction", "Faction", false, 40);
VehicleToBuy.addVehicle("buffalo", "Buffalo", false, 40);


VehicleToBuy.addVehicle("schafter3", "Schafter V12", false, 30);

VehicleToBuy.addVehicle("avarus", "Avarus", false, 5, true);
VehicleToBuy.addVehicle("daemon", "Daemon", false, 10, true);
VehicleToBuy.addVehicle("gburrito2", "GBurrito2", false, 10, true);
VehicleToBuy.addVehicle("cliffhanger", "Cliffhanger", false, 15, true);
VehicleToBuy.addVehicle("gargoyle", "Gargoyle", false, 20, true);
VehicleToBuy.addVehicle("hexer", "Hexer", false, 25, true);
VehicleToBuy.addVehicle("chimera", "Chimera", false, 30, true);
VehicleToBuy.addVehicle("innovation", "Innovation", false, 35, true);
VehicleToBuy.addVehicle("sanctus", "Sanctus", false, 40, true);
VehicleToBuy.addVehicle("shotaro", "Shotaro", false, 50, true);


VehicleToBuy.addVehicle("faggio", "Faggio", false, 30);
VehicleToBuy.addVehicle("blazer", "Blazer (Quad)", false, 30);
VehicleToBuy.addVehicle("sanchez", "Sanchez", false, 50);
VehicleToBuy.addVehicle("vader", "Vader", false, 50);
VehicleToBuy.addVehicle("fcr2", "FCR2", false, 50);
VehicleToBuy.addVehicle("bf400", "BF400", false, 100);
VehicleToBuy.addVehicle("bati2", "BATI", false, 100);
VehicleToBuy.addVehicle("carbonrs", "Carbon RS", false, 100);
VehicleToBuy.addVehicle("ruffian", "Ruffian", false, 100);
VehicleToBuy.addVehicle("double", "Double", false, 100);
VehicleToBuy.addVehicle("Manchez", "Manchez", false, 100);

VehicleToBuy.addVehicle("jugular", "Jugular - Sports", false, 100);

VehicleToBuy.addVehicle("issi7", "Issi 7 - Sports", false, 100);

VehicleToBuy.addVehicle("locust", "Locust - Sports", false, 200);

VehicleToBuy.addVehicle("drafter", "Drafter - Sports", false, 200);



VehicleToBuy.addVehicle("krieger", "Krieger - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("s80", "S80 - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("thrax", "Thrax - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("emerus", "Emerus - Super Sport", false, 350, false);


VehicleToBuy.addVehicle("autarch", "Autarch - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("italigtb", "ItaliGTB - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("T20", "T20 - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("zentorno", "Zentorno - Super Sport", false, 350, false);

VehicleToBuy.addVehicle("furoregt", "Furore GT - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("infernus2", "Infernus 2 - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("jester", "Jester - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("italigto", "Itali GTO - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("carbonizzare", "Carbonizzare - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("omnis", "Omnis - Super Sport", false, 350, false);
VehicleToBuy.addVehicle("specter", "Specter - Super Sport", false, 350, false);





//Copcars
VehicleToBuy.addVehicle("scorcher", "Mountain Bike", true, 0);
VehicleToBuy.addVehicle("police", "Schlichter Streifenwagen", true, 3);

VehicleToBuy.addVehicle("police2", "Moderner Streifenwagen", true, 15);
VehicleToBuy.addVehicle("police3", "Premium Streifenwagen", true, 15);
VehicleToBuy.addVehicle("fbi", "FBI Streifenwagen", true, 15);
VehicleToBuy.addVehicle("fbi2", "FBI SUV", true, 15);
VehicleToBuy.addVehicle("sheriff2", "Sheriff Truck", true, 15);
VehicleToBuy.addVehicle("riot", "Riot", true, 250);


VehicleToBuy.addVehicle("police4", "Undercover Streifenwagen", true, 30);
VehicleToBuy.addVehicle("policet", "Polizeitruck", true, 30);

VehicleToBuy.addVehicle("policeb", "Polizeimotorrad", true, 30);


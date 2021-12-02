import { Player } from "../account/player";
import { Distance } from "../warflags/flags";
import { VehicleToBuy } from "../vehicles/vehicles";
import { Vehicles } from "../database/entities/vehicles";
import { overlaySuccess } from "../utils/utils";
import { Leveling } from "../database/entities/leveling";
import { Level } from "../account/leveling";
import { database } from "../database/manager";
import { Egg } from "../database/entities/egg";
import { Ranks } from "../admin";

var EggUniqueCars = ["issi4", "brioso", "dominator2", "bifta", "trophytruck"];
var EggCars = ["nero2", "pfister811", "fmj", "prototipo", "sheava", "turismor", "xa21", "t20", "sc1", "italigto"];
var Items = ["Schutzweste", "Verbandskasten"];

enum EggType {
    vehicle = 0,
    item = 1,
    token = 2,
    exp = 3,
    uniqueveh = 4
}

class EggItem {
    id: number;
    position: Vector3Mp;
    object: ObjectMp;
    gift: number;

    constructor(id: number, position: Vector3Mp, gift: number) {
        this.id = id;
        this.position = position;
        this.object = mp.objects.new(mp.joaat("prop_alien_egg_01"), this.position);
        this.gift = gift;
    }
}

class EasterManager {

    list: EggItem[] = [];

    constructor() {
        mp.events.add("Egg:Destroy", (player: Player, x: number, y: number, z: number) => {

            this.list.forEach((element) => {
                if (Distance(element.position, new mp.Vector3(x, y, z)) > 3)
                    return false;

                mp.players.call("Client:StartParticle", ["des_gas_station", "ent_ray_paleto_gas_explosion", element.position.x, element.position.y, element.position.z]);

                this.destroy(element.id);

                if (element.gift == EggType.vehicle) {
                    var carname = EggCars[Math.floor(Math.random() * EggCars.length)];
                    var vehicles = new Vehicles();
                    vehicles.name = player.name;
                    vehicles.vehicle = carname;
                    vehicles.vehiclename = "Osterei - " + carname;
                    vehicles.copcar = false;
                    vehicles.lostcar = false;

                    database.then(connection => {
                        connection.getRepository(Vehicles).save(vehicles).then(() => {
                            player.vehicles.loadPlayerVehicles();
                        });
                    });

                    overlaySuccess(player, "Du hast ein Fahrzeug aus dem Osterei erhalten! ", "Achtung!");
                }

                if (element.gift == EggType.uniqueveh) {
                    var carname = EggUniqueCars[Math.floor(Math.random() * EggUniqueCars.length)];
                    var vehicles = new Vehicles();
                    vehicles.name = player.name;
                    vehicles.vehicle = carname;
                    vehicles.vehiclename = "Osterei - " + carname;
                    vehicles.copcar = false;
                    vehicles.lostcar = false;

                    database.then(connection => {
                        connection.getRepository(Vehicles).save(vehicles).then(() => {
                            player.vehicles.loadPlayerVehicles();
                        });
                    });


                    overlaySuccess(player, "Du hast ein EINZIGARTIGES Fahrzeug aus dem Osterei erhalten!", "Achtung!");
                }

                if (element.gift == EggType.token) {
                    Level.giveTokens(player, 30);
                }

                if (element.gift == EggType.item) {
                    player.inventory.addAmount(Items[Math.floor(Math.random() * Items.length)], 40);
                }

                if (element.gift == EggType.exp) {
                    player.inventory.addAmount("EXP Münze", 30);
                }
            });

        });

        database.then(connection => {

            connection.getRepository(Egg).find().then((element) => {

                element.forEach((egg: Egg) => { this.add(egg.id, new mp.Vector3(egg.x, egg.y, egg.z), egg.gift) })

            });

        });

    }

    add(id: number, position: Vector3Mp, gift: number) {
        this.list.push(new EggItem(id, position, gift));
    }

    destroy(id: number) {
        var element = this.list.find(element => element.id == id);

        if (element) {
            if (!mp.objects.exists(element.object))
                return false;

            element.object.destroy();

            database.then(connection => {
                connection.getRepository(Egg).findOne({ where: { id: id } }).then((element: Egg) => {
                    if (element)
                        connection.getRepository(Egg).remove(element);
                });
            }).then(() => {
                var spliceId = this.list.findIndex(element => element.id == id);
                this.list.splice(spliceId, 1);
            });
        }
    }
}

var Eggs = new EasterManager();

mp.events.addCommand("egg", (player: Player, fullText: string) => {

    if(player.info.admin != Ranks.Projectlead)
        return false;

    database.then(connection => {

        var egg = new Egg();
        egg.gift = parseInt(fullText);
        egg.x = player.position.x;
        egg.y = player.position.y;
        egg.z = player.position.z - 0.70;

        connection.getRepository(Egg).save(egg).then((element) => {
            Eggs.add(element.id, new mp.Vector3(egg.x, egg.y, egg.z), parseInt(fullText));
        });
    });

});
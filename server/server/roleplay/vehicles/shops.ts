import { Player } from "../account/player";
import { getTimeInSeconds, overlayError, overlayInfo } from "../utils/utils";

import { Teams, TeamIds } from "../spawning/team";
import { VehicleToBuy } from "./vehicles";
import { database } from "../database/manager";
import { Vehicles } from "../database/entities/vehicles";
import { Leveling } from "../database/entities/leveling";
import { Translation } from "../chat/translation";
import { animationPlayer } from "../gameplay/animations";
import { Level } from "../account/leveling";
import { Tuning } from "../system/tuning";

export interface Vehicle extends VehicleMp {
    user: PlayerMp;
    timespawned: number;
}

function Distance(target: Vector3Mp, destination: Vector3Mp) {
    return (Math.sqrt(
        (target.x - destination.x) * (target.x - destination.x) +
        (target.y - destination.y) * (target.y - destination.y) +
        (target.z - destination.z) * (target.z - destination.z)) * 2);
};

var vehicleShopPos = [
    new mp.Vector3(-68.39327239990234, -1459.4163818359375, 31.10615921020508), //ballascarshop
    new mp.Vector3(103.21144104003906, -1957.8134765625, 19.743555068969727), //grovegarage
    new mp.Vector3(418.0285949707031, -1518.449951171875, 28.291608810424805),
    new mp.Vector3(-1528.2353515625, 80.14339447021484, 55.68472671508789),
    new mp.Vector3(-1537.6431884765625, -612.7869873046875, 22.600513458251953),
    new mp.Vector3(-197.96270751953125, -1699.3870849609375, 32.468101501464844),//lacosagarage
    new mp.Vector3(1337.985595703125, -1550.537841796875, 52.2078857421875),//bloods,
    new mp.Vector3(1371.247802734375, -1518.63232421875, 56.58983612060547), //bloods2
    new mp.Vector3(480.0514221191406, -1793.0498046875, 27.516250610351562),//vagos
    new mp.Vector3(489.3013000488281, -1730.144287109375, 28.204044342041016),//vagos
    new mp.Vector3(83.60151672363281, -1973.7764892578125, 20.929899215698242),//balls
    new mp.Vector3(-25.319307327270508, -1432.139404296875, 30.6531982421875),
    new mp.Vector3(457.2780456542969, -1017.2918090820312, 27.846696853637695),//pd
    new mp.Vector3(472.7919616699219, -1018.8672485351562, 27.618663787841797),    //pd
    new mp.Vector3(993.5725708007812, -1529.31201171875, 30.358596801757812),
    new mp.Vector3(947.7587890625, -1570.8551025390625, 30.01689338684082),
    new mp.Vector3(-565.828857421875, 302.5116882324219, 81.65142059326172),
    new mp.Vector3(-553.9082641601562, 311.1889953613281, 81.67401123046875),
    new mp.Vector3(1366.6873779296875, -545.2942504882812, 73.83795166015625),
    new mp.Vector3(1345.3402099609375, -608.1898803710938, 73.85558319091797),
    new mp.Vector3(-1128.84033203125, -1612.619384765625, 3.898430824279785),
    new mp.Vector3(-469.6539611816406, -1720.06298828125, 18.1778354644775),
    new mp.Vector3(-441.1819763183594, -1694.5181884765625, 18.592422485351562),
    new mp.Vector3(1226.15185546875, -1602.2734375, 51.45640182495117),
    new mp.Vector3(1270.1304931640625, -1606.3092041015625, 53.28577423095703),
    new mp.Vector3(412.8605041503906, -357.94061279296875, 46.499691009521484),
    new mp.Vector3(-131.2287139892578, 1007.725341796875, 235.2321319580078),
    new mp.Vector3(-1510.442138671875, -21.62312126159668, 56.37226104736328),
    new mp.Vector3(817.1788330078125, -2146.911865234375, 28.315692901611328),
    new mp.Vector3(843.8773803710938, -2191.54296875, 29.26606559753418),
    new mp.Vector3(913.54833984375, 56.07826232910156, 80.39583587646)
];
/* 105.81678771972656 */ //garshop
/* 302.7716369628906 */  //out


var vehicleCarPos = [
    [-75.2325668334961, -1460.677734375, 32.11458969116211, 209.949],
    [96.6762924194336, -1957.892822265625, 20.743852615356445, 317.380],
    [422.69342041015625, -1532.5701904296875, 29.275827407836914, 210.331],
    [-1519.8505859375, 87.98860931396484, 56.351158142089844, 259],
    [-1532.8670654296875, -620.1617431640625, 24.812406539916992, 265],
    [-197.2213897705078, -1695.1748046875, 32.83970260620117, 340],//carballas];
    [1347.35791015625, -1550.180908203125, 52.70548629760742, 9.0],
    [1372.7437744140625, -1521.978515625, 57.144466400146484, 200], //bloods
    [480.0218811035156, -1797.9337158203125, 28.525344848632812, 228],//vagos
    [493.8555908203125, -1730.2056884765625, 29.18781089782715, 250],//vagos
    [87.05424499511719, -1969.614013671875, 20.747438430786133, 317], //grove
    [-25.08804702758789, -1437.2662353515625, 30.653146743774414, 180], //ballas
    [450.8428955078125, -1016.8322143554688, 28.00298500061035, 90],
    [479.32354736328125, -1022.1837768554688, 27.503185272216797, 270],
    [996.0858154296875, -1533.2490234375, 29.851306915283203, 88],
    [951.6932983398438, -1575.369140625, 29.93729782104492, 274],
    [-560.7374267578125, 302.0049743652344, 82.6662368774414, 260],
    [-554.546630859375, 306.673828125, 82.79429626464844, 170],
    [1363.6993408203125, -552.6104736328125, 73.8379516601562, 150],
    [1348.413818359375, -603.334716796875, 73.854843139648, 330],
    [-1125.1544189453125, -1610.1451416015625, 3.898430824279785, 275],
    [-463.5967102050781, -1717.6358642578125, 18.170381546020508, 289],
    [-442.569091796875, -1698.8162841796875, 18.437807083129883, 169],
    [1229.4241943359375, -1607.93994140625, 50.992000579833984, 212],
    [1267.09912109375, -1601.5531005859375, 52.678489685058594, 31],
    [419.0943603515625, -356.6404113769531, 46.72244644165039, 227],
    [-130.44647216796875, 1003.347900390625, 235.23214721679688, 190],
    [-1508.1846923828125, -15.219904899597168, 56.10298538208008, 302],
    [821.7422485351562, -2142.146728515625, 27.86567497253418, 359],
    [850.0478515625, -2187.7265625, 29.38827133178711, 265],
    [916.2297973632812, 55.01837921142578, 79.97515869, 300]
];



setInterval(() => {

    mp.vehicles.forEach((entity: Vehicle) => {

        if (entity.user != undefined) {
            entity.getOccupants().some(val => typeof val == "object") ? (entity.timespawned = 0) : (entity.timespawned++);

            if (entity.timespawned > (3 * 60))
                entity.destroy();
        }

    });
}, 1000);

vehicleShopPos.forEach(entity => {

    mp.markers.new(30, entity, 1.0, {
        color: [255, 0, 0, 50],
        visible: true
    });

    mp.labels.new("Fahrzeuge\n- E Drücken -", new mp.Vector3(entity.x, entity.y, entity.z + 2), {
        los: true,
        font: 4,
        drawDistance: 20.0,
        color: [255, 255, 255, 255]
    });

    mp.blips.new(544, entity, {
        color: 4,
        name: "Garagenshop",
        shortRange: true
    });
});

mp.events.add("giveShopInfo", (player: Player) => {
    if (player.isLoggedIn) {
        var data = { amount: vehicleShopPos.length, pos: vehicleShopPos };

        if (player.team == TeamIds.LSPD)
            player.call("createCarshop", [JSON.stringify(data), player.vehicles.getCopVehicleForCarshop(), VehicleToBuy.getCopVehicleForCarshop(), player.leveling.tokens]);
        else if (player.team == TeamIds.LostMC)
            player.call("createCarshop", [JSON.stringify(data), player.vehicles.getLostVehicleForCarshop(), VehicleToBuy.getLostVehicleForCarshop(), player.leveling.tokens]);
        else
            player.call("createCarshop", [JSON.stringify(data), player.vehicles.getVehicleForCarshop(), VehicleToBuy.getVehicleForCarshop(), player.leveling.tokens]);
    }
});

mp.events.add("buyShopVehicle", (player: animationPlayer, id: number, vehicleName: string) => {

    if (player.isPlayingAnimation)
        return overlayError(player, "Du kannst während einer Animation kein Fahrzeug ausparken.", "Fehler");

    if (vehicleName) {
        var spawnPos = new mp.Vector3(vehicleCarPos[id][0], vehicleCarPos[id][1], vehicleCarPos[id][2])
        var spawnBlocked = false;

        mp.vehicles.forEach((entity: Vehicle) => {

            var distance = Distance(spawnPos, entity.position);

            if (distance <= 9.0)
                spawnBlocked = true;
        });

        if (!spawnBlocked) {
            if (getTimeInSeconds() > (player.lastVehicleTime)) {

                player.lastVehicleTime = getTimeInSeconds() + 60;

                var vehicle = mp.vehicles.new(mp.joaat(vehicleName), spawnPos);

                vehicle.setColorRGB(
                    Teams.getTeamRGBColor(player.team).r, Teams.getTeamRGBColor(player.team).g, Teams.getTeamRGBColor(player.team).b,
                    Teams.getTeamRGBColorSecond(player.team).r, Teams.getTeamRGBColorSecond(player.team).g, Teams.getTeamRGBColorSecond(player.team).b);

                vehicle.rotation = new mp.Vector3(0.0, 0.0, vehicleCarPos[id][3]);
                vehicle.numberPlate = player.name;
                vehicle.numberPlateType = 1;

                player.stopAnimation();
                player.isPlayingAnimation = false;

                player.putIntoVehicle(vehicle, -1);

                if (player.name == "JazzBaalele") {
                    if (vehicle.model == mp.joaat("italigtb")) {
                        vehicle.setColor(120, 120);
                    }
                }

                mp.vehicles.forEach((entity: Vehicle) => {
                    if (entity.id == vehicle.id) {
                        entity.user = player;
                        entity.timespawned = 0;
                    }
                });

                //
                if (mp.players.exists(player))
                    player.call("destroyCarshop");
                // }, 100);

                Tuning.loadTuning(vehicle, player);
            }
            else {
                Translation.add("vehicle:Timeout", "Du kannst nur jede Minute ein Fahrzeug ausparken.", "You only can spawn a vehicle per minute.", "Вы можете заспавнить толькоо 1 транспортное средство за 1 минуту.");
                overlayError(player, Translation.get("vehicle:Timeout", player.language), "Error");
            }

        }
        else {
            player.call("receiveErrorNotifyCarshop", ["Der Fahrzeugspawn ist blockiert.", "Fehler"]);
        }
    }

});

mp.events.add("buyVehicleWithTokens", (player: Player, vehicleName: string) => {
    if (player.isLoggedIn) {
        if (player.leveling.tokens >= VehicleToBuy.getVehiclePrice(vehicleName)) {
            database.then(connection => {

                if (mp.players.exists(player)) {
                    var vehicles = new Vehicles();
                    vehicles.name = player.name;
                    vehicles.vehicle = vehicleName;
                    vehicles.vehiclename = VehicleToBuy.getVehiclePreview(vehicleName);
                    vehicles.copcar = (player.team == TeamIds.LSPD) ? true : false;
                    vehicles.lostcar = (player.team == TeamIds.LostMC) ? true : false;

                    if (mp.players.exists(player)) {
                        connection.getRepository(Vehicles).save(vehicles).then(() => {
                            if (mp.players.exists(player)) {
                                player.outputChatBox("Du hast dir ein neues Fahrzeug gekauft. (" + VehicleToBuy.getVehiclePreview(vehicleName) + ")");
                                player.leveling.tokens -= VehicleToBuy.getVehiclePrice(vehicleName);
                                connection.getRepository(Leveling).save(player.leveling);
                                player.vehicles.loadPlayerVehicles();
                            }
                        });
                    }
                }
            });
        }
        else {
            overlayError(player, "Du hast nicht genügend Tokens für dieses Fahrzeug.", "Fehler");
        }
    }
});

mp.events.add("server:SellVehicle", (player: Player, vehiclename: string) => {

    if (!player.isLoggedIn)
        return false;

    database.then(connection => {

        connection.getRepository(Vehicles).findOne({ where: { name: player.name, vehiclename: VehicleToBuy.getVehiclePreview(vehiclename) } }).then((element: Vehicles) => {

            if (!mp.players.exists(player))
                return false;

            if (!element)
                return overlayError(player, "Dieses Fahrzeug ist nicht zum Verkauf geeignet oder existiert nicht.", "Fehler");

            connection.getRepository(Vehicles).delete(element).then(() => {

                player.vehicles.loadPlayerVehicles();

                var price = VehicleToBuy.getVehiclePrice(vehiclename);
                overlayInfo(player, "Du hast dieses Fahrzeug für " + price + " Tokens verkauft.", "Erfolgreich!");
                Level.giveTokens(player, (price / 2));
            });

        });



    });

});

mp.events.add("server:OpenCarSharing", (player: Player) => {

    if (!player.isLoggedIn)
        return false;

    var playerInDistance: any;

    mp.players.forEach((element: Player) => {

        if (element == player)
            return false;

        if (!element.isLoggedIn)
            return false;

        if (Distance(element.position, player.position) > 3)
            return false;

        playerInDistance = { ...playerInDistance, [element.id]: element.name };
    });

    player.call("client:OpenCarSharing", [player.vehicles.getVehicleForCarshop(), JSON.stringify(playerInDistance)]);

});

mp.events.add("server:GivePlayerVehicle", (player: Player, vehicle: string, playerId: string) => {

    if (Number(vehicle) == 0)
        return overlayError(player, "Du hast kein Fahrzeug ausgewählt!", "Error" );

    if (Number(playerId) == 0)
        return overlayError(player, "Du hast kein Spieler ausgewählt!", "Error" );



    mp.players.forEach((element : Player) => {

        if(element == player)
            return false;

        if(!element.isLoggedIn)  
            return false;

        if(element.id != Number(playerId))
            return false;

        if(Distance(element.position, player.position) > 3)
            return false;

        player.vehicles.shareVehicle(element, vehicle);

        overlayInfo(player, "Du hast das Fahrzeug " + vehicle + " an " + element.name + " weitergegeben!", "Yaay!");
        overlayInfo(element, "Du hast das Fahrzeug " + vehicle + " von " + element.name + " bekommen!", "Yaay!");
    });

});
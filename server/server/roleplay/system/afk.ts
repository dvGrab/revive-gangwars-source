import { Player } from "../account/player";
import { Distance } from "../warflags/flags";
import { Messages } from "../chat/messaging";
import { spawnPlayer } from "../spawning";
import { Zones } from "../events/kingofkill";

export interface AfkPlayer extends Player {

    lastPosition: Vector3Mp;
    counter: number;
    isAfk: boolean;
    lootCounter: number;

    isPlayerRobbing: boolean;
    hasPlayerRobbed: boolean;
    robbingBlip: BlipMp;

    lastZone: Zones;
    isInside: boolean;
    lastWeapon: number;
};

var afkSpawns = [[39.021446228027344, -2100.630615234375, -1017.0957641601562, 8.470995903015137],
[81.0627670288086, -2097.871337890625, -1008.9700927734375, 8.471282005310059],
[189.86572265625, -2111.230712890625, -1004.8651733398438, 8.470967292785645],
[293.20880126953125, -2113.8837890625, -1012.7847290039062, 8.470860481262207],
[254.1824188232422, -2103.393798828125, -1012.2788696289062, 8.469232559204102],
[68.51631164550781, -2089.614501953125, -1010.8749389648438, 8.471163749694824],
[1.1057666540145874, -2093.033203125, -1020.0170288085938, 8.468965530395508],
[270.54193115234375, -2038.359619140625, -1030.380859375, 8.471484184265137],
[182.485107421875, -2038.6541748046875, -1036.259765625, 8.471485137939453]];

var afkSharkSpawns = [[-2020.03369140625, -1051.111328125, -0.07670879364013672],
[-2017.3385009765625, -1055.9119873046875, -0.1911960244178772],
[-2001.8258056640625, -1058.4622802734375, -0.10312721133232117],
[-1992.5030517578125, -1043.0382080078125, -0.17689335346221924],
[-1999.1820068359375, -1032.218994140625, 0.3599499464035034],
[-2009.8572998046875, -1033.4053955078125, -0.23882097005844116],
[-2015.6500244140625, -1043.60791015625, -0.3028322607278824],
[-2014.9205322265625, -1050.2261962890625, -0.48837654292583466]];

var afkSharks: VehicleMp[] = [];

for (var i = 0; i < 7; i++) {
    afkSharks[i] = mp.vehicles.new(mp.joaat("seashark3"), new mp.Vector3(afkSharkSpawns[i][0], afkSharkSpawns[i][1], afkSharkSpawns[i][2]));
    afkSharks[i].dimension = 1;
}

var afkCenter = new mp.Vector3(-2078.731689453125, -1016.1231689453125, -50.384130001068115);
var afkExit = new mp.Vector3(-2106.10595703125, -1011.095703125, 9.002082824707031);
var afkExitLabel = new mp.Vector3(-2106.10595703125, -1011.095703125, 9.502082824707031);
mp.markers.new(1, afkCenter, 300, { color: [255, 0, 0, 40], dimension: 1 });
mp.blips.new(487, afkExit, { shortRange: true, color: 1, dimension: 1 });

mp.labels.new("Verlassen\nDrücke E", afkExitLabel, { color: [255, 0, 0, 250], dimension: 1 });
mp.markers.new(1, afkExit, 1, { color: [255, 0, 0, 40], dimension: 1 });

setInterval(() => {

    for (var i = 0; i < 7; i++) {
        if (afkSharks[i].getOccupant(-1))
            continue;

        afkSharks[i].destroy();
        afkSharks[i] = mp.vehicles.new(mp.joaat("seashark3"), new mp.Vector3(afkSharkSpawns[i][0], afkSharkSpawns[i][1], afkSharkSpawns[i][2]));
        afkSharks[i].dimension = 1;
    }

}, 30 * 1000);

setInterval(() => {

    mp.players.forEach((element: AfkPlayer) => {

        if (!element.isLoggedIn)
            return false;

        if (!element.lastPosition)
            return false;

        if(element.isCustomizing)
            return false;

        var newDistance = Distance(element.lastPosition, element.position);

        if (newDistance < 3) {
            element.counter++;

            if (element.counter >= 300) {

                if (!element.isAfk) {                   
                    element.isAfk = true;
                    spawnAfk(element);
                    Messages.Send("SERVER", "Spieler " + element.name + " ist AFK und nun auf der Yacht!", true);
                }
            }

        }
        else {
            element.lastPosition = element.position;
            element.counter = 0;
        }

        if (element.isAfk) {
            if (Distance(element.position, afkCenter) > 300) {
                spawnAfk(element);
            }
        }

    });



}, 1000);

mp.events.add(RageEnums.EventKey.PLAYER_JOIN, (player: AfkPlayer) => {

    player.lastPosition = new mp.Vector3(0, 0, 0);
    player.counter = 0;

});

mp.events.addCommand("testtele", (player: Player, full: string) => {

    mp.players.call("Client:StartParticle", ["scr_rcbarry1", full, player.position.x, player.position.y, player.position.z]);

});

mp.events.add("Server:ExitAFK", (player : AfkPlayer) => {

    if(Distance(player.position, afkExit) < 5)
    {
        player.isAfk = false;
        player.counter = 0;
        spawnPlayer(player);
    }

});

export function spawnAfk(player : AfkPlayer)
{
    player.call("spawnProtectionEnabled", [false]);
    mp.players.call("Client:StartParticle", ["scr_rcbarry1", "scr_alien_charging", player.position.x, player.position.y, player.position.z]);

    var random = Math.floor(Math.random() * afkSpawns.length);
    player.position = new mp.Vector3(afkSpawns[random][1], afkSpawns[random][2], afkSpawns[random][3]);
    player.dimension = 1;
    player.removeAllWeapons();

    player.streak = 0;
}

mp.events.addCommand("afk", (player : AfkPlayer) => {
   
    player.isAfk = true;
    spawnAfk(player);

});
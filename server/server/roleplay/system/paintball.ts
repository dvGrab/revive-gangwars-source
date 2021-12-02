import { Player } from "../account/player";
import { Distance } from "../warflags/flags";
import { overlayError } from "../utils/utils";
import { Messages } from "../chat/messaging";
import { Level } from "../account/leveling";
import { database } from "../database/manager";
import { Stats } from "../database/entities/stats";
import { Leveling } from "../database/entities/leveling";
import { damagePlayer } from "../weapons/syncing";

var paintballSpawns = [
/* 145.89447021484375 */ [2643.3701171875, 4425.396484375, 40.3127326965332],//paintball
/* 0.1976059377193451 */ [2634.962890625, 4414.84765625, 40.55441665649414],//paintball
/* 309.7200622558594 */ [2624.41796875, 4427.26904296875, 40.334476470947266],//paintball
/* 302.66143798828125 */ [2617.513427734375, 4435.00732421875, 39.48048782348633],//paintball
/* 7.27738618850708 */ [2635.391845703125, 4445.97265625, 40.2626838684082],//paintball
/* 92.20370483398438 */ [2654.506103515625, 4440.171875, 40.235599517822266],//paintball
/* 297.1029968261719 */ [2646.39794921875, 4445.41796875, 40.14955520629883],//paintball
/* 347.8911437988281 */ [2661.6474609375, 4447.8486328125, 40.186187744140625],//paintball
/* 177.4071807861328 */ [2659.688720703125, 4473.3671875, 39.49516677856445],//paintball
/* 169.78079223632812 */ [2655.629150390625, 4476.9638671875, 39.12332534790039],//paintball
/* 103.40235900878906 */ [2675.870849609375, 4456.43212890625, 40.12247085571289]//paintball
];


var paintballIdle = [
/* 271.895263671875 */ [ 250, 2689.98583984375, 4460.44189453125, 40.57204055786133], //ok
/* 271.895263671875 */ [ 250, 2689.98583984375, 4460.44189453125, 40.57204055786133], //ok
/* 272.510986328125 */ [ 250, 2690.6845703125, 4460.1826171875, 40.530517578125], //ok2
/* 255.77130126953125 */ [ 250, 2690.837890625, 4458.5048828125, 40.571224212646484], //ok2
/* 268.54296875 */ [ 250, 2690.919189453125, 4456.13427734375, 40.54209518432617], //ok2
/* 251.67626953125 */ [ 250, 2690.745361328125, 4453.6884765625, 40.5052490234375], //ok2
/* 291.71453857421875 */ [ 250, 2692.785888671875, 4461.81005859375, 40.49550247192383], //ok2
/* 287.70086669921875 */ [ 250, 2693.258544921875, 4459.0751953125, 40.49684524536133], //ok2
/* 284.76983642578125 */ [ 250, 2693.658203125, 4455.95166015625, 40.47428512573242], //ok2
/* 275.29901123046875 */ [ 250, 2693.728271484375, 4452.55078125, 40.498924255371094], //ok2
];




class playerManager {
    player: Player;
    kills: number;
    deaths: number;

    constructor(player: Player) {
        this.player = player;
    }
}

class PaintballManager {

    list: playerManager[] = [];
    dimension: number;
    position: Vector3Mp;
    timer: any = undefined;
    countdown: number = 60;
    startedMatch: boolean = false;
    matchcountdown: number = 0;
    topplayers: Stats[] = [];
    lastwinner: string = "";

    constructor(position: Vector3Mp) {
        this.dimension = Math.floor(Math.random() * 10000);
        this.position = position;

        mp.markers.new(1, this.position, 1.0, { color: [100, 0, 0, 80] });
        mp.blips.new(280, this.position, { color: 15, shortRange: true, name: "Paintball" });
        mp.labels.new("Paintball\n/paintball", new mp.Vector3(this.position.x, this.position.y, this.position.z + 2.0), { color: [255, 255, 0, 255], drawDistance: 15, los: false });

        this.getTopPlayers();
    }

    playerCount() {
        return this.list.length;
    }

    isMatchRunning() {
        if (this.startedMatch)
            return true;
        else
            return false;
    }

    addPlayer(player: Player) {
        if (this.playerCount() >= 10)
            return false;

        if (this.playerCount() == 0) {
            if (this.timer == undefined) {
                this.timer = setInterval(() => {

                    if (this.playerCount() > 1)
                        this.countdown--;

                    if (!this.startedMatch)
                        this.list.forEach((element: playerManager) => {
                            if (mp.players.exists(element.player))
                                element.player.call("client:SetLobbyInfo", [this.playerCount(), this.countdown, JSON.stringify(this.topplayers)]);
                        });

                    if (this.countdown == 0 && this.startedMatch == false) {
                        this.startedMatch = true;

                        this.list.forEach((element: playerManager) => {

                            if (!mp.players.exists(element.player))
                                return false;

                            element.player.call("client:DeleteLobbyInfo", []);
                            element.player.call("client:PaintallReady", []);


                            this.setRandomSpawn(element.player);

                            this.matchcountdown = 180;

                            element.kills = 0;
                            element.deaths = 0;

                            this.getTopPlayers();
                        });
                    }

                    if (this.startedMatch) {

                        if (this.matchcountdown == 0) {
                            this.startedMatch = false;
                            this.countdown = 60;

                            Messages.Send("INFO", "Der Gewinner von Paintball ist " + this.getTopPlayer().player.name + " mit " + this.getTopPlayer().kills + " Kills!", true);
                            this.lastwinner = this.getTopPlayer().player.name;


                            this.getTopPlayer().player.inventory.addAmount("Schutzweste", 5);
                            Level.givePlayerExperience(this.getTopPlayer().player, 250);
                            Level.giveTokens(this.getTopPlayer().player, 3);

                            this.list.forEach((element: playerManager) => {

                                if (!mp.players.exists(element.player))
                                    return false;

                                element.player.spawn(this.position);
                                element.player.position = this.position;
                                element.player.dimension = 0;

                                element.player.call("client:StopPaintball", []);

                            });

                            this.list = [];
                            clearInterval(this.timer);
                            this.timer = undefined;

                        }

                        this.matchcountdown--;

                    }
                }, 1000);
            }
        }

        this.list.push(new playerManager(player));
        player.dimension = this.dimension;

        player.position = new mp.Vector3(paintballIdle[this.playerCount() - 1][1], paintballIdle[this.playerCount() - 1][2], paintballIdle[this.playerCount() - 1][3]);
        player.heading = paintballIdle[this.playerCount() - 1][0];

    }

    getTopPlayer() {
        var toplist = this.list.slice();

        toplist.sort(function (a, b) { return a.kills - b.kills });

        return toplist[toplist.length - 1];

    }

    removePlayer(player: Player) {

        if (!mp.players.exists(player))
            return false;

        player.call("client:StopPaintball", []);

        var playerIndex = this.list.findIndex(element => element.player == player);

        if (playerIndex > -1)
            this.list.splice(playerIndex, 1);
    }

    isPlayerIn(player: Player) {
        var found = this.list.find(element => element.player == player);

        if (found)
            return true;
        else
            return false;
    }

    setRandomSpawn(player: Player) {
        var spawn = paintballSpawns[Math.floor(Math.random() * paintballSpawns.length)];
        player.spawn(new mp.Vector3(spawn[0], spawn[1], spawn[2]));
        player.heading = Math.random() * 360;
        player.dimension = this.dimension;

        player.removeAllWeapons();
        player.giveWeapon(RageEnums.Hashes.Weapon.PISTOL50, 999);
    }

    getTopPlayers() {
        database.then(connection => {

            connection.getRepository(Stats).find({ order: { paintball: "DESC" }, take: 3 }).then((elements) => {

                this.topplayers = [];

                elements.forEach((element) => {
                    this.topplayers.push(element);
                });

            });

        });
    }
}

export var Paintball = new PaintballManager(new mp.Vector3(453.49005126953125, -3074.783203125, 5.099331378936768));


mp.events.addCommand("paintball", (player: Player) => {

    if (Distance(player.position, Paintball.position) > 5)
        return false;

    if (Paintball.isMatchRunning())
        return overlayError(player, "Derzeit läuft eine Runde Paintball", "Fehler");

    if (Paintball.playerCount() >= 10)
        return overlayError(player, "Die Lobby ist voll!", "Fehler");

    if (Paintball.lastwinner == player.name)
        return overlayError(player, "Du hast letzte Runde gewonnen und musst nun eine Runde aussetzen.", "Fehler");

    player.call("client:StartPaintball", []);
    player.call("client:PaintballLobby", []);
    player.call("client:SetLobbyInfo", [Paintball.playerCount(), Paintball.countdown, Paintball.getTopPlayers()]);

    Paintball.addPlayer(player);
});

mp.events.add("playerDeath", (player: damagePlayer, reason: string, killer: Player) => {

    if (Paintball.isPlayerIn(player))
        player.call("client:PaintballHit", []);

    if (!player.killer)
        return false;

    if (!mp.players.exists(player.killer))
        return false;

    if (!Paintball.isPlayerIn(player))
        return false;

    if (!Paintball.isPlayerIn(player.killer))
        return false;

    if (!Paintball.isMatchRunning())
        return false;

    var paintballAttacker = Paintball.list.find(element => element.player == player.killer);
    var paintballVictim = Paintball.list.find(element => element.player == player);

    if (paintballAttacker) {
        paintballAttacker.kills++;
        paintballAttacker.player.stats.paintball++;
    }

    if (paintballVictim)
        paintballVictim.deaths++;

    Messages.Send("SERVER", "Du hast ein Kill im Paintball gemacht. +1 (25 EXP)", false, player.killer);
    Messages.Send("SERVER", "Du wurdest von einen Gegner im Paintball getötet.", false, player);

    Level.givePlayerExperience(player.killer, 25);
});

mp.events.add("playerQuit", (player: Player) => {

    if (Paintball.isPlayerIn(player))
        Paintball.removePlayer(player);

});

mp.events.add("server:ExitPaintball", (player: Player) => {

    if (!Paintball.isPlayerIn(player))
        return false;

    Paintball.removePlayer(player);
    player.call("client:StopPaintball", []);

    player.dimension = 0;
    player.position = Paintball.position;
});
import { Users } from "../database/entities/user";
import { database } from "../database/manager";
import { Punishments } from "../database/entities/punishments";
import { Bans } from "../database/entities/bans";
import { Stats } from "../database/entities/stats";

import { Leveling } from "../database/entities/leveling";
import { playerInventory } from "../inventory/inventory";
import { playerClothes } from "../spawning/clothes";
import { getTimeInSeconds } from "../utils/utils";
import { Timebans } from "../database/entities/timebans";
import { vehicles } from "../vehicles/vehicles";
import { Messages } from "../chat/messaging";
import { Characters } from "../database/entities/characters";
import { Tints } from "../inventory/tints";
import { WebhookClient } from "discord.js";
import { TattooPlayer } from "../player/tattoo";
import { BansCheats } from "../database/entities/bans_cheats";

class playerFunction {

    player: Player;
    currentSessionTime: number = 0;
    timeWhenLoggedIn: number = 0;
    timeSinceLastCall: number = 0;

    constructor(player: Player) {
        this.player = player;
    }

    getPlaytimeSinceLastCall(): number {
        var difference: any = getTimeInSeconds() - this.timeWhenLoggedIn;
        this.timeWhenLoggedIn = getTimeInSeconds();

        if (!difference)
            difference = 0;

        return difference;
    }
}

export interface Player extends PlayerMp {

    info: Users;
    stats: Stats;
    leveling: Leveling;
    character: Characters;
    inventory: playerInventory;
    clothes: playerClothes;
    function: playerFunction;
    vehicles: vehicles;
    tints: Tints;
    tattoo: TattooPlayer;

    lastAttackers: any;

    isLoggedIn: boolean;
    team: number;
    streak: number;
    blipcolor: number;
    teamkills: number;
    vehiclekills: number;
    protectionTime: number;
    blip: BlipMp;
    isInGangzone: boolean;
    modelname: string;
    isSupporting: boolean;
    lastWeaponOnDeath: number;
    isLooting: boolean;
    playtimeSinceLogin: number;
    firstSpawn: boolean;
    houseSpawn: boolean;
    isHacking: boolean;
    isHackingBank: boolean;
    hitmarker: boolean;
    sniperShots: number;
    spawnedInsideHouse: boolean;
    boughtTimestamp: number;

    spawnTimer: any;

    isBreaking: boolean;
    isBreakingTimer: any;
    countryCode: string;

    lastVehicleTime: number;

    savePlayerTimer: any;

    policeGangwarTimer: any;

    onDutyTimer: any;

    adminDildo: ObjectMp;

    usePropTimer: any;

    language: number;

    harvestTimer: any;

    tryingLogin: boolean;

    isCustomizing: boolean;

    mailReset: boolean;

    selectedWeapons: any[];

    directHwid: string;
    socialClubId: string;

    mapSpawn : number;
}

mp.events.add("playerJoin", (player: Player) => {

    player.info = new Users();
    player.leveling = new Leveling();
    player.stats = new Stats();
    player.character = new Characters();
    player.inventory = new playerInventory();
    player.clothes = new playerClothes();
    player.function = new playerFunction(player);
    player.vehicles = new vehicles();
    player.vehicles.player = player;
    player.tints = new Tints(player);
    player.tattoo = new TattooPlayer(player);

    player.selectedWeapons = [];

    player.team = -1;
    player.isLoggedIn = false;
    player.streak = 0;
    player.teamkills = 0;
    player.vehiclekills = 0;
    player.isSupporting = false;
    player.lastWeaponOnDeath = 0;
    player.isLooting = false;
    player.lastAttackers = [];
    player.playtimeSinceLogin = 0;
    player.lastVehicleTime = 0;
    player.firstSpawn = false;
    player.houseSpawn = false;
    player.isHacking = false;
    player.isHackingBank = false;
    player.hitmarker = false;
    player.sniperShots = 0;
    player.spawnedInsideHouse = false;
    player.language = 0;
    player.tryingLogin = false;

    player.isCustomizing = false;

    player.usePropTimer = undefined;

    player.stats.playtime = 0;

    player.mailReset = false;

    player.spawnTimer = undefined;
    player.savePlayerTimer = undefined;
    player.onDutyTimer = undefined;
    player.isBreakingTimer = undefined;
  
    player.policeGangwarTimer = undefined;

    player.isBreaking = false;
    player.clothes.player = player;

    player.harvestTimer = undefined;

    player.mapSpawn = 0;

});

mp.events.add("playerQuit", (player: Player) => {
});

mp.events.add("kickme", (player : Player) => {
    Kick(player, "Banned by DevGrab", "System");
})

export function Kick(player: Player, reason: string, kickerName: string = "System") {

    try {
        if (player != undefined) {
            if (player.type == "player") {
                player.call("kickPlayerMessage", [reason]);
                Messages.Send("SERVER", "Spieler " + player.name + " wurde vom Server gekickt. Grund: " + reason);

                database.then(connection => {

                    var punishment = new Punishments();
                    punishment.name = player.name;
                    punishment.socialclub = player.info.socialclub;
                    punishment.reason = reason;
                    punishment.admin = kickerName;

                    connection.getRepository(Punishments).insert(punishment);
                    player.call("destroyLogin");
                    player.kick(reason);
                }).catch((error) => {
                    console.log(error);
                });

                try {
                    var Discord = new WebhookClient("504448573816176641", "ultuhX3LK5OZoKmG7wUfbX_HE8nPKaxzfb86GIqQdoc7YTTxYKo-fWcCpQmcpae4-aux");
                    var date = new Date();
                    Discord.sendMessage("__**Information zum Kick:**__ :hammer:```Spieler: " + player.name + "\nGrund: " + reason + "\nDatum: " + date.toLocaleString() + "\nAdmin: " + kickerName + "```");
                }
                catch (error) {
                    console.log(error);
                }

            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export function Ban(player: Player, reason: string, kickerName: string = "System") {
    try {
        if (player != undefined) {
            if (player.type == "player") {
                player.call("kickPlayerMessage", [reason + " (Ban)"]);
                Messages.Send("SERVER", "Spieler " + player.name + " wurde vom Server gebannt. Grund: " + reason);

                mp.events.call("client:SetBanMessage", ["yes"]);

                database.then(connection => {

                    var ban = new Bans();
                    ban.name = player.name;
                    ban.socialclub = player.socialClub;
                    ban.reason = reason;
                    ban.hwid = player.serial;
                    ban.admin = kickerName;
                    ban.socialid = player.socialClubId;

                    connection.getRepository(Bans).insert(ban);
                    player.call("destroyLogin");
                    player.kick(reason);
                });

                try {
                    var Discord = new WebhookClient("504448573816176641", "ultuhX3LK5OZoKmG7wUfbX_HE8nPKaxzfb86GIqQdoc7YTTxYKo-fWcCpQmcpae4-aux");
                    var date = new Date();
                    Discord.sendMessage("__**Information zum Ban:**__ :no_entry: ```Spieler: " + player.name + "\nGrund: " + reason + "\nDatum: " + date.toLocaleString() + "\nAdmin: " + kickerName + "```");
                }
                catch (error) {
                    console.log(error);
                }

            }
        }
    }
    catch (error) {
        console.log(error);
    }
}


export function Timeban(player: Player, reason: string, kickerName: string = "System", time: number) {
    try {
        if (player != undefined) {
            if (player.type == "player") {
                player.call("kickPlayerMessage", [reason + " (Timeban)"]);
                Messages.Send("SERVER", "Spieler " + player.name + " wurde vom Server temporär gebannt. Grund: " + reason);

                database.then(connection => {

                    if (mp.players.exists(player)) {
                        connection.getRepository(Timebans).findOne({ where: { name: player.name } }).then((element: Timebans) => {
                            if (mp.players.exists(player)) {

                                if (element) {
                                    var timeban = element;

                                    timeban.admin = kickerName;
                                    timeban.hwid = player.serial;
                                    timeban.reason = reason;
                                    timeban.socialclub = player.socialClub;
                                    timeban.name = player.name;
                                    timeban.time = getTimeInSeconds() + time;

                                    connection.getRepository(Timebans).save(timeban);
                                }
                                else {
                                    var timeban = new Timebans();

                                    timeban.admin = kickerName;
                                    timeban.hwid = player.serial;
                                    timeban.reason = reason;
                                    timeban.socialclub = player.socialClub;
                                    timeban.name = player.name;
                                    timeban.time = getTimeInSeconds() + time;

                                    connection.getRepository(Timebans).insert(timeban);
                                }

                            }

                            player.call("destroyLogin");
                            player.kick(reason);

                        });
                    }

                });


                try {
                    var Discord = new WebhookClient("504448573816176641", "ultuhX3LK5OZoKmG7wUfbX_HE8nPKaxzfb86GIqQdoc7YTTxYKo-fWcCpQmcpae4-aux");
                    var date = new Date();
                    Discord.sendMessage("__**Information zum Timeban:**__ :clock1: ```Spieler: " + player.name + "\nGrund: " + reason + "\nDatum: " + date.toLocaleString() + "\nAdmin: " + kickerName + "```");
                }
                catch (error) {
                    console.log(error);
                }

            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

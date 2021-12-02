import { Player } from "../account/player";
import { database } from "../database/manager";
import { Gangzones } from "../database/entities/gangzones";
import { Ranks } from "../admin";
import { Teams, TeamIds } from "../spawning/team";
import { overlayError } from "../utils/utils";
import { Level } from "../account/leveling";
import { Messages } from "../chat/messaging";
import { Translation } from "../chat/translation";
import { damagePlayer } from "../weapons/syncing";

interface gangzonePlayer extends Player {
    lastweapon: number;
    lastzone: Gangzone;
}

class Gangzone {
    database: number;
    team: number;
    attacker: number;
    position: Vector3Mp;
    blip: BlipMp;
    color: number;
    lastteam: number;
    attackerkills: number;
    victimkills: number;
    isBeingAttacked: boolean;
    size: number;
    menumarker: MarkerMp;
    menulabel: TextLabelMp;
    attackerTimeOut: number;
    victimTimeOut: number;
    anyAttackerInside: boolean;
    anyVictimInside: boolean;
    zoneCooldown: number;
    zoneName: string;
    pistol: boolean;

    constructor(database: number, position: Vector3Mp, team: number, lastteam: number, size: number, zoneName: string) {
        this.database = database;
        this.position = position;
        this.team = team;
        this.lastteam = lastteam;
        this.size = size;
        this.zoneName = zoneName;
    }
}

//initialize gangzone array
var gangzoneBlip: Gangzone[] = [];


mp.events.addCommand("gangzone", (player: Player, fullText: string, size: string, name: string) => {
    if (player.info.admin >= Ranks.Projectlead) {
        database.then(connection => {

            var gangzone = new Gangzones();
            gangzone.team = 0;
            gangzone.x = player.position.x;
            gangzone.y = player.position.y;
            gangzone.z = player.position.z;
            gangzone.size = Number(size);
            gangzone.name = name;

            connection.getRepository(Gangzones).insert(gangzone).then(result => {

                var gangzoneIndex = gangzoneBlip.length - 1;
                gangzoneBlip[gangzoneIndex] = new Gangzone(result.identifiers[0].id, new mp.Vector3(gangzone.x, gangzone.y, gangzone.z + 1), 1, 2, gangzone.size, gangzone.name);
                player.outputChatBox("Du hast die Gangzone erstellt. Datenbank ID: " + gangzoneBlip[gangzoneIndex].database);
                respawnGangzones();
            });

        });
    }
});


database.then(connection => {

    connection.getRepository(Gangzones).find().then((values: Gangzones[]) => {
        values.forEach((entity, i) => {
            gangzoneBlip[i] = new Gangzone(entity.id, new mp.Vector3(entity.x, entity.y, entity.z), entity.team, entity.lastteam, entity.size, entity.name);
        });

        respawnGangzones();
    });

});

function respawnGangzones() {
    gangzoneBlip.forEach((entity: Gangzone) => {

        if (entity.blip)
            entity.blip.destroy();

        entity.blip = mp.blips.new(164, entity.position, { name: "Gangzone - " + entity.zoneName });
        entity.blip.color = (entity.team < 0) ? 0 : Teams.getTeamColorNumber(entity.team);


        if (entity.menumarker)
            entity.menumarker.destroy();

        entity.menumarker = mp.markers.new(0, new mp.Vector3(entity.position.x, entity.position.y, entity.position.z - 1.0), 2.0, {
            color: [100, 255, 255, 255],
        });


        if (entity.menulabel)
            entity.menulabel.destroy();

        entity.menulabel = mp.labels.new("Gangzone - " + entity.zoneName + "\nDrücke E", entity.position, {
            drawDistance: 8
        });

    });
}

setPlayerProgessBars();
setShowPlayerProgess();

export function Distance(target: Vector3Mp, destination: Vector3Mp) {
    return (Math.sqrt(
        (target.x - destination.x) * (target.x - destination.x) +
        (target.y - destination.y) * (target.y - destination.y) +
        (target.z - destination.z) * (target.z - destination.z)) * 2);
};

mp.events.add("showGangzoneMenu", (player: Player) => {

    try {
        gangzoneBlip.forEach((entity: Gangzone) => {

            if (!mp.players.exists(player)) return false;

            var distance = Distance(player.position, entity.position);

            if (distance < 4) {
                if (player.team != TeamIds.LSPD) {

                    if (!entity.isBeingAttacked) {
                        var gangzoneInfo = {
                            team: Teams.getTeamName(entity.team),
                            lastteam: Teams.getTeamName(entity.attacker),
                            attackerkills: entity.attackerkills,
                            victimkills: entity.victimkills,
                            isattacked: entity.isBeingAttacked
                        };

                        player.call("showGangzoneInfo", [JSON.stringify(gangzoneInfo)]);
                    }
                    else
                        overlayError(player, "Hier findet bereits ein Krieg statt!", "Achtung");
                }
                else {

                    if (!entity.isBeingAttacked) return overlayError(player, "Hier findet kein Krieg statt!", "Fehler");

                    if (player.vehicle) return overlayError(player, "Du kannst das nur zu Fuß!", "Fehler");

                    player.playAnimation('missfbi_s4mop', 'plant_bomb_a', 3000, 31);

                    if (player.policeGangwarTimer == undefined) {
                        player.policeGangwarTimer = setTimeout(() => {
                            if (mp.players.exists(player)) {

                                player.policeGangwarTimer = undefined;

                                if (Distance(player.position, entity.position) < 10) {

                                    player.stopAnimation();

                                    mp.players.forEach((element: Player) => {
                                        if ((element.team == entity.attacker) || (element.team == entity.team))
                                            element.call("hidePlayerProgessBars");
                                    });

                                    mp.players.forEach((element: Player) => {

                                        if (element.team == TeamIds.LSPD)
                                            Level.givePlayerExperience(element, 250);

                                    });

                                    mp.players.broadcast("<font color='#FFFF00'>Die Polizei hat den Kampf " + Teams.getTeamName(entity.team) + " gegen " + Teams.getTeamName(entity.attacker) + " beendet. (Zone: " + entity.zoneName + ")</font>");

                                    entity.blip.color = Teams.getTeamColorNumber(entity.team);
                                    entity.isBeingAttacked = false;
                                    entity.attackerkills = 0;
                                    entity.victimkills = 0;
                                    entity.zoneCooldown = 5 * 60;

                                    entity.blip.destroy();

                                    entity.blip = mp.blips.new(164, entity.position, { name: "Gangzone - " + entity.zoneName });
                                    entity.blip.color = (entity.team < 0) ? 0 : Teams.getTeamColorNumber(entity.team);

                                    mp.players.forEach((element: Player) => {
                                        element.call("setZoneFlashing", [entity.blip.id, false]);

                                    });
                                }
                            }
                        }, 15 * 1000);
                    }
                }
            }
        });
    }
    catch (error) {
        console.log("Error warflags:" + error);
    }

});

mp.events.add("startGangwarServerside", (player: Player) => {

    if (player.team == TeamIds.Hitman)
        return false;

    try {

        gangzoneBlip.forEach((entity: Gangzone) => {

            var distance = Distance(player.position, entity.position);

            if (distance < 4) {
                if (entity.isBeingAttacked)
                    return overlayError(player, "Hier findet bereits ein Krieg statt!", "Achtung");

                if (entity.team == player.team)
                    return overlayError(player, "Du kannst das Territorium deiner eigenen Gang nicht angreifen.", "Achtung");

                if (isTeamInFight(entity.team))
                    return overlayError(player, "Die Gang, die du angreifen willst, ist derzeit schon in einem Kampf verwickelt.", "Achtung");

                if (entity.zoneCooldown)
                    return overlayError(player, "Die Zone ist erst in " + Math.round(entity.zoneCooldown / 60) + " Minuten bereit für den nächsten Angriff!", "Achtung");

                entity.attacker = player.team;
                entity.isBeingAttacked = true;
                entity.attackerkills = 0;
                entity.victimkills = 0;
                entity.victimTimeOut = 0;
                entity.attackerTimeOut = 0;

                if (Math.floor(Math.random() * 100) <= 30)
                    entity.pistol = true;
                else
                    entity.pistol = false;


                Translation.add("gangwar:Start", "<font color='" + Teams.getTeamHexColor(player.team) + "'>" + Teams.getTeamName(player.team) + " hat einen Kampf gegen " + Teams.getTeamName(entity.team) + " gestartet. (Zone: " + entity.zoneName + ")</font>",
                    "<font color='" + Teams.getTeamHexColor(player.team) + "'>" + Teams.getTeamName(player.team) + " has started a gangwar against " + Teams.getTeamName(entity.team) + " (Zone: " + entity.zoneName + ")</font>",
                    "<font color='" + Teams.getTeamHexColor(player.team) + "'>" + Teams.getTeamName(player.team) + " начали войну против " + Teams.getTeamName(entity.team) + " (Zone: " + entity.zoneName + ")</font>");

                Translation.globalTranslationPush("gangwar:Start");
            }

        });
    }
    catch (error) {
        console.log(error);
    }
});

mp.events.add("playerDeath", (player: damagePlayer, reason: string, killer: Player) => {

    try {
        if (player.killer == undefined)
            return false;

        if (mp.players.exists(player) && mp.players.exists(player.killer)) {
            gangzoneBlip.forEach((entity: Gangzone) => {

                if (entity.isBeingAttacked) {

                    if (player.killer == undefined)
                        return false;

                    if (player.killer.team == entity.attacker && player.team == entity.team) {
                        var distanceToGangzone = isInsideArea(player, entity.position, entity.size);

                        if (distanceToGangzone) {
                            player.outputChatBox("Du wurdest in eurer Gangzone von dem Feind getötet.");
                            player.killer.outputChatBox("Du hast ein Member der feindlichen Gang getötet. (+" + Level.getExpWithMultiplicator(25, player.killer) + "  Exp!)");

                            player.killer.stats.gwkills++;
                            player.stats.gwdeaths++;

                            if (Math.floor(Math.random() * 100) < 5) {
                                player.killer.inventory.addAmount("Dollar", Math.floor(Math.random() * 10));
                            }

                            if (Math.floor(Math.random() * 100) < 2) {
                                Level.giveTokens(player.killer, 1);
                            }

                            entity.attackerkills += 2;

                            Level.givePlayerExperience(player.killer, 25);
                        }
                    }

                    if (player.killer.team == entity.team && player.team == entity.attacker) {
                        var distanceToGangzone = isInsideArea(player, entity.position, entity.size);

                        if (distanceToGangzone) {

                            Translation.add("gang:Killed", "Du wurdest in der Gangzone von dem Feind getötet.", "You have been killed by an enemy.", "Вы были убиты врагом.")
                            Translation.add("gang:Attacked", "Du hast ein Member der feindlichen Gang getötet. (+" + Level.getExpWithMultiplicator(25, player.killer) + " Exp!)",
                                "You've killed a gangmember of an enemy gang. (+" + Level.getExpWithMultiplicator(25, player.killer) + " Exp!)",
                                "Вы убили человека из вражеской команды. (+" + Level.getExpWithMultiplicator(25, player.killer) + " Exp!)");

                            player.outputChatBox(Translation.get("gang:Killed", player.language));
                            player.killer.outputChatBox(Translation.get("gang:Attacked", player.killer.language));

                            player.killer.stats.gwkills++;
                            player.stats.gwdeaths++;

                            entity.victimkills += 2;

                            if (Math.floor(Math.random() * 100) < 5) {
                                player.killer.inventory.addAmount("Dollar", Math.floor(Math.random() * 10));
                            }

                            if (Math.floor(Math.random() * 100) < 2) {
                                Level.giveTokens(player.killer, 1);
                            }

                            Level.givePlayerExperience(player.killer, 25);
                        }
                    }

                    if (player.killer.team != entity.attacker && player.killer.team != entity.team) {
                        if (player.killer.team != TeamIds.LSPD) {

                            if (player.killer.team == TeamIds.Hitman)
                                return false;

                            var distanceToGangzone = isInsideArea(player, entity.position, entity.size);

                            if (distanceToGangzone) {
                                player.killer.outputChatBox("Du hast dich in einen fremden Gangkampf eingemischt! (-" + Level.getExpWithMultiplicator(50, player.killer) + "  Exp!)");

                                Level.givePlayerExperience(player.killer, -100);
                            }
                        }
                    }
                }
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});

function setPlayerProgessBars() {
    try {
        setInterval(() => {

            gangzoneBlip.forEach((entity: Gangzone) => {

                if (entity.isBeingAttacked) {
                    entity.anyAttackerInside = false;
                    entity.anyVictimInside = false;

                    mp.players.forEach((player: Player) => {

                        if (player.isLoggedIn) {
                            if (isInsideArea(player, entity.position, entity.size)) {
                                if (player.team == entity.team) {
                                    var data = JSON.stringify({ attacker: entity.victimkills, victim: entity.attackerkills, attackerid: entity.team, victimid: entity.attacker });
                                    player.call("setGangwarProgress", [data]);
                                    entity.anyVictimInside = true;
                                }

                                if (player.team == entity.attacker) {
                                    var data = JSON.stringify({ attacker: entity.attackerkills, victim: entity.victimkills, attackerid: entity.attacker, victimid: entity.team });
                                    player.call("setGangwarProgress", [data]);
                                    entity.anyAttackerInside = true;
                                }
                            }

                            player.call("setZoneFlashing", [entity.blip.id, true]);

                        }
                    });

                    if (!entity.anyAttackerInside)
                        entity.attackerTimeOut++;
                    else
                        entity.attackerTimeOut = 0;

                    if (!entity.anyVictimInside)
                        entity.victimTimeOut++;
                    else
                        entity.victimTimeOut = 0;

                    if (entity.attackerTimeOut >= 30) {
                        entity.victimkills += 2;
                        entity.attackerTimeOut = 0;
                    }

                    if (entity.victimTimeOut >= 30) {
                        entity.attackerkills += 2;
                        entity.victimTimeOut = 0;
                    }

                    if (entity.attackerkills >= 100) {

                        mp.players.forEach((element: Player) => {
                            if ((element.team == entity.attacker) || (element.team == entity.team))
                                element.call("hidePlayerProgessBars");
                        });


                        mp.players.forEach((element: Player) => {

                            if (element.team == entity.attacker)
                                Level.givePlayerExperience(element, 250);


                            element.call("Gangzone:Changed", [entity.database, Teams.getTeamColorNumber(entity.team)]);
                        });

                        mp.players.broadcast("<font color='#FFFF00'>Die Gang " + Teams.getTeamName(entity.attacker) + " hat den Kampf gegen " + Teams.getTeamName(entity.team) + " gewonnen. (Zone: " + entity.zoneName + ")</font>");


                        entity.blip.color = entity.attacker;
                        entity.isBeingAttacked = false;
                        entity.team = entity.attacker;
                        entity.attackerkills = 0;
                        entity.victimkills = 0;
                        entity.zoneCooldown = 10 * 60;
                        entity.blip.destroy();

                        entity.blip = mp.blips.new(164, entity.position, { name: "Gangzone - " + entity.zoneName });
                        entity.blip.color = (entity.team < 0) ? 0 : Teams.getTeamColorNumber(entity.team);

                        mp.players.forEach((element: Player) => {
                            element.call("setZoneFlashing", [entity.blip.id, false]);
                        });

                        database.then(connection => {
                            var zone = new Gangzones();
                            zone.lastteam = entity.attacker;
                            zone.team = entity.attacker;
                            zone.id = entity.database;

                            connection.getRepository(Gangzones).save(zone);

                        });
                    }

                    if (entity.victimkills >= 100) {
                        mp.players.forEach((element: Player) => {
                            if ((element.team == entity.attacker) || (element.team == entity.team))
                                element.call("hidePlayerProgessBars");
                        });

                        mp.players.forEach((element: Player) => {

                            if (element.team == entity.team)
                                Level.givePlayerExperience(element, 250);

                            element.call("Gangzone:Changed", [entity.database, Teams.getTeamColorNumber(entity.team)]);

                        });


                        Messages.Send("INFO", "Die Gang " + Teams.getTeamName(entity.team) + " hat ihre Zone gegen " + Teams.getTeamName(entity.attacker) + " verteidigt. (Zone: " + entity.zoneName + ")", true);

                        entity.blip.color = Teams.getTeamColorNumber(entity.team);

                        entity.isBeingAttacked = false;
                        entity.attackerkills = 0;
                        entity.victimkills = 0;
                        entity.zoneCooldown = 5 * 60;


                        entity.blip.destroy();

                        entity.blip = mp.blips.new(164, entity.position, { name: "Gangzone - " + entity.zoneName });
                        entity.blip.color = (entity.team < 0) ? 0 : Teams.getTeamColorNumber(entity.team);

                        mp.players.forEach((element: Player) => {
                            element.call("setZoneFlashing", [entity.blip.id, false]);
                        });

                        database.then(connection => {
                            var zone = new Gangzones();
                            zone.lastteam = entity.attacker;
                            zone.team = entity.team;
                            zone.id = entity.database;

                            connection.getRepository(Gangzones).save(zone);

                        });
                    }
                }
                else {
                    if (entity.zoneCooldown)
                        entity.zoneCooldown--;
                }
            });

        }, 1000);
    }
    catch (error) {
        console.log(error);
    }
}

mp.events.add(RageEnums.EventKey.PLAYER_SPAWN, (player: gangzonePlayer) => {

    if (player.isLoggedIn) {
        player.call("hidePlayerProgessBars");
        player.isInGangzone = false;
    }

});

function setShowPlayerProgess() {

    setInterval(() => {

        mp.players.forEach((element: gangzonePlayer) => {

            if (!element.isLoggedIn)
                return false;

            var zone = isPlayerInsideAnyZone(element);

            if (!zone) {
                if (element.isInGangzone) {
                    element.isInGangzone = false;
                    element.call("hidePlayerProgessBars");

                    if (element.lastzone != undefined) {
                        if (element.lastzone.pistol) {
                            element.removeAllWeapons();

                            Level.getWeaponToSpawn(element).forEach((weaponName: string) => {
                                element.giveWeapon(mp.joaat(weaponName), 2000);
                            });

                            if (element.spawnedInsideHouse)
                                element.giveWeapon(RageEnums.Hashes.Weapon.SPECIALCARBINE_MK2, 2000);

                            if (element.sniperShots) {
                                element.giveWeapon(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, element.sniperShots);
                                element.setWeaponAmmo(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, element.sniperShots);
                            }

                            if (element.team == TeamIds.LSPD) {
                                element.giveWeapon(RageEnums.Hashes.Weapon.NIGHTSTICK, 1);
                                element.giveWeapon(RageEnums.Hashes.Weapon.FLAREGUN, 10);
                                element.giveWeapon(RageEnums.Hashes.Weapon.FLARE, 20);
                            }

                            element.giveWeapon(element.lastweapon, 1);
                        }
                    }
                }
            }
            else {
                if (!element.isInGangzone) {
                    if (zone.isBeingAttacked) {

                        element.isInGangzone = true;

                        if (zone.pistol) {
                            element.lastzone = zone;
                            element.lastweapon = element.weapon;
                            element.removeAllWeapons();

                            element.giveWeapon(RageEnums.Hashes.Weapon.PISTOL, 2000);
                            element.giveWeapon(RageEnums.Hashes.Weapon.REVOLVER, 2000);
                            element.giveWeapon(RageEnums.Hashes.Weapon.COMBATPISTOL, 2000);
                            element.giveWeapon(RageEnums.Hashes.Weapon.PISTOL50, 2000);
                            element.giveWeapon(RageEnums.Hashes.Weapon.PISTOL, 2000);
                        }
                    }

                }
            }

        });

    }, 1000);

}


/*
   try {

        setInterval(() => {

            mp.players.forEach((player: Player) => {

                if (!player.isLoggedIn) return false;

                var somethingFound = false;
                player.isInGangzone = false;
                var distance = false;

                gangzoneBlip.forEach((gangzone: Gangzone) => {

                    if (!somethingFound) {
                        distance = isInsideArea(player, gangzone.position, gangzone.size);

                        if (!player.isInGangzone) {
                            if (distance) {
                                player.isInGangzone = true;
                                somethingFound = true;
                            }

                            player.outputChatBox("Hey!");
                        }
                    }
                });

                if (!player.isInGangzone)
                    
            });

        }, 1000);
    }
    catch (error) {
        console.log(error);
    }
*/


function isTeamInFight(teamid: number): boolean {
    var isInFight: boolean = false;

    gangzoneBlip.forEach((element: Gangzone) => {

        if (isInFight) return false;

        if (!element.isBeingAttacked) return false;

        if (element.team == teamid)
            isInFight = true;

    });

    return isInFight;
}

mp.events.add(RageEnums.EventKey.PLAYER_READY, (player: Player) => {

    gangzoneBlip.forEach(element => {
        player.call("Gangzone:Create", [element.position.x, element.position.y, element.database, element.blip.color, element.size]);
    });

});

function isInsideArea(player: Player, position: Vector3Mp, range: number) {
    var isInside = false;

    range = range / 2;

    if (player.position.x < (position.x + range))
        if (player.position.x > (position.x - range))
            if (player.position.y < (position.y + range))
                if (player.position.y > (position.y - range))
                    isInside = true;

    return isInside;
}

function isPlayerInsideAnyZone(player: Player): Gangzone | undefined {
    var isInside = undefined;

    gangzoneBlip.forEach((element) => {

        if (!isInsideArea(player, element.position, element.size))
            return false;

        isInside = element;
    });

    return isInside;
}

export function isPlayerInGangzone(playerName: string) {
    var returnValue = false;

    mp.players.forEach((element: Player) => {

        if (!element.isLoggedIn)
            return false;

        if (element.name != playerName)
            return false;

        if (element.isInGangzone)
            returnValue = true;
    });

    return returnValue;
}
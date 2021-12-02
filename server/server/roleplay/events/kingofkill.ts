import { Player } from "../account/player";
import { Distance } from "../warflags/flags";
import { playerClothes } from "../spawning/clothes";
import { Level } from "../account/leveling";
import { Messages } from "../chat/messaging";
import { json } from "body-parser";
import { Teams, teamHelper, TeamIds } from "../spawning/team";
import { getTimeInSeconds, overlayInfo } from "../utils/utils";
import { Translation } from "../chat/translation";
import { damagePlayer } from "../weapons/syncing";

var randomPositions = [
    new mp.Vector3(17.435791015625, -1742.2578125, 20.800870895385742),
    new mp.Vector3(-264.400634765625, -1897.738525390625, 20.255407333374023),
    new mp.Vector3(-168.7305450439453, -1073.7403564453125, 10.185274124145508)
];

var randomWeapons: string[] = [
    "weapon_pistol_mk2",
    "weapon_doubleaction",
    "weapon_smg",
    "weapon_pistol50",
    "weapon_pumpshotgun_mk2",
    "weapon_musket",
    "weapon_assaultrifle",
    "weapon_carbinerifle",
    "weapon_specialcarbine",
    "weapon_compactrifle",
    "weapon_sniperrifle",
    "weapon_microsmg",
    "weapon_combatpistol",
    "weapon_pistol",
    "weapon_mg"
];

interface zonePlayer extends Player {

}

class Team {
    team: number;
    kills: number;
    name: string;

    constructor(team: number, kills: number, name: string) {
        this.team = team;
        this.kills = kills;
        this.name = name;
    }
}

export class Zones {
    name: string;
    position: Vector3Mp;
    radius: number;
    teams: Team[] = [];
    marker: MarkerMp;
    blip: BlipMp;
    weapon: number;
    created: number;

    constructor(name: string, position: Vector3Mp, radius: number, weapon: number) {
        this.name = name;
        this.position = position;
        this.radius = radius;
        this.weapon = weapon;
        this.marker = mp.markers.new(1, this.position, this.radius, { color: [255, 102, 0, 60] });
        this.blip = mp.blips.new(378, this.position, { drawDistance: this.radius, color: 17, shortRange: true });
    }
}

Translation.add("king:New", "Es ist eine neue King of Kill Zone aufgetaucht.", "There is a new King of Kill Zone popping up.", "Появляется новая зона King of Kill.")

class KingOfKill {

    zones: Zones[] = [];
    nextZone: number = 0;

    initialize() {

        setInterval(() => {

            if (this.nextZone < getTimeInSeconds())
                this.addZone((Math.random() * 9999).toString(), randomPositions[Math.floor(Math.random() * randomPositions.length)], 150, randomWeapons[Math.floor(Math.random() * randomWeapons.length)]);

            King.zones.forEach((element: Zones) => {

                if (element.created < getTimeInSeconds()) {
                    if (King.getTopTeam(element).kills <= 0) {
                        Messages.Send("INFO", "Eine Zone wurde von keiner Gang gewonnen!");
                        this.delZone(element.name);
                    }
                    else {
                        Messages.Send("INFO", "Die Gang " + King.getTopTeam(element).name + " hat eine King of Kills Zone mit " + King.getTopTeam(element).kills + " Kills gewonnen!");


                        mp.players.forEach((teamPlayers: Player) => {
                            if (teamPlayers.team != King.getTopTeam(element).team)
                                return false;

                            teamPlayers.inventory.addAmount("Kokain", 1);
                            teamPlayers.inventory.addAmount("Schutzweste", 2);
                            Level.giveTokens(teamPlayers, 1);

                            if (Math.floor(Math.random() * 100) <= 50)
                                teamPlayers.inventory.addAmount("Metallschrott", 10);

                        });

                        this.delZone(element.name);
                    }
                }
            });

            mp.players.forEach((element: damagePlayer) => {

                if (!element.isLoggedIn)
                    return false;

                var zone: Zones = King.isPlayerInZone(element);

                if (element.health < 1)
                    return false;

                if (zone != undefined) {

                    element.lastZone = zone;
                    element.call("client:ShowKingInfo", [King.getTopTeams(zone)]);

                    if (!element.isInside) {
                        element.isInside = true;
                        element.lastWeapon = element.weapon;
                        element.removeAllWeapons();
                        element.giveWeapon(zone.weapon, 2000);

                        overlayInfo(element, "Du hast eine King of Kill Zone betreten. Du darfst nur innerhalb der Zone auf Feinde schießen!", "Achtung!");
                    }
                }
                else {
                    if (element.isInside) {
                        element.isInside = false;
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

                        element.giveWeapon(element.lastWeapon, 1);
                        element.call("client:HideKingInfo", []);
                    }
                }
            })


        }, 250);
    }

    addZone(name: string, position: Vector3Mp, radius: number, weapon: string) {

        var doesPositionExist = false;

        this.zones.forEach((element: Zones) => {

            if (element.position == position)
                doesPositionExist = true;

        });

        if (!doesPositionExist) {

            Translation.globalTranslationPush("king:New");

            this.zones.push(new Zones(name, position, radius, mp.joaat(weapon)));

            var zone = this.zones.find(element => element.name === name);

            if (zone) {
                Teams.teams.forEach((element: teamHelper) => {
                    if (zone)
                        this.addKill(zone, element.id, 0);
                });

                zone.created = getTimeInSeconds() + 3600;
            }

            this.nextZone = getTimeInSeconds() + 1800;
        }
    }

    delZone(name: string) {
        this.zones.forEach((element: Zones) => {
            if (element.name != name)
                return false;

            if (mp.markers.exists(element.marker))
                element.marker.destroy();

            if (mp.blips.exists(element.blip))
                element.blip.destroy();

            this.zones.splice(this.zones.findIndex(element => element.name === name), 1);
        });
    }

    addKill(zone: Zones, team: number, kills: number) {
        var zoneTeamFound = zone.teams.find(element => element.team === team)

        if (!zoneTeamFound)
            zone.teams.push(new Team(team, kills, Teams.getTeamName(team)));

        zone.teams.forEach((element: Team) => {

            if (element.team != team)
                return false;

            element.kills += kills;

        });
    }

    isPlayerInZone(player: Player) {
        var returnValue: Zones | any = undefined;

        this.zones.forEach((element: Zones) => {

            if (Distance(player.position, element.position) > (element.radius + 3))
                return false;

            returnValue = element;

        });

        return returnValue;
    }

    getTopTeams(zone: Zones) {
        var sortedTeams = zone.teams.slice();
        sortedTeams.sort(function (a, b) { return a.kills - b.kills });

        if (sortedTeams)
            return JSON.stringify(sortedTeams);
    }

    getTopTeam(zone: Zones): Team {
        var sortedTeams = zone.teams.slice();
        sortedTeams.sort(function (a, b) { return a.kills - b.kills });

        return sortedTeams[sortedTeams.length - 1];
    }
}

export var King = new KingOfKill();
King.initialize();

mp.events.add("playerDeath", (player: damagePlayer, reason: string, target: Player) => {

    if (player.isInside)
        player.removeAllWeapons();

    player.lastWeapon = RageEnums.Hashes.Weapon.UNARMED;
    player.isInside = false;
    player.call("client:HideKingInfo", []);

    if (!mp.players.exists(player))
        return false;

    if(player.killer == undefined)
        return false;
        
    if (!mp.players.exists(player.killer))
        return false;

    var victimZone = King.isPlayerInZone(player);
    var attackerZone = King.isPlayerInZone(player.killer);

    if (victimZone != undefined && attackerZone != undefined) {

        if (player.team == player.killer.team)
            return false;

        if (victimZone != attackerZone)
            return false;

        King.addKill(attackerZone, player.killer.team, 1);

        if (King.getTopTeam(attackerZone).team == player.killer.team) {
            Level.givePlayerExperience(player.killer, 30);

            Translation.add("king:Bonus", "Du hast für deinen Kill einen Bonus von " + Level.getExpWithMultiplicator(30, player.killer) + " bekommen. (King of Kill Leader)",
                "You received a bonus of " + Level.getExpWithMultiplicator(30, player.killer) + " experience. (King of Kill Leader)",
                "Вы получили бонус в виде " + Level.getExpWithMultiplicator(30, player.killer) + " опыта. (King of Kill Leader)"
            );

            Messages.Send("INFO", Translation.get("king:Bonus", player.language), false, player.killer);
        }
    }

});

mp.events.add(RageEnums.EventKey.PLAYER_WEAPON_CHANGE, (player: damagePlayer, oldWeap: number, newWeap: number) => {

    if (oldWeap == RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2) {
        var zone = King.isPlayerInZone(player);

        if (zone) {
            player.isInside = true;
            player.lastWeapon = player.weapon;
            player.removeAllWeapons();
            player.giveWeapon(zone.weapon, 2000);
        }
    }

});
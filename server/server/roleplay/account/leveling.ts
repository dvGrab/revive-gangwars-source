import { Player } from "./player";
import { Ranks } from "../admin";
import { overlaySuccess, overlayError } from "../utils/utils";
import { Messages } from "../chat/messaging";
import { Translation } from "../chat/translation";
import hash from "fast-sha256";
import { Inventory } from "../database/entities/inventory";

export interface levelingPlayer extends Player {
    selectedWeapons: any[];
};

class levelingWeapons {
    realname: string;
    name: string;
    level: number;

    constructor(name: string, realname: string, level: number) {
        this.name = name;
        this.realname = realname;
        this.level = level;
    }

}

class leveling {

    maxLevel: number;
    expMultiplicator: number;
    expAmount: number;
    weapons: any = [];

    constructor(maxLevel: number, expMultiplicator: number, expAmount: number) {
        this.maxLevel = maxLevel;
        this.expMultiplicator = expMultiplicator;
        this.expAmount = expAmount;

        mp.events.add("server:Prestige", (player: Player) => {
            this.checkPrestigeUpdate(player);
        });
    }

    getExpForNextLevel(player: Player): number {
        var experienceNextLevel: number = 0;
        experienceNextLevel = (((player.leveling.level) * this.expAmount) - (player.leveling.experience));
        return experienceNextLevel;
    }

    getExpMultiplicator(player: Player): number {
        var returnValue = 0;

        if (player.info.donator >= 1)
            returnValue = this.expMultiplicator + 2.5;
        else
            returnValue = this.expMultiplicator;

        if (player.stats.expboost)
            returnValue = (returnValue + 1.75);

        return returnValue;
    }

    getExpWithMultiplicator(value: number, player: Player): number {
        return (value * this.getExpMultiplicator(player));
    }

    givePlayerExperience(player: Player, amount: number) {

        if (mp.players.exists(player)) {
            if (player.isLoggedIn) {
                if (player.leveling.level < this.maxLevel) {

                    if (player.info.donator >= 1)
                        player.leveling.experience += (amount * (this.expMultiplicator + 2.5));
                    else
                        player.leveling.experience += (amount * this.expMultiplicator);


                    if (player.leveling.experience >= (player.leveling.level * this.expAmount)) {
                        player.leveling.level++;

                        mp.players.forEach((element) => {
                            element.call("client:StartLevelUpEffect", player.id);
                        });

                        Translation.add("leveling:NewLevel", "<font color='#00FFFF'>Du hast Level " + player.leveling.level + " erreicht und " + this.getWeaponFromCurrentLevel(player) + " freigeschaltet.</font>",
                            "<font color='#00FFFF'>You have reached level " + player.leveling.level + " and unlocked " + this.getWeaponFromCurrentLevel(player) + "</font>",
                            "<font color='#00FFFF'>Вы достигли уровня " + player.leveling.level + " и открыли " + this.getWeaponFromCurrentLevel(player) + "</font>");

                        Translation.add("leveling:Level",
                            "<font color='#00FFFF'>Du hast Level " + player.leveling.level + " erreicht.</font>",
                            "<font color='#00FFFF'>You reached level " + player.leveling.level + "</font>",
                            "<font color='#00FFFF'>Вы достигли уровня " + player.leveling.level + "</font>");

                        Translation.add("leveling:MaxLevel",
                            "<font color='#DAA520'>Glückwunsch! " + player.name + " hat das maximale Level erreicht.</font>",
                            "<font color='#DAA520'>Congrats! " + player.name + " has reached the maximum level.</font>",
                            "<font color='#DAA520'>Поздравляем! " + player.name + " вы открыли максимальный уровень.</font>")

                        if (this.getWeaponFromCurrentLevel(player) != undefined)
                            player.outputChatBox(Translation.get("leveling:NewLevel", player.language));
                        else
                            player.outputChatBox(Translation.get("leveling:Level", player.language));


                        if (player.leveling.level == this.maxLevel)
                            mp.players.broadcast(Translation.get("leveling:MaxLevel", player.language));

                    }
                }
            }
        }

    }

    sendLevelingInfoToClient(player: Player) {

        var jsonData = JSON.stringify({
            level: player.leveling.level,
            playerexp: player.leveling.experience,
            expamount: this.expAmount,
            expnextlevel: this.getExpForNextLevel(player),
            nextweapon: this.getWeaponForNextLevel(player),
            prestigelevel: player.leveling.prestige
        });

        player.call("createLevelingBrowser", [jsonData]);

    }

    setExpMultiplicator(player: Player, amount: number) {
        if (player.info.admin >= Ranks.Projectlead) {
            this.expMultiplicator = amount;
            Messages.Send("WARNUNG", "Projektleitung " + player.name + " hat den EXP Multiplikator auf " + amount + " gestellt.", true);
        }
    }

    giveTokens(player: Player, amount: number) {

        Translation.add("Leveling:Token",
            "Du hast " + amount + " Fahrzeugtokens bekommen.",
            "You received " + amount + " Vehicletokens.",
            "Вы получили " + amount + " Vehicletokens.");

        if (player.isLoggedIn) {
            overlaySuccess(player, Translation.get("Leveling:Token", player.language), "Vehicleshop");
            player.leveling.tokens += amount;
        }
    }

    getWeaponRealNameByName(name: string) {
        var returnValue = "Unknown";

        this.weapons.forEach((element: levelingWeapons) => {

            if (element.name != name)
                return false;

            returnValue = element.realname;

        });

        return returnValue;
    }

    checkPrestigeUpdate(player: Player) {
        if (!player.isLoggedIn)
            return false;

        if (player.leveling.level < 2000)
            return overlayError(player, "Du kannst dein Prestige erst ab Level 2000 einlösen!", "Prestige");

        player.leveling.prestige++;
        player.leveling.level = 0;
        player.leveling.experience = 0;

        
        this.giveTokens(player, 200);
        player.inventory.addAmount("Schutzweste", 100);
        player.inventory.addAmount("Verbandskasten", 100);

        Messages.Send("INFO", "Spieler " + player.name + " hat sein Prestige aktiviert und ist nun Prestige " + player.leveling.prestige + ".", true);
    }
}

export var Level = new leveling(2000, 1.0, 1500);

Level.addWeapon("weapon_knife", "Messer", 1);
Level.addWeapon("weapon_bat", "Baseballschläger", 1);
Level.addWeapon("weapon_pistol", "Pistole 9mm", 1);
Level.addWeapon("weapon_microsmg", "Mikro UZI", 1);
Level.addWeapon("weapon_assaultrifle", "Assaultrifle", 1);
Level.addWeapon("weapon_smg", "Maschinenpistole 5", 10);
Level.addWeapon("weapon_pistol_mk2", "Pistole MK2", 15);
Level.addWeapon("weapon_carbinerifle", "Karabiner", 20);
Level.addWeapon("weapon_specialcarbine", "G36", 25);
Level.addWeapon("weapon_heavyshotgun", "Schwere Schrotflinte", 30);
Level.addWeapon("weapon_musket", "Muskete", 35);
Level.addWeapon("weapon_hatchet", "Axt", 40);
Level.addWeapon("weapon_heavypistol", "Schwere Pistole", 45);
Level.addWeapon("weapon_compactrifle", "Combat Rifle", 50);
Level.addWeapon("weapon_minismg", "Scorpion", 55);
Level.addWeapon("weapon_doubleaction", "Revolver (Gold)", 60);
Level.addWeapon("weapon_pumpshotgun", "Schrotflinte", 65);
Level.addWeapon("weapon_assaultrifle_mk2", "Sturmgewehr MK2", 70);
Level.addWeapon("weapon_revolver", "Revolver", 75);
Level.addWeapon("weapon_machinepistol", "Maschinenpistole", 80);
Level.addWeapon("weapon_combatpdw", "PDW", 85);
Level.addWeapon("weapon_carbinerifle_mk2", "Karabiner MK2", 90);
Level.addWeapon("weapon_bullpuprifle", "Bullpuprifle", 95);
Level.addWeapon("weapon_gusenberg", "Gusenberg", 100);
Level.addWeapon("weapon_pistol50", "Kaliber 50.", 105);
Level.addWeapon("weapon_smg_mk2", "SMG MK2", 110);
Level.addWeapon("weapon_advancedrifle", "Advanced Rifle", 110);

Level.addWeapon("weapon_sawnoffshotgun", "Abgesägte Schrotflinte", 250);


mp.events.add("requestLevelingInfo", (player: Player) => {

    if (player.isLoggedIn)
        Level.sendLevelingInfoToClient(player);

});

mp.events.addCommand("setexp", (player: Player, fullText: string, amount: string) => {
    if (player.info.admin >= Ranks.Projectlead)
        Level.setExpMultiplicator(player, Number(amount));
});
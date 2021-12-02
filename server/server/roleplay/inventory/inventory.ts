import { Player } from "../account/player";
import { database } from "../database/manager";
import { Inventory } from "../database/entities/inventory";
import { overlayError, giveHealth, giveArmour, overlaySuccess, getTimeInSeconds, overlayInfo } from "../utils/utils";
import { Level } from "../account/leveling";
import { TeamIds } from "../spawning/team";
import { playAnimation } from "../gameplay/animations";
import { startFirework, fireworkPlayer } from "../gameplay/fireworks";
import { callbackify } from "util";
import { Distance } from "../warflags/flags";
import { Messages } from "../chat/messaging";
import { Ranks } from "../admin";
import { Translation } from "../chat/translation";
import { Growing } from "../system/weed";
import { ServerClothes, Component } from "../spawning/clothes";
import { damagePlayer } from "../weapons/syncing";

export class playerInventory {
    list: any = [];
    isUsing: boolean = false;
    isSaving: boolean = false;
    isLoaded: boolean = false;
    player: Player;

    addItem(id: number, name: string, amount: number) {

        var foundInside = false;

        this.list.forEach((element: any) => {

            if (element.name == name) {
                foundInside = true;
                element.amount += amount;
            }

        });

        if (!foundInside)
            this.list.push({ db: id, name: name, amount: amount });
    }

    getAmount(itemName: string): number {
        var returnVal: any = 0;

        this.list.forEach((element: any) => {
            if (element.name != itemName) return false;
            returnVal = element.amount;
        });

        return returnVal;
    }

    addAmount(itemName: string, amount: number) {

        if (this.isSaving)
            return overlayError(this.player, "Fehler beim erstellen des Items.", "Fehler");

        var itemFound: boolean = false;

        this.list.forEach((element: any) => {
            if (element.name != itemName) return false;
            element.amount += amount;
            itemFound = true;

            Translation.add("inventory:Add", element.name + " im Inventar. (+" + amount + ")",
                element.name + " (+" + amount + ")",
                element.name + " (+" + amount + ")");

            overlaySuccess(this.player, Translation.get("inventory:Add", this.player.language), "Information");
        });

        if (itemFound == false)
            this.addItem(0, itemName, amount);

    }

    removeAmount(itemName: string, amount: number) {

        this.list.forEach((element: any) => {
            if (element.name != itemName) return false;
            element.amount -= amount;
        });
    }

    getItemsAsJson() {
        var returnValue: any = [];

        this.list.forEach((element: any) => {
            if (element.amount <= 0) return false;
            returnValue.push({ name: element.name, amount: element.amount });
        });

        return JSON.stringify({ items: returnValue });
    }

    loadInventory() {

        if (mp.players.exists(this.player)) {

            this.isLoaded = false;

            database.then(connect => {

                if (mp.players.exists(this.player)) {

                    if (this.isLoaded)
                        return false;

                    connect.getRepository(Inventory).find({ where: { name: this.player.name } }).then((element) => {

                        if (mp.players.exists(this.player)) {
                            if (element) {
                                element.forEach((item: Inventory) => {
                                    this.addItem(item.id, item.item, item.amount);
                                });
                                this.isLoaded = true;
                            }
                        }

                    });
                }

            });
        }
    }

    saveInventory() {

        if (mp.players.exists(this.player)) {

            if (this.isSaving)
                return overlayInfo(this.player, "Das Inventar wird zurzeit gespeichert...", "Achtung");

            this.isSaving = true;

            database.then(connect => {

                if (mp.players.exists(this.player)) {

                    var tempItems: any = [];

                    this.list.forEach((element: any) => {

                        var Item = new Inventory();
                        Item.id = element.db;
                        Item.name = this.player.name;
                        Item.item = element.name;
                        Item.amount = element.amount;

                        tempItems.push(Item);

                    });

                    if (mp.players.exists(this.player)) {
                        this.player.inventory.list = [];

                        connect.getRepository(Inventory).save(tempItems).then((element) => {

                            element.forEach((item: Inventory) => {
                                this.addItem(item.id, item.item, item.amount);
                            });

                            this.isSaving = false;
                        });
                    }
                }

            });

        }

    }
}

mp.events.add("sendItemToServerForClient", (player: Player, playerName: string, itemName: string, amount: number) => {

    if (!player.isLoggedIn) return false;

    mp.players.forEach((element: Player) => {

        if (!element.isLoggedIn) return false;

        if (element.name != playerName) return false;

        if (Distance(player.position, element.position) > 5) return false;

        if (player.inventory.getAmount(itemName) >= amount) {
            player.inventory.removeAmount(itemName, amount);
            element.inventory.addAmount(itemName, amount);

            player.outputChatBox("Du hast Spieler " + playerName + " das Item " + itemName + " gegeben. (Anzahl: " + amount + ")");
        }

    });

});

mp.events.add("receiveInventoryAccess", (player: Player) => {

    if (player.isLoggedIn) {
        player.inventory.player = player;

        var playerData: any = [];

        mp.players.forEach((element: Player) => {

            if (!element.isLoggedIn) return false;

            if (element == player) return false;

            if (Distance(element.position, player.position) > 5) return false;

            playerData.push({ name: element.name });

        });

        if (player.inventory.isLoaded && (player.inventory.isSaving == false))
            player.call("showInventory", [player.inventory.getItemsAsJson(), playerData.length > 0 ? JSON.stringify({ items: playerData }) : undefined]);
        else
            return overlayError(player, "Das Inventar wird derzeit geladen oder gespeichert.", "Fehler");
    }

});

mp.events.add("receiveInventoryClose", (player: Player) => {
    if (player.isLoggedIn)
        player.inventory.saveInventory();
});

mp.events.add("playerQuit", (player: Player) => {

    if (mp.players.exists(player))
        player.inventory.saveInventory();

});

var policeHelmets = [39, 123, 124, 125, 126];

mp.events.add("sendUsedItemName", (player: fireworkPlayer, name: string) => {

    if (player.isPlayingAnimation)
        return overlayError(player, "Du bist in einer Animation.", "Fehler");

    if (player.isBreaking)
        return overlayError(player, "Du kannst derzeit keine Items verwenden.", "Fehler");

    if (!player.vehicle) {
        if (player.inventory.isUsing)
            return overlayError(player, "Du verwendest gerade ein Item.", "Fehler");

        if (name) {
            if (player.inventory.getAmount(name) > 0) {

                if (name == "Dollar")
                    return overlayError(player, "Du kannst Dollar nur im Inventar haben und in Shops einlösen.", "Fehler");

                player.inventory.isUsing = true;
                player.inventory.removeAmount(name, 1);
                player.call("receiveInventoryItems", [player.inventory.getItemsAsJson()]);

                switch (name) {

                    case "EXP Booster":
                        {
                            player.inventory.isUsing = false;


                            if (player.stats.expboost)
                                return overlayError(player, "Du hast bereits einen EXP Boost verwendet.", "Fehler");

                            player.stats.expboost = 1;
                            player.stats.expboosttime = getTimeInSeconds() + 43200 /*12 Stunden*/;

                            Messages.Send("INVENTAR", "Du hast für 12 Stunden einen EXP-Boost aktiviert.", false, player);

                            break;
                        }

                    case "Feuerwerk": {

                        playAnimation(player, "anim@mp_fireworks", "place_firework_3_box", 0, false);

                        mp.players.forEach((element: Player) => {
                            if (!element.isLoggedIn) return false;

                            element.call("startFirework", [player.id]);

                        });

                        setTimeout(() => {
                            startFirework(player);
                            if (mp.players.exists(player))
                                player.inventory.isUsing = false;

                        }, 3000);

                        break;
                    }


                    case "Donut": {
                        playAnimation(player, 'mp_suicide', 'pill', 31);

                        setTimeout(() => {
                            if (mp.players.exists(player)) {
                                player.outputChatBox("Du hast einen Donut benutzt und 30 HP bekommen.");
                                giveHealth(player, 30);
                                player.stopAnimation();
                                player.inventory.isUsing = false;
                            }

                        }, 2000);
                        break;
                    }

                    case "EXP Münze":
                        {
                            var randomExp = Math.floor(Math.random() * 300);
                            Level.givePlayerExperience(player, randomExp);
                            mp.players.broadcast("<font color='#00FF00'>Spieler " + player.name + " hat eine EXP Münze geworfen und " + randomExp + " bekommen!</font>");
                            player.inventory.isUsing = false;
                            break;
                        }

                    case "Schutzweste":
                        {
                            playAnimation(player, "amb@medic@standing@kneel@base", "base", 31);

                            setTimeout(() => {
                                if (mp.players.exists(player)) {
                                    player.outputChatBox("Du hast eine Schutzweste benutzt und 80 Armour bekommen.");
                                    giveArmour(player, 80);
                                    player.stopAnimation();

                                    if (!player.clothes.gender)
                                        player.setClothes(8, 131, 0, 2);
                                    else
                                        player.setClothes(8, 161, 0, 2);


                                    player.inventory.isUsing = false;

                                    if (player.team == TeamIds.LSPD)
                                        player.setProp(0, policeHelmets[Math.floor(Math.random() * policeHelmets.length)], 0);
                                }

                            }, 3000);

                            break;
                        }

                    case "Kokain":
                        {
                            playAnimation(player, "mp_suicide", "pill", 32, false);

                            setTimeout(() => {
                                player.stopAnimation();
                                player.call("startScreenFx", ["PPFilter"]);
                                player.call("client:setCocainEffect", [30]);
                                player.inventory.isUsing = false;
                            }, 3000);
                            break;
                        }

                    case "Verbandskasten":
                        {
                            playAnimation(player, "amb@medic@standing@kneel@base", "base", 31);

                            setTimeout(() => {
                                if (mp.players.exists(player)) {

                                    player.inventory.isUsing = false;

                                    if (player.health < 1)
                                        return false;

                                    player.outputChatBox("Du hast ein Verbandskasten benutzt und 100 HP bekommen.");
                                    giveHealth(player, 100);
                                    player.stopAnimation();
                                }

                            }, 3000);

                            break;
                        }

                    case "Sniper":
                        {
                            player.inventory.isUsing = false;
                            player.outputChatBox("Du hast ein Heavy Sniper ausgepackt.");
                            player.giveWeapon(mp.joaat("weapon_heavysniper_mk2"), 15);
                            player.sniperShots += 15;
                            break;
                        }

                    case "Joint": {
                        playAnimation(player, 'amb@world_human_smoking@male@male_b@idle_a', 'idle_a', 31);

                        setTimeout(() => {
                            if (mp.players.exists(player)) {
                                player.outputChatBox("Du hast ein Joint benutzt und 100 HP bekommen.");
                                player.call("startScreenFx", ["ChopVision"]);
                                giveHealth(player, 45);
                                player.stopAnimation();
                                player.inventory.isUsing = false;
                            }

                        }, 3000);
                        break;
                    }

                    case "LSD": {
                        playAnimation(player, 'mp_suicide', 'pill', 31);

                        setTimeout(() => {
                            if (mp.players.exists(player)) {
                                player.outputChatBox("Du hast LSD benutzt und 90 HP bekommen.");
                                player.call("startScreenFx", ["PPPink"]);
                                player.call("startTrip", []);
                                giveHealth(player, 90);
                                player.stopAnimation();
                                player.inventory.isUsing = false;
                            }

                        }, 3000);
                        break;
                    }

                    case "Extasy": {
                        playAnimation(player, 'amb@world_human_smoking@male@male_b@idle_a', 'idle_a', 31);

                        setTimeout(() => {
                            if (mp.players.exists(player)) {
                                player.outputChatBox("Du hast Extasy benutzt und 60 HP bekommen.");
                                player.call("startScreenFx", ["DMT_flight"]);
                                giveHealth(player, 80);
                                player.stopAnimation();
                                player.inventory.isUsing = false;
                            }

                        }, 3000);
                        break;
                    }

                    case "Hanfsamen": {

                        if (player.team == TeamIds.LSPD)
                            return overlayError(player, "Du kannst das als Officer nicht!", "Fehler!");

                        playAnimation(player, "anim@heists@money_grab@briefcase", "put_down_case", 32, false);

                        setTimeout(() => {
                            if (mp.players.exists(player)) {
                                Growing.requestWeed(player);
                                player.stopAnimation();
                                player.inventory.isUsing = false;
                            }

                        }, 2000);
                        break;
                    }

                    case "Wasser": {
                        playAnimation(player, "anim@amb@business@weed@weed_inspecting_lo_med_hi@", "weed_spraybottle_crouch_spraying_01_inspector", 43, false);

                        setTimeout(() => {
                            if (mp.players.exists(player)) {

                                player.stopAnimation();
                                player.inventory.isUsing = false;


                                var plant = Growing.isNearPlant(player);

                                if (plant) {
                                    if (!plant.canBeWatered)
                                        return overlayError(player, "Diese Pflanze ist noch nicht bereit um gegossen zu werden.", "Fehler");

                                    if (!plant.water) {
                                        plant.water = true;
                                        plant.waterdate = getTimeInSeconds();
                                        overlaySuccess(player, "Du hast deine Pflanze gegossen und kannst sie in einer Stunde ernten.", "Gegossen!");
                                    }
                                    else {
                                        overlayError(player, "Diese Pflanze wurde bereits gegossen.", "Fehler");
                                    }
                                }
                                else
                                    overlayError(player, "Du hast keine Pflanze in deiner Nähe! Du hast das Wasser verschüttet.", "Fehler");
                            }

                        }, 3000);
                        break;
                    }

                    default:
                        {
                            player.inventory.isUsing = false;
                            break;
                        }
                }
            }
            else
                overlayError(player, "Du besitzt kein Item davon.", "Fehler");
        }
    }
    else
        overlayError(player, "Du kannst diese Dinge nicht im Fahrzeug verwenden.", "Fehler");

});



mp.events.add("playerDeath", (player: damagePlayer, reason: number, attacker: Player) => {

    try {
        player.call("stopScreenFx");

        if (player.killer == undefined)
            return false;

        if (mp.players.exists(player) && mp.players.exists(player.killer)) {

            player.clothes.applyComponent(
                ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Body, player.clothes.gender), 0, Component.Body);

            player.setProp(0, -1, 0);

            if (player.stats.expboosttime <= getTimeInSeconds())
                player.stats.expboost = 0;

            if (player.killer) {
                if (player.killer.team != player.team) {

                    if (Math.floor(Math.random() * 100) <= 3)
                        player.killer.inventory.addAmount("EXP Münze", 1);

                    if (Math.floor(Math.random() * 100) <= 5)
                        player.killer.inventory.addAmount("Dollar", 3);

                    if (Math.floor(Math.random() * 100) <= 15)
                        player.killer.inventory.addAmount("Metallschrott", 5);

                    player.killer.streak++;

                    switch (player.killer.streak) {
                        case 25:
                            {
                                player.inventory.addAmount("Schutzweste", 20);
                                player.health = 100;
                                mp.players.broadcast("<font color='#00FFFF'>Spieler " + player.killer.name + " ist auf einem " + player.killer.streak + "er Streak.</font>");
                                break;
                            }
                        case 20:
                            {
                                Level.giveTokens(player.killer, 1);
                                player.health = 100;
                                mp.players.broadcast("<font color='#00FFFF'>Spieler " + player.killer.name + " ist auf einem " + player.killer.streak + "er Streak.</font>");
                                break;
                            }
                        case 16:
                            {
                                Level.giveTokens(player.killer, 1);
                                mp.players.broadcast("<font color='#00FFFF'>Spieler " + player.killer.name + " ist auf einem " + player.killer.streak + "er Streak.</font>");
                                break;
                            }
                        case 15:
                            {
                                player.killer.inventory.addAmount("Sniper", 1);
                                Messages.Send("INFO", "Du hast eine Sniper bekommen.", false, player.killer);
                                mp.players.broadcast("<font color='#00FFFF'>Spieler " + player.killer.name + " ist auf einen " + player.killer.streak + "er Streak.</font>");
                                player.killer.stats.bounty += 50;
                                break;
                            }
                        case 12:
                            {
                                giveRandomItem(player.killer);
                                mp.players.broadcast("<font color='#00FFFF'>Spieler " + player.killer.name + " ist auf einen " + player.killer.streak + "er Streak.</font>");
                                player.killer.stats.bounty += 50;
                                break;
                            }
                        case 6:
                            {
                                giveRandomItem(player.killer);
                                mp.players.broadcast("<font color='#00FFFF'>Spieler " + player.killer.name + " ist auf einen " + player.killer.streak + "er Streak.</font>");
                                player.killer.stats.bounty += 50;
                                Messages.Send("INFO", "Du hast ein Kopfgeld bekommen! Die Hitmans jagen dich!", false, player.killer);

                                mp.players.forEach((element: Player) => {

                                    if (element.team == TeamIds.Hitman) {
                                        
                                        if (player.killer == undefined)
                                            return false;

                                        Messages.Send("WARNUNG", "Spieler " + player.killer.name + " hat vom Staat ein Kopfgeld bekommen!", false, element);
                                    }

                                });

                                break;
                            }
                    }

                }

                if (player.streak >= 6) {
                    mp.players.broadcast("<font color='#00FFFF'>Spieler " + player.killer.name + " hat den " + player.streak + "er Streak von " + player.name + " beendet.</font>");
                    giveRandomItem(player.killer);
                }
                player.streak = 0;
            }
        }
    }
    catch (error) {
        console.log("Inventory Death: " + error);
    }
});

mp.events.add("playerSpawn", (player: Player, reason: number, attacker: Player) => {

    player.call("stopScreenFx");

});

function giveRandomItem(player: Player) {
    switch (Math.floor(Math.random() * 5)) {
        case 4: {
            player.inventory.addAmount("LSD", 1);
            break;
        }
        case 3: {
            player.inventory.addAmount("Schutzweste", 1);
            break;
        }
        case 2: {
            player.inventory.addAmount("Verbandskasten", 1);
            break;
        }
        case 0: {
            player.inventory.addAmount("Extasy", 1);
            break;
        }
    }
}

mp.events.add("onPlayerHitTarget", (player: Player, target: Player, weaponName: number, distance: number) => {

    if (mp.players.exists(target))
        if (target.armour < 10)
            target.clothes.applyComponent(
                ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Body, player.clothes.gender), 0, Component.Body);
});

mp.events.addCommand("item", (player: Player, fullText: string) => {

    if (player.info.admin >= Ranks.Projectlead) {
        player.inventory.addAmount(fullText, 50);
    }

});
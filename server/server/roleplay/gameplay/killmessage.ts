import { Player } from "../account/player";
import { spawnPlayer } from "../spawning";
import { Popup, ToastColors } from "../utils/overlay";
import { Level } from "../account/leveling";
import { Translation } from "../chat/translation";
import { database } from "../database/manager";
import { Killlog } from "../database/entities/killlog";
import { Distance } from "../warflags/flags";
import { FreeForAll } from "../events/freeforall";
import { AfkPlayer } from "../system/afk";
import { Messages } from "../chat/messaging";
import { Leveling } from "../database/entities/leveling";
import { damagePlayer, DeathReasons } from "../weapons/syncing";



mp.events.add("playerDeath", (player: damagePlayer, reason: number, killer: AfkPlayer) => {

    if(reason == DeathReasons.VEHICLE_RUN_OVER)
        player.killer = undefined;

    if(reason == DeathReasons.VEHICLE_RAMMED)
        player.killer = undefined;

    if (player.killer)
        if (mp.players.exists(player.killer))
            try {
                if (mp.players.exists(player.killer)) {
                    player.lastWeaponOnDeath = player.weapon;
                    if (player.killer.team != player.team || FreeForAll.isPlayerInside(player.killer)) {
                        if (player.killer != player) {

                            if (player.killer.type == "player" && player.type == "player") {
                                Translation.add("killMessage", "Du hast <font color=yellow>" + player.name + "</font> eleminiert +" + Level.getExpWithMultiplicator(50, player.killer) + " Exp",
                                    "You killed <font color=red>" + player.name + "</font>+" + Level.getExpWithMultiplicator(50, player.killer) + " Exp",
                                    "Вы убили <font color=red>" + player.name + "</font>+" + Level.getExpWithMultiplicator(50, player.killer) + " Exp");

                                Translation.add("deadMessage", "Du wurdest von <font color=yellow>" + player.killer.name + "(" + Math.floor(player.killer.health + player.killer.armour) + " HP)</font> mit " + Level.getWeaponByHash(player.killer.weapon) + " eleminiert",
                                    "You got killed by <font color=red>" + player.killer.name + "(" + Math.floor(player.killer.health + player.killer.armour) + " HP)</font>",
                                    "Вы были убиты игроком <font color=red>" + player.killer.name + "(" + Math.floor(player.killer.health + player.killer.armour) + " HP)</font>");

                                player.killer.call("newPopupMessage", [Translation.get("killMessage", player.killer.language)]);
                                player.call("newPopupMessage", [Translation.get("deadMessage", player.language)]);

                                player.killer.stats.kills++;
                                player.stats.deaths++;

                                if (player.leveling.prestige > 0) {
                                    Level.givePlayerExperience(player.killer, 100);
                                    Messages.Send("INFO", "Du hast einen Prestige-Spieler getötet und " + Level.getExpWithMultiplicator(100, player.killer) + " Exp. bekommen!", false, player.killer);
                                }
                                else
                                    Level.givePlayerExperience(player.killer, 50);

                                if (mp.players.exists(player.killer))
                                    player.call("client:Killcam", [player.killer.id]);

                                database.then(connection => {

                                    if (!mp.players.exists(player))
                                        return false;

                                    if(player.killer == undefined)
                                        return false;
                                        
                                    if (!mp.players.exists(player.killer))
                                        return false;

                                    var killElement = new Killlog();
                                    killElement.attacker = player.killer.name;
                                    killElement.victim = player.name;
                                    killElement.range = Distance(player.killer.position, player.position);
                                    killElement.attackerhp = player.killer.health;
                                    killElement.weapon = player.killer.weapon;

                                    connection.getRepository(Killlog).save(killElement);
                                });

                            }
                        }

                    }
                }
            }
            catch (error) {
                console.log(error);
            }

});

mp.events.addCommand("testkill", (player: Player, fullText: string, argu: string) => {
    player.call("newPopupMessage", ["Du hast <font color=red>" + player.name + "</font> eleminiert \+" + Level.getExpWithMultiplicator(50, player) + " Exp"]);
});
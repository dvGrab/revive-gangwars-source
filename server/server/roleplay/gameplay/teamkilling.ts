import { Player, Kick } from "../account/player";
import { Level } from "../account/leveling";
import { Messages } from "../chat/messaging";
import { Paintball } from "../system/paintball";
import { FreeForAll } from "../events/freeforall";
import { AfkPlayer } from "../system/afk";
import { damagePlayer, DeathReasons } from "../weapons/syncing";

mp.events.add("playerDeath", (player: damagePlayer, reason: number, killer: AfkPlayer) => {

    if (player.killer) {

        if (mp.players.exists(player.killer))
        
        if (player.killer.type == "player" && player.type == "player") {
            if (player.killer.id != player.id) {
                if (player.killer.team == player.team) {
                    player.killer.teamkills++;

                    if (Paintball.isPlayerIn(player.killer))
                        return false;

                    if (FreeForAll.isPlayerInside(player.killer))
                        return false;

                    Messages.Send("WARNUNG", "Du hast ein Teamkamerad getötet. (" + player.killer.teamkills + "/3) (" + Level.getExpWithMultiplicator(-150, player.killer) + " Exp.)", false, player.killer);

                    Level.givePlayerExperience(player.killer, -150);

                    if (player.killer.teamkills >= 3)
                        Kick(player.killer, "Teamkilling");

                }
            }
        }
    }

});
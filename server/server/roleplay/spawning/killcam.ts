import { spawnPlayer } from ".";
import { Player } from "../account/player";
import { Leveling } from "../database/entities/leveling";
import { Level } from "../account/leveling";
import { AfkPlayer } from "../system/afk";
import { damagePlayer } from "../weapons/syncing";


mp.events.add("playerDeath", (player: damagePlayer, reason: string, killer: AfkPlayer) => {
    try {


        if (player.isLoggedIn) {
            if (player.killer != undefined) {
                if (mp.players.exists(player.killer)) {
                    var randomAmount = Math.floor(Math.random() * 100);

                    if (randomAmount <= 3)
                        Level.giveTokens(player.killer, 1);
                }
            }

            setTimeout(() => {
                if (mp.players.exists(player))
                    spawnPlayer(player);
            }, 5000);
        }

    }
    catch (error) {
        console.log("Killcam: " + error);
    }
});


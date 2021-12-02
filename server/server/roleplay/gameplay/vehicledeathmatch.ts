import { Player, Kick } from "../account/player";
import { Level } from "../account/leveling";
import { Messages } from "../chat/messaging";

mp.events.add("playerDeath", (player: Player, reason: Number, killer: Player) => {

    if (killer != undefined) {
        if (killer.type == "player") {
            if (killer.id != player.id) {
                if (reason == 2741846334) {

                    
                    killer.vehiclekills++;

                    Messages.Send("WARNUNG", "Du hast Vehicle-Deathmatch begangen. (" + killer.vehiclekills + "/3) (" + Level.getExpWithMultiplicator(-150, killer) + " Exp)", false, killer);

                    Level.givePlayerExperience(killer, -150);

                    if (killer.vehiclekills >= 3)
                        Kick(killer, "Vehicle Deathmatch");
                }
            }
        }
    }
});
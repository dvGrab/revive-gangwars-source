import { Player, Kick } from "../account/player";
import { Ranks } from "../admin";
import { Messages } from "../chat/messaging";

interface highPingPlayer extends Player {
    highPingTrigger: number;
}

mp.events.add("playerSpawn", (player: highPingPlayer) => {

    if (!mp.players.exists(player))
        return false;

    if (player.ping > 130)
    {
        player.highPingTrigger++;
        Messages.Send("SERVER", "<font color=red>Du hast einen High-Ping! (Ping: " + player.ping + ")", false, player);
    }
        
    if(player.highPingTrigger >= 3)
        Kick(player, "Highping (" + player.ping + ")", "Anti Cheat");
        
});

mp.events.add(RageEnums.EventKey.PLAYER_READY, (player : highPingPlayer) => {

    player.highPingTrigger = 0;

});
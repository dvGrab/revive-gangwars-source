import { Player } from "./player";

mp.events.add("getPlayerStats", (player : Player) => {

    if(player.isLoggedIn)
    {
        var jsonStats = JSON.stringify(player.stats);
        player.call("setPlayerStats", [jsonStats]);
    }

});
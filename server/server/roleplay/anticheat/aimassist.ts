import { Player, Ban, Kick } from "../account/player";

mp.events.add("cheatAimassist", (player : Player) => {

    if(player.isLoggedIn)
       Kick(player, "Aimassist", "Anti Cheat");

});
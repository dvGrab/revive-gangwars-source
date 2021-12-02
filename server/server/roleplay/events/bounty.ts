import { Player } from "../account/player";
import { Distance } from "../warflags/flags";
import { TeamIds } from "../spawning/team";
import { overlayError } from "../utils/utils";
import { Messages } from "../chat/messaging";
import { Leveling } from "../database/entities/leveling";
import { Level } from "../account/leveling";
import { Translation } from "../chat/translation";
import { damagePlayer } from "../weapons/syncing";

mp.blips.new(378, new mp.Vector3(240.78990173339844, -1379.4595947265625, 33.241764068603516), { shortRange: true, scale: 1.0, color: 1, name: "Kopfgeldjäger"});

mp.events.add("server:BountyRequest", (player: Player) => {

    if (Distance(player.position, new mp.Vector3(240.78990173339844, -1379.4595947265625, 33.241764068603516)) > 5)
        return false;

    if (player.team == TeamIds.LSPD)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    player.call("client:BountyOpen", []);

});

mp.events.add("server:GiveBountPlayer", (player: Player, target: string, amount: string) => {

    if(player.inventory.getAmount("Dollar") < parseInt(amount))
        return overlayError(player, "Du hast nicht genügend Geld für dieses Kopfgeld!", "Fehler");

    mp.players.forEach((targetPlayer: Player) => {

        if(!targetPlayer.isLoggedIn)
            return false;

        if(targetPlayer == player)
            return false;

        if(target.toUpperCase() != targetPlayer.name.toUpperCase())
            return false;

        Messages.Send("INFO", "Du hast ein Kopfgeld auf Spieler " + target + " aufgegeben.", false, player);
        Messages.Send("INFO", "Du hast ein Kopfgeld von einem Spieler bekommen. Die Hitmans jagen dich nun!", false, targetPlayer);

        targetPlayer.stats.bounty += parseInt(amount);
        targetPlayer.setVariable("bounty", targetPlayer.stats.bounty);

        player.inventory.removeAmount("Dollar", parseInt(amount));

        mp.players.forEach((element: Player) => {

            if (!element.isLoggedIn)
                return false;

            if (element.team == TeamIds.Hitman)
                Messages.Send("WARNUNG", "Es wurde ein neues Kopfgeld für Spieler " + target + " in Höhe von " + amount + " aufgegeben.", false, element);
        });
    });

});

mp.events.add("playerDeath", (player : damagePlayer, reason : string, killer : damagePlayer) => {

    if(!mp.players.exists(player))
        return false;
    
    if(player.killer == undefined)
        return false;

    if(!mp.players.exists(player.killer))
        return false;

    if(player.team == TeamIds.Hitman)
        return false;

    if(player.killer.team != TeamIds.Hitman)
        return false;

    if(player.stats.bounty < 1)
        return false;

    Messages.Send("WARNUNG", "Der Spieler " + player.name + " mit einem Kopfgeld in Höhe von $" + player.stats.bounty + " wurde eleminiert.");
    Messages.Send("WARNUNG", "Du bekommst somit " + Level.getExpWithMultiplicator(200, player.killer) + " Exp und $" + player.stats.bounty + ".", false, player.killer);

    Level.givePlayerExperience(player.killer, 200);
    player.killer.inventory.addAmount("Dollar", player.stats.bounty);
    player.stats.bounty = 0;
    player.setVariable("bounty", player.stats.bounty);
});
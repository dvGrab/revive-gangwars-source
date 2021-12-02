import "./developing";
import "./team";
import { Player } from "../account/player";
import { database } from "../database/manager";
import { Gift } from "../database/entities/gift";
import { Level } from "../account/leveling";
import { Vehicles } from "../database/entities/vehicles";
import { Translation } from "../chat/translation";
import { Messages } from "../chat/messaging";
import { Message } from "discord.js";
import { Ranks, Ranknames } from "../admin";

Translation.add("gift:Rececdived", "Revive-Gangwars dankt dir für deinen geilen Suppoer!",
    "Revive-Gangwars is saying thanks to you for your awesome support!",
    "Revive-Gangwars благодарит вас за вашу замечательную поддержку!");

mp.events.addCommand("gift", (player: Player) => {


    if (player.isLoggedIn) {
        database.then(connection => {

            if (mp.players.exists(player))
                connection.getRepository(Gift).findOne({ where: { name: player.name } }).then(elem => {

                    if (!elem) {
                        Level.givePlayerExperience(player, 500);
                        Level.giveTokens(player, 300);
                        player.inventory.addAmount("Schutzweste", 50);
                        player.inventory.addAmount("Verbandskasten", 50);

          
                        if (mp.players.exists(player)) {
                            var gift = new Gift();
                            gift.name = player.name;
                            connection.getRepository(Gift).save(gift);

                            player.outputChatBox(Translation.get("gift:Rececdived", player.language));
                        }
                    }

                });

        });
    }

});

mp.events.addCommand("admins", (player: Player) => {

    if (!player.isLoggedIn)
        return false;

    Messages.Send("INFO", "<font color=grey>Liste der Teammitglieder:</font>", false, player);

    mp.players.forEach((element: Player) => {

        if (!element.isLoggedIn)
            return false;

        if (element.info.admin <= Ranks.Moderator)
            return false;

        Messages.Send("INFO", "<font color=yellow>" + Ranknames[element.info.admin] + " " + element.name + "</font>", false, player);

    });

});

mp.events.addCommand("purge", (player : Player) => {

    if(player.info.admin != Ranks.Projectlead)
        return false;

    Messages.Send("INFO", "Es findet eine Purge statt! Bitte seid auf der Hut!", true);

    mp.players.forEach((element : Player) => {
        if(!element.isLoggedIn)
            return false;
            
            element.call("client:playAudio", [""]);
    });
});
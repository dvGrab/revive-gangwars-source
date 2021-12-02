import { Player } from "./player";
import { Entity } from "typeorm";
import { Teams } from "../spawning/team";
import { Ranks } from "../admin";
import { logHelper } from "../logger";
import { Distance } from "../warflags/flags";
import { Messages } from "../chat/messaging";

var logger = new logHelper("Chat", "chat.log", false);

mp.events.add("playerChat", (player: Player, text: string) => {

    if (player.isLoggedIn) {

        logger.log(player.name + ": " + text);

        var adminPrefix = "";

        if (player.info.chatmute)
            return false;

        if (player.info.admin <= Ranks.Moderator) {
            if (player.info.discord.length)
                adminPrefix = "<font color='FFA500'>[Gangster]</font>";
            else
                adminPrefix = "<font color='FFFFFF'>[User]</font>";
        }


        if (player.info.donator >= 1)
            adminPrefix = "<font color='#33CC33'>[Donator]</font>";

        switch (player.info.admin) {
            case 3:
                {
                    adminPrefix = "<font color='#FF0000'>[Projektleitung]</font>";
                    break;
                }
            case 2:
                {
                    adminPrefix = "<font color='#ff9000'>[Administrator]</font>";
                    break;
                }
            case 1:
                {
                    adminPrefix = "<font color='#42f480'>[Moderator]</font>";
                    break;
                }
            case 0:
                {
                    if (player.info.donator >= 1)
                        adminPrefix = "<font color='#33CC33'>[Donator]</font>";
                    else
                        adminPrefix = "<font color='#FFFFFF'>[User]</font>";

                    break;
                }
        }

        if (player.info.name == "Cooler2667")
            adminPrefix = "<font color='#4286f4'>[Manager]</font>";

            if (player.info.name == "Snake")
            adminPrefix = "<font color='#4286f4'>[Manager]</font>";

        mp.players.forEach((element: Player) => {


            if (player.name == "BeastLvl4tw") {
                if (Distance(element.position, player.position) < 15) {
                    element.call("client:sayText", [text]);
                }
            }

            if (!element.isLoggedIn)
                return false;

            if (element.team != player.team)
                return false;

            if (player.leveling.prestige)
                element.outputChatBox(player.countryCode + " <font color='#CCCCFF'>[TEAM]</font> " + adminPrefix + " <font color='" + Teams.getTeamHexColor(player.team) + "'>" + player.info.name + " (Level: " + player.leveling.level + "):</font>p_1" + text);
            else
                element.outputChatBox(player.countryCode + " <font color='#CCCCFF'>[TEAM]</font> " + adminPrefix + " <font color='" + Teams.getTeamHexColor(player.team) + "'>" + player.info.name + " (Level: " + player.leveling.level + "):</font> " + text);

        });

    }

});

mp.events.addCommand("g", (player: Player, fullText: string) => {

    if (!fullText)
        return false;

    if (fullText.length > 0) {
        if (player.isLoggedIn) {
            var adminPrefix = "";

            if (player.info.chatmute)
                return false;

            logger.log(player.name + " [GLOBAL]: " + fullText);

            if (player.info.admin <= Ranks.Moderator) {
                if (player.info.discord.length)
                    adminPrefix = "<font color='#FFA500}[Gangster]</font>";
                else
                    adminPrefix = "<font color='#FFFFFF}[User]</font>";
            }

            switch (player.info.admin) {
                case 3:
                    {
                        adminPrefix = "<font color='#FF0000'>[Projektleitung]</font>";
                        break;
                    }
                case 2:
                    {
                        adminPrefix = "<font color='#ff9000'>[Administrator]</font>";
                        break;
                    }
                case 1:
                    {
                        adminPrefix = "<font color='#42f480'>[Moderator]</font>";
                        break;
                    }
                case 0:
                    {
                        if (player.info.donator >= 1)
                            adminPrefix = "<font color='#33CC33'>[Donator]</font>";
                        else
                            adminPrefix = "<font color='#FFFFFF'>[User]</font>";

                        break;
                    }
            }

            if (player.info.name == "Cooler2667")
            adminPrefix = "<font color='#4286f4'>[Manager]</font>";

            if (player.info.name == "Snake")
            adminPrefix = "<font color='#4286f4'>[Manager]</font>";

            
            if (player.leveling.prestige)
                mp.players.broadcast(player.countryCode + " " + adminPrefix + " <font color='" + Teams.getTeamHexColor(player.team) + "'>" + player.info.name + " (Level: " + player.leveling.level + "):</font>p_1" + fullText);
            else
                mp.players.broadcast(player.countryCode + " " + adminPrefix + " <font color='" + Teams.getTeamHexColor(player.team) + "'>" + player.info.name + " (Level: " + player.leveling.level + "):</font> " + fullText);

        }
    }
});

mp.events.addCommand("w", (player: Player, fullText: string) => {

    mp.players.forEach((element: Player) => {

        if (!element.isLoggedIn)
            return false;

        if (Distance(element.position, player.position) > 5)
            return false;

        Messages.Send("WHISPER", "Spieler " + player.name + " flüstert: " + fullText, false, element);
    });
});
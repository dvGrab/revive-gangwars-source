import { Player } from "../account/player";
import { getTimeInSeconds, overlaySuccess } from "../utils/utils";
import { AfkPlayer } from "../system/afk";
import { Messages } from "../chat/messaging";
import { Message } from "discord.js";
import { Distance } from "../warflags/flags";
import { Teams } from "../spawning/team";
import { Level } from "../account/leveling";
import { damagePlayer } from "../weapons/syncing";

class OgManager {
    lastTime: number = getTimeInSeconds();
    target: AfkPlayer;
    foundTarget: boolean = false;
    marker: BlipMp;

    constructor() {

        mp.events.add(RageEnums.EventKey.PLAYER_QUIT, (player: Player) => {

            if (player == this.target)
                this.foundTarget = false;

        });

        mp.events.add(RageEnums.EventKey.PLAYER_DEATH, (player: damagePlayer, reason: string, killer: damagePlayer) => {

            if (this.foundTarget == false)
                return false;

            if (!mp.players.exists(this.target))
                return false;

            if (player.killer == undefined)
                return false;

            if (player.getVariable("isPlayerOg") == true) {
                player.setVariable("isPlayerOg", false);
                this.foundTarget = false;

                mp.players.forEach((element: Player) => {

                    if (element.team == player.team)
                        Messages.Send("INFO", "Euer OG ist gestorben! Ihr habt schlechte Arbeit geleistet!", false, element);
                    else {
                        if (player.killer == undefined)
                            return false;

                        Messages.Send("INFO", "Der feindliche OG ist gestorben! " + Teams.getTeamName(player.killer.team) + " hat die Belohnung bekommen!", false, element);

                        if (player.killer == undefined)
                            return false;

                        if (player.killer.team == element.team) {
                            element.inventory.addAmount("Schutzweste", 15);
                            Level.giveTokens(element, 1);
                            Level.givePlayerExperience(element, 250);
                            Messages.Send("INFO", "Dein Team hat durch das Töten des feindlichen OG's " + Level.getExpWithMultiplicator(250, element) + " EXP bekommen.", false, element);
                        }
                    }

                });
            }

            if (mp.players.exists(player.killer)) {
                if (!mp.players.exists(this.target))
                    return false;

                if (player.killer.team != this.target.team)
                    return false;

                if (Distance(player.killer.position, this.target.position) < 30)
                    overlaySuccess(player.killer, "Du hast deinen OG beschützt und " + Level.getExpWithMultiplicator(50, player.killer) + " EXP bekommen!", "Erfolg!");
            }

        });

        setInterval(() => {

            if (this.foundTarget == true)
                return false;

            var playerList: AfkPlayer[] = [];

            mp.players.forEach((element: AfkPlayer) => {

                if (!element.isLoggedIn)
                    return false;

                if (element.team == -1)
                    return false;

                if (element.isAfk)
                    return false;

                playerList.push(element);
            });

            if (playerList.length < 1)
                return false;

            this.target = playerList[Math.floor(Math.random() * playerList.length)];
            this.target.setVariable("isPlayerOg", true);

            Messages.Send("INFO", "<font color=red>Du bist der OG deiner Gang! Hol deine Leute ran und überlebe!</font>", false, this.target);

            if (this.target) {
                mp.players.forEach((element: AfkPlayer) => {

                    if (this.target == undefined)
                        return false;

                    if (element.team == this.target.team)
                        Messages.Send("INFO", "<font color=red>Bleibt in der Nähe eures OG's " + this.target.name + "! Beschützt ihn vor feindlichen Gangs!</font>", false, element);
                    else
                        Messages.Send("INFO", "<font color=yellow>" + Teams.getTeamName(this.target.team) + "</font><font color=yellow> hat einen neuen OG bekommen! Findet und tötet ihn!</font>", false, element);

                });
            }

            this.foundTarget = true;

        }, 500 * 60 * 60)

        mp.events.addCommand("newog", (player: Player) => {

            if (this.foundTarget == true)
                return false;

            var playerList: AfkPlayer[] = [];

            mp.players.forEach((element: AfkPlayer) => {

                if (!element.isLoggedIn)
                    return false;

                if (element.team == -1)
                    return false;

                if (element.isAfk)
                    return false;

                playerList.push(element);
            });

            if (playerList.length < 1)
                return false;

            this.target = playerList[Math.floor(Math.random() * playerList.length)];
            this.target.setVariable("isPlayerOg", true);

            Messages.Send("INFO", "<font color=red>Du bist der OG deiner Gang! Hol deine Leute ran und überlebe!</font>", false, this.target);

            if (this.target) {
                mp.players.forEach((element: AfkPlayer) => {

                    if (this.target == undefined)
                        return false;

                    if (element.team == this.target.team)
                        Messages.Send("INFO", "<font color=red>Bleibt in der Nähe eures OG's " + this.target.name + "! Beschützt ihn vor feindlichen Gangs!</font>", false, element);
                    else
                        Messages.Send("INFO", "<font color=yellow>" + Teams.getTeamName(this.target.team) + "</font><font color=yellow> hat einen neuen OG bekommen! Findet und tötet ihn!</font>", false, element);

                });
            }

            this.foundTarget = true;

        });

        setInterval(() => {

            if (this.foundTarget) {
                if (!mp.blips.exists(this.marker))
                    this.marker = mp.blips.new(84, this.target.position, { color: 1, shortRange: false, name: "Gang OG" });
                else {
                    this.marker.position = this.target.position;
                    this.marker.dimension = this.target.dimension;
                }
            }
            else
                if (mp.blips.exists(this.marker))
                    this.marker.destroy();

        }, 5000);
    }
}


export var OgEvent = new OgManager();
import { Player } from "../account/player";
import { Showdown } from "../showdown/showdown";
import { overlayError } from "../utils/utils";
import { Teams } from "../spawning/team";
import { Translation } from "../chat/translation";
import { Paintball } from "../system/paintball";
import { OgEvent } from "../events/og";

Translation.add("Team:Showdown", "Du kannst während eines Showdowns (Truck) kein Team wechseln.", "You can't change the team while a showdown is running.", "Вы не можете сменить команду во время вскрытия.");

mp.events.addCommand("team", (player: Player) => {

    if (Paintball.isPlayerIn(player))
        return false;

    if (Showdown.isCurrentlyStolen())
        return overlayError(player, Translation.get("Team:Showdown", player.language), "Error");

    player.team = -1;
    player.dimension = Math.floor((Math.random() * 99) + 1);
    player.call("createLogin", [1, Teams.getTeamsAsJson()]);
    player.isCustomizing = true;

    if (player.getVariable("isPlayerOg") == true)
        OgEvent.foundTarget = false;
});
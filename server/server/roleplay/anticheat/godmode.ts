import { Player, Ban } from "../account/player";
import { Ranks } from "../admin";
import { Messages } from "../chat/messaging";
import { getTimeInSeconds } from "../utils/utils";

interface godmodePlayer extends Player {
    lastMessage: number;
    checkPlayer: boolean;
    oldPosition: Vector3Mp;
    oldHealth: number;
    oldHeading: number;
    oldArmour: number;
    godTester: Player;
}

setInterval(() => {
    mp.players.forEach((element: Player) => {

        if (element.team <= -1)
            return false;

        if (!element.isLoggedIn)
            return false;

        element.call("client:testInvisible", []);
        element.call("client:testSetHack", []);
    });
}, 60 * 1000);

mp.events.add("server:detectedGodmode", (player: godmodePlayer, hp: number) => {

    if (player.lastMessage >= getTimeInSeconds())
        return false;

    player.lastMessage = getTimeInSeconds() + 30;
    player.call("resetDeathState", []);

    mp.players.forEach((element: Player) => {
        if (element.info.admin >= Ranks.Moderator) {
            Messages.Send("WARNUNG", "<font color=red>Spieler " + player.name + " steht im verdacht Godmode zu verwenden. Derzeitige HP: " + hp + "</font>", false, element);
        }
    });
});

mp.events.add("playerDeath", (player: Player, reason: number, killer: Player) => {
    if (mp.players.exists(player))
        player.call("resetDeathState", []);
});

mp.events.addCommand("testgod", (player: godmodePlayer, fullText: string) => {

    if (player.info.admin >= Ranks.Moderator) {
        mp.players.forEach((element: godmodePlayer) => {

            if (element.name.toUpperCase() != fullText.toUpperCase())
                return false;

            if (element.checkPlayer)
                return false;

            element.oldPosition = element.position;
            element.oldHealth = element.health;
            element.oldHeading = element.heading;
            element.oldArmour = element.armour;
            element.godTester = player;

            element.position = new mp.Vector3(0, 0, 0);
            element.armour = 0;

            element.checkPlayer = true;
            element.call("client:testGodmode");


        });
    }

});

mp.events.add("server:GodmodeCheckDone", (player: godmodePlayer, healthBefore: number, healthAfter: number) => {

    if (healthBefore == healthAfter)
        if (mp.players.exists(player.godTester))
            Messages.Send("WARNUNG", "<font color=red>Der Spieler " + player.name + " wurde positiv auf Godmode geprüft.</font>", false, player.godTester);

    player.position = player.oldPosition;
    player.health = player.oldHealth;
    player.heading = player.oldHeading;
    player.armour = player.oldArmour;
    player.checkPlayer = false;
});

mp.events.add("server:GodmodeInvicible", (player: Player) => {

    if (mp.players.exists(player))
        Ban(player, "Godmode (Fehlerhaft? TS3: revive-gangwars.net)", "Anti Cheat");

});
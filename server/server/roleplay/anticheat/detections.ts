import { Player, Ban, Kick } from "../account/player";
import { logHelper } from "../logger";
import { playAnimation, animationPlayer } from "../gameplay/animations";
import { getTimeInSeconds } from "../utils/utils";
import { Ranks } from "../admin";
import { Messages } from "../chat/messaging";
import { database } from "../database/manager";
import { Bans } from "../database/entities/bans";
import { AdvancedConsoleLogger } from "typeorm";

interface antiCheat extends Player {
    detectionTriggered: boolean;
    keysCount: number;
    keysCountAll: number;
    isCalled: boolean;
    frameWarnings: number;
    lastFrameWarn: number;
}

mp.events.add("server:StopCtrlBug", (player: animationPlayer) => {
    if (player.vehicle) return false;

    if (player.isClimbing) return false;

    if (player.isOnLadder) return false;

    if (player.isJumping) return false;

    if (player.health < 1) return false;

    if (player.isBreaking) return false;

    if (player.isLooting) return false;

    if (player.isReloading) return false;

    if (player.isInMelee) return false;

    if (player.inventory.isUsing) return false;

    if (player.isHacking) return false;

    if (player.isHackingBank) return false;

    if (player.isInMelee)
        return false;

    playAnimation(player, "melee@unarmed@streamed_core_fps", "hit_heavy_punch_a", 0, false);
});

mp.events.add("server:Keys", (player: antiCheat, keyName: string) => {

    if (!player.isLoggedIn)
        return false;

    player.keysCountAll++;

    if (player.keysCount > getTimeInSeconds())
        return false;

    mp.players.forEach((element: Player) => {

        if (element.info.admin < Ranks.Admin)
            return false;

        if (element.isSupporting == false)
            return false;

        player.keysCount = getTimeInSeconds() + 5;
        Messages.Send("SERVER", "<font color=red>Spieler " + player.name + " hat ein Honeypot gedrückt. (Taste: " + keyName + " Anzahl: " + player.keysCountAll + ")</font>", false, element);

    });

});

mp.events.add(RageEnums.EventKey.PLAYER_READY, (player: antiCheat) => {

    player.keysCount = getTimeInSeconds() + 5;
    player.keysCountAll = 0;
    player.frameWarnings = 0;
    player.lastFrameWarn = getTimeInSeconds();
});


mp.events.add("server:LowFramerate", (player: antiCheat, frames: number) => {

    if (!player.isLoggedIn)
        return false;

    if (player.lastFrameWarn <= getTimeInSeconds()) {
        player.lastFrameWarn = getTimeInSeconds() + 3;

        player.frameWarnings++;

        Messages.Send("SERVER", "<font color=red>Du hast zu niedrige Frames. Bitte sorge für eine konstante Framerate! (FPS: " + frames + ")</font>", false, player);

        if (player.frameWarnings > 9)
            return Kick(player, "Low FPS (" + frames + ")", "System");
    }

});
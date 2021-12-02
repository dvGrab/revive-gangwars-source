import { Player } from "../account/player";
import { getTimeInSeconds } from "../utils/utils";

export interface animationPlayer extends Player {
    isPlayingAnimation: boolean;
    isHavingGangsterMove: boolean;
    lastAnimation : number;
};


export function playAnimation(animatedPlayer: Player, animDict: string, animName: string, flag: number, freeze: boolean = false) {
    mp.players.forEach((element: Player) => {
        element.call("streamAnimationToPlayers", [animDict, animName, flag, animatedPlayer.id, freeze]);
    });
}

var walkStyle = "move_m@gangster@generic";

var gangSigns = [
    ["amb@code_human_in_car_mp_actions@gang_sign_b@std@rds@base", "idle_a", "48"],
    ["amb@code_human_in_car_mp_actions@gang_sign_a@bodhi@rds@base", "idle_a", "48"],
    ["amb@code_human_in_car_mp_actions@gang_sign_a@low@ds@base", "idle_a", "48"],
    ["anim@mp_player_intcelebrationmale@peace", "peace", "48"],
    ["anim@mp_player_intcelebrationmale@finger", "finger", "48"],
    ["anim@heists@fleeca_bank@ig_7_jetski_owner", "owner_idle", "3"],
    ["mp_am_hold_up", "handsup_base", "3"],
    ["amb@code_human_in_car_mp_actions@wank@low@ps@base", "idle_a", "48"],
    ["missfbi_s4mop", "guard_idle_a", "3"]];
    
mp.events.add("sendAnimationToServer", (player: animationPlayer, animation: number) => {

    if(player.lastAnimation >= getTimeInSeconds())
        return false;

    player.lastAnimation = getTimeInSeconds() + 4;

    if (player.vehicle) return false;

    if (player.isClimbing) return false;

    if (player.isOnLadder) return false;

    if (player.isJumping) return false;

    if (player.health < 1) return false;

    if (player.isBreaking) return false;

    if (player.isAiming) return false;

    if (player.isLooting) return false;

    if (player.isReloading) return false;

    if (player.isInMelee) return false;


    if (player.inventory.isUsing) return false;

    if (player.isHacking) return false;

    if (player.isHackingBank) return false;

    if (player.policeGangwarTimer != undefined) return false;

    if (animation == 5 || animation == 6 || animation == 8) {
        if (player.isPlayingAnimation)
            player.stopAnimation();
        else {
            playAnimation(player, gangSigns[animation][0], gangSigns[animation][1], Number(gangSigns[animation][2]), true);
        }

        player.isPlayingAnimation = !player.isPlayingAnimation;


    }
    else {
        player.isPlayingAnimation = false;
        playAnimation(player, gangSigns[animation][0], gangSigns[animation][1], Number(gangSigns[animation][2]));
    }

});

mp.events.add("sendWalkstyleToServer", (player: animationPlayer) => {

    if (player.isHavingGangsterMove)
        player.setVariable("walkStyle", walkStyle);
    else
        player.setVariable("walkStyle", undefined);


    player.isHavingGangsterMove = !player.isHavingGangsterMove;

});

mp.events.addCommand("anim", (player: Player, fullText: string, cmd1: string, cmd2: string, cmd3: string) => {

    playAnimation(player, cmd1, cmd2, Number(cmd3));

});

mp.events.add("playerStartEnterVehicle", (player: animationPlayer, vehicle: VehicleMp, seat: number) => {

    if (player.isPlayingAnimation) {
        player.stopAnimation();
        player.isPlayingAnimation = false;
    }
    
});
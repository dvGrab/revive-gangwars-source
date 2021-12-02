import { Player } from "../account/player";

mp.events.add("enableVoiceToPlayer", (player: Player, target: Player) => {
    if (player.info.voicemute)
        return false;

    if (player) {
        if (target) {
            player.enableVoiceTo(target);
        }

    }
});

mp.events.add("disableVoiceToPlayer", (player: Player, target: Player) => {
    if (player.info.voicemute)
        return false;

    if (player) {
        if (target) {
            player.disableVoiceTo(target);
        }

    }
});
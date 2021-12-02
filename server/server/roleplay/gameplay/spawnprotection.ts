import { Player } from "../account/player";
import { Popup, ToastColors } from "../utils/overlay";
import { Paintball } from "../system/paintball";
import { playerClothes } from "../spawning/clothes";

mp.events.add("playerSpawn", (player: Player) => {
    try {

        if (player.isLoggedIn) {

            player.call("client:StopKillcam", []);

            if(Paintball.isPlayerIn(player))
                return false;

            Popup(player, "Spawnschutz aktiviert (10. Sek)", ToastColors.alert);
            player.call("spawnProtectionEnabled", [false]);
            player.setVariable("spawnProtection", true);
            player.alpha = 170;

            setTimeout(() => {

                if (mp.players.exists(player)) {
                    Popup(player, "Spawnschutz deaktiviert", ToastColors.alert);
                    player.call("spawnProtectionEnabled", [true]);
                    player.setVariable("spawnProtection", false);
                    player.alpha = 255;
                    player.spawnTimer = undefined;
                }

            }, 10 * 1000);

        }
    }
    catch (error) {
        console.log("Playerspawn: " + error);
    }
});
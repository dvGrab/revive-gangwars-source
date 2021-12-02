import { Player } from "../account/player";
import { TeamIds } from "../spawning/team";
import { Distance } from "../warflags/flags";
import { overlayError } from "../utils/utils";

var donutPosition = new mp.Vector3(436.68072509765625, -986.1544799804688, 30.09594268798828);

mp.markers.new(1, donutPosition, 0.5, { color: [50, 50, 100, 120]});
mp.labels.new("Donutautomat ($10)\n~g~Drücke E", donutPosition, { los: true, drawDistance: 3.0 });

mp.events.add("tryingLoot", (player : Player) => {

    if(player.team == TeamIds.LSPD)
    {
        if(Distance(player.position, donutPosition) < 5)
        {
            if(player.inventory.getAmount("Dollar") >= 10)
            {
                player.inventory.addAmount("Donut", 4);
                player.inventory.removeAmount("Dollar", 10);
            }
            else
                overlayError(player, "Du hast nicht genügend Geld!", "Fehler");
        }
    }

});
import { listenerCount } from "cluster";
import { Player } from "../account/player";
import { Distance } from "../warflags/flags";
import { overlayError } from "../utils/utils";
import { damagePlayer } from "../weapons/syncing";

class FreeForAllHelper {
    position: Vector3Mp;
    marker: MarkerMp;
    range: number;
    blip: BlipMp;


    constructor(position: Vector3Mp, range: number) {
        this.position = position;
        this.range = range;

        this.blip = mp.blips.new(310, new mp.Vector3(position.x, position.y, position.z), { shortRange: true, color: 26 });
        this.marker = mp.markers.new(1, new mp.Vector3(position.x, position.y, position.z - 50), this.range, { color: [25, 200, 255, 40] });
    }
};

class FreeForAllManager {
    list: FreeForAllHelper[] = [];

    add(position: Vector3Mp, range: number) {
        this.list.push(new FreeForAllHelper(position, range));
    }

    isPlayerInside(player: Player) {
        var isInside = false;

        this.list.forEach((element: FreeForAllHelper) => {

            if (Distance(player.position, element.position) > (element.range + 5))
                return false;

            isInside = true;
        });

        return isInside;
    }
}

mp.events.add("playerDeath", (player: damagePlayer, reason: string, killer: Player) => {

    if (!player.killer)
        return false;

    var random = Math.floor(Math.random() * 100);

    if (random < 2)
    {
        player.killer.inventory.addAmount("Drogencase Stufe I", 1);
        overlayError(player, "Verwende diese Box noch nicht. Sie hat noch keine Funktion.", "ACHTUNG!");
    }
        

});

export var FreeForAll = new FreeForAllManager();

FreeForAll.add(new mp.Vector3(-1134.7552490234375, 6.27667236328125, 48.56285858154297), 180);
FreeForAll.add(new mp.Vector3(-61.371158599853516, -2221.2255859375, 7.152728080749512), 150);
FreeForAll.add(new mp.Vector3(-794.981689453125, -1299.134033203125, 4.342898368835449), 180);
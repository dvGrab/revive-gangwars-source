import { Player } from "../account/player";
import { Distance } from "../warflags/flags";
import { playAnimation } from "../gameplay/animations";
import { getTimeInSeconds, overlayError } from "../utils/utils";
import { Messages } from "../chat/messaging";
import { Level } from "../account/leveling";
import { TeamIds } from "../spawning/team";
import { damagePlayer } from "../weapons/syncing";

class helperShops {
    position: Vector3Mp;
    blip: BlipMp;
    last: number;
    name: string;

    constructor(position: Vector3Mp) {
        this.position = position;
    }
}

class ShopRob {
    list: helperShops[] = [];
    dealerposition: Vector3Mp;
    dealerblip: BlipMp;
    constructor(position: Vector3Mp) {
        this.dealerposition = position;
        this.dealerblip = mp.blips.new(480, this.dealerposition, { color: 71, shortRange: true, name: "Gebrauchtwarenhehler" });
    }

    add(position: Vector3Mp) {
        this.list.push(new helperShops(position));
    }

    create() {
        this.list.forEach((element: helperShops) => {
            element.blip = mp.blips.new(500, element.position, {
                color: 52,
                shortRange: true,
                name: "Raub"
            });
        });
    }
}

var Shop = new ShopRob(new mp.Vector3(-677.43505859375, -634.134521484375, 24.268283843994));

Shop.add(new mp.Vector3(-46.71303939819336, -1758, 28.921016693115234));
Shop.add(new mp.Vector3(24.341093063354492, -1346.992431640625, 28.99702262878418));
Shop.add(new mp.Vector3(-706.0280151367188, -913.848876953125, 18.71558952331543));
Shop.add(new mp.Vector3(-1152.2598876953125, -1423.8336181640625, 4.4544596672058105));
Shop.add(new mp.Vector3(-1221.7738037109375, -908.5302124023438, 11.826345443725586));
Shop.add(new mp.Vector3(-1486.2364501953125, -377.94842529296875, 39.66339874267578));
Shop.add(new mp.Vector3(372.4295959472656, 326.22552490234375, 103.06636810302734));
Shop.add(new mp.Vector3(1164.6885986328125, -322.6375732421875, 68.7050552368164));
Shop.add(new mp.Vector3(1134.2188720703125, -982.332275390625, 45.91585159301758));
Shop.add(new mp.Vector3(1324.350830078125, -1650.055908203125, 51.7750358581543));
Shop.add(new mp.Vector3(319.6524963378906, 180.94815063476562, 103.08650207519531));

Shop.create();

setInterval(() => {

    mp.players.forEach((element: damagePlayer) => {

        if (!element.isLoggedIn) return false;

        if (element.hasPlayerRobbed) {
            if (!mp.blips.exists(element.robbingBlip))
                element.robbingBlip = mp.blips.new(303, element.position, { color: 1, shortRange: true, name: ("Dieb - " + element.name), scale: 0.5 });

            if (mp.blips.exists(element.robbingBlip)) {
                element.robbingBlip.position = element.position;

            }
        }
        else {
            if (mp.blips.exists(element.robbingBlip))
                element.robbingBlip.destroy();
        }
    });

}, 250);

mp.events.add("server:ShopRob", (player: damagePlayer) => {

    if (player.vehicle)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (player.team == TeamIds.LSPD)
        return false;

    if (player.health < 1)
        return false;

    if (player.isPlayerRobbing)
        return false;

    if (player.hasPlayerRobbed)
        return false;

    Shop.list.forEach((element: helperShops) => {

        if (Distance(element.position, player.position) > 5)
            return false;

        if (element.last > getTimeInSeconds())
            return overlayError(player, "Bruder, ich hab nichts mehr für dich!", "Fehler");

        player.isPlayerRobbing = true;
        playAnimation(player, "oddjobs@shop_robbery@rob_till", "loop", 32, false);

        setTimeout(() => {

            if (!mp.players.exists(player))
                return false;

            player.isPlayerRobbing = false;

            if (element.last > getTimeInSeconds())
                return overlayError(player, "Bruder, ich hab nichts mehr für dich!", "Fehler");

            if (player.health < 1)
                return false;

            if (Distance(element.position, player.position) > 5)
                return false;

            player.hasPlayerRobbed = true;
            player.stopAnimation();
            element.last = getTimeInSeconds() + 1500;

            Messages.Send("RAUB", player.name + " hat in deiner Hood ein Geschäfft ausgeraubt. Schnapp ihn dir!", true);
            player.setClothes(5, 40, 0, 2);

        }, 4 * 1000);

    });

});

mp.events.add("server:ShopDrop", (player: damagePlayer) => {

    if (player.vehicle)
        return false;

    if (Distance(player.position, Shop.dealerposition) > 5)
        return false;

    if (!player.hasPlayerRobbed)
        return overlayError(player, "Du musst mir schon was richtiges bringen.. Idiot.", "Fehler");

    if (player.health < 1)
        return false;

    player.hasPlayerRobbed = false;
    player.setClothes(5, 0, 0, 2);

    player.inventory.addAmount("Kokain", 1);
    player.inventory.addAmount("Verbandskasten", 1);
    player.inventory.addAmount("Dollar", 10);
    Level.givePlayerExperience(player, 250);

    Messages.Send("RAUB", "Du hast die Tasche abgegeben und vom Hehler ein kleines Geschenk bekommen.", false, player);
    Messages.Send("RAUB", "Der Diebstahl gibt dir eine Belohnung von " + Level.getExpWithMultiplicator(250, player) + " Exp.", false, player);
});

mp.events.add("playerDeath", (player: damagePlayer, reason: string, killer: damagePlayer) => {

    if(player.killer == undefined)
        return false;
    
    if (!mp.players.exists(player.killer))
        return false;

    if (!player.hasPlayerRobbed)
        return false;

    if (player.team == player.killer.team) {
        Messages.Send("SERVER", "Du hast deinen Teamkamerad beim Klauen erschossen. Du bekommst Minusexp.", false, player.killer);
        Level.givePlayerExperience(player.killer, -250);
        return false;
    }

    Messages.Send("WARNUNG", "Es wurde ein Dieb getötet und somit das eigene Geschäfft verteidigt.", true);

    player.killer.inventory.addAmount("Kokain", 1);
    player.killer.inventory.addAmount("Verbandskasten", 1);

    if (Math.floor(Math.random() * 100) <= 30)
        player.inventory.addAmount("Metallschrott", 10);

    Level.givePlayerExperience(player.killer, 200);
    Messages.Send("INFO", "Du hast für deine gute Tat " + Level.getExpWithMultiplicator(200, player.killer) + " EXP bekommen.", false, player.killer);
    Messages.Send("INFO", "Du hast es nicht geschafft die Ware zu klauen!", false, player);


    if (player.hasPlayerRobbed)
        player.hasPlayerRobbed = false;

    if (player.isPlayerRobbing)
        player.isPlayerRobbing = false;

    player.setClothes(5, 0, 0, 2);
});

mp.events.add("playerQuit", (player: damagePlayer) => {

    if (mp.blips.exists(player.robbingBlip))
        player.robbingBlip.destroy();

});
import { Player } from "../account/player";
import { getTimeInSeconds, overlayError } from "../utils/utils";
import { TeamIds, Teams } from "../spawning/team";
import { Messages } from "../chat/messaging";
import { Distance } from "../warflags/flags";
import { playAnimation } from "../gameplay/animations";
import { Level } from "../account/leveling";
import { Ranks } from "../admin";
import { playerBankRob } from "./bank";
import { Translation } from "../chat/translation";

interface playerRob extends Player {
    hasRobbed: boolean;
    isPickedUpJuwelry: boolean;
    isGivingJuwelry: boolean;
    lastJuwelry : number;
    robElement: juwelryRobPoints;
}

class juwelryRobPoints {

    position: Vector3Mp;
    robbed: boolean = true;
    marker: MarkerMp;
    bagObject: ObjectMp;
    bagdrop: Vector3Mp;
    bagMarker: MarkerMp;
    player: any;
    isdropped: boolean;


    constructor(position: Vector3Mp) {
        this.position = position;
    }
};

class JuwelryObject {

    robPoints: juwelryRobPoints[] = [];
    position: Vector3Mp;
    blip: BlipMp;
    marker: MarkerMp;
    last: number;

    receiverposition: Vector3Mp;
    receiver: BlipMp;

    copreceiverposition: Vector3Mp;
    copreceiver: BlipMp;

    warehouseposition: Vector3Mp;
    warehouse: BlipMp;

    constructor(position: Vector3Mp, receiverposition: Vector3Mp, copreceiverposition: Vector3Mp, warehouseposition: Vector3Mp) {
        this.position = position;

        this.blip = mp.blips.new(617, this.position, {
            color: 3
        });

        this.marker = mp.markers.new(1, this.position, 0.7, { color: [255, 0, 0, 30] });

        this.receiverposition = receiverposition;
        this.receiver = mp.blips.new(480, this.receiverposition, { color: 71, shortRange: true, name: "Hehler" });

        this.copreceiverposition = copreceiverposition;
        this.copreceiver = mp.blips.new(480, this.copreceiverposition, { color: 3, shortRange: true, name: "Asservatenkammer" });

        this.warehouseposition = warehouseposition;
        this.warehouse = mp.blips.new(479, this.warehouseposition, { color: 5, shortRange: true, name: "Warenhaus für Hehlerquittung" });
    }

    addpoint(position: Vector3Mp) {
        this.robPoints.push(new juwelryRobPoints(position));
    }

    start() {
        this.robPoints.forEach((element: juwelryRobPoints) => {

            if (mp.markers.exists(element.bagMarker))
                element.bagMarker.destroy();

            if (mp.objects.exists(element.bagObject)) {
                element.bagObject.destroy();
                element.bagdrop = new mp.Vector3(0, 0, 9999);
            }

            element.marker = mp.markers.new(1, element.position, 0.3, { color: [50, 255, 0, 30] });
            element.robbed = false;
            element.isdropped = false;
            element.player = null;


        });
    }
}


var Juwelry = new JuwelryObject(
    new mp.Vector3(-631.3824462890625, -230.0990447998047, 37.0570487976074),
    new mp.Vector3(-1566.7489013671875, -231.85153198242188, 48.43786621),
    new mp.Vector3(464.8822937011719, -984.5567626953125, 25.06532859802246),
    new mp.Vector3(1709.0831298828125, -1610.1993408203125, 113.1593551635742));

Juwelry.addpoint(new mp.Vector3(-623.8839721679688, -227.03646850585938, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-624.926513671875, -227.8002166748047, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-626.9009399414062, -233.14059448242188, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-627.9962158203125, -233.8310546875, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-626.8267822265625, -235.45053100585938, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-625.8069458007812, -234.58734130859375, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-625.6775512695312, -237.87461853027344, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-626.6419677734375, -238.5700225830078, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-623.0386352539062, -232.97047424316406, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-624.4407958984375, -231.0298614501953, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-620.2501220703125, -234.49310302734375, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-619.1737060546875, -233.70928955078125, 37.0701446533203));
Juwelry.addpoint(new mp.Vector3(-617.5987548828125, -230.6067352294922, 37.07010650634766));
Juwelry.addpoint(new mp.Vector3(-618.5056762695312, -229.60205078125, 37.06976318359375));
Juwelry.addpoint(new mp.Vector3(-619.8706665039062, -227.73330688476562, 37.0699157714844));
Juwelry.addpoint(new mp.Vector3(-620.6956176757812, -226.63729858398438, 37.06983947753906));
Juwelry.addpoint(new mp.Vector3(-620.8612670898438, -228.45706176757812, 37.0705642700195));
Juwelry.addpoint(new mp.Vector3(-619.5060424804688, -230.31936645507812, 37.0705642700195));

mp.events.addCommand("bank", (player: Player) => {

    if (player.info.admin < Ranks.Projectlead)
        return false;

    player.position = Juwelry.position;

});

/* 
    adding blackmarkert as npc for all juwelry and bank stuff 
*/

Translation.add("juwelry:Timeout", "Der Juwelier kann gerade nicht ausgraubt werden.", "The juwelry cannot be robbed currently.", "Ювелирный магазин не может быть ограблен в данный момент.");
Translation.add("juwelry:Police", "Du kannst als Polizist keinen Raub ausführen.", "You cannot rob a juwelry as police officer.", "Вы не можете ограбить ювелирный магазин, если вы офицер полиции.");
Translation.add("juwelry:IsHacking", "Jemand hackt bereits die Sicherheitssysteme.", "Someone is currently hacking security system.", "Кто-то начал взламываь охранную систему.");

Translation.add("juwelry:Hacked",
    "<font color='red'>Es wird gerade ein Raub auf den Juwelier gestartet. Die Sicherheitssysteme werden angegriffen.</font>",
    "<font color='red'>There is currently starting a juwelry rob. The security system is getting hacked.</font>",
    "<font color='red'>Началось ограбление ювелирного магазина. Кто-то начал взламывать охранную систему.</font>");

Translation.add("juwelry:Bagpick",
    "Du hast deine Tasche voll mit Juwelen! Bring sie zum Hehler!",
    "You've a bagpack full of juwelrys. Bring it to the seller.",
    "Ваш рюкзак полон драгоценностей из ювелирного магазина. Отнесите их продавцу.");

mp.events.add("server:JuwelryHacking", (player: Player) => {

    if (Distance(player.position, Juwelry.position) > 3)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (Juwelry.last > getTimeInSeconds())
        return overlayError(player, Translation.get("juwelry:Timeout", player.language), "Fehler");

    if (player.team == TeamIds.LSPD)
        return overlayError(player, Translation.get("juwelry:Police", player.language), "Fehler");

    if (mp.players.toArray().findIndex((element: Player) => element.isHacking == true) > -1)
        return overlayError(player, Translation.get("juwelry:IsHacking", player.language), "Fehler");

    Translation.globalTranslationPush("juwelry:Hacked");

    player.position = new mp.Vector3(-631.4659423828125, -229.9373779296875, 38.00);
    player.heading = 216;

    playAnimation(player, "missheist_jewel@hacking", "hack_loop", 1, true);
    player.call("client:freeze", [true]);
    player.isHacking = true;

    setTimeout(() => {

        if (!mp.players.exists(player))
            return false;

        player.isHacking = false;

        if (Distance(player.position, Juwelry.position) > 3)
            return false;

        Juwelry.last = getTimeInSeconds() + 2700;

        player.call("client:freeze", [false]);
        player.stopAnimation();

        Translation.add("juwelry:HasHacked",
            "<font color='red'>Die Sicherheitssysteme wurden von dem Team " + Teams.getTeamName(player.team) + " gehackt.</font>",
            "<font color='red'>The juwelry has been hacked by team " + Teams.getTeamName(player.team) + "</font>",
            "<font color='red'>Ювелирный магазин был взломан командой " + Teams.getTeamName(player.team) + "</font>");

        Translation.globalTranslationPush("juwelry:HasHacked");

        mp.players.forEach((element: playerRob) => {
            element.hasRobbed = false;
        });

        Juwelry.start();

    }, 60 * 1000);

});

mp.events.add("server:JuwelryRobbing", (player: playerRob) => {

    if (player.team == TeamIds.LSPD)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (player.hasRobbed)
        return false;

    if (player.vehicle)
        return false;

    if (player.health < 1)
        return false;

    Juwelry.robPoints.forEach((element: juwelryRobPoints) => {

        if (Distance(element.position, player.position) > 4)
            return false;

        if (element.robbed)
            return false;

        if (player.isPickedUpJuwelry)
            return false;

        if (player.hasRobbed)
            return false;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false);

        element.robbed = true;
        player.isPickedUpJuwelry = true;

        setTimeout(() => {

            if (!mp.players.exists(player)) return false;

            if (player.health < 1 || (Distance(player.position, element.position) > 4)) {
                element.robbed = false;
                player.isPickedUpJuwelry = false;
                return false;
            }

            if (mp.markers.exists(element.marker))
                element.marker.destroy();

            player.setClothes(5, 40, 0, 2);
            player.hasRobbed = true;
            player.isPickedUpJuwelry = false;

            element.player = player;

            player.stopAnimation();

            Messages.Send("WARNUNG", Translation.get("juwelry:Bagpick", player.language), false, player);


        }, 2 * 1000);
    });

});

Translation.add("juwelry:Delivered", "Du hast vom Hehler eine Quittung bekommen. Du kannst diese beim Hehlerlager einlösen.",
    "You received the Hehlerquittung from the guy. You can exchange it on the Hehlerwarehouse.",
    "Вы получили квитанцию от Hehler'а. Вы можете обменять ее на складе Hehler'а. (Карта/GPS: Hehler)");

mp.events.add("server:JuwelryReceiver", (player: playerRob) => {

    if (player.vehicle)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (player.health < 1)
        return false;

    if (player.isGivingJuwelry)
        return false;

    if (player.team == TeamIds.LSPD) {
        if (Distance(player.position, Juwelry.copreceiverposition) > 4)
            return false;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false)
        player.isGivingJuwelry = true;

        setTimeout(() => {

            if (!mp.players.exists(player))
                return false;

            player.isGivingJuwelry = false;

            if (Distance(player.position, Juwelry.copreceiverposition) > 4)
                return false;

            if (player.health < 1)
                return false;

            player.stopAnimation();

            if (!player.hasRobbed)
                return overlayError(player, "Du hast keine Diebstahlware dabei!", "Fehler");

            player.hasRobbed = false;

            var rob = Juwelry.robPoints.find(element => element.player == player);

            if (rob) {
                rob.isdropped = false;
                rob.player = null;
            }


            Level.givePlayerExperience(player, 150);
            player.inventory.addAmount("Hehlerquittung", 1);


            if (Math.floor(Math.random() * 100) <= 30)
                player.inventory.addAmount("Metallschrott", 10);

            player.outputChatBox("Du hast die Ware in der Asservatenkamer abgelagert. Du bekommst eine Belohnung für deine gute Tat!");
            player.outputChatBox("In deiner Tasche lag jedoch noch ein alter Hehlerschein...");
            player.setClothes(5, 0, 0, 2);
        }, 2500);

    }
    else {
        if (Distance(player.position, Juwelry.receiverposition) > 4)
            return false;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false);
        player.isGivingJuwelry = true;

        setTimeout(() => {

            if (!mp.players.exists(player))
                return false;

            player.isGivingJuwelry = false;

            if (Distance(player.position, Juwelry.receiverposition) > 4)
                return false;

            if (player.health < 1)
                return false;

            if (!player.hasRobbed)
                return overlayError(player, "Du hast keine Hehlerware dabei! Verpiss schleunigst von hier!", "Fehler");

            player.stopAnimation();

            player.hasRobbed = false;

            var rob = Juwelry.robPoints.find(element => element.player == player);

            if (rob) {
                rob.isdropped = false;
                rob.player = null;
            }

            player.inventory.addAmount("Hehlerquittung", 1);
            Level.givePlayerExperience(player, 150);
            player.outputChatBox(Translation.get("juwelry:Delivered", player.language));
            player.setClothes(5, 0, 0, 2);
        }, 2500);

    }

});

mp.events.add("server:JuwelryDropbag", (player: playerRob, x: number, y: number, z: number, aboveGround: number) => {

    Juwelry.robPoints.forEach((element: juwelryRobPoints) => {

        if (element.player == null) return false;

        if (element.isdropped) return false;

        if (element.player != player) return false;

        if (mp.markers.exists(element.bagMarker))
            element.bagMarker.destroy();

        if (mp.objects.exists(element.bagObject))
            element.bagObject.destroy();

        element.bagObject = mp.objects.new(mp.joaat("p_ld_heist_bag_s_pro2_s"), new mp.Vector3(x, y, z - aboveGround), {
            rotation: new mp.Vector3(0, 15, Math.floor(Math.random() * 360))
        });

        element.bagMarker = mp.markers.new(1, element.bagObject.position, 0.9, { color: [255, 0, 0, 30] });

        mp.players.forEach((playerElement: playerRob) => {

            playerElement.call("receiveCashParticle", [player.position.x, player.position.y, player.position.z - aboveGround])

        });

        element.bagdrop = new mp.Vector3(x, y, z - aboveGround);
        element.isdropped = true;
        element.player = null;
    });

});

mp.events.add("server:JuwelryBagpickup", (player: playerRob) => {

    if(!player.lastJuwelry)
        player.lastJuwelry = getTimeInSeconds() + 3;

    if(player.lastJuwelry > getTimeInSeconds())
        return false;
    else
        player.lastJuwelry = getTimeInSeconds() + 3;

    if (player.health < 1)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (player.vehicle)
        return false;

    Juwelry.robPoints.forEach((element: juwelryRobPoints) => {

        if (!element.isdropped) return false;

        if (element.player != null) return false;

        if (Distance(element.bagdrop, player.position) > 6) return false;

        if (player.hasRobbed)
            return false;

        if (mp.objects.exists(element.bagObject))
            element.bagObject.destroy();

        if (mp.markers.exists(element.bagMarker))
            element.bagMarker.destroy();

        element.isdropped = false;
        element.player = player;
        element.bagdrop = new mp.Vector3(0, 0, 999);

        player.hasRobbed = true;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false);
        player.setClothes(5, 40, 0, 2);


    });

});

mp.events.add("server:JuwelryWarehouse", (player: playerRob) => {

    if (player.vehicle)
        return false;

    if (Distance(player.position, Juwelry.warehouseposition) > 5)
        return false;

    if (player.inventory.getAmount("Hehlerquittung") < 1)
        return false;

    player.inventory.removeAmount("Hehlerquittung", 1);

    player.inventory.addAmount("Dollar", 25);
    player.inventory.addAmount("Schutzweste", 2);
    player.inventory.addAmount("Verbandskasten", 2);

    Level.giveTokens(player, 1);
    Level.givePlayerExperience(player, 50);

    player.inventory.saveInventory();
});

Translation.add("juwelry:Dropped", "Du hast die Hehlerware verloren!", "You've lost the juwelries.", "Вы потеряли ювелирные изделия.");

mp.events.add("playerDeath", (player: playerRob) => {

    if (player.isGivingJuwelry)
        player.isGivingJuwelry = false;

    if (player.isPickedUpJuwelry)
        player.isPickedUpJuwelry = false;

    if (player.isHacking)
        player.isHacking = false;

    if (player.hasRobbed) {
        player.setClothes(5, 0, 0, 2);
        player.call("client:getPerfectGroundPosition", [player.position.x, player.position.y, player.position.z]);
        Messages.Send("WARNUNG", Translation.get("juwelry:Dropped", player.language), false, player);
        player.hasRobbed = false;
    }

});

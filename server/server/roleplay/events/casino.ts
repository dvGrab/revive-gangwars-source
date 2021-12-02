import { Player } from "../account/player";
import { getTimeInSeconds, overlayError } from "../utils/utils";
import { TeamIds, Teams } from "../spawning/team";
import { Messages } from "../chat/messaging";
import { Distance } from "../warflags/flags";
import { playAnimation } from "../gameplay/animations";
import { Level } from "../account/leveling";
import { Ranks } from "../admin";
import { Translation } from "../chat/translation";

interface playerCasinoRob extends Player {
    hasRobbedCasino: boolean;
    isPickedUpCasino: boolean;
    isGivingCasino: boolean;
    lastCasino: number;
    lastEnter: number;
}

class casinoRobPoints {

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

class CasinoObject {

    robPoints: casinoRobPoints[] = [];
    position: Vector3Mp;
    blip: BlipMp;
    marker: MarkerMp;
    last: number;
    isAlarm: boolean = false;

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
        this.receiver = mp.blips.new(683, this.receiverposition, { color: 71, shortRange: true, name: "Pokerchip Bilo" });

        this.warehouseposition = warehouseposition;
        this.warehouse = mp.blips.new(680, this.warehouseposition, { color: 5, shortRange: true, name: "Dealer" });


        mp.markers.new(1, new mp.Vector3(936.023193359375, 47.22430419921875, 79.595687866210), 1, { color: [255, 0, 0, 100] });
        mp.markers.new(1, new mp.Vector3(1089.781982421875, 206.44766235351562, -50.4997444152832), 1, { color: [255, 0, 0, 100] });

    }

    addpoint(position: Vector3Mp) {
        this.robPoints.push(new casinoRobPoints(position));
    }

    start() {
        this.robPoints.forEach((element: casinoRobPoints) => {

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

var Casino = new CasinoObject(
    new mp.Vector3(1112.0799560546875, 242.2651824951172, -46.03102035522461),
    new mp.Vector3(-333.9362487792969, -90.81761932373047, 46.55352020263672),
    new mp.Vector3(44444, 444, 44440),
    new mp.Vector3(-2078.809814453125, -1016.347900390625, 5.384132385253906));

Casino.addpoint(new mp.Vector3(1134.2506103515625, 254.99514770507812, -51.5357666015625));
Casino.addpoint(new mp.Vector3(1132.923095703125, 256.2222595214844, -51.5357666015625));
Casino.addpoint(new mp.Vector3(1133.71728515625, 258.15069580078125, -51.5357666015625));
Casino.addpoint(new mp.Vector3(1130.1754150390625, 251.69851684570312, -51.53578186035156));
Casino.addpoint(new mp.Vector3(1131.7283935546875, 250.33360290527344, -51.53578186035156));
Casino.addpoint(new mp.Vector3(1133.4462890625, 249.1833953857422, -51.535728454589844));
Casino.addpoint(new mp.Vector3(1136.9268798828125, 252.005615234375, -51.53573226928711));
Casino.addpoint(new mp.Vector3(1137.898681640625, 254.00747680664062, -51.53573226928711));
Casino.addpoint(new mp.Vector3(1140.043212890625, 253.665283203125, -51.53573226928711));
Casino.addpoint(new mp.Vector3(1140.1431884765625, 251.44363403320312, -51.535789489746094));
Casino.addpoint(new mp.Vector3(1115.3392333984375, 235.80003356933594, -50.34079360961914));
Casino.addpoint(new mp.Vector3(1113.059814453125, 235.67112731933594, -50.34079360961914));
Casino.addpoint(new mp.Vector3(1112.358154296875, 233.83924865722656, -50.34079360961914));
Casino.addpoint(new mp.Vector3(1114.08642578125, 232.64059448242188, -50.34079360961914));
Casino.addpoint(new mp.Vector3(1108.410888671875, 232.69686889648438, -50.34074401855469));
Casino.addpoint(new mp.Vector3(1106.8035888671875, 233.9861602783203, -50.34075164794922));
Casino.addpoint(new mp.Vector3(1107.57421875, 235.865234375, -50.34075927734375));
Casino.addpoint(new mp.Vector3(1109.700927734375, 235.72952270507812, -50.34075927734375));
Casino.addpoint(new mp.Vector3(1119.520263671875, 231.88807678222656, -50.3408088684082));
Casino.addpoint(new mp.Vector3(1119.3697509765625, 232.97994995117188, -50.340824127197266));
Casino.addpoint(new mp.Vector3(1120.15234375, 229.7591094970703, -50.34081268310547));

mp.events.addCommand("casino", (player: Player) => {

    if (player.info.admin < Ranks.Projectlead)
        return false;

    player.position = Casino.position;

});


Translation.add("casino:Timeout", "Das Casino kann gerade nicht ausgraubt werden.", "The casino cannot be robbed currently.", "Ювелирный магазин не может быть ограблен в данный момент.");
Translation.add("casino:Police", "Du kannst als Polizist keinen Raub ausführen.", "You cannot rob a casino as police officer.", "Вы не можете ограбить ювелирный магазин, если вы офицер полиции.");
Translation.add("casino:IsHacking", "Jemand hackt bereits die Sicherheitssysteme.", "Someone is currently hacking security system.", "Кто-то начал взламываь охранную систему.");

Translation.add("casino:Hacked",
    "<font color='red'>Es wird gerade ein Raub auf das Casino gestartet. Die Sicherheitssysteme werden angegriffen.</font>",
    "<font color='red'>There is currently starting a casino rob. The security system is getting hacked.</font>",
    "<font color='red'>Началось ограбление ювелирного магазина. Кто-то начал взламывать охранную систему.</font>");

Translation.add("casino:Bagpick",
    "Du hast deine Tasche voll mit Chips! Bring sie zum Dealer!",
    "You've a bagpack full of chips. Bring it to the seller.",
    "Ваш рюкзак полон драгоценностей из ювелирного магазина. Отнесите их продавцу.");

Translation.add("casino:Team",
    "Es müssen mindestens 5 Mitspieler in deinem Team sein!",
    "You've a bagpack full of chips. Bring it to the seller.",
    "Ваш рюкзак полон драгоценностей из ювелирного магазина. Отнесите их продавцу.");

mp.events.add("server:CasinoHacking", (player: Player) => {

    if (Distance(player.position, Casino.position) > 3)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (Teams.getTeamAmount(player.team) < 0)
        return overlayError(player, Translation.get("casino:Team", player.language), "Fehler");

    if (Casino.last > getTimeInSeconds())
        return overlayError(player, Translation.get("casino:Timeout", player.language), "Fehler");

    if (player.team == TeamIds.LSPD)
        return overlayError(player, Translation.get("casino:Police", player.language), "Fehler");

    if (mp.players.toArray().findIndex((element: Player) => element.isHacking == true) > -1)
        return overlayError(player, Translation.get("casino:IsHacking", player.language), "Fehler");

    Translation.globalTranslationPush("casino:Hacked");

    player.position = new mp.Vector3(1112.0799560546875, 242.2651824951172, -46.03102035522461);
    player.heading = 28;

    playAnimation(player, "missheist_jewel@hacking", "hack_loop", 1, true);
    player.call("client:freeze", [true]);
    player.isHacking = true;

    setTimeout(() => {

        if (!mp.players.exists(player))
            return false;

        player.isHacking = false;

        if (Distance(player.position, Casino.position) > 3)
            return false;

        Casino.last = getTimeInSeconds() + 2700;

        player.call("client:freeze", [false]);
        player.stopAnimation();

        Translation.add("casino:HasHacked",
            "<font color='red'>Die Sicherheitssysteme des Casinos wurden von dem Team " + Teams.getTeamName(player.team) + " gehackt.</font>",
            "<font color='red'>The casino has been hacked by team " + Teams.getTeamName(player.team) + "</font>",
            "<font color='red'>Ювелирный магазин был взломан командой " + Teams.getTeamName(player.team) + "</font>");

        Translation.globalTranslationPush("casino:HasHacked");

        Casino.isAlarm = true;

        mp.players.forEach((element: playerCasinoRob) => {
            element.hasRobbedCasino = false;
            element.call("client:CasinoAlarmState", [true]);
        });

        Casino.start();

        setTimeout(() => {
            mp.players.forEach((element: playerCasinoRob) => {
                Casino.isAlarm = false;
                element.call("client:CasinoAlarmState", [false]);
            });
        }, 120 * 1000);

    }, 60 * 1000);

});

mp.events.add("server:CasinoRobbing", (player: playerCasinoRob) => {

    if (player.team == TeamIds.LSPD)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (player.hasRobbedCasino)
        return false;

    if (player.vehicle)
        return false;

    if (player.health < 1)
        return false;

    Casino.robPoints.forEach((element: casinoRobPoints) => {

        if (Distance(element.position, player.position) > 4)
            return false;

        if (element.robbed)
            return false;

        if (player.isPickedUpCasino)
            return false;

        if (player.hasRobbedCasino)
            return false;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false);

        element.robbed = true;
        player.isPickedUpCasino = true;

        setTimeout(() => {

            if (!mp.players.exists(player)) return false;

            if (player.health < 1 || (Distance(player.position, element.position) > 4)) {
                element.robbed = false;
                player.isPickedUpCasino = false;
                return false;
            }

            if (mp.markers.exists(element.marker))
                element.marker.destroy();

            player.setClothes(5, 40, 0, 2);
            player.hasRobbedCasino = true;
            player.isPickedUpCasino = false;

            element.player = player;

            player.stopAnimation();

            Messages.Send("WARNUNG", Translation.get("casino:Bagpick", player.language), false, player);

        }, 2 * 1000);
    });

});

Translation.add("casino:Delivered", "Du hast vom Dealer eine Chip-Quittung bekommen. Du kannst diese beim Croupier einlösen.",
    "You received the Chip-Quittung from the guy. You can exchange it on the Croupier.",
    "Вы получили квитанцию от Hehler'а. Вы можете обменять ее на складе Hehler'а. (Карта/GPS: Hehler)");

mp.events.add("server:CasinoReceiver", (player: playerCasinoRob) => {

    if (player.vehicle)
        return false;

    if (player.dimension != 0)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (player.health < 1)
        return false;

    if (player.isGivingCasino)
        return false;

    if (player.team == TeamIds.LSPD) {
        if (Distance(player.position, Casino.copreceiverposition) > 4)
            return false;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false)
        player.isGivingCasino = true;

        setTimeout(() => {

            if (!mp.players.exists(player))
                return false;

            player.isGivingCasino = false;

            if (Distance(player.position, Casino.copreceiverposition) > 4)
                return false;

            if (player.health < 1)
                return false;

            player.stopAnimation();

            if (!player.hasRobbedCasino)
                return overlayError(player, "Du hast keine Diebstahlware dabei!", "Fehler");

            player.hasRobbedCasino = false;

            var rob = Casino.robPoints.find(element => element.player == player);

            if (rob) {
                rob.isdropped = false;
                rob.player = null;
            }


            Level.givePlayerExperience(player, 150);
            player.inventory.addAmount("Pokerchips", 1);


            if (Math.floor(Math.random() * 100) <= 30)
                player.inventory.addAmount("Metallschrott", 10);

            player.outputChatBox("Du hast die Ware in der Asservatenkamer abgelagert. Du bekommst eine Belohnung für deine gute Tat!");
            player.outputChatBox("In deiner Tasche lag jedoch noch ein alter Hehlerschein...");
            player.setClothes(5, 0, 0, 2);
        }, 2500);

    }
    else {
        if (Distance(player.position, Casino.receiverposition) > 4)
            return false;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false);
        player.isGivingCasino = true;

        setTimeout(() => {

            if (!mp.players.exists(player))
                return false;

            player.isGivingCasino = false;

            if (Distance(player.position, Casino.receiverposition) > 4)
                return false;

            if (player.health < 1)
                return false;

            if (!player.hasRobbedCasino)
                return overlayError(player, "Du hast keine Chips dabei! Verpiss schleunigst von hier!", "Fehler");

            player.stopAnimation();

            player.hasRobbedCasino = false;

            var rob = Casino.robPoints.find(element => element.player == player);

            if (rob) {
                rob.isdropped = false;
                rob.player = null;
            }

            player.inventory.addAmount("Pokerchips", 1);
            Level.givePlayerExperience(player, 150);
            player.outputChatBox(Translation.get("casino:Delivered", player.language));
            player.setClothes(5, 0, 0, 2);
        }, 2500);

    }

});

mp.events.add("server:CasinoDropbag", (player: playerCasinoRob, x: number, y: number, z: number, aboveGround: number) => {

    Casino.robPoints.forEach((element: casinoRobPoints) => {

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

        mp.players.forEach((playerElement: playerCasinoRob) => {

            playerElement.call("receiveCashParticle", [player.position.x, player.position.y, player.position.z - aboveGround])

        });

        element.bagdrop = new mp.Vector3(x, y, z - aboveGround);
        element.isdropped = true;
        element.player = null;
    });

});

mp.events.add("server:CasinoBagpickup", (player: playerCasinoRob) => {

    if (!player.lastCasino)
        player.lastCasino = getTimeInSeconds() + 3;

    if (player.lastCasino > getTimeInSeconds())
        return false;
    else
        player.lastCasino = getTimeInSeconds() + 3;

    if (player.health < 1)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (player.vehicle)
        return false;

    Casino.robPoints.forEach((element: casinoRobPoints) => {

        if (!element.isdropped) return false;

        if (element.player != null) return false;

        if (Distance(element.bagdrop, player.position) > 6) return false;

        if (player.hasRobbedCasino)
            return false;

        if (mp.objects.exists(element.bagObject))
            element.bagObject.destroy();

        if (mp.markers.exists(element.bagMarker))
            element.bagMarker.destroy();

        element.isdropped = false;
        element.player = player;
        element.bagdrop = new mp.Vector3(0, 0, 999);

        player.hasRobbedCasino = true;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false);
        player.setClothes(5, 40, 0, 2);
    });

});

mp.events.add("server:CasinoWarehouse", (player: playerCasinoRob) => {

    if (player.vehicle)
        return false;

    if (Distance(player.position, Casino.warehouseposition) > 5)
        return false;

    if (player.dimension != 0)
        return false;


    if (player.inventory.getAmount("Pokerchips") < 1)
        return false;

    player.inventory.removeAmount("Pokerchips", 1);

    player.inventory.addAmount("Dollar", 150);
    player.inventory.addAmount("Schutzweste", 15);
    player.inventory.addAmount("Verbandskasten", 15);

    Level.giveTokens(player, 1);
    Level.givePlayerExperience(player, 500);

    player.inventory.saveInventory();
});

Translation.add("casino:Dropped", "Du hast die Chips verloren!", "You've lost the chips.", "Вы потеряли ювелирные изделия.");

mp.events.add(RageEnums.EventKey.PLAYER_DEATH, (player: playerCasinoRob) => {

    if (player.isGivingCasino)
        player.isGivingCasino = false;

    if (player.isPickedUpCasino)
        player.isPickedUpCasino = false;

    if (player.isHacking)
        player.isHacking = false;

    if (player.hasRobbedCasino) {
        player.setClothes(5, 0, 0, 2);
        player.call("client:CasinogetPerfectGroundPosition", [player.position.x, player.position.y, player.position.z]);
        Messages.Send("WARNUNG", Translation.get("casino:Dropped", player.language), false, player);
        player.hasRobbedCasino = false;
    }

});

mp.events.add("playerReady", (player: playerCasinoRob) => {
    player.call("client:CasinoAlarmState", [Casino.isAlarm]);
    player.lastEnter = getTimeInSeconds();
});

mp.events.add("server:CasinoEnter", (player: playerCasinoRob) => {

    if (player.lastEnter < getTimeInSeconds()) {


        if (Distance(player.position, new mp.Vector3(1089.781982421875, 206.44766235351562, -49.4997444152832)) < 3) {
            player.position = new mp.Vector3(936.023193359375, 47.22430419921875, 80.59568786621094);
            player.heading = 328.75103759765625;
            player.lastEnter = getTimeInSeconds() + 5;
        } else if (Distance(player.position, new mp.Vector3(936.023193359375, 47.22430419921875, 80.5956878662109)) < 3) {
            player.position = new mp.Vector3(1089.781982421875, 206.44766235351562, -49.4997444152832);
            player.heading = 3;
            player.lastEnter = getTimeInSeconds() + 5;
        }

    }

});
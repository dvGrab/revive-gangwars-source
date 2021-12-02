import { Player } from "../account/player";

mp.events.addCommand("bankrob", (player: Player) => {
    if (player.info.admin >= Ranks.Projectlead)
        player.position = new mp.Vector3(255.2283, 223.976, 102.3932);
});


import { getTimeInSeconds, overlayError } from "../utils/utils";
import { TeamIds, Teams } from "../spawning/team";
import { Messages } from "../chat/messaging";
import { Distance } from "../warflags/flags";
import { playAnimation } from "../gameplay/animations";
import { Level } from "../account/leveling";
import { Ranks } from "../admin";
import { Translation } from "../chat/translation";
import { Message } from "discord.js";

export interface playerBankRob extends Player {
    hasRobbedBank: boolean;
    isPickungUpBank: boolean;
    isGivingMoney: boolean;
    lastBank : number;
}

class BankRobPoints {

    position: Vector3Mp;
    isPointRobbed: boolean = true;
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

class BankObject {

    robPoints: BankRobPoints[] = [];
    position: Vector3Mp;
    blip: BlipMp;
    marker: MarkerMp;
    last: number;
    isAlarm: boolean;

    receiverposition: Vector3Mp;
    receiver: BlipMp;

    copreceiverposition: Vector3Mp;
    copreceiver: BlipMp;

    warehouseposition: Vector3Mp;
    warehouse: BlipMp;

    constructor(position: Vector3Mp, receiverposition: Vector3Mp, copreceiverposition: Vector3Mp, warehouseposition: Vector3Mp) {
        this.position = position;

        this.blip = mp.blips.new(374, this.position, {
            color: 3
        });

        this.marker = mp.markers.new(1, this.position, 0.7, { color: [255, 0, 0, 30] });

        this.receiverposition = receiverposition;
        this.receiver = mp.blips.new(480, this.receiverposition, { color: 71, shortRange: true, name: "Geldwäscher" });

        this.copreceiverposition = copreceiverposition;
        this.copreceiver = mp.blips.new(480, this.copreceiverposition, { color: 3, shortRange: true, name: "Asservatenkammer für Geld" });

        this.warehouseposition = warehouseposition;
        this.warehouse = mp.blips.new(619, this.warehouseposition, { color: 5, shortRange: true, name: "Banker" });
    }

    addpoint(position: Vector3Mp) {
        this.robPoints.push(new BankRobPoints(position));
    }

    start() {
        this.robPoints.forEach((element: BankRobPoints) => {

            if (mp.markers.exists(element.bagMarker))
                element.bagMarker.destroy();

            if (mp.objects.exists(element.bagObject)) {
                element.bagdrop = new mp.Vector3(0, 0, 9999);
                element.bagObject.destroy();
            }

            element.marker = mp.markers.new(1, element.position, 0.5, { color: [50, 255, 0, 30] });
            element.isPointRobbed = false;
            element.isdropped = false;
            element.player = null;
        });
    }
}

var Bank = new BankObject(
    new mp.Vector3(261.67572021484375, 223.18753051757812, 105.0839126586914),
    new mp.Vector3(891.68603515625, -1582.1646728515625, 29.5610790252685555),
    new mp.Vector3(459.7052307128906, -989.27783203125, 25.014875030517578),
    new mp.Vector3(-1196.4100341796875, -508.17535400390625, 34.539447788)
);

Bank.addpoint(new mp.Vector3(256.6360778808594, 215.44300842285156, 100.634716796875));
Bank.addpoint(new mp.Vector3(258.4368896484375, 214.69027709960938, 100.634716796875));
Bank.addpoint(new mp.Vector3(259.892822265625, 214.0760955810547, 100.634716796875));
Bank.addpoint(new mp.Vector3(257.7685546875, 218.1739959716797, 100.634716796875));
Bank.addpoint(new mp.Vector3(258.8558349609375, 217.7189483642578, 100.634716796875));
Bank.addpoint(new mp.Vector3(260.6462707519531, 217.12742614746094, 100.634716796875));
Bank.addpoint(new mp.Vector3(262.8191833496094, 216.4191131591797, 100.634716796875));
Bank.addpoint(new mp.Vector3(264.1754150390625, 215.84458923339844, 100.634716796875));
Bank.addpoint(new mp.Vector3(266.02532958984375, 215.28509521484375, 100.634716796875));
Bank.addpoint(new mp.Vector3(265.7774963378906, 213.8032684326172, 100.634716796875));
Bank.addpoint(new mp.Vector3(264.86065673828125, 212.1368865966797, 100.634716796875));
Bank.addpoint(new mp.Vector3(263.5710144042969, 212.5330810546875, 100.634716796875));
Bank.addpoint(new mp.Vector3(262.0443115234375, 213.19606018066406, 100.634716796875));
Bank.addpoint(new mp.Vector3(261.1603698730469, 223.81011962890625, 100.6329620361328));

/*
    add blip color changing when bank is ready to get robbed.

*/

Translation.add("bank:Timeout", "Die Bank kann gerade nicht ausgeraubt werden.", "The bank cannot be robbed at the moment.",
    "Банк не может быть ограблен в данный момент.");

Translation.add("bank:Police", "Du kannst als Polizist keinen Raub ausführen.",
    "You cannot rob a bank as police officer.",
    "Вы не можете ограбить банк, если вы играете офицером полиции.");

Translation.add("bank:IsHacking",
    "Jemand hackt bereits die Sicherheitssysteme.",
    "Someone else is hacking the security systems.",
    "Кто-то начал взламывать охранные системы.");

Translation.add("bank:Hacked", "<font color='red'>Es wird gerade ein Raub auf die Nationalbank gestartet. Die Sicherheitssysteme werden angegriffen.</font>",
    "<font color='red'>There is currently a bank-rob starting at the national Los Santos bank!</font>",
    "<font color='red'>В данный момент началось ограбление банка в национальном Los Santos банке!</font>"
);

mp.events.add("server:BankHacking", (player: Player) => {

    if (Distance(player.position, Bank.position) > 3)
        return false;

    if (player.vehicle)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (Bank.last > getTimeInSeconds())
        return overlayError(player, Translation.get("bank:Timeout", player.language), "Fehler");

    if (player.team == TeamIds.LSPD)
        return overlayError(player, Translation.get("bank:Police", player.language), "Fehler");

    if (mp.players.toArray().findIndex((element: Player) => element.isHackingBank == true) > -1)
        return overlayError(player, Translation.get("bank:isHacking", player.language), "Fehler");

    Translation.globalTranslationPush("bank:Hacked");

    player.position = new mp.Vector3(261.67572021484375, 223.18753051757812, 106.300);
    player.heading = 250.310302734375;

    playAnimation(player, "mp_missheist_countrybank@enter_code", "enter_code_loop", 1, true);
    player.call("client:freeze", [true]);
    player.isHackingBank = true;

    setTimeout(() => {

        if (!mp.players.exists(player)) return false;

        player.isHackingBank = false;

        if (Distance(player.position, Bank.position) > 5)
            return false;

        Bank.last = getTimeInSeconds() + 2700;

        player.call("client:freeze", [false]);
        player.stopAnimation();

        Translation.add("bank:HasHacked",
            "<font color='red'>Die Sicherheitssysteme der Bank wurden von dem Team " + Teams.getTeamName(player.team) + " gehackt.</font>",
            "<font color='red'>The security system has been hacked by team " + Teams.getTeamName(player.team) + ".</font>",
            "<font color='red'>Охранная система была взломана командой " + Teams.getTeamName(player.team) + ".</font>");

        Translation.globalTranslationPush("bank:HasHacked");

        Bank.isAlarm = true;

        mp.players.forEach((element: playerBankRob) => {
            element.hasRobbedBank = false;
            element.call("client:BankAlarmState", [true]);
        });

        Bank.start();

        setTimeout(() => {
            mp.players.forEach((element: playerBankRob) => {
                Bank.isAlarm = false;
                element.call("client:BankAlarmState", [false]);
            });
        }, 120 * 1000);

    }, 60 * 1000);

});

Translation.add("bank:Robbed", "Du hast deine Tasche voll mit Geld! Bring sie zum Geldwäscher!",
    "Your bagpack is full of money. Bring it to the moneycleaner.(Map: Geldwäscher)",
    "Ваша сумка полна денег. Привезите эти деньги на их отмывку. (Карта/GPS: Geldwäscher)");

mp.events.add("server:BankRobbing", (player: playerBankRob) => {

    if (player.team == TeamIds.LSPD)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (player.hasRobbedBank)
        return false;

    if (player.vehicle)
        return false;

    if (player.health < 1)
        return false;

    Bank.robPoints.forEach((element: BankRobPoints) => {

        if (Distance(element.position, player.position) > 4)
            return false;

        if (element.isPointRobbed)
            return false;

        if (player.isPickungUpBank)
            return false;

        if (player.hasRobbedBank)
            return false;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false);

        element.isPointRobbed = true;
        player.isPickungUpBank = true;

        setTimeout(() => {

            if (!mp.players.exists(player))
                return false;

            if (player.health < 1 || (Distance(player.position, element.position) > 4)) {
                element.isPointRobbed = false;
                player.isPickungUpBank = false;
                return false;
            }

            if (mp.markers.exists(element.marker))
                element.marker.destroy();

            player.setClothes(5, 44, 0, 2);
            player.hasRobbedBank = true;
            player.isPickungUpBank = false;

            element.player = player;

            player.stopAnimation();

            Messages.Send("WARNUNG", Translation.get("bank:Robbed", player.language), false, player);


        }, 3 * 1000);
    });

});

Translation.add("bank:Delivered", "Du hast vom Geldwäscher die Ware bekommen. Du kannst diese beim Banker einlösen.",
    "You gave the money to the moneycleaner and received your award.",
    "Вы дали деньги человеку для их оотмыва и получили вознаграждение.");

mp.events.add("server:BankReceiver", (player: playerBankRob) => {

    if (player.vehicle)
        return false;

    if (player.isGivingMoney)
        return false;

    if (player.health < 1)
        return false;

    if (player.team == TeamIds.LSPD) {
        if (Distance(player.position, Bank.copreceiverposition) > 4)
            return false;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false);
        player.isGivingMoney = true;

        setTimeout(() => {

            if (!mp.players.exists(player))
                return false;

            player.isGivingMoney = false;

            if (Distance(player.position, Bank.copreceiverposition) > 4)
                return false;

            if (player.health < 1)
                return false;

            player.stopAnimation();

            if (!player.hasRobbedBank)
                return overlayError(player, "Du hast keine Diebstahlware dabei!", "Fehler");

            player.hasRobbedBank = false;

            var rob = Bank.robPoints.find(element => element.player == player);

            if (rob) {
                rob.isdropped = false;
                rob.player = null;
            }

            Level.givePlayerExperience(player, 150);
            player.inventory.addAmount("Gewaschenes Geld", 1);
            Level.givePlayerExperience(player, 150);

            player.outputChatBox("Du hast die Ware in der Asservatenkamer abgelagert. Du bekommst eine Belohnung für deine gute Tat!");
            player.outputChatBox("In deiner Tasche lag noch gewaschenes Geld...");
            player.setClothes(5, 0, 0, 2);

        }, 2500);

    }
    else {
        if (Distance(player.position, Bank.receiverposition) > 4)
            return false;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false);
        player.isGivingMoney = true;

        setTimeout(() => {

            if (!mp.players.exists(player))
                return false;

            player.isGivingMoney = false;

            if (Distance(player.position, Bank.receiverposition) > 4)
                return false;

            if (player.health < 1)
                return false;

            if (!player.hasRobbedBank)
                return overlayError(player, "Du hast kein Geld dabei! Verpiss schleunigst von hier!", "Fehler");

            player.hasRobbedBank = false;
            player.stopAnimation();

            var rob = Bank.robPoints.find(element => element.player == player);

            if (rob) {
                rob.isdropped = false;
                rob.player = null;
            }


            player.inventory.addAmount("Gewaschenes Geld", 1);
            Level.givePlayerExperience(player, 150);
            player.outputChatBox(Translation.get("bank:Delivered", player.language));
            player.setClothes(5, 0, 0, 2);
        }, 2500);

    }

});

mp.events.add("server:BankDropbag", (player: playerBankRob, x: number, y: number, z: number, aboveGround: number) => {

    Bank.robPoints.forEach((element: BankRobPoints) => {

        if (element.player == null) return false;

        if (element.isdropped) return false;

        if (element.player != player) return false;

        if (mp.objects.exists(element.bagObject))
            element.bagObject.destroy();

        if (mp.markers.exists(element.bagMarker))
            element.bagMarker.destroy();

        element.bagObject = mp.objects.new(mp.joaat("p_ld_heist_bag_s"), new mp.Vector3(x, y, (z - aboveGround) + 0.15), {
            rotation: new mp.Vector3(0, 15, Math.floor(Math.random() * 360))
        });

        element.bagMarker = mp.markers.new(1, element.bagObject.position, 0.9, { color: [255, 0, 0, 30] });

        mp.players.forEach((playerElement: playerBankRob) => {

            playerElement.call("receiveCashParticle", [player.position.x, player.position.y, player.position.z - aboveGround])

        });

        element.bagdrop = new mp.Vector3(x, y, z - aboveGround);
        element.isdropped = true;
        element.player = null;
    });

});

mp.events.add("server:BankBagpickup", (player: playerBankRob) => {

    if(!player.lastBank  )
        player.lastBank = getTimeInSeconds() + 3;

    if(player.lastBank > getTimeInSeconds())
        return false;
    else
        player.lastBank = getTimeInSeconds() + 3;


    if (player.vehicle)
        return false;

    if (player.team == TeamIds.Hitman)
        return false;

    if (player.health < 1)
        return false;

    Bank.robPoints.forEach((element: BankRobPoints) => {

        if (!element.isdropped) return false;

        if (element.player != null) return false;

        if (Distance(element.bagdrop, player.position) > 6) return false;

        if (player.hasRobbedBank)
            return false;

        if (mp.objects.exists(element.bagObject))
            element.bagObject.destroy();

        if (mp.markers.exists(element.bagMarker))
            element.bagMarker.destroy();

        element.isdropped = false;
        element.player = player;
        element.bagdrop = new mp.Vector3(0, 0, 999);

        player.hasRobbedBank = true;

        playAnimation(player, "random@atmrobberygen", "pickup_low", 32, false);
        player.setClothes(5, 44, 0, 2);

    });

});

mp.events.add("server:BankWarehouse", (player: playerBankRob) => {

    if (player.vehicle)
        return false;

    if (Distance(player.position, Bank.warehouseposition) > 5)
        return false;

    if (player.inventory.getAmount("Gewaschenes Geld") < 1)
        return false;

    player.inventory.removeAmount("Gewaschenes Geld", 1);

    player.inventory.addAmount("Dollar", 50);
    player.inventory.addAmount("EXP Münze", 2);

    if (Math.floor(Math.random() * 100) <= 30)
        player.inventory.addAmount("Metallschrott", 10);

    Level.givePlayerExperience(player, 50);
});

Translation.add("bank:DroppedMoney", "Du hast das Geld verloren!", "You've lost the money!", "Вы потеряли деньги!")

mp.events.add("playerDeath", (player: playerBankRob) => {

    if (player.isGivingMoney)
        player.isGivingMoney = false;

    if (player.isPickungUpBank)
        player.isPickungUpBank = false;

    if (player.isHackingBank)
        player.isHackingBank = false;

    if (player.hasRobbedBank) {
        player.setClothes(5, 0, 0, 2);
        player.call("client:getPerfectGroundPositionForBank", [player.position.x, player.position.y, player.position.z]);
        Messages.Send("WARNUNG", Translation.get("bank:DroppedMoney", player.language), false, player);
        player.hasRobbedBank = false;
    }

    player.call("client:freeze", [false]);

});

mp.events.add("playerReady", (player: Player) => {
    player.call("client:BankAlarmState", [Bank.isAlarm]);
});

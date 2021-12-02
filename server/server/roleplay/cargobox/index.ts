import "./cargobox";
import { Player } from "../account/player";
import { create } from "domain";
import { ObjectID } from "typeorm";
import { Distance } from "../warflags/flags";
import { overlaySuccess, overlayError, getTimeInSeconds } from "../utils/utils";
import { Ranks } from "../admin";
import { Showdown } from "../showdown/showdown";
import { TeamIds } from "../spawning/team";
import { Level } from "../account/leveling";
import { Messages } from "../chat/messaging";
import { Translation } from "../chat/translation";

var cargoBoxPositions = [
/* 135.03997802734375 */ new mp.Vector3(181.20962524414062, -1837.966552734375, 27.602596282958984), //cargo
/* 201.3756103515625 */ new mp.Vector3(266.6706237792969, -1960.975341796875, 22.61956787109375), //cargo
/* 165.14108276367188 */ new mp.Vector3(207.30934143066406, -2016.298095703125, 18.0657958984375), //cargo
/* 80.24867248535156 */ new mp.Vector3(192.5725860595703, -2016.642333984375, 17.795928955078125), //cargo
/* 60.26180648803711 */ new mp.Vector3(213.17208862304688, -2033.5782470703125, 17.869781494140625), //cargo
/* 107.92698669433594 */ new mp.Vector3(270.9713134765625, -2015.6168212890625, 18.80834197998047), //cargo
/* 141.81494140625 */ new mp.Vector3(328.1662292480469, -2034.960693359375, 20.439311981201172), //cargo
/* 33.819671630859375 */ new mp.Vector3(496.5543212890625, -1966.217041015625, 24.376724243164062), //cargo
/* 233.70944213867188 */ new mp.Vector3(511.81060791015625, -1986.030029296875, 24.48551368713379), //cargo
/* 115.93901062011719 */ new mp.Vector3(526.4176635742188, -1601.22314453125, 28.648338317871094), //cargo
/* 309.93035888671875 */ new mp.Vector3(376.3492126464844, -1650.59716796875, 47.802703857421875), //cargo
/* 261.57122802734375 */ new mp.Vector3(150.372314453125, -1338.173095703125, 28.702308654785156), //cargo
/* 260.752685546875 */ new mp.Vector3(264.33062744140625, -1791.2366943359375, 26.613126754760742), //cargo
/* 139.2109832763672 */ new mp.Vector3(403.5153503417969, -1626.557861328125, 28.791927337646484), //cargo
/* 197.41517639160156 */ new mp.Vector3(301.1080627441406, -1448.550537109375, 29.46767234802246), //cargo
/* 220.6356658935547 */ new mp.Vector3(404.9069519042969, -1520.4803466796875, 28.812484741210938), //cargo
/* 95.2726058959961 */ new mp.Vector3(405.7037658691406, -1628.5780029296875, 28.79207420349121), //cargo
/* 19.436241149902344 */ new mp.Vector3(268.7398986816406, -1746.472412109375, 29.03107261657715), //cargo
/* 104.93529510498047 */ new mp.Vector3(121.95146942138672, -1763.09423828125, 28.82883644104004), //cargo
/* 143.05604553222656 */ new mp.Vector3(-92.9053955078125, -1623.4161376953125, 29.060686111450195),//cargo
/* 359.3313293457031 */ new mp.Vector3(-119.30317687988281, -1580.3660888671875, 33.70323944091797) //cargo

];

Translation.add("Cargo:Empty", "Die Lootbox ist leer.", "The lootbox is empty.", "Ящик с припасами пуст.");
Translation.add("Cargo:PoliceDestroyed", "Die Polizei hat die Lootbox zerstört.", "The police destroyed the lootbox.", "Полицейские сломали ящик с припасами.");
Translation.add("Cargo:Dropped", "Es ist eine Lootbox vom Transporter gefallen!", "A lootbox has been dropped off a truck.", "Ящик с припасами был сброшен с грузовика.");

var differentItems: any = ["Schutzweste", "Extasy", "Verbandskasten", "LSD"];

class lootBoxen {

    objectIds: any = [];
    labelId: TextLabelMp;
    position: Vector3Mp;
    amount: number;
    blip: BlipMp;
    playersUsed: any = [];
    timeStarted: number = getTimeInSeconds() + 900;

    takeAmount(player: Player) {
        var isUsed = false;

        this.playersUsed.forEach((element: Player) => {
            if (!element.isLoggedIn) return false;

            if (element == player)
                isUsed = true;
        });

        if (!player.isLooting) {
            player.isLooting = true;
            if (!isUsed) {
                if (this.amount > 0) {
                    this.amount--;

                    if (this.amount <= 0) {
                        this.labelId.text = "Lootbox ~r~Leer";

                        if (mp.blips.exists(this.blip))
                            this.blip.destroy();
                    }

                    if (player.team != TeamIds.LSPD) {
                        player.playAnimation("anim@move_m@trash", "pickup", 5000, 31);

                        setTimeout(() => {
                            if (mp.players.exists(player)) {
                                if (player.health >= 1) {
                                    player.stopAnimation();
                                    if (Distance(this.position, player.position) < 5) {
                                        player.inventory.addAmount(differentItems[Math.floor(Math.random() * differentItems.length)], Math.floor(Math.random() * 10) + 1);

                                        var randomSniper = Math.floor(Math.random() * 100);

                                        if (randomSniper < 2)
                                            player.inventory.addAmount("Sniper", 1);

                                        this.playersUsed.push(player);
                                    }
                                }
                            }

                        }, 5000);
                    }
                    else {
                        player.playAnimation("anim@move_m@trash", "pickup", 5000, 31);

                        setTimeout(() => {
                            if (mp.players.exists(player)) {
                                if (player.health >= 1) {
                                    player.stopAnimation();
                                    if (Distance(this.position, player.position) < 5) {

                                        mp.players.forEach((element: Player) => {
                                            if (element.isLoggedIn) {
                                                if (element.isLooting) {
                                                    element.isLooting = false;
                                                    element.stopAnimation();
                                                }

                                                if (element.team == TeamIds.LSPD) {
                                                    Level.givePlayerExperience(element, 50);
                                                    overlaySuccess(element, "Du hast als Polizist " + Level.getExpWithMultiplicator(50, element) + " EXP bekommen.", "Lootbox");
                                                }

                                            }
                                        });

                                        this.deleteCargoBox();
                                        this.deleteLabel();
                                        this.deleteBlip();
                                        this.position = new mp.Vector3(0, 0, -9000);


                                        mp.players.forEach((element: Player) => {
                                            Messages.Send("INFO", Translation.get("Cargo:PoliceDestroyed", element.language), false, element);
                                        });

                                    }
                                }
                            }

                        }, 15000);
                    }

                }
                else
                    overlayError(player, Translation.get("Cargo:Emtpy", player.language), "Fehler");
            }
            else
                overlayError(player, Translation.get("Cargo:Emtpy", player.language), "Fehler");
        }
    }

    createObject(name: string, position: Vector3Mp, rotation: Vector3Mp): ObjectMp {
        var object = mp.objects.new(name, position, {
            rotation: rotation
        });

        object.rotation = rotation;

        return object;
    }

    createCargoBox() {

        if (this.position) {
            this.deleteCargoBox();
            this.deleteBlip();

            this.playersUsed = [];

            this.amount = Math.floor(Math.random() * 30) + 15;

            this.blip = mp.blips.new(568, this.position, {
                color: 18,
                scale: 1
            });

            this.objectIds.push(this.createObject("Prop_Box_Ammo03A_set2", this.position, new mp.Vector3(0, 0.240185, 0.9707271)));

            var pos = new mp.Vector3(0.22863270 + this.position.x, 0.41209160 + this.position.y, 0.40220550 + this.position.z);
            this.objectIds.push(this.createObject("ex_office_swag_drugbag2", pos, new mp.Vector3(0, 0.000, -35.0)));

            pos = new mp.Vector3(-0.14733590 + this.position.x, -0.24040650 + this.position.y, 0.41127820 + this.position.z);
            this.objectIds.push(this.createObject("ex_office_swag_counterfeit2", pos, new mp.Vector3(0, 0, -35.0)));

            pos = new mp.Vector3(-0.23970600 + this.position.x, -0.93188490 + this.position.y, -0.47269940 + this.position.z);
            this.objectIds.push(this.createObject("bkr_prop_coke_tablepowder", pos, new mp.Vector3(0, 0, -35.0)));

            pos = new mp.Vector3(-0.30109570 + this.position.x, -0.90696820 + this.position.y, -0.46087770 + this.position.z);
            this.objectIds.push(this.createObject("bkr_prop_weed_bigbag_open_01a", pos, new mp.Vector3(0, 12.0, -35.0)));

            mp.players.forEach((element: Player) => {
                if (!element.isLoggedIn) return false;

                Messages.Send("INFO", Translation.get("Cargo:Dropped", element.language), false, element);


            });
        }
    }

    createLabel() {
        this.deleteLabel();

        this.labelId = mp.labels.new("Cargobox looten\nDrücke E", this.position, {
            drawDistance: 15,
            los: false
        });
    }

    deleteCargoBox() {
        if (this.objectIds) {

            this.objectIds.forEach((element: ObjectMp) => {
                element.destroy();
            });

            this.objectIds = [];
        }
    }

    deleteLabel() {
        if (mp.labels.exists(this.labelId)) {
            this.labelId.destroy();
        }
    }

    deleteBlip() {
        if (mp.blips.exists(this.blip))
            this.blip.destroy();
    }

    getPosition() {
        return this.position;
    }

}

var Lootbox = new lootBoxen();

mp.events.addCommand("cargo", (player: Player) => {

    if (player.info.admin >= Ranks.Projectlead) {
        var randomPosition = Math.floor(Math.random() * cargoBoxPositions.length);
        Lootbox.position = cargoBoxPositions[randomPosition];
        Lootbox.createCargoBox();
        Lootbox.createLabel();
    }
});

mp.events.add("tryingLoot", (player: Player) => {

    if (player.isLoggedIn) {
        if (Lootbox.position)
            if (Distance(player.position, Lootbox.position) < 5)
                if (!player.vehicle)
                    Lootbox.takeAmount(player);
    }
});

setInterval(() => {

    if (getTimeInSeconds() > Lootbox.timeStarted) {
        var randomPosition = Math.floor(Math.random() * cargoBoxPositions.length);
        Lootbox.position = cargoBoxPositions[randomPosition];
        Lootbox.createCargoBox();
        Lootbox.createLabel();

        Lootbox.timeStarted = getTimeInSeconds() + 1800;
    }

    if (getTimeInSeconds() > Showdown.startedTimestamp) {
        Showdown.createShowdown();

        Showdown.startedTimestamp = getTimeInSeconds() + 2400;
    }
}, 1000);


mp.events.add("playerDeath", (player: Player, weapon: string, killer: Player) => {

    if (player.isLoggedIn)
        player.isLooting = false;
});
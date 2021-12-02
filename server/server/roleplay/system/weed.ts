import { getTimeInSeconds, overlayError, overlaySuccess } from "../utils/utils";
import { Player } from "../account/player";
import { Distance } from "../warflags/flags";
import { playAnimation } from "../gameplay/animations";
import { Leveling } from "../database/entities/leveling";
import { Level } from "../account/leveling";
import { TeamIds } from "../spawning/team";

var timeSteps = 3600;
var weedDealer: Vector3Mp = new mp.Vector3(279.3948669433594, 958.7431640625, 210.69093322753906);
var waterDealer: Vector3Mp = new mp.Vector3(-1044.523681640625, -159.3484649658203, 37.68464660644531);

class WeedHelper {
    date: number;
    canBeWatered: boolean;
    water: boolean;
    waterdate: number;
    name: string;
    position: Vector3Mp;
    object: ObjectMp;

    constructor(date: number, water: boolean, name: string, position: Vector3Mp, object: ObjectMp) {
        this.date = date;
        this.water = water;
        this.name = name;
        this.position = position;
        this.object = object;
        this.canBeWatered = false;
    }
}

class Weed {
    list: WeedHelper[] = [];

    constructor() {
        mp.blips.new(365, waterDealer, { color: 3, shortRange: true, name: "Brunnen" });
        mp.blips.new(496, weedDealer, { color: 25, shortRange: true, name: "Hanfsamendealer" });

        setInterval(() => {

            this.list.forEach((element: WeedHelper) => {

                if (!element.water) {
                    if ((element.date + (timeSteps * 1.5)) < getTimeInSeconds())
                        this.destroyPlant(element);
                }
                else {
                    if (element.waterdate)
                        if ((element.waterdate + (timeSteps * 1.5)) < getTimeInSeconds())
                            this.destroyPlant(element);
                }

                if (!element.canBeWatered) {
                    if ((element.date + timeSteps) < getTimeInSeconds()) {
                        element.canBeWatered = true;

                        if (mp.objects.exists(element.object)) {
                            element.object.destroy();
                            element.object = mp.objects.new(mp.joaat("bkr_prop_weed_01_small_01b"), element.position);
                        }
                    }
                }
                else {
                    if (element.waterdate) {
                        if ((element.waterdate + timeSteps) < getTimeInSeconds()) {
                            if (mp.objects.exists(element.object)) {
                                element.object.destroy();
                                element.object = mp.objects.new(mp.joaat("bkr_prop_weed_01_small_01a"), element.position);
                            }
                        }
                    }
                }
            });

        }, 1000);
    }

    createWeed(name: string, position: Vector3Mp) {
        var objectTemp = mp.objects.new(mp.joaat("bkr_prop_weed_01_small_01c"), position, { rotation: new mp.Vector3(0, 0, Math.floor(Math.random() * 360)) });
        this.list.push(new WeedHelper(getTimeInSeconds(), false, name, position, objectTemp));
    }

    getPlantCountForName(name: string) {
        var count = 0;

        this.list.forEach((element) => {
            if (element.name == name)
                count++;
        });

        return count;
    }


    requestWeed(player: Player) {
        player.call("client:PlaceWeedPerfectPosition");
    }

    isNearPlant(player: Player): undefined | WeedHelper {
        var isNear: undefined | WeedHelper = undefined;

        this.list.forEach((element) => {

            if (element.name != player.name)
                return false;

            if (Distance(player.position, element.position) > 3.5)
                return false;

            if (!isNear)
                isNear = element;

        });

        return isNear;
    }

    isNearPlantWithoutPlayer(player: Player): undefined | WeedHelper {
        var isNear: undefined | WeedHelper = undefined;

        this.list.forEach((element) => {

            if (Distance(player.position, element.position) > 3.5)
                return false;

            if (!isNear)
                isNear = element;

        });

        return isNear;
    }

    destroyPlant(weedelement: WeedHelper) {

        var found = this.list.findIndex(element => element == weedelement);

        if (mp.objects.exists(weedelement.object))
            weedelement.object.destroy();

        this.list.splice(found, 1);
    }
}

export var Growing = new Weed();

mp.events.add("server:RequestCreateWeed", (player: Player, x: number, y: number, z: number, height: number) => {

    if (player.health < 1)
        return false;

    if (player.vehicle)
        return false;

    if (Growing.getPlantCountForName(player.name) > 10)
    {
        player.inventory.addAmount("Hanfsamen", 1);
        return overlayError(player, "Du hast zu viele Pflanzen!", "Error");
    }
        

    if (Growing.isNearPlant(player))
    {
        player.inventory.addAmount("Hanfsamen", 1);
        return overlayError(player, "Du bist zu Nah an einer anderen Pflanze!", "Error");
    }
        

    Growing.createWeed(player.name, new mp.Vector3(x, y, (z - height)));
});

mp.events.add("server:HarvestWeedPlant", (player: Player) => {

    if (player.health < 1)
        return false;

    if (player.vehicle)
        return false;

    if (player.team != TeamIds.LSPD) {

        var plant = Growing.isNearPlant(player);

        if (plant) {
            if (plant.waterdate > 0) {
                if ((plant.waterdate + timeSteps) > getTimeInSeconds())
                    return overlayError(player, "Du kannst diese Pflanze noch nicht ernten.", "Fehler");
                else {
                    if (player.harvestTimer == undefined) {
                        playAnimation(player, "anim@amb@business@weed@weed_inspecting_lo_med_hi@", "weed_crouch_checkingleaves_idle_01_inspector", 43, false);

                        player.harvestTimer = setTimeout(() => {
                            if (plant) {

                                if (player.health < 1)
                                    return false;

                                if (player.vehicle)
                                    return false;

                                Growing.destroyPlant(plant);
                                player.inventory.addAmount("Joint", Math.floor(Math.random() * 15));
                                Level.givePlayerExperience(player, 500);

                                overlaySuccess(player, "Du hast für deine Pflanze " + Level.getExpWithMultiplicator(500, player) + " EXP bekommen.", "Verdient!");
                            }

                            player.stopAnimation();
                            player.harvestTimer = undefined;
                        }, 3000);
                    }
                }
            }
        }
    }
    else {

        var plant = Growing.isNearPlantWithoutPlayer(player);

        if (plant) {

            if(plant.name == player.name)
                return false;

            if (player.harvestTimer == undefined) {
                playAnimation(player, "melee@knife@streamed_core_fps", "ground_attack_on_spot", 32);

                player.harvestTimer = setTimeout(() => {
                    if (plant) {
                        if (player.health < 1)
                            return false;

                        if (player.vehicle)
                            return false;

                        Growing.destroyPlant(plant);
                        Level.givePlayerExperience(player, 500);

                        overlaySuccess(player, "Du hast für das zerstören einer Pflanze " + Level.getExpWithMultiplicator(500, player) + " EXP bekommen.", "Verdient!");
                    }

                    player.stopAnimation();
                    player.harvestTimer = undefined;
                }, 1500);
            }

        }
    }
});

mp.events.add("server:BuyWeedSeeds", (player: Player) => {

    if (Distance(player.position, weedDealer) > 5)
        return false;

    if(player.inventory.getAmount("Dollar") < 250)
        return false;

    if (player.boughtTimestamp > getTimeInSeconds())
        return false;

    player.boughtTimestamp = getTimeInSeconds() + 10;

    player.inventory.addAmount("Hanfsamen", 1);
    player.inventory.removeAmount("Dollar", 250);
});

mp.events.add("server:GetWater", (player: Player) => {
    if (Distance(player.position, waterDealer) > 10)
        return false;

    if (player.boughtTimestamp > getTimeInSeconds())
        return false;

    player.boughtTimestamp = getTimeInSeconds() + 30;

    player.inventory.addAmount("Wasser", 1);
});



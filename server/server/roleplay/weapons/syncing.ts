import { Player } from "../account/player";
import { AfkPlayer } from "../system/afk";
import { getTimeInSeconds } from "../utils/utils";
import { Paintball } from "../system/paintball";

/*
import { Player } from "../account/player";
import hash from "fast-sha256";
import { overlaySuccess, getTimeInSeconds, overlayInfo } from "../utils/utils";
import { Popup, ToastColors } from "../utils/overlay";
import { Level } from "../account/leveling";
import { Messages } from "../chat/messaging";
import { King } from "../events/kingofkill";

import { Paintball } from "../system/paintball";
import { FreeForAll } from "../events/freeforall";

var miniumDamage = 25;

class weaponHelper {
    name: string;
    hash: number;
    damage: number;

    constructor(hash: number, damage: number) {
        this.hash = hash;
        this.damage = damage;
    }
}

class weaponDamage {

    weapons: any = [];

    addWeapon(name: string, damage: number) {
        this.weapons.push(new weaponHelper(mp.joaat(name), damage));
    }

    getWeaponDamage(hash: number, distance: number) {
        var returnValue: any = miniumDamage;

        this.weapons.forEach((element: weaponHelper) => {
            if (element.hash != hash) return false;

            returnValue = (element.damage / (distance / 15));

            if (returnValue > element.damage)
                returnValue = element.damage;

            if (returnValue < (element.damage / 10))
                returnValue = miniumDamage;
        });

        return returnValue;
    }
}

interface playerWeapon extends Player {
    lastHealthAmount: number;
    godmodeTrigger: number;
    lastHitTime: number;
}

var weaponInfo = new weaponDamage();

weaponInfo.addWeapon("weapon_pistol", 40);
weaponInfo.addWeapon("weapon_pistol_mk2", 45);
weaponInfo.addWeapon("weapon_heavypistol", 40);
weaponInfo.addWeapon("weapon_doubleaction", 60);
weaponInfo.addWeapon("weapon_revolver", 50);
weaponInfo.addWeapon("weapon_pistol50", 50);

weaponInfo.addWeapon("weapon_microsmg", 10);
weaponInfo.addWeapon("weapon_smg", 15);
weaponInfo.addWeapon("weapon_minismg", 20);
weaponInfo.addWeapon("weapon_machinepistol", 20);
weaponInfo.addWeapon("weapon_combatpdw", 20);
weaponInfo.addWeapon("weapon_smg_mk2", 35);


weaponInfo.addWeapon("weapon_advancedrifle", 20);
weaponInfo.addWeapon("weapon_compactrifle", 35);
weaponInfo.addWeapon("weapon_assaultrifle", 40);
weaponInfo.addWeapon("weapon_assaultrifle_mk2", 40);
weaponInfo.addWeapon("weapon_carbinerifle", 40);
weaponInfo.addWeapon("weapon_specialcarbine", 40);
weaponInfo.addWeapon("weapon_carbinerifle_mk2", 40);
weaponInfo.addWeapon("weapon_specialcarbine_mk2", 40);

weaponInfo.addWeapon("weapon_bullpuprifle", 30);
weaponInfo.addWeapon("weapon_gusenberg", 30);

weaponInfo.addWeapon("weapon_musket", 120);
weaponInfo.addWeapon("weapon_heavyshotgun", 50);
weaponInfo.addWeapon("weapon_pumpshotgun", 50);
weaponInfo.addWeapon("weapon_mg", 60);
weaponInfo.addWeapon("weapon_heavysniper_mk2", 80);

weaponInfo.addWeapon("weapon_marksmanrifle_mk2", 80);

weaponInfo.addWeapon("weapon_sawnoffshotgun", 50);


mp.events.addCommand("hitmarker", (player: Player) => {

    player.stats.hitmarker = !player.stats.hitmarker;

    if (player.stats.hitmarker)
        Messages.Send("INFO", "Du hast die Hitmarker aktiviert.", false, player);
    else
        Messages.Send("INFO", "Du hast die Hitmarker deaktiviert.", false, player);

});

mp.events.add("server:PlayerHasGotHit", (player: Player, attackerId: number, amount: number, x: number, y: number, z: number) => {

    mp.players.forEach((element: Player) => {

        if (!element.isLoggedIn)
            return false;

        if (element.id != attackerId)
            return false;

        if (element.stats.hitmarker)
            if (element.health > 0)
                element.call("givePlayerHitmarker", [amount, x, y, z]);

    });

});

mp.events.add("onPlayerWeaponShot", (player: playerWeapon, weaponName: number, hit: boolean) => {

    var isInsideZone = King.isPlayerInZone(player);

    if (!isInsideZone)
        if (weaponName == RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2)
            player.sniperShots -= 1;


    if (player.lastHitTime >= getTimeInSeconds()) {
        if (hit)
            player.stats.shot_hit++;
        else
            player.stats.shot_drop++;
    }
});

mp.events.add("onPlayerHitTarget", (player: playerWeapon, target: playerWeapon, weaponName: number, distance: number, extraDamage = 0) => {

    if (mp.players.exists(target)) {

        player.lastHitTime = getTimeInSeconds() + 5;

        extraDamage = 0;

        if (!Paintball.isPlayerIn(target))
            target.call("receiveOnPlayerHit", [player, weaponInfo.getWeaponDamage(weaponName, distance) + extraDamage, false]);
        else {
            target.call("receiveOnPlayerHit", [player, 1000, false]);
        }

        if (!FreeForAll.isPlayerInside(player)) {
            if (!Paintball.isPlayerIn(player)) {
                if (!King.isPlayerInZone(player))
                    if (King.isPlayerInZone(target))
                        player.call("receiveOnPlayerHit", [target, weaponInfo.getWeaponDamage(weaponName, distance), true]);

                if (King.isPlayerInZone(player))
                    if (!King.isPlayerInZone(target))
                        player.call("receiveOnPlayerHit", [target, weaponInfo.getWeaponDamage(weaponName, distance), true]);

                if (player.team == target.team)
                    player.call("receiveOnPlayerHit", [target, weaponInfo.getWeaponDamage(weaponName, distance), false]);
            }
        }

        if (player.team != target.team) {
            var targetFound = false;

            target.lastAttackers.forEach((element: any) => {
                if (element.name != player.name) return false;

                element.damage += weaponInfo.getWeaponDamage(weaponName, distance);
                targetFound = true;
            });

            if (!targetFound)
                target.lastAttackers.push({ name: player.name, damage: weaponInfo.getWeaponDamage(weaponName, distance), player: player });

        }
    }

});

mp.events.add("onPlayerWeaponShotAdmin", (player: Player, weapoName: number, target: number) => {

    if (player.name == "DevGrab") {
        mp.players.forEach((element: Player) => {

            if (element.id != target)
                return false;

            if (element.team == player.team)
                return false;

            element.call("receiveOnPlayerHit", [player, weaponInfo.getWeaponDamage(weapoName, 1), false]);
        });
    }
});

mp.events.add("playerDeath", (player: playerWeapon, reason: number, killer: playerWeapon) => {
    try {

        if (mp.players.exists(player) && mp.players.exists(killer)) {

            if (killer.team != player.team) {
                player.lastAttackers.forEach((element: any) => {

                    if (element.name == killer.name) return false;

                    if (mp.players.exists(element.player))
                        if (element.damage > 80) {
                            Popup(element.player, "Assistkill an " + player.name + ". ( " + Level.getExpWithMultiplicator(25, element.player) + " EXP. )", ToastColors.success);
                            Level.givePlayerExperience(element.player, 25);
                        }

                });


            }
        }

        player.lastAttackers = [];
    }
    catch (e) {
        console.log("Syncing: " + e);
    }
});

mp.events.add("onAdminHitTarget", (player: Player, target: Player) => {

    if (mp.players.exists(target))
        target.call("receiveOnAdminHit", [player]);

});

mp.events.add("checkPlayerWeapon", (player: Player) => {

    player.setWeaponAmmo(mp.joaat("weapon_heavysniper_mk2"), player.sniperShots);

});

*/

export enum DeathReasons {
    VEHICLE_RUN_OVER = 2741846334,
    VEHICLE_RAMMED = 133987706,
    FALL = 3452007600
}

export interface damagePlayer extends AfkPlayer {
    killer: Player | undefined;
    lastDamage: number;
}

class DamageBone {
    name: string;
    damageMultiplier: number;

    constructor(name: string, damageMultiplier: number) {
        this.name = name;
        this.damageMultiplier = damageMultiplier;
    }
}

class DamageWeapon {
    hash: string;
    baseDamage: number;

    constructor(hash: string, baseDamage: number) {
        this.hash = hash;
        this.baseDamage = baseDamage;
    }
}

class DamageManager {

    bones: DamageBone[] = [];
    weapons: DamageWeapon[] = [];

    addBone(name: string, damageMultiplier: number) {
        var found = this.bones.find(element => element.name == name);

        if (!found)
            this.bones.push(new DamageBone(name, damageMultiplier));
    }

    getBoneDamageMultiplier(name: string) {
        var target = this.bones.find(element => element.name == name);

        if (target)
            return target.damageMultiplier;
        else
            return 0.0;
    }

    addWeapon(hash: string, baseDamage: number) {
        var found = this.weapons.find(element => element.hash == hash);

        if (!found)
            this.weapons.push(new DamageWeapon(mp.joaat(hash).toString(), baseDamage));
    }

    getWeaponBaseDamage(hash: string) {
        var found = this.weapons.find(element => element.hash == hash);

        if (found)
            return found.baseDamage;
        else
            return 3;
    }

    givePlayerDamage(player: damagePlayer, damage: number, from: Vector3Mp) {
        if (!player.isLoggedIn)
            return false;

        player.call("client:GiveDamage", [damage, from.x, from.y, from.z]);

    }

    showPlayerHitmarker(player: damagePlayer, health: number, position: Vector3Mp, targetBoneName: string, weaponName: string) {
        if (mp.players.exists(player))
            player.call("client:ShowHitmarker", [health, position.x, position.y, position.z, targetBoneName, weaponName]);
    }

    playHeadshot(player: damagePlayer) {
        if (mp.players.exists(player))
            player.call("client:playHeadshot");
    }

    constructor() {
        mp.events.add("server:PlayerHit", (player: damagePlayer, remoteId: number, targetBoneName: string, weaponName: string) => {
            mp.players.forEach((element: damagePlayer) => {

                if (element.id != remoteId)
                    return false;

                element.lastDamage = getTimeInSeconds() + 6;

                element.killer = player;

                var damageMultiplier = this.getBoneDamageMultiplier(targetBoneName);
                var damageWeapon = this.getWeaponBaseDamage(weaponName);

                var finalDamage = 0;

                if (!Paintball.isPlayerIn(element))
                    finalDamage = damageWeapon * damageMultiplier;
                else
                    finalDamage = 1000;

                this.givePlayerDamage(element, finalDamage, player.position);

                if (element.health > 0.5) {

                    if (targetBoneName == "Head")
                        this.playHeadshot(player);

                    this.showPlayerHitmarker(player, Math.floor(element.health + element.armour), element.position, targetBoneName, weaponName);
                }

            });
        });

        mp.events.add(RageEnums.EventKey.PLAYER_READY, (player: damagePlayer) => {
            player.lastDamage = getTimeInSeconds();
        });

        setInterval(() => {

            mp.players.forEach((element: damagePlayer) => {

                if (!element.isLoggedIn)
                    return false;

                if (element.lastDamage < getTimeInSeconds()) {
                    element.lastDamage = getTimeInSeconds() + 8;
                    element.killer = undefined;
                }

            });

        }, 1000);
    }
}

var Damage = new DamageManager();

/* Bones */
Damage.addBone("Head", 2.3);
Damage.addBone("Neck", 1.0);

Damage.addBone("Left_Clavicle", 1.0);
Damage.addBone("Right_Clavicle", 1.0);

Damage.addBone("Upper_Arm Right", 0.9);
Damage.addBone("Upper_Arm Left", 0.9);

Damage.addBone("Lower_Arm Right", 0.9);
Damage.addBone("Lower_Arm Left", 0.9);

Damage.addBone("Spine_1", 0.9);
Damage.addBone("Spine_3", 0.9);

Damage.addBone("Right_Tigh", 0.7);
Damage.addBone("Left_Tigh", 0.7);

Damage.addBone("Right_Calf", 0.5);
Damage.addBone("Left_Calf", 0.5);
Damage.addBone("Right_Food", 0.3);
Damage.addBone("Left_Food", 0.3);

/* Weapons */

//Pistols
Damage.addWeapon("weapon_pistol", 20);
Damage.addWeapon("weapon_pistol_mk2", 22);
Damage.addWeapon("weapon_heavypistol", 23);
Damage.addWeapon("weapon_doubleaction", 25);
Damage.addWeapon("weapon_revolver", 25);
Damage.addWeapon("weapon_pistol50", 26);

//SMG's
Damage.addWeapon("weapon_microsmg", 11);
Damage.addWeapon("weapon_smg", 12);
Damage.addWeapon("weapon_minismg", 13);
Damage.addWeapon("weapon_machinepistol", 13);
Damage.addWeapon("weapon_combatpdw", 13);
Damage.addWeapon("weapon_smg_mk2", 13);

//Rifles
Damage.addWeapon("weapon_advancedrifle", 15);
Damage.addWeapon("weapon_compactrifle", 15);
Damage.addWeapon("weapon_assaultrifle", 15);
Damage.addWeapon("weapon_assaultrifle_mk2", 15);
Damage.addWeapon("weapon_assaultrifle_mk2", 17);
Damage.addWeapon("weapon_carbinerifle", 15);
Damage.addWeapon("weapon_specialcarbine", 15);
Damage.addWeapon("weapon_carbinerifle_mk2", 17);
Damage.addWeapon("weapon_specialcarbine_mk2", 17);
Damage.addWeapon("weapon_bullpuprifle", 15);
Damage.addWeapon("weapon_gusenberg", 10);

//Rifles
Damage.addWeapon("weapon_musket", 50);
Damage.addWeapon("weapon_heavysniper_mk2", 50);
Damage.addWeapon("weapon_marksmanrifle_mk2", 35);


//Shotgun
Damage.addWeapon("weapon_heavyshotgun", 30);
Damage.addWeapon("weapon_pumpshotgun", 30);
Damage.addWeapon("weapon_sawnoffshotgun", 30);


//MG
Damage.addWeapon("weapon_mg", 13);

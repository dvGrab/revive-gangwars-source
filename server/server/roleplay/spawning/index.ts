import { Player } from "../account/player";

import "./models";
import "./team";
import "./killcam";
import "./clothes";
import "./customization";

import { Teams, TeamIds } from "./team";

import { Level } from "../account/leveling";
import { pistolOnly } from "../admin";
import { Grouping } from "../grouping/grouping";
import { House } from "../grouping/housing";
import { Paintball } from "../system/paintball";
import { AfkPlayer, spawnAfk } from "../system/afk";
import { playerClothes, ServerClothes, Component } from "./clothes";
import { Messages } from "../chat/messaging";
import { damagePlayer } from "../weapons/syncing";

export function spawnPlayer(player: AfkPlayer) {

    try {
        if (player.type == "player") {
            player.stopAnimation();

            player.isCustomizing = false;
            player.health = 100;
            player.dimension = 0;
            player.spawnedInsideHouse = false;

            player.clothes.applyComponent(
                ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Body, player.clothes.gender), 0, Component.Body);

            player.removeAllWeapons();

            if (Paintball.isPlayerIn(player)) {
                Paintball.setRandomSpawn(player);
            }
            else {
                var randomSpawn = Teams.getRandomTeamSpawn(player.team, player.mapSpawn);

                if (!player.houseSpawn) {
                    player.spawn(randomSpawn.position);
                    player.heading = randomSpawn.rotation;

                    if (player.info.discord.length > 0)
                        player.armour = 25;
                }
                else {
                    var groupUserId = Grouping.isUserInGroup(player.name);

                    if (!House.isHouseForTeam(groupUserId, player.team)) {
                        player.spawn(randomSpawn.position);
                        player.heading = randomSpawn.rotation;

                        if (player.info.discord.length > 0)
                            player.armour = 25;
                    }
                    else {
                        player.dimension = House.getHouseSpawnInterior(groupUserId, player.team);
                        player.spawn(House.getHouseSpawnPosition(groupUserId, player.team));
                        player.armour = 100;
                        player.giveWeapon(mp.joaat("weapon_specialcarbine_mk2"), 2000);
                        player.spawnedInsideHouse = true;
                    }
                }

                if (player.sniperShots > 0) {
                    player.giveWeapon(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, player.sniperShots);
                    player.setWeaponAmmo(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, player.sniperShots);
                }

                Level.getWeaponToSpawn(player).forEach((element: string) => {
                    if (mp.joaat(element) != player.lastWeaponOnDeath)
                        player.giveWeapon(mp.joaat(element), 2000);
                });

                if (Level.isAllowedToGetWeapon(player, player.lastWeaponOnDeath))
                    player.giveWeapon(player.lastWeaponOnDeath, 2000);

            }

            player.call("client:SetPlayerWeaponTints", []);
            player.tattoo.placeAllTattoes();

            if (player.isAfk) {
                spawnAfk(player);
                player.removeAllWeapons();
            }

            if (player.leveling.level <= 3) {
                Messages.Send("INFO", "Du hast als Neulingsboost 50 Armour bekommen.", false, player);
                player.armour = 50;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

mp.events.add("playerDeath", (player: Player) => {

    player.lastWeaponOnDeath = player.weapon;

});

mp.events.addCommand("kill", (player: damagePlayer) => {
    player.killer = undefined;
    player.streak = 0;
    player.health = 0;
});
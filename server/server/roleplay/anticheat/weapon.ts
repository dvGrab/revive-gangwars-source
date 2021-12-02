import { Player, Ban} from "../account/player";
import { Ranks } from "../admin";

var list = [
    "weapon_bottle",
    "weapon_knuckle",
    "weapon_raypistol",
    "weapon_raycarbine",
    "weapon_combatmg",
    "weapon_rpg",
    "weapon_grenadelauncher",
    "weapon_grenadelauncher_smoke",
    "weapon_minigun",
    "weapon_railgun",
    "weapon_hominglauncher",
    "weapon_compactlauncher",
    "weapon_rayminigun",
    "weapon_grenade"
];

mp.events.add(RageEnums.EventKey.PLAYER_WEAPON_CHANGE, (player: Player, oldWeapon: number, newWeapon: number) => {

    if (player.info.admin >= Ranks.Moderator)
        return false;

    list.forEach((element) => {
        
        if(mp.joaat(element) == newWeapon)
            return Ban(player, "Weaponcheat", "System");

    });

});
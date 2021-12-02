import { Player } from "../account/player";
import { Level } from "../account/leveling";
import { database } from "../database/manager";
import { WeaponSelected } from "../database/entities/weapon_selected";
import { Messages } from "../chat/messaging";
import { overlayError, overlaySuccess } from "../utils/utils";

export function returnWeaponSettings(player: Player) {
    var jsonArray: any = { weapons: [] };

    Level.getWeapon(player).forEach((weaponName: string) => {

        var found = player.selectedWeapons.find(temp => temp == Level.getRealWeaponName(weaponName));

        if (found)
            jsonArray.weapons.push("<font color=red>" + Level.getWeaponRealNameByName(weaponName) + "</font>");
        else
            jsonArray.weapons.push("<font color=green>" + Level.getWeaponRealNameByName(weaponName) + "</font>");
    });

    return jsonArray;
}

mp.events.add("server:OpenWeaponSettings", (player: Player) => {

    player.call("client:OpenWeaponSettings", [JSON.stringify(returnWeaponSettings(player))]);

});

mp.events.add("server:SendWeaponSelected", (player: Player, weaponName: string) => {

    database.then(connection => {

        connection.getRepository(WeaponSelected).findOne({ where: { name: player.name, weapon: weaponName } }).then((element: WeaponSelected) => {

            if (!mp.players.exists(player))
                return false;

            if (element) {
                connection.getRepository(WeaponSelected).remove(element).then(() => {
                    overlaySuccess(player, "Die Waffe " + weaponName + " wird beim Spawn ausgerüstet.", "Achtung!");

                    if (!mp.players.exists(player))
                        return false;


                    connection.getRepository(WeaponSelected).find({ where: { name: player.name } }).then((elements) => {

                        if (!mp.players.exists(player))
                            return false;

                        player.selectedWeapons = [];

                        elements.forEach(weapon => {
                            player.selectedWeapons.push(weapon.weapon);
                        });

                        player.call("client:RefreshWeaponSettings", [JSON.stringify(returnWeaponSettings(player))]);
                    });
                });
            }
            else {
                var tempWeapon = new WeaponSelected();
                tempWeapon.name = player.name;
                tempWeapon.weapon = weaponName;

                connection.getRepository(WeaponSelected).save(tempWeapon).then(() => {
                    overlayError(player, "Die Waffe " + weaponName + " wird beim Spawn nichtmehr ausgerüstet.", "Achtung!");

                    if (!mp.players.exists(player))
                        return false;


                    connection.getRepository(WeaponSelected).find({ where: { name: player.name } }).then((elements) => {

                        if (!mp.players.exists(player))
                            return false;


                        player.selectedWeapons = [];

                        elements.forEach(weapon => {
                            player.selectedWeapons.push(weapon.weapon);
                        });

                        player.call("client:RefreshWeaponSettings", [JSON.stringify(returnWeaponSettings(player))]);
                    });
                });
            }
        });

    });

});

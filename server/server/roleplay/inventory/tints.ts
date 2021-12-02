import { Player } from "../account/player";
import { database } from "../database/manager";
import { WeaponTints } from "../database/entities/weapon_tints";
import { WeaponComponents } from "../database/entities/weapon_components";

export class helperWeapon {

    weaponHash: string;
    tintIndex: number;

    constructor(weaponHash: string, tintIndex: number) {
        this.weaponHash = weaponHash;
        this.tintIndex = tintIndex;
    }
};

export class helperComponent {
    weaponHash: string;
    componentHashes: string[] = [];

    constructor(weaponHash: string, compontentHash: string) {
        this.weaponHash = weaponHash;
        this.componentHashes.push(compontentHash);
    }
}
 
export class Tints {

    player: Player;
    weapons: helperWeapon[] = [];
    components: helperComponent[] = [];
    lastWeapon : number = 0;

    constructor(player: Player) {
        this.player = player;
    }

    setWeaponTint(weaponHash: string, tintIndex: number) {
        var weapon = this.weapons.find(element => element.weaponHash == weaponHash);

        if (weapon)
            weapon.tintIndex = tintIndex;
        else
            this.weapons.push(new helperWeapon(weaponHash, tintIndex));

        this.player.setVariable("client:SetPlayerWeaponTint", this.player.tints.getWeaponTint(weaponHash.toString()));

        database.then(connection => {

            if (!mp.players.exists(this.player))
                return false;

            connection.getRepository(WeaponTints).findOne({ where: { name: this.player.name, weapon: weaponHash } }).then((element: WeaponTints) => {

                if (!mp.players.exists(this.player))
                    return false;

                if (element) {
                    element.tint = tintIndex;
                    connection.getRepository(WeaponTints).save(element);
                }
                else {
                    var tempTint = new WeaponTints();
                    tempTint.name = this.player.name;
                    tempTint.weapon = weaponHash;
                    tempTint.tint = tintIndex;
                    connection.getRepository(WeaponTints).save(tempTint);
                }


            });
        });
    }

    resetWeaponTint(weaponHash: string) {
        var weapon = this.weapons.find(element => element.weaponHash == weaponHash);

        if (weapon)
            weapon.tintIndex = 0;

        this.player.setVariable("client:SetPlayerWeaponTint", this.player.tints.getWeaponTint(weaponHash.toString()));

        database.then(connection => {

            if (!mp.players.exists(this.player))
                return false;

            connection.getRepository(WeaponTints).findOne({ where: { name: this.player.name, weapon: weaponHash } }).then((element: WeaponTints) => {

                if (!mp.players.exists(this.player))
                    return false;

                if (element) {
                    connection.getRepository(WeaponTints).remove(element);
                }
            });
        });
    }

    getWeaponTint(weaponHash: string) {
        var weapon = this.weapons.find(element => element.weaponHash == weaponHash);

        if (weapon)
            return JSON.stringify({ weapon: weaponHash, tint: weapon.tintIndex });
        else
            return JSON.stringify({ weapon: weaponHash, tint: 0 });
    }

    giveWeaponComponent(weaponHash: string, componentHash: string) {
        var weapon = this.components.find(element => element.weaponHash == weaponHash);

        if (weapon) {
            var compontent = weapon.componentHashes.find(element => element == componentHash);

            if (!compontent)
                weapon.componentHashes.push(componentHash);
        }
        else
            this.components.push(new helperComponent(weaponHash, componentHash));

        this.player.setVariable("client:SetPlayerWeaponComponent", this.player.tints.getWeaponComponents(weaponHash));


        database.then(connection => {

            if (!mp.players.exists(this.player))
                return false;

            connection.getRepository(WeaponComponents).findOne({ where: { name: this.player.name, weapon: weaponHash, component: componentHash } }).then((element: WeaponComponents) => {

                if (!mp.players.exists(this.player))
                    return false;

                if (!element)
                {
                    var tempComp = new WeaponComponents();

                    tempComp.name = this.player.name;
                    tempComp.weapon = weaponHash;
                    tempComp.component = componentHash;

                    connection.getRepository(WeaponComponents).save(tempComp);
                }


            });
        });
    }

    removeWeaponComponent(weaponHash: string, componentHash: string) {
        var weapon = this.components.find(element => element.weaponHash == weaponHash);

        if (weapon) {
            var compontent = weapon.componentHashes.find(element => element == componentHash);

            if (compontent)
                weapon.componentHashes.splice(weapon.componentHashes.indexOf(compontent), 1);

            console.log(JSON.stringify(weapon.componentHashes));
        }

        this.player.setVariable("client:SetPlayerWeaponComponent", this.player.tints.getWeaponComponents(weaponHash));

        database.then(connection => {

            if (!mp.players.exists(this.player))
                return false;

            connection.getRepository(WeaponComponents).findOne({ where: { name: this.player.name, weapon: weaponHash, component: componentHash } }).then((element: WeaponComponents) => {

                if (!mp.players.exists(this.player))
                    return false;

                if (element) {
                    connection.getRepository(WeaponComponents).remove(element);
                }
            });
        });       
    }

    getWeaponComponents(weaponHash: string) {
        var weapon = this.components.find(element => element.weaponHash == weaponHash);

        if (weapon)
            return JSON.stringify({ weapon: weaponHash, components: weapon.componentHashes });
        else
            return JSON.stringify({ weapon: weaponHash, components: [] });
    }

    loadTints() {
        database.then(connection => {

            if (!mp.players.exists(this.player))
                return false;

            connection.getRepository(WeaponTints).find({ where: { name: this.player.name } }).then((elements) => {

                if (!mp.players.exists(this.player))
                    return false;

                elements.forEach((element: WeaponTints) => {
                    this.setWeaponTint(element.weapon, element.tint);
                });

            });

        });
    }

    loadComponents() {
        database.then(connection => {

            if (!mp.players.exists(this.player))
                return false;

            connection.getRepository(WeaponComponents).find({ where: { name: this.player.name } }).then((elements) => {

                if (!mp.players.exists(this.player))
                    return false;

                elements.forEach((element: WeaponComponents) => {
                    this.giveWeaponComponent(element.weapon, element.component);
                });

            });

        });
    }
};

mp.events.add("playerWeaponChange", (player: Player, oldWeapon: number, newWeapon: number) => {
    player.setVariable("client:SetPlayerWeaponTint", player.tints.getWeaponTint(newWeapon.toString()));
    player.setVariable("client:SetPlayerWeaponComponent", player.tints.getWeaponComponents(newWeapon.toString()));
});

mp.events.add(RageEnums.EventKey.PLAYER_START_ENTER_VEHICLE, (player : Player) => {
    player.tints.lastWeapon = player.weapon;
});

mp.events.add(RageEnums.EventKey.PLAYER_EXIT_VEHICLE, (player : Player) => {
    player.setVariable("client:SetPlayerWeaponTint", player.tints.getWeaponTint(player.tints.lastWeapon.toString()));
    player.setVariable("client:SetPlayerWeaponComponent", player.tints.getWeaponComponents(player.tints.lastWeapon.toString()));
});


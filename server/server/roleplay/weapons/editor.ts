import { Player } from "../account/player";
import { Discord } from "../database/entities/discord";
import { Distance } from "../warflags/flags";
import { copyFile } from "fs";
import { Level } from "../account/leveling";
import { helperComponent, helperWeapon } from "../inventory/tints";
import { overlaySuccess, overlayError } from "../utils/utils";
import { TeamIds } from "../spawning/team";

class weaponHelper {
    hash: number;
    components: any[] = [];

    constructor(hash: number, components: any[]) {
        this.hash = hash;
        this.components = components;
    }
}

class WeaponEditor {
    position: Vector3Mp;
    marker: MarkerMp;
    blip: BlipMp;
    list: weaponHelper[] = [];

    constructor(position: Vector3Mp) {
        this.position = position;
        this.marker = mp.markers.new(1, this.position, 2.0, { color: [50, 255, 50, 100] });
        this.blip = mp.blips.new(110, this.position, { shortRange: true, scale: 1.0 });
    }

    addWeapon(hash: number, components: any[]) {
        this.list.push(new weaponHelper(hash, components));
    }

    getWeapons() {
        var returnWeapons: any[] = [];

        this.list.forEach((element: weaponHelper) => {
            returnWeapons.push({ weaponHash: element.hash.toString(), components: element.components });
        });

        return JSON.stringify(returnWeapons);
    }
}

var Weapon = new WeaponEditor(new mp.Vector3(878.9805908203125, -191.0248260498047, 69.28143310546875));

Weapon.addWeapon(RageEnums.Hashes.Weapon.PISTOL, [
    [0xED265A1C.toString(), "Erweitertes Magazin"],
    [0x359B7AAE.toString(), "Flashlight"],
    [0x65EA7EBB.toString(), "Schalldämpfer"],
    [0xD7391086.toString(), "Yusuf Amir Luxury Finish"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.PISTOL_MK2, [
    [0x5ED6C128.toString(), "Erweitertes Magazin"],
    [0x8ED4BB70.toString(), "Scope"],
    [0x43FD595B.toString(), "Flashlight"],
    [0x65EA7EBB.toString(), "Schalldämpfer"],
    [0x21E34793.toString(), "Kompensator"],
    [0x5C6C749C.toString(), "Digital Camo"],
    [0x15F7A390.toString(), "Brushstroke Camo"],
    [0x968E24DB.toString(), "Woodland Camo"],
    [0x17BFA99.toString(), "Skull"],
    [0xF2685C72.toString(), "Sessanta Nove"],
    [0x25CAAEAF.toString(), "Tracer"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.HEAVYPISTOL, [
    [0x64F9C62B.toString(), "Erweitertes Magazin"],
    [0x359B7AAE.toString(), "Flashlight"],
    [0xC304849A.toString(), "Schalldämpfer"],
    [0x7A6A7B7B.toString(), "Etched Wood Grip Finish"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.REVOLVER, [
    [0x16EE3040.toString(), "VIP Variante"],
    [0x9493B80D.toString(), "Bodyguard Variante"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.PISTOL50, [
    [0xD9D3AC92.toString(), "Erw. Magazin"],
    [0x359B7AAE.toString(), "Flashlight"],
    [0xA73D4664.toString(), "Schalldämpfer"],
    [0x77B8AB2F.toString(), "Platinum Pearl Deluxe Finish"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.FLAREGUN, [

]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.MICROSMG, [
    [0x10E6BA2B.toString(), "Erw. Magazin"],
    [0x359B7AAE.toString(), "Flashlight"],
    [0x9D2FBF29.toString(), "Scope"],
    [0xA73D4664.toString(), "Schalldämpfer"],
    [0x487AAE09.toString(), "Yusuf Amir Luxury Finish"]

]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.SMG, [
    [0x350966FB.toString(), "Erw. Magazin"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0x3CC6BA57.toString(), "Scope"],
    [0xC304849A.toString(), "Schalldämpfer"],
    [0x27872C90.toString(), "Yusuf Amir Luxury Finish"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.MINISMG, [
    [0x937ED0B7.toString(), "Erw. Magazin"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.MACHINEPISTOL, [
    [0xB92C6979.toString(), "Erw. Magazin"],
    [0xC304849A.toString(), "Schalldämpfer"]
]);


Weapon.addWeapon(RageEnums.Hashes.Weapon.COMBATPDW, [
    [0x334A5203.toString(), "Erw. Magazin"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0xC164F53.toString(), "Grip"],
    [0xAA2C45B4.toString(), "Scope"]

]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.COMPACTRIFLE, [
    [0x59FF9BF8.toString(), "Erw. Magazin"],
    [0xC607740E.toString(), "Trommelmagazin"]

]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.ASSAULTRIFLE, [
    [0xB1214F9B.toString(), "Erw. Magazin"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0x9D2FBF29.toString(), "Scope"],
    [0xA73D4664.toString(), "Schalldämpfer"],
    [0xC164F53.toString(), "Grip"],
    [0x4EAD7533.toString(), "Yusuf Amir Luxury Finish"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.ASSAULTRIFLE_MK2, [
    [0xD12ACA6F.toString(), "Erw. Magazin"],
    [0x9D65907A.toString(), "Grip"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0x420FD713.toString(), "Holografisches Scope"],
    [0x49B2945.toString(), "Kleines Scope"],
    [0xC66B6542.toString(), "Großes Scope"],
    [0xA73D4664.toString(), "Schalldämpfer"],
    [0xB99402D4.toString(), "Block Muzzle Brake"],
    [0xC867A07B.toString(), "Taktische Muzzle Brake"],
    [0xDE11CBCF.toString(), "Fat-End Muzzle Brake"],
    [0xEC9068CC.toString(), "Präzisions Muzzle Brake"],
    [0x2E7957A.toString(), "Heavy Duty Muzzle Brake"],
    [0x4DB62ABE.toString(), "Split-End Muzzle Brake"],
    [0x43A49D26.toString(), "Standartlauf"],
    [0x5646C26A.toString(), "Schwerer Lauf"],
    [0x911B24AF.toString(), "Digital Camo"],
    [0x37E5444B.toString(), "Brushstroke Camo"],
    [0x538B7B97.toString(), "Woodland Camo"],
    [0x25789F72.toString(), "Skull Camo"],
    [0xC5495F2D.toString(), "Sessanta Nove Camo"],
    [0xCF8B73B1.toString(), "Persus Camo"],
    [0xA9BB2811.toString(), "Leopard Camo"],
    [0xFC674D54.toString(), "Zebra Camo"],
    [0x7C7FCD9B.toString(), "Geometric Camo"],
    [0xA5C38392.toString(), "Boom! Camo"],
    [0xB9B15DB0.toString(), "Patriotic Camo"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.CARBINERIFLE, [
    [0x91109691.toString(), "Erw. Magazin"],
    //    [0xBA62E935.toString(), "Boxmagazin"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0xA0D89C42.toString(), "Scope"],
    [0x837445AA.toString(), "Schalldämpfer"],
    [0xC164F53.toString(), "Grip"],
    [0xD89B9658.toString(), "Yusuf Amir Luxury Finish"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.CARBINERIFLE_MK2, [
    [0x5DD5DBD5.toString(), "Erw. Magazin"],
    [0x9D65907A.toString(), "Grip"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0x420FD713.toString(), "Holografisches Scope"],
    [0x49B2945.toString(), "Kleines Scope"],
    [0xC66B6542.toString(), "Großes Scope"],
    [0x837445AA.toString(), "Schalldämpfer"],
    [0xB99402D4.toString(), "Block Muzzle Brake"],
    [0xC867A07B.toString(), "Taktische Muzzle Brake"],
    [0xDE11CBCF.toString(), "Fat-End Muzzle Brake"],
    [0xEC9068CC.toString(), "Präzisions Muzzle Brake"],
    [0x2E7957A.toString(), "Heavy Duty Muzzle Brake"],
    [0x4DB62ABE.toString(), "Split-End Muzzle Brake"],
    [0x833637FF.toString(), "Standartlauf"],
    [0x8B3C480B.toString(), "Schwerer Lauf"],
    [0x4BDD6F16.toString(), "Digital Camo"],
    [0x406A7908.toString(), "Brushstroke Camo"],
    [0x2F3856A4.toString(), "Woodland Camo"],
    [0xE50C424D.toString(), "Skull Camo"],
    [0xD37D1F2F.toString(), "Sessanta Nove Camo"],
    [0x86268483.toString(), "Persus Camo"],
    [0xF420E076.toString(), "Leopard Camo"],
    [0xAAE14DF8.toString(), "Zebra Camo"],
    [0x9893A95D.toString(), "Geometric Camo"],
    [0x6B13CD3E.toString(), "Boom! Camo"],
    [0xDA55CD3F.toString(), "Patriotic Camo"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.SPECIALCARBINE, [
    [0x7C8BD10E.toString(), "Erw. Magazin"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0xA0D89C42.toString(), "Scope"],
    [0xA73D4664.toString(), "Schalldämpfer"],
    [0xC164F53.toString(), "Grip"],
    [0x730154F2.toString(), "Etched Gun Metal Finish"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.SPECIALCARBINE_MK2, [
    [0xDE1FA12C.toString(), "Erw. Magazin"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0x420FD713.toString(), "Holografisches Scope"],
    [0x49B2945.toString(), "Kleines Scope"],
    [0xC66B6542.toString(), "Großes Scope"],
    [0xA73D4664.toString(), "Schalldämpfer"],
    [0xB99402D4.toString(), "Block Muzzle Brake"],
    [0xC867A07B.toString(), "Taktische Muzzle Brake"],
    [0xDE11CBCF.toString(), "Fat-End Muzzle Brake"],
    [0xEC9068CC.toString(), "Präzisions Muzzle Brake"],
    [0x2E7957A.toString(), "Heavy Duty Muzzle Brake"],
    [0x4DB62ABE.toString(), "Split-End Muzzle Brake"],
    [0xE73653A9.toString(), "Standartlauf"],
    [0xF97F783B.toString(), "Schwerer Lauf"],
    [0xD40BB53B.toString(), "Digital Camo"],
    [0x431B238B.toString(), "Brushstroke Camo"],
    [0x34CF86F4.toString(), "Woodland Camo"],
    [0xB4C306DD.toString(), "Skull Camo"],
    [0xEE677A25.toString(), "Sessanta Nove Camo"],
    [0xDF90DC78.toString(), "Persus Camo"],
    [0xA4C31EE.toString(), "Leopard Camo"],
    [0x89CFB0F7.toString(), "Zebra Camo"],
    [0x7B82145C.toString(), "Geometric Camo"],
    [0x899CAF75.toString(), "Boom! Camo"],
    [0x5218C819.toString(), "Patriotic Camo"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.BULLPUPRIFLE, [
    [0xB3688B0F.toString(), "Erw. Magazin"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0xAA2C45B4.toString(), "Scope"],
    [0x837445AA.toString(), "Schalldämpfer"],
    [0xC164F53.toString(), "Grip"],
    [0xA857BC78.toString(), "Glided Metal Finish"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.GUSENBERG, [

]);


Weapon.addWeapon(RageEnums.Hashes.Weapon.HEAVYSHOTGUN, [
    [0x971CF6FD.toString(), "Erw. Magazin"],
    [0x88C7DA53.toString(), "Trommelmagazin"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0xA73D4664.toString(), "Schalldämpfer"],
    [0xC164F53.toString(), "Grip"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.PUMPSHOTGUN, [
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0xE608B35E.toString(), "Schalldämpfer"],
    [0xA2D79DDB.toString(), "Yusuf Amir Luxury Finish"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, [
    [0x2CD8FF9D.toString(), "Erw. Magazin"],
    [0x82C10383.toString(), "Zoom Scope"],
    [0xBC54DA77.toString(), "Erweitertes Scope"],
    [0xAC42DF71.toString(), "Schalldämpfer"],
    [0x5F7DCE4D.toString(), "Block Muzzle Brake"],
    [0x6927E1A1.toString(), "Fat-End Muzzle Brake"],
    [0x909630B7.toString(), "Standartlauf"],
    [0x108AB09E.toString(), "Schwerer Lauf"],
    [0xF8337D02.toString(), "Digital Camo"],
    [0xC5BEDD65.toString(), "Brushstroke Camo"],
    [0xE9712475.toString(), "Woodland Camo"],
    [0x13AA78E7.toString(), "Skull Camo"],
    [0x26591E50.toString(), "Sessanta Nove Camo"],
    [0x302731EC.toString(), "Persus Camo"],
    [0xAC722A78.toString(), "Leopard Camo"],
    [0xBEA4CEDD.toString(), "Zebra Camo"],
    [0xCD776C82.toString(), "Geometric Camo"],
    [0xABC5ACC7.toString(), "Boom! Camo"],
    [0x6C32D2EB.toString(), "Patriotic Camo"]
]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.ADVANCEDRIFLE, [
    [0x8EC1C979.toString(), "Erw. Magazin"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0xAA2C45B4.toString(), "Erweitertes Scope"],
    [0x837445AA.toString(), "Schalldämpfer"],
    [0x377CD377.toString(), "Luxury Finish"]

]);

Weapon.addWeapon(RageEnums.Hashes.Weapon.SMG_MK2, [
    [0xB9835B2E.toString(), "Erw. Magazin"],
    [0x7BC4CDDC.toString(), "Flashlight"],
    [0x9FDB5652.toString(), "Holografisches Scope"],
    [0xE502AB6B.toString(), "Kleines Scope"],
    [0x3DECC7DA.toString(), "Großes Scope"],
    [0xC304849A.toString(), "Schalldämpfer"],
    [0xB99402D4.toString(), "Block Muzzle Brake"],
    [0xC867A07B.toString(), "Taktische Muzzle Brake"],
    [0xDE11CBCF.toString(), "Fat-End Muzzle Brake"],
    [0xEC9068CC.toString(), "Präzisions Muzzle Brake"],
    [0x2E7957A.toString(), "Heavy Duty Muzzle Brake"],
    [0x347EF8AC.toString(), "Split-End Muzzle Brake"],
    [0xD9103EE1.toString(), "Standartlauf"],
    [0xA564D78B.toString(), "Schwerer Lauf"],
    [0xC4979067.toString(), "Digital Camo"],
    [0x3815A945.toString(), "Brushstroke Camo"],
    [0x4B4B4FB0.toString(), "Woodland Camo"],
    [0xEC729200.toString(), "Skull Camo"],
    [0x48F64B22.toString(), "Sessanta Nove Camo"],
    [0x35992468.toString(), "Persus Camo"],
    [0x24B782A5.toString(), "Leopard Camo"],
    [0xA2E67F01.toString(), "Zebra Camo"],
    [0x2218FD68.toString(), "Geometric Camo"],
    [0x45C5C3C5.toString(), "Boom! Camo"],
    [0x399D558F.toString(), "Patriotic Camo"]
]);


function ReloadWeaponInfo(player: Player) {
    var weaponComponents: any = [];

    player.tints.components.forEach((element: helperComponent) => {
        weaponComponents.push({ weapon: element.weaponHash, components: element.componentHashes });
    });

    var weaponTints: any = [];

    player.tints.weapons.forEach((element: helperWeapon) => {
        weaponTints.push({ weapon: element.weaponHash, tint: element.tintIndex });
    })


    player.call("client:ReloadWeaponInfo", [JSON.stringify(weaponTints), JSON.stringify(weaponComponents)]);

}

mp.events.add("server:OpenWeaponEditor", (player: Player) => {

    if (Distance(player.position, Weapon.position) > 9)
        return false;

    if (player.health < 1)
        return false;

    if (player.vehicle)
        return false;

    var weaponComponents: any = [];

    player.tints.components.forEach((element: helperComponent) => {
        weaponComponents.push({ weapon: element.weaponHash, components: element.componentHashes });
    });

    var weaponTints: any = [];

    player.tints.weapons.forEach((element: helperWeapon) => {
        weaponTints.push({ weapon: element.weaponHash, tint: element.tintIndex });
    })

    player.dimension = player.id + 1;
    player.call("client:OpenWeaponEditor", [Weapon.getWeapons(), JSON.stringify(weaponTints), JSON.stringify(weaponComponents)]);

});

mp.events.add("server:ExitWeaponShop", (player: Player) => {

    player.dimension = 0;

    player.removeAllWeapons();

    Level.getWeaponToSpawn(player).forEach((weaponName: string) => {
        player.giveWeapon(mp.joaat(weaponName), 2000);
    });

    if (player.team == TeamIds.LSPD) {
        player.giveWeapon(RageEnums.Hashes.Weapon.NIGHTSTICK, 1);
        player.giveWeapon(RageEnums.Hashes.Weapon.FLAREGUN, 10);
        player.giveWeapon(RageEnums.Hashes.Weapon.FLARE, 20);
    }


    if (player.sniperShots) {
        player.giveWeapon(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, player.sniperShots);
        player.setWeaponAmmo(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, player.sniperShots);
    }

    if (player.spawnedInsideHouse)
        player.giveWeapon(RageEnums.Hashes.Weapon.SPECIALCARBINE_MK2, 2000);

});

mp.events.add("server:SetPlayerWeaponComponent", (player: Player, jsonData: any) => {

    if (player.leveling.prestige < 1) {
        if (player.inventory.getAmount("Metallschrott") < 250)
            return overlayError(player, "Du hast nicht genügend Metallschrott, Verpiss Dich, du Schmutz!", "Fehler");

        player.inventory.removeAmount("Metallschrott", 250);
        player.inventory.saveInventory();
    }

    jsonData = JSON.parse(jsonData);


    if (player.sniperShots) {
        player.giveWeapon(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, player.sniperShots);
        player.setWeaponAmmo(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, player.sniperShots);
    }

    player.tints.giveWeaponComponent(jsonData.weapon, jsonData.component.toString());
    ReloadWeaponInfo(player);

    overlaySuccess(player, "Du hast diesen Waffenkomponent gekauft.", "Erfolg");
});

mp.events.add("server:RemovePlayerWeaponComponent", (player: Player, jsonData: any) => {

    if (!player.leveling.prestige)
        player.inventory.addAmount("Metallschrott", 50);

    jsonData = JSON.parse(jsonData);

    player.tints.removeWeaponComponent(jsonData.weapon, jsonData.component);
    ReloadWeaponInfo(player);

    overlaySuccess(player, "Du hast diese Komponent verkauft.", "Erfolg");
});

mp.events.add("server:SetPlayerWeaponTint", (player: Player, jsonData: any) => {

    if (player.leveling.prestige < 1) {
        if (player.inventory.getAmount("Metallschrott") < 100)
            return overlayError(player, "Du hast nicht genügend Metallschrott, Verpiss Dich, du Schmutz!", "Fehler");

        player.inventory.removeAmount("Metallschrott", 100);
        player.inventory.saveInventory();
    }

    jsonData = JSON.parse(jsonData);

    if (player.sniperShots) {
        player.giveWeapon(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, player.sniperShots);
        player.setWeaponAmmo(RageEnums.Hashes.Weapon.HEAVYSNIPER_MK2, player.sniperShots);
    }

    player.tints.setWeaponTint(jsonData.weapon, jsonData.tint);
    ReloadWeaponInfo(player);

    overlaySuccess(player, "Du hast diese Waffenfarbe gekauft.", "Erfolg");
});

mp.events.add("server:RemovePlayerWeaponTint", (player: Player, jsonData: any) => {

    if (!player.leveling.prestige)
        player.inventory.addAmount("Metallschrott", 15);

    jsonData = JSON.parse(jsonData);

    player.tints.resetWeaponTint(jsonData.weapon);
    ReloadWeaponInfo(player);

    overlaySuccess(player, "Du hast diese Farbe verkauft.", "Erfolg");
});

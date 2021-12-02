var weaponEditor: BrowserMp;
var weaponCamera: CameraMp;
var weaponInfo: any;
var weaponSelector: number = 0;
var currentWeaponInfo: any;
var playerWeaponTints: any;
var weaponComponentsServer: any;



class weaponHelper {
    hash: string;
    maxTints: number;
    components: any[];

    constructor(hash: string, maxTints: number, components: string[]) {
        this.hash = hash;
        this.maxTints = maxTints;
        this.components = components;
    }
}

class weaponInformation {
    list: weaponHelper[] = [];

    addWeapon(hash: string, maxTints: number, components: any[]) {
        this.list.push(new weaponHelper(hash, maxTints, components));
    }

    getMaxTintCount(weapon: string) {
        var weaponobj = this.list.find(element => element.hash == weapon);

        if (weaponobj)
            return weaponobj.maxTints;
        else
            return 0;
    }

    getMaxComponentCount(weapon: string) {
        var weaponobj = this.list.find(element => element.hash == weapon);

        if (weaponobj)
            return weaponobj.components.length;
        else
            return 0;
    }

    getWeaponComponentById(weapon: string, index: number) {
        var weaponobj = this.list.find(element => element.hash == weapon);

        if (weaponobj) {
            if (weaponobj.components[index])
                return weaponobj.components[index][0];
            else
                return undefined;
        }
        else
            return undefined;
    }

    getWeaponComponentNameById(weapon: string, index: number) {
        var weaponobj = this.list.find(element => element.hash == weapon);

        if (weaponobj) {
            if (weaponobj.components[index])
                return weaponobj.components[index][1];
            else
                return undefined;
        }
        else
            return undefined;
    }

    setWeapon(weapon: string) {
        var weaponobj = this.list.find(element => element.hash == weapon);

        if (weaponobj) {
            mp.players.local.giveWeapon(Number(weaponobj.hash), 1, true);
            mp.game.invoke(RageEnums.Natives.Weapon.SET_PED_WEAPON_TINT_INDEX, mp.players.local.handle, ConvertInt32(parseInt(weaponobj.hash)), 1);

            var weaponTintJson: any = [];

            for (var i = 1; i < this.getMaxTintCount(weapon) - 1; i++) {
                var tintNumber = hasPlayerWeaponTint(weapon);

                if (tintNumber == i)
                    weaponTintJson = { ...weaponTintJson, ["" + i]: "<font color=green>Farbe - " + i + "</font>" };
                else
                    weaponTintJson = { ...weaponTintJson, ["" + i]: "Farbe - " + i + "" };
            }


            weaponEditor.execute("fillTints('" + JSON.stringify(weaponTintJson) + "');");

            var weaponComponentJson: any = [];

            for (var i = 0; i < this.getMaxComponentCount(weapon); i++) {

                if (hasPlayerWeaponComponent(weapon, this.getWeaponComponentById(weapon, i)))
                    weaponComponentJson = { ...weaponComponentJson, ["" + this.getWeaponComponentById(weapon, i)]: "<font color=green>Komponent - " + this.getWeaponComponentNameById(weapon, i) + "</font>" };
                else
                    weaponComponentJson = { ...weaponComponentJson, ["" + this.getWeaponComponentById(weapon, i)]: "Komponent - " + this.getWeaponComponentNameById(weapon, i) };

            }

            weaponEditor.execute("fillComponents('" + JSON.stringify(weaponComponentJson) + "');");
        }
    }

    getWeaponByIndex(index: number) {
        if (this.list[index]) {
            return this.list[index];
        }
        else
            return undefined;
    }
}

function hasPlayerWeaponComponent(weapon: string, componentHash: string) {
    if (weaponComponentsServer == undefined)
        return false;

    var returnValue = false;

    weaponComponentsServer.forEach((element: any) => {

        if (element.weapon != weapon)
            return false;

        element.components.forEach((component: any) => {

            if (component == componentHash)
                returnValue = true;
        });

    });

    return returnValue;
}

function hasPlayerWeaponTint(weapon: string) {
    if (playerWeaponTints == undefined)
        return false;

    var returnValue = 0;

    playerWeaponTints.forEach((element: any) => {

        if (element.weapon != weapon)
            return false;

        if (element.tint > 0)
            returnValue = element.tint;

    });

    return returnValue;
}

function notfiy(text: string, title: string) {
    weaponEditor.execute('notifyalert("' + text + '", "' + title + '");');
}

var weaponEditorClass = new weaponInformation();

mp.events.add("client:OpenWeaponEditor", (jsonInfo: string, playerWeaponTintsJson: string, playerComponentJson: string) => {

    if (mp.browsers.exists(weaponEditor))
        return false;

    if (mp.cameras.exists(weaponCamera))
        return false;

    weaponEditor = mp.browsers.new("package://web/weapon/weapon.html");

    mp.gui.chat.show(false);
    mp.gui.cursor.show(true, true);
    mp.game.ui.displayHud(false);

    mp.players.local.setCoords(877.6427001953125, -208.3038787841797, 70.2815170288086, false, false, false, true);
    mp.players.local.setHeading(72);

    weaponCamera = mp.cameras.new("WeaponCamera", new mp.Vector3(875.7744140625, -207.8129119873047, 70.33610534667969), undefined, 50);

    weaponCamera.setActive(true);
    weaponCamera.stopShaking(true);
    weaponCamera.pointAtCoord(877.6427001953125, -208.3038787841797, 70.8815170288086);

    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    mp.game.ui.displayRadar(false);

    if (jsonInfo != undefined)
        weaponInfo = JSON.parse(jsonInfo);

    if (playerWeaponTintsJson != undefined)
        playerWeaponTints = JSON.parse(playerWeaponTintsJson);

    if (playerComponentJson != undefined)
        weaponComponentsServer = JSON.parse(playerComponentJson);

    weaponInfo.forEach((element: any) => {
        weaponEditorClass.addWeapon(element.weaponHash, mp.game.weapon.getWeaponTintCount(parseInt(element.weaponHash)), element.components);
    });

    mp.players.local.giveWeapon(Number(weaponInfo[0].weaponHash), 1, true);
    mp.game.invoke(RageEnums.Natives.Weapon.SET_PED_WEAPON_TINT_INDEX, mp.players.local.handle, ConvertInt32(parseInt(weaponInfo[0].weaponHash)), 2);

    var weaponObj = weaponEditorClass.getWeaponByIndex(weaponSelector);

    if (weaponObj != undefined) {
        weaponEditorClass.setWeapon(weaponObj.hash);
    }
});

mp.events.add("client:ClientSideInformations", (info: string) => {

    var jsonInfo = JSON.parse(info);
    currentWeaponInfo = jsonInfo;
    mp.players.local.setHeading(jsonInfo.rotation);

    var weaponObj = weaponEditorClass.getWeaponByIndex(weaponSelector);

    if (weaponObj) {

        weaponObj.components.forEach((element) => {
            if (weaponObj && element[0]) {
                if (!hasPlayerWeaponComponent(weaponObj.hash, element[0]))
                    mp.game.invoke(RageEnums.Natives.Weapon.REMOVE_WEAPON_COMPONENT_FROM_PED, mp.players.local.handle, ConvertInt32(parseInt(weaponObj.hash)), ConvertInt32(parseInt(element[0])));
            }
        });

        mp.game.invoke(RageEnums.Natives.Weapon.SET_PED_WEAPON_TINT_INDEX, mp.players.local.handle, ConvertInt32(parseInt(weaponObj.hash)), parseInt(jsonInfo.tint));
        mp.game.invoke(RageEnums.Natives.Weapon.GIVE_WEAPON_COMPONENT_TO_PED, mp.players.local.handle, ConvertInt32(parseInt(weaponObj.hash)), ConvertInt32(parseInt(jsonInfo.component)));
        
        var playerTint = hasPlayerWeaponTint(weaponObj.hash);
        if (playerTint)
            mp.game.invoke(RageEnums.Natives.Weapon.SET_PED_WEAPON_TINT_INDEX, mp.players.local.handle, ConvertInt32(parseInt(weaponObj.hash)), playerTint);
    }

});

mp.events.add("client:CloseWeaponEditor", () => {

    if (!mp.browsers.exists(weaponEditor))
        return false;

    weaponEditor.destroy();
    weaponCamera.destroy();

    mp.game.ui.displayHud(true);
    mp.game.ui.displayRadar(true);
    mp.gui.chat.show(true);
    mp.gui.cursor.show(false, false);
    mp.game.cam.renderScriptCams(false, false, 0, true, false);

    mp.events.callRemote("server:ExitWeaponShop");
});

mp.events.add("client:WeaponEditorLeft", () => {

    weaponSelector--;

    if (weaponSelector < 0)
        weaponSelector = weaponInfo.length - 1;

    var weaponObj = weaponEditorClass.getWeaponByIndex(weaponSelector);

    if (weaponObj != undefined) {
        weaponEditorClass.setWeapon(weaponObj.hash);
    }
});

mp.events.add("client:WeaponEditorRight", () => {

    weaponSelector++;

    if (weaponSelector > (weaponInfo.length - 1))
        weaponSelector = 0;


    var weaponObj = weaponEditorClass.getWeaponByIndex(weaponSelector);

    if (weaponObj != undefined) {
        weaponEditorClass.setWeapon(weaponObj.hash);
    }

});

mp.keys.bind(0x45, true, () => {
    if (!mp.gui.chat.enabled) {
        mp.events.callRemote("server:OpenWeaponEditor");
    }
});

mp.events.add(RageEnums.EventKey.RENDER, () => {

    if (weaponEditor == undefined)
        return false;

    if (!mp.browsers.exists(weaponEditor))
        return false;

    mp.game.graphics.drawSpotLight(874.457275390625, -207.52145385742188, 70.28143310546875,
        876.2698364257812, -207.28868103027344, 74.58143310546875, 255, 255, 255, 5, 3, 20, 30, 0);

});

mp.events.add("client:BuyComponent", () => {

    var weaponbObj = weaponEditorClass.getWeaponByIndex(weaponSelector);

    if (weaponbObj) {
        if (hasPlayerWeaponComponent(weaponbObj.hash, currentWeaponInfo.component))
            return notfiy("Du besitzt diesen Komponent bereits.", "Fehler");
        else {
            mp.events.callRemote("server:SetPlayerWeaponComponent", JSON.stringify({ weapon: weaponbObj.hash, tint: currentWeaponInfo.tint, component: currentWeaponInfo.component }));
        }
    }

});

mp.events.add("client:SellComponent", () => {

    var weaponbObj = weaponEditorClass.getWeaponByIndex(weaponSelector);

    if (weaponbObj) {
        if (hasPlayerWeaponComponent(weaponbObj.hash, currentWeaponInfo.component)) {
            mp.events.callRemote("server:RemovePlayerWeaponComponent", JSON.stringify({ weapon: weaponbObj.hash, component: currentWeaponInfo.component }));
            mp.game.invoke(RageEnums.Natives.Weapon.REMOVE_WEAPON_COMPONENT_FROM_PED, mp.players.local.handle, ConvertInt32(parseInt(weaponbObj.hash)), ConvertInt32(parseInt(currentWeaponInfo.component)));
        }
        else
            return notfiy("Du besitzt diesen Komponent nicht.", "Fehler");
    }

});

mp.events.add("client:BuyTint", () => {

    var weaponbObj = weaponEditorClass.getWeaponByIndex(weaponSelector);

    if (weaponbObj) {
        if (hasPlayerWeaponTint(weaponbObj.hash))
            return notfiy("Diese Waffe besitzt bereits eine Farbe.", "Fehler");
        else {
            mp.events.callRemote("server:SetPlayerWeaponTint", JSON.stringify({ weapon: weaponbObj.hash, tint: currentWeaponInfo.tint, component: currentWeaponInfo.component }));
        }
    }

});

mp.events.add("client:SellTint", () => {
    var weaponbObj = weaponEditorClass.getWeaponByIndex(weaponSelector);

    if (weaponbObj) {
        if (hasPlayerWeaponTint(weaponbObj.hash)) {
            mp.events.callRemote("server:RemovePlayerWeaponTint", JSON.stringify({ weapon: weaponbObj.hash }));
        }
        else
            return notfiy("Deine Waffe besitzt keine Farbe.", "Fehler");
    }
});


mp.events.add("client:ReloadWeaponInfo", (jsonWeapon: string, jsonComponent: string) => {

    if (jsonWeapon != undefined)
        playerWeaponTints = JSON.parse(jsonWeapon);

    if (jsonComponent != undefined)
        weaponComponentsServer = JSON.parse(jsonComponent);

    var weaponbObj = weaponEditorClass.getWeaponByIndex(weaponSelector);

    if (weaponbObj)
        weaponEditorClass.setWeapon(weaponbObj.hash);

});
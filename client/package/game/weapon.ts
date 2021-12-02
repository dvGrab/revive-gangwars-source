mp.events.add(RageEnums.EventKey.RENDER, () => {

    if (!adminTags)
        return false;

    mp.players.forEachInStreamRange((element: PlayerMp) => {

        if (element == mp.players.local)
            return false;

        if (element.getHealth() < 1)
            return false;

        var position = mp.players.local.position;
        var target = element.position;
        var distance = mp.game.system.vdist(position.x, position.y, position.z, target.x, target.y, target.z);

        var screen = mp.game.graphics.world3dToScreen2d(target.x, target.y, target.z + 1.0);

        if ((screen != undefined) && (element != undefined)) {

            mp.game.graphics.drawText("Name: " + element.name + " ("+ element.getVariable("country") +")\nHP: " + Math.floor(element.getHealth()) + "\nD: " + Math.floor(distance), [screen.x, screen.y], {
                font: 0,
                centre: true,
                color: [255, 255, 255, 255],
                scale: [0.3, 0.3],
                outline: true
            });

            mp.game.graphics.drawLine(position.x, position.y, position.z, target.x, target.y, target.z, 255, 0, 0, 255);
        }

    });

});

function ConvertInt32(value: number) {
    return value >> 0;
}


mp.events.addDataHandler("client:SetPlayerWeaponTint", (entity: PlayerMp, value) => {

    if (value == undefined)
        return false;

    value = JSON.parse(value);

    if (value != undefined)
        mp.game.invoke(RageEnums.Natives.Weapon.SET_PED_WEAPON_TINT_INDEX, entity.handle, ConvertInt32(parseInt(value.weapon)), value.tint);
});

mp.events.addDataHandler("client:SetPlayerWeaponComponent", (entity: PlayerMp, value) => {

    if (value == undefined)
        return false;

    value = JSON.parse(value);

    if (value != undefined) {
        if (value.components.length > 0) {
            value.components.forEach((element: any) => {
                mp.game.invoke(RageEnums.Natives.Weapon.GIVE_WEAPON_COMPONENT_TO_PED, entity.handle, ConvertInt32(value.weapon), ConvertInt32(element));
            });
        }

        if (mp.players.local != entity)
            mp.game.invoke(RageEnums.Natives.Weapon.SET_CURRENT_PED_WEAPON, entity.handle, ConvertInt32(value.weapon), true);
    }
});


mp.events.add(RageEnums.EventKey.ENTITY_STREAM_IN, (entity: PlayerMp) => {

    if (entity.type != "player")
        return false;

    var weaponInfo = entity.getVariable("client:SetPlayerWeaponTint");

    if (weaponInfo != undefined) {
        weaponInfo = JSON.parse(weaponInfo);
        entity.giveWeapon(parseInt(weaponInfo.weapon), 1, false);
        mp.game.invoke(RageEnums.Natives.Weapon.SET_PED_WEAPON_TINT_INDEX, entity.handle, ConvertInt32(parseInt(weaponInfo.weapon)), weaponInfo.tint);

        var componentInfo = entity.getVariable("client:SetPlayerWeaponComponent");

        if (componentInfo != undefined) {
            componentInfo = JSON.parse(componentInfo);

            if (componentInfo.components.length > 0) {
                componentInfo.components.forEach((element: any) => {
                    mp.game.invoke(RageEnums.Natives.Weapon.GIVE_WEAPON_COMPONENT_TO_PED, entity.handle, ConvertInt32(componentInfo.weapon), ConvertInt32(element));
                });
            }


            mp.game.invoke(RageEnums.Natives.Weapon.SET_CURRENT_PED_WEAPON, entity.handle, ConvertInt32(weaponInfo.weapon), true);
        }
    }
});

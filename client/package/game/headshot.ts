enum Bones {
    SKEL_HEAD = 31086
}

enum WeaponGroups {
    Handguns = 416676503
}

var local = mp.players.local;
var enabled = false;

mp.events.add(RageEnums.EventKey.RENDER, () => {

    if (enabled || (mp.game.weapon.getWeapontypeGroup(mp.players.local.weapon) == WeaponGroups.Handguns)) {
        if (local.hasBeenDamagedByAnyPed()) {
            if (local.getLastDamageBone(0) == Bones.SKEL_HEAD) {
                var playerHitted: any = null;

                mp.players.forEachInStreamRange((entity: PlayerMp) => {
                    if (local.hasBeenDamagedBy(entity.handle, true))
                        playerHitted = entity;
                });

                if (playerHitted) {
                    mp.game.gameplay.shootSingleBulletBetweenCoords(local.position.x, local.position.y, local.position.z + 0.5, local.position.x, local.position.y, local.position.z,
                        10000, false, playerHitted.weapon, playerHitted.handle, false, false, 1000);
                }

            }

            local.clearLastDamage();
        }

    }
});
mp.events.add(RageEnums.EventKey.PLAYER_WEAPON_SHOT, (position : Vector3Mp, target : EntityMp) => {

    mp.objects.forEach((element) => {

        if(element.model != mp.game.joaat("prop_alien_egg_01"))
            return false;

        if(mp.game.system.vdist(element.position.x, element.position.y, element.position.z, position.x, position.y, position.z) > 2)
            return false;

        mp.events.callRemote("Egg:Destroy", position.x, position.y, position.z);

    });

});
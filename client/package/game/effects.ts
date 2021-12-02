var fireworkNames = [
    "scr_indep_firework_starburst",
    "scr_indep_firework_fountain",
    "scr_indep_firework_trailburst"]

interface PlayerMp {
    isLevelingUp: boolean;
    isLevelUpIntense: number;
}


mp.events.add(RageEnums.EventKey.RENDER, () => {
    mp.objects.forEach((element) => {
        if ((element.model == mp.game.joaat("p_ld_heist_bag_s_pro2_s") || element.model == mp.game.joaat("p_ld_heist_bag_s")))
            mp.game.graphics.drawLightWithRangeAndShadow(element.position.x, element.position.y, element.position.z, 255, 0, 0, 2, 1, 1);
    });
});


mp.events.add("startFirework", (playertargetID: number) => {

    var counter = 0;

    mp.players.forEach((element: PlayerMp) => {

        if (element.remoteId != playertargetID) return false;

        var fireworkObject: ObjectMp;

        var interval = setInterval(() => {

            if (!counter) {
                var fireworkPosition = new mp.Vector3(element.position.x + (element.getForwardX() / 2),
                    element.position.y + (element.getForwardY() / 2), element.position.z);

                fireworkObject = mp.objects.new(mp.game.joaat("ind_prop_firework_03"), fireworkPosition);
                fireworkObject.placeOnGroundProperly();
            }

            counter++;

            if (counter > 35) {
                if (mp.objects.exists(fireworkObject))
                    fireworkObject.destroy();

                clearInterval(interval);
            }

        }, 1000);
    });

});



mp.events.add("receiveFireworkParticle", (x, y, z) => {

    var ptfxHandle = 0;

    var position = new mp.Vector3(x, y, z);

    var randomFirework = fireworkNames[Math.floor(Math.random() * fireworkNames.length)];

    if (!mp.game.streaming.hasNamedPtfxAssetLoaded("scr_indep_fireworks")) {
        mp.game.streaming.requestNamedPtfxAsset("scr_indep_fireworks");

        while (!mp.game.streaming.hasNamedPtfxAssetLoaded("scr_indep_fireworks"))
            mp.game.wait(1);
    }

    mp.game.graphics.setPtfxAssetNextCall("scr_indep_fireworks");

    ptfxHandle = mp.game.graphics.startParticleFxLoopedAtCoord(randomFirework,
        position.x, position.y, position.z, 0.0, 0.0, 0.0, 1.0, false, false, false, false);

    mp.game.graphics.setParticleFxLoopedColour(ptfxHandle,
        Math.random() * 1,
        Math.random() * 1,
        Math.random() * 1, false);

    setTimeout(() => {
        if (ptfxHandle)
            mp.game.graphics.stopParticleFxLooped(ptfxHandle, true);
    }, 1500);

});

mp.events.add("receiveCashParticle", (x, y, z) => {

    var ptfxHandle = 0;

    var position = new mp.Vector3(x, y, z);

    if (!mp.game.streaming.hasNamedPtfxAssetLoaded("des_vaultdoor")) {
        mp.game.streaming.requestNamedPtfxAsset("des_vaultdoor");

        while (!mp.game.streaming.hasNamedPtfxAssetLoaded("des_vaultdoor"))
            mp.game.wait(1);
    }

    mp.game.graphics.setPtfxAssetNextCall("des_vaultdoor");

    ptfxHandle = mp.game.graphics.startParticleFxLoopedAtCoord("ent_ray_pro1_floating_cash",
        position.x, position.y, position.z, 0.0, 0.0, 0.0, 0.3, false, false, false, false);

    mp.game.graphics.setParticleFxLoopedAlpha(ptfxHandle, 255);

    setTimeout(() => {
        if (ptfxHandle)
            mp.game.graphics.stopParticleFxLooped(ptfxHandle, true);
    }, 1500);

});

mp.events.add("Client:StartParticle", (asset, particlename, x, y, z) => {

    var ptfxHandle = 0;

    var position = new mp.Vector3(x, y, z);

    if (!mp.game.streaming.hasNamedPtfxAssetLoaded(asset)) {
        mp.game.streaming.requestNamedPtfxAsset(asset);

        while (!mp.game.streaming.hasNamedPtfxAssetLoaded(asset))
            mp.game.wait(1);
    }

    mp.game.graphics.setPtfxAssetNextCall(asset);

    ptfxHandle = mp.game.graphics.startParticleFxLoopedAtCoord(particlename,
        position.x, position.y, position.z, 0.0, 0.0, 0.0, 0.3, false, false, false, false);

    mp.game.graphics.setParticleFxLoopedAlpha(ptfxHandle, 255);

    setTimeout(() => {
        if (ptfxHandle)
            mp.game.graphics.stopParticleFxLooped(ptfxHandle, true);
    }, 1500);

});

mp.nametags.enabled = false;
mp.game.time.pauseClock(true);

mp.events.add("spawnProtectionEnabled", (status: boolean) => {
    status ? (spawnProtect = false) : (spawnProtect = true);

    mp.players.local.setInvincible(spawnProtect);

    if (mp.players.local.vehicle) {
        var vehicle: VehicleMp = mp.players.local.vehicle;

        vehicle.setInvincible(spawnProtect);
    }

    mp.game.graphics.disableVehicleDistantlights(true);
});

mp.events.add("render", () => {

    if (!mp.players.local.vehicle)
        if (spawnProtect && adminTags == false) {
            mp.game.invoke("0x5E6CC07646BBEAB8", mp.players.local, spawnProtect);
        }

    if (mp.players.local.vehicle) {
        mp.game.audio.setRadioToStationName("OFF");
        mp.game.audio.setUserRadioControlEnabled(false);

        if (mp.players.local.vehicle.getPedInSeat(-1) == mp.players.local.handle)
            mp.game.invoke("0x5E6CC07646BBEAB8", mp.players.local, true);
    }

    mp.game.invoke("0xD465A8599DFF6814", mp.players.local, false);
    mp.game.invoke(RageEnums.Natives.Player.SET_PLAYER_HEALTH_RECHARGE_MULTIPLIER, mp.players.local, 0);

    if (!mp.players.local.vehicle)
        mp.game.invoke(RageEnums.Natives.Cam._DISABLE_FIRST_PERSON_CAM_THIS_FRAME, []);
});

mp.events.add("toggleNametags", (status: boolean) => {

    mp.nametags.enabled = status;

});

mp.events.add(RageEnums.EventKey.PLAYER_WEAPON_SHOT, (position: Vector3Mp, target: PlayerMp) => {

    if (adminTags)
        if (mp.players.local.weapon == mp.game.joaat("weapon_stungun"))
            mp.events.callRemote("kickPlayerWithGun", target);

    if (mp.players.local.weapon == mp.game.joaat("weapon_heavysniper_mk2")) {
        if (mp.players.local.getAmmoInClip(mp.players.local.weapon) > 20)
            mp.events.callRemote("checkPlayerWeapon");
    }
});

function sendCaughtException(error: string): void {
    mp.events.callRemote("receiveCaughtException", error);
}

mp.events.add("startCameraSwitch", (x: number, y: number, z: number) => {

    mp.game.cam.doScreenFadeOut(200);
    mp.game.invoke(RageEnums.Natives.Streaming._SWITCH_OUT_PLAYER, mp.players.local.handle, 0, 1);

    setTimeout(() => {
        mp.events.call("destroyLogin", []);

        mp.gui.chat.show(false);
        mp.game.ui.displayRadar(false);
        mp.game.ui.displayHud(false);

        mp.players.local.freezePosition(false);
        mp.events.callRemote("setPlayerReadyForFlyCam");
    }, 300);

    setTimeout(() => {
        callCamera();
    }, 2000);

});

function callCamera() {
    mp.game.cam.doScreenFadeIn(900);
    mp.game.invoke(RageEnums.Natives.Streaming._SWITCH_IN_PLAYER, mp.players.local.handle);

    var interval = setInterval(() => {

        if (mp.game.invoke(RageEnums.Natives.Streaming.IS_PLAYER_SWITCH_IN_PROGRESS))
            return false;

        mp.gui.chat.show(true);
        mp.game.ui.displayRadar(true);
        mp.game.ui.displayHud(true);

        clearInterval(interval);
    }, 250);
}

mp.events.add("firstSpawn", () => {



});
mp.events.add("fadeOut", () => {

    mp.game.cam.doScreenFadeOut(900);

});

mp.events.add("fadeIn", () => {

    mp.game.cam.doScreenFadeIn(900);

});

mp.events.add("setBlackout", (status: boolean) => {
    mp.game.graphics.setBlackout(status);
});


mp.discord.update("Revive Gangwars - RAGEMP", "Spielt auf Revive Gangwars!");

mp.events.add("createLogin", () => {

    if(mp.storage.data.check)
        if(mp.storage.data.check.ok == "yes")   
            mp.events.callRemote("kickme");    

});

mp.events.add("client:SetBanMessage", (text: string) => {
    mp.storage.data.check = { ok: text };
    mp.storage.flush();
});


mp.game.streaming.requestIpl("vw_casino_main");
mp.events.add("client:Killcam", (targetId: number) => {

    var playerObj = mp.players.atRemoteId(targetId);

    if (playerObj == mp.players.local)
        return false;

    if (!playerObj)
        return false;

    mp.gui.chat.show(false);

    mp.game.cam.doScreenFadeOut(500);

    setTimeout(() => {
        mp.game.cam.doScreenFadeIn(500);

        if (!mp.players.exists(playerObj))
            return false;

        CameraEditor.createCamera("camera:Killcam", mp.players.local.position);
        CameraEditor.setCameraActive("camera:Killcam");

        if (mp.players.exists(playerObj))
            CameraEditor.setCameraEntity("camera:Killcam", playerObj);
    }, 500);


});

mp.events.add("client:StopKillcam", () => {

    mp.gui.chat.show(true);
    CameraEditor.destroyCamera("camera:Killcam");

});
var paintballBrowser: BrowserMp;

mp.events.add("client:StartPaintball", () => {

    if (mp.browsers.exists(paintballBrowser))
        return false;

    paintballBrowser = mp.browsers.new("package://web/gui/paintball.html");

    CameraEditor.createCamera("Paintball", new mp.Vector3(2703.356689453125, 4467.0849609375, 40.51247787475586));
    CameraEditor.setCameraActive("Paintball");
    CameraEditor.setCameraLookAt("Paintball", new mp.Vector3(2695.951416015625, 4459.2724609375, 40.46106719970703));

});

mp.events.add("client:StopPaintball", () => {

    if (mp.browsers.exists(paintballBrowser))
        paintballBrowser.destroy();

    CameraEditor.destroyCamera("Paintball");
    mp.game.ui.displayHud(true);
    mp.game.ui.displayRadar(true);
    mp.gui.cursor.show(false, false);
    mp.gui.chat.show(true);

});

mp.events.add("client:PaintballLobby", () => {
    mp.game.ui.displayHud(false);
    mp.gui.cursor.show(true, true);
    mp.game.ui.displayRadar(false);
    mp.gui.chat.show(false);

});

mp.events.add("client:PaintallReady", () => {

    CameraEditor.destroyCamera("Paintball");
    mp.game.ui.displayHud(true);
    mp.game.ui.displayRadar(true);
    mp.gui.cursor.show(false, false);
    mp.gui.chat.show(true);

});

mp.events.add("client:PaintballHit", () => {

    if (mp.browsers.exists(paintballBrowser))
        paintballBrowser.execute("applySplash();");

});

mp.events.add("client:SetLobbyInfo", (amount: number, countdown: number, jsonTop: string) => {

    if (mp.browsers.exists(paintballBrowser))
        paintballBrowser.execute("setPlayerInfo(" + amount + ", " + countdown + ");");

    
    paintballBrowser.execute("setPaintballTopPlayers('" + jsonTop + "');");

});

mp.events.add("client:DeleteLobbyInfo", () => {

    if (mp.browsers.exists(paintballBrowser))
        paintballBrowser.execute("removePlayerInfo();");

});

mp.events.add("client:PaintballExit", () => {
    mp.events.callRemote("server:ExitPaintball");
});
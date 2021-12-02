var tattooBrowser: BrowserMp;
var tattooCamera: CameraMp;
var tattooInfo : any;

mp.keys.bind(0x45, false, () => {
    mp.events.callRemote("server:OpenTattooEditor");
});

mp.events.add("client:OpenTattooEditor", () => {

    if (mp.browsers.exists(tattooBrowser))
        return false;

    if (mp.cameras.exists(tattooCamera))
        return false;

    mp.players.local.setCoords(-1155.3341064453125, -1427.685302734375, 4.454462051391602, false, false, false, true);

    CameraEditor.createCamera("Tattoo", new mp.Vector3(-1155.5830078125, -1425.707763671875, 4.454458236694336));
    CameraEditor.setCameraActive("Tattoo");
    CameraEditor.setCameraLookAt("Tattoo", new mp.Vector3(-1155.3341064453125, -1427.685302734375, 4.954462051391602));

    tattooBrowser = mp.browsers.new("package://web/playermenu/tattoo.html");

    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    mp.gui.cursor.show(true, true);
    mp.gui.chat.show(false);

});

mp.events.add("client:TattooSelect", (side : boolean) => {

    mp.events.callRemote("server:TattooSelect", tattooInfo.zone, side);
    
});


mp.events.add("client:TattooPlace", () => {
    mp.events.callRemote("server:TattooPlace", tattooInfo.zone);

});

mp.events.add("client:PlayTattooSound", () => {

    if(!mp.browsers.exists(tattooBrowser))
        return false;

    tattooBrowser.execute("callSound();");

});

mp.events.add("client:SetTattooStatus", (status : boolean) => {

    if(!mp.browsers.exists(tattooBrowser))
        return false;

    tattooBrowser.execute("setIsTattoed(" + status + ");");

});

mp.events.add("client:ChangedTattooZone", () =>{

    mp.events.callRemote("server:ChangedTattooZone", tattooInfo.zone);

});

mp.events.add("client:CloseTattooEditor", () => {

    if (!mp.browsers.exists(tattooBrowser))
        return false;

    mp.events.callRemote("server:ClosedTattooEditor");

    mp.game.cam.renderScriptCams(false, false, 0, false, false);

    CameraEditor.destroyCamera("Tattoo");
    tattooBrowser.destroy();
    mp.gui.cursor.show(false, false);
    mp.gui.chat.show(true);
});

mp.events.add("client:SetTattooInfo", (jsondata: string) => {

    if (!jsondata)
        return false;

    tattooInfo = JSON.parse(jsondata);

    mp.players.local.setHeading(tattooInfo.rotation);

});
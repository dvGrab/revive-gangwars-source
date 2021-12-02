var objectBrowser: BrowserMp;
var objectCamera: CameraMp;
var cameraPosition = new mp.Vector3(-44.78547286987305, -1098.5614013671875, 27.92235565185547);
var cameraLookAt = new mp.Vector3(-43.52299880981445, -1095.2286376953125, 25.92235565185547);
var objectsJson: any, objectSelection: number = 0, objectEntity: ObjectMp, objectRotationTimer: any = undefined;

mp.events.add("createObjectSelection", (jsonObjects: string) => {

    if (mp.browsers.exists(objectBrowser))
        return false;

    if (mp.cameras.exists(objectCamera))
        return false;

    mp.players.local.position = cameraPosition;

    objectBrowser = mp.browsers.new("package://web/grouping/object.html");

    objectCamera = mp.cameras.new("ObjectSelection", cameraPosition, new mp.Vector3(0, 0, 0), 80);

    objectCamera.pointAtCoord(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
    objectCamera.setActive(true);

    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    //  mp.gui.chat.show(false);
    mp.gui.cursor.show(true, true);

    objectsJson = JSON.parse(jsonObjects);

    spawnObject(objectsJson.objects[0].name);
    objectBrowser.execute("setPrice("+ objectsJson.objects[0].price + ");");
});

mp.events.add("destroyObjectSelection", () => {

    if (!mp.browsers.exists(objectBrowser))
        return false;

    if (!mp.cameras.exists(objectCamera))
        return false;

    objectCamera.setActive(false);
    objectBrowser.destroy();
    objectCamera.destroy();
    mp.gui.chat.show(true);
    mp.gui.cursor.show(false, false);

    stopRotation();
});

mp.events.add("selectionLeft", () => {

    objectSelection -= 1;

    if (objectSelection < 0)
        objectSelection = objectsJson.objects.length - 1;

    spawnObject(objectsJson.objects[objectSelection].name);
    objectBrowser.execute("setPrice("+ objectsJson.objects[objectSelection].price + ");");

});


mp.events.add("selectionRight", () => {

    objectSelection += 1;

    if (objectSelection >= objectsJson.objects.length)
        objectSelection = 0;

    spawnObject(objectsJson.objects[objectSelection].name);
    objectBrowser.execute("setPrice("+ objectsJson.objects[objectSelection].price + ");");
    
});

function spawnObject(name: string) {

    if (mp.objects.exists(objectEntity))
        objectEntity.destroy();

    objectEntity = mp.objects.new(mp.game.joaat(name), cameraLookAt, {
        rotation: new mp.Vector3(0, 0, 0)
    })

    objectEntity.placeOnGroundProperly();

    startRotation();

}

function startRotation() {

    stopRotation();

    var objectRotation: number = 0;

    objectRotationTimer = setInterval(() => {

        if (objectRotation >= 360)
            objectRotation = 0;

        objectRotation += 1;

        if (mp.objects.exists(objectEntity))
            objectEntity.setRotation(0, 0, objectRotation, 2, true);

    }, 10);
}

function stopRotation() {
    if (objectRotationTimer == undefined)
        return false;

    clearInterval(objectRotationTimer);
    objectRotationTimer = undefined;
}
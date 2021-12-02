
var tuningVehicle: VehicleMp;
var tuningRotationTimer: any;
var tuningBrowser: BrowserMp;
var tuningPartsBefore: any;
var allCosts = 0;

enum VehicleParts {
    Spoilers = 0,
    FrontBumper = 1,
    ReadBumper = 2,
    SideSkirt = 3,
    Exhaust = 4,
    Frame = 5,
    Grille = 6,
    Hood = 7,
    LeftFender = 8,
    RightFender = 9,
    Roof = 10,
    PlateHolder = 25,
    Window = 46,
    Wheels = 23,
    Xenon = 22,
    Engine = 11,
    Brakes = 12,
    Transmission = 13,
    Suspension = 15,
    Turbo = 18
};


mp.keys.bind(0x45, true, () => {
    if (!mp.gui.chat.enabled) {
        mp.events.callRemote("server:TuningRequest");
    }
});

mp.events.add("client:StartTuning", (vehicleHash: string, tunedParts: string) => {

    tuningPartsBefore = JSON.parse(tunedParts);

    if (!mp.game.streaming.isIplActive("imp_sm_13_modgarage"))
        mp.game.streaming.requestIpl("imp_sm_13_modgarage");

    if (!mp.browsers.exists(tuningBrowser))
        tuningBrowser = mp.browsers.new("package://web/tuning/tuning.html");

    if (!mp.vehicles.exists(tuningVehicle)) {
        tuningVehicle = mp.vehicles.new(parseInt(vehicleHash), new mp.Vector3(-1579.9659423828125, -577.3146362304688, 104.46545715332031), { numberPlate: "P3N1S" });
        tuningVehicle.dimension = mp.players.local.dimension;
        tuningVehicle.setHeading(260);
    }

    mp.players.local.freezePosition(true);
    mp.players.local.setCoords(-1582.314453125, -571.3085327148438, 103.9250, false, false, false, false);
    mp.players.local.setHeading(215);

    mp.players.local.taskPlayAnim("missfbi_s4mop", "guard_idle_a", 1.6, 1.6, 1.6, 3, 1, false, false, false);

    CameraEditor.createCamera("Tuning", new mp.Vector3(-1574.1397705078125, -578.0684814453125, 106.40015716552734));
    CameraEditor.setCameraLookAt("Tuning", new mp.Vector3(-1579.4993896484375, -575.5031127929688, 105.02600860595703));
    CameraEditor.setCameraActive("Tuning");

    mp.game.ui.displayRadar(false);
    mp.gui.cursor.show(true, true);
    mp.gui.chat.show(false);

    var partsApplied = JSON.parse(tunedParts);

    var Stocks = {
        spoilers: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Spoilers), partsApplied.spoiler],
        frontbumpers: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.FrontBumper), partsApplied.frontbumper],
        rearbumpers: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.ReadBumper), partsApplied.rearbumper],
        sideskirts: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.SideSkirt), partsApplied.sideskirt],
        exhaust: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Exhaust), partsApplied.exhaust],
        frame: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Frame), partsApplied.frame],
        grille: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Grille), partsApplied.grille],
        hood: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Hood), partsApplied.hood],
        leftfender: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.LeftFender), partsApplied.leftfender],
        rightfender: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.RightFender), 0],
        roof: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Roof), partsApplied.roof],
        windows: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Window), partsApplied.window],
        wheels: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Wheels), partsApplied.wheel],
        wheeltype: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_VEHICLE_WHEEL_TYPE, tuningVehicle.handle), partsApplied.wheeltype],
        xenons: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Xenon), partsApplied.xenon],
        neon: [0, partsApplied.neon],
        neonred: [0, partsApplied.neonred],
        neongreen: [0, partsApplied.neongreen],
        neonblue: [0, partsApplied.neonblue],
        colorred: [0, partsApplied.colorr],
        colorgreen: [0, partsApplied.colorg],
        colorblue: [0, partsApplied.colorb],
        wheelcolor: [0, partsApplied.wheelcolor],
        numberplate: [0, partsApplied.numberplate],

        engine: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Engine), partsApplied.engine],
        brake: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Brakes), partsApplied.brake],
        transmission: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Transmission), partsApplied.transmission],
        suspension: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Suspension), partsApplied.suspension],
        turbo: [mp.game.invoke(RageEnums.Natives.Vehicle.GET_NUM_VEHICLE_MODS, tuningVehicle.handle, VehicleParts.Turbo), partsApplied.turbo]
    };

    tuningBrowser.execute("fillStocks('" + JSON.stringify(Stocks) + "');");

});

mp.events.add("client:ExitTuning", () => {

    if (mp.browsers.exists(tuningBrowser))
        tuningBrowser.destroy();

    mp.gui.chat.show(true);
    mp.gui.cursor.show(false, false);
    mp.game.ui.displayRadar(true);

    CameraEditor.destroyCamera("Tuning");

    if (mp.vehicles.exists(tuningVehicle))
        tuningVehicle.destroy();

    mp.players.local.freezePosition(false);

});

mp.events.add("client:TuningChoosenParts", (jsonParts: string) => {

    if (mp.vehicles.exists(tuningVehicle)) {

        var choosenParts = JSON.parse(jsonParts);

        tuningVehicle.setEngineOn(true, true, true);
        tuningVehicle.setLights(2);

        tuningVehicle.setMod(VehicleParts.Spoilers, parseInt(choosenParts.spoiler));
        tuningVehicle.setMod(VehicleParts.FrontBumper, parseInt(choosenParts.frontbumper));
        tuningVehicle.setMod(VehicleParts.ReadBumper, parseInt(choosenParts.rearbumper));
        tuningVehicle.setMod(VehicleParts.SideSkirt, parseInt(choosenParts.sideskirt));
        tuningVehicle.setMod(VehicleParts.Exhaust, parseInt(choosenParts.exhaust));
        tuningVehicle.setMod(VehicleParts.Frame, parseInt(choosenParts.frame));
        tuningVehicle.setMod(VehicleParts.Grille, parseInt(choosenParts.grille));
        tuningVehicle.setMod(VehicleParts.Hood, parseInt(choosenParts.hood));
        tuningVehicle.setMod(VehicleParts.LeftFender, parseInt(choosenParts.leftfender));
        tuningVehicle.setMod(VehicleParts.Roof, parseInt(choosenParts.roof));
        tuningVehicle.setMod(VehicleParts.Xenon, parseInt(choosenParts.xenon));
        tuningVehicle.setMod(VehicleParts.Wheels, parseInt(choosenParts.wheel));

        tuningVehicle.setWheelType(parseInt(choosenParts.wheeltype));
        tuningVehicle.setNumberPlateTextIndex(parseInt(choosenParts.numberplate));
        tuningVehicle.setWindowTint(parseInt(choosenParts.window));

        mp.game.invoke(RageEnums.Natives.Vehicle.SET_VEHICLE_EXTRA_COLOURS, tuningVehicle.handle, 0, parseInt(choosenParts.wheelcolor));
        mp.game.invoke(RageEnums.Natives.Vehicle.SET_VEHICLE_CUSTOM_PRIMARY_COLOUR, tuningVehicle.handle, parseInt(choosenParts.colorr), parseInt(choosenParts.colorg), parseInt(choosenParts.colorb));
        mp.game.invoke(RageEnums.Natives.Vehicle.SET_VEHICLE_CUSTOM_SECONDARY_COLOUR, tuningVehicle.handle, parseInt(choosenParts.colorr), parseInt(choosenParts.colorg), parseInt(choosenParts.colorb));

        if (parseInt(choosenParts.neon) > 0) {
            tuningVehicle.setNeonLightEnabled(0, true);
            tuningVehicle.setNeonLightEnabled(1, true);
            tuningVehicle.setNeonLightEnabled(2, true);
            tuningVehicle.setNeonLightEnabled(3, true);
        }
        else {
            tuningVehicle.setNeonLightEnabled(0, false);
            tuningVehicle.setNeonLightEnabled(1, false);
            tuningVehicle.setNeonLightEnabled(2, false);
            tuningVehicle.setNeonLightEnabled(3, false);
        }

        tuningVehicle.setNeonLightsColour(parseInt(choosenParts.neonred), parseInt(choosenParts.neongreen), parseInt(choosenParts.neonblue));

        tuningVehicle.setMod(VehicleParts.Engine, parseInt(choosenParts.engine));
        tuningVehicle.setMod(VehicleParts.Brakes, parseInt(choosenParts.brake));
        tuningVehicle.setMod(VehicleParts.Transmission, parseInt(choosenParts.transmission));
        tuningVehicle.setMod(VehicleParts.Suspension, parseInt(choosenParts.suspension));
        tuningVehicle.setMod(VehicleParts.Turbo, parseInt(choosenParts.turbo));

        allCosts = 0;

        if (tuningPartsBefore.spoiler != choosenParts.spoiler && choosenParts.spoiler != -1)
            allCosts += 100;

        if (tuningPartsBefore.frontbumper != choosenParts.frontbumper && choosenParts.frontbumper != -1)
            allCosts += 100;

        if (tuningPartsBefore.rearbumper != choosenParts.rearbumper && choosenParts.rearbumper != -1)
            allCosts += 100;

        if (tuningPartsBefore.sideskirt != choosenParts.sideskirt && choosenParts.sideskirt != -1)
            allCosts += 100;

        if (tuningPartsBefore.exhaust != choosenParts.exhaust && choosenParts.exhaust != -1)
            allCosts += 100;

        if (tuningPartsBefore.frame != choosenParts.frame && choosenParts.frame != -1)
            allCosts += 100;

        if (tuningPartsBefore.grille != choosenParts.grille && choosenParts.grille != -1)
            allCosts += 50;

        if (tuningPartsBefore.hood != choosenParts.hood && choosenParts.hood != -1)
            allCosts += 50;

        if (tuningPartsBefore.leftfender != choosenParts.leftfender && choosenParts.leftfender != -1)
            allCosts += 50;

        if (tuningPartsBefore.roof != choosenParts.roof && choosenParts.roof != -1)
            allCosts += 50;

        if (tuningPartsBefore.window != choosenParts.window && choosenParts.window != 0)
            allCosts += 50;

        if (tuningPartsBefore.wheel != choosenParts.wheel && choosenParts.wheel != -1)
            allCosts += 100;

        if (tuningPartsBefore.neon != choosenParts.neon && choosenParts.neon != 0)
            allCosts += 150;

        if (tuningPartsBefore.xenon != choosenParts.xenon && choosenParts.xenon != -1)
            allCosts += 50;

        if ((tuningPartsBefore.colorr != choosenParts.colorr) || (tuningPartsBefore.colorg != choosenParts.colorg) || (tuningPartsBefore.colorb != choosenParts.colorb))
            allCosts += 100;

        if (tuningPartsBefore.wheelcolor != choosenParts.wheelcolor && choosenParts.wheelcolor != -1)
            allCosts += 50;

        if (tuningPartsBefore.engine != choosenParts.engine && choosenParts.engine != 0)
            allCosts += 100;

        if (tuningPartsBefore.brake != choosenParts.brake && choosenParts.brake != 0)
            allCosts += 100;

        if (tuningPartsBefore.transmission != choosenParts.transmission && choosenParts.transmission != 0)
            allCosts += 100;

        if (tuningPartsBefore.suspension != choosenParts.suspension && choosenParts.suspension != -1)
            allCosts += 100;

        if (tuningPartsBefore.turbo != choosenParts.turbo && choosenParts.turbo != -1)
            allCosts += 100;

        if (mp.browsers.exists(tuningBrowser))
            tuningBrowser.execute("setCosts('" + allCosts + "');");
    }
});

mp.events.add("client:SendBuyTuning", (jsonParts) => {
    mp.events.callRemote("server:SetCarTuning", jsonParts, tuningVehicle.model.toString(), allCosts.toString())
    mp.events.call("client:ExitTuning");

});

mp.events.add("client:TuningSetRotation", (rotation) => {

    if (mp.vehicles.exists(tuningVehicle))
        tuningVehicle.setHeading(parseInt(rotation));

});


mp.keys.bind(0x45, true, () => {
    if (!mp.gui.chat.enabled)
        mp.events.callRemote("server:TryScrapMetal");
});

mp.events.add("client:TuningPlayerLoots", (x: number, y: number, z: number) => {

    mp.events.callRemote("server:TuningMessageZone", mp.game.zone.getNameOfZone(x, y, z));

});
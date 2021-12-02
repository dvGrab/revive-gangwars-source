
mp.keys.bind(0x45, true, () => {
    if(!mp.gui.chat.enabled)
    {
        mp.events.callRemote("server:CasinoReceiver");   
        mp.events.callRemote("server:CasinoBagpickup");
        mp.events.callRemote("server:CasinoHacking");
        mp.events.callRemote("server:CasinoRobbing"); 
        mp.events.callRemote("server:CasinoWarehouse");
        mp.events.callRemote("server:CasinoEnter");
    }
});


mp.events.add("client:CasinogetPerfectGroundPosition", (x : number, y :  number, z : number) => {

    var object = mp.objects.new(mp.game.joaat("p_ld_heist_bag_s_pro2_s"), new mp.Vector3(x, y, z));
    mp.events.callRemote("server:CasinoDropbag", object.position.x, object.position.y, object.position.z, object.getHeightAboveGround());
    object.destroy();

});

mp.events.add("client:CasinoAlarmState", (state: boolean) => {
    if(state)
        playCasinoAlarms();
    else
        stopCasinoAlarms();
});

var positions = [
    new mp.Vector3(1118.3133544921875, 224.06954956054688, -49.926570892333984),
    new mp.Vector3(1099.8621826171875, 227.9193878173828, -49.92387008666992),
    new mp.Vector3(1108.105712890625, 247.5836944580078, -50.94070816040039),
    new mp.Vector3(1152.832763671875, 258.091552734375, -51.9408073425293)
];


var soundIds: number[] = [];

function playCasinoAlarms() {

    while (!mp.game.audio.requestScriptAudioBank("Alarms", false)) {
        mp.game.audio.requestScriptAudioBank("Alarms", false);
        mp.game.wait(1);
    }

    stopCasinoAlarms();

    positions.forEach((element) => {
        var getSoundId = mp.game.invoke("0x430386FE9BF80B45");
        mp.game.audio.playSoundFromCoord(getSoundId, "Burglar_Bell", element.x, element.y, element.z, "Generic_Alarms", false, 0, false);
        soundIds.push(getSoundId);
    });

}

function stopCasinoAlarms() {

    soundIds.forEach((element: number) => {
        mp.game.audio.stopSound(element);
    });

    soundIds = [];

}

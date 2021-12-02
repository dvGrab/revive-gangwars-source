
mp.keys.bind(0x45, true, () => {
    if (!mp.gui.chat.enabled) {
        mp.events.callRemote("server:BankReceiver");
        mp.events.callRemote("server:BankBagpickup");
        mp.events.callRemote("server:BankHacking");
        mp.events.callRemote("server:BankRobbing");
        mp.events.callRemote("server:BankWarehouse");
    }
});


mp.events.add("client:getPerfectGroundPositionForBank", (x: number, y: number, z: number) => {

    var object = mp.objects.new(mp.game.joaat("p_ld_heist_bag_s_pro2_s"), new mp.Vector3(x, y, z));
    mp.events.callRemote("server:BankDropbag", object.position.x, object.position.y, object.position.z, object.getHeightAboveGround());
    object.destroy();

});

mp.events.add("client:BankAlarmState", (state: boolean) => {
    if(state)
        playBankAlarms();
    else
        stopBankAlarms();
});

var positions = [
    new mp.Vector3(259.6229553222656, 227.183837890625, 101.18330383300781),
    new mp.Vector3(249.86074829101562, 230.28170776367188, 105.78697967529297),
    new mp.Vector3(244.79103088378906, 209.4702606201172, 106.76683807373047),
    new mp.Vector3(260.870361328125, 213.4257354736328, 105.78324127197266),
    new mp.Vector3(265.9501037597656, 218.14749145507812, 109.78300476074219),
    new mp.Vector3(268.68963623046875, 224.0506134033203, 102.9832534790039)
];

var soundIds: number[] = [];

function playBankAlarms() {

    while (!mp.game.audio.requestScriptAudioBank("Alarms", false)) {
        mp.game.audio.requestScriptAudioBank("Alarms", false);
        mp.game.wait(1);
    }

    stopBankAlarms();

    positions.forEach((element) => {
        var getSoundId = mp.game.invoke("0x430386FE9BF80B45");
        mp.game.audio.playSoundFromCoord(getSoundId, "Burglar_Bell", element.x, element.y, element.z, "Generic_Alarms", false, 0, false);
        soundIds.push(getSoundId);
    });

}

function stopBankAlarms() {

    soundIds.forEach((element: number) => {
        mp.game.audio.stopSound(element);
    });

    soundIds = [];

}

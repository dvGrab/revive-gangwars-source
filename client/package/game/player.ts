var cocainTimer: any = undefined;



interface playerStream extends PlayerMp {

    dildoObject: ObjectMp;

};

mp.events.add("entityStreamIn", (entity: playerStream) => {

    if (entity.type === "player") {
        var eyeColor = entity.getVariable("eyeColor");

        if (eyeColor !== undefined) {
            entity.setEyeColor(eyeColor);
        }
    }
});

mp.events.add("setLocalEyeColor", () => {

    var eyeColor = mp.players.local.getVariable("eyeColor");

    if (eyeColor !== undefined)
        mp.players.local.setEyeColor(eyeColor);
});

mp.events.add("client:setCocainEffect", (delay: number) => {

    if (cocainTimer != undefined) {
        clearTimeout(cocainTimer);
        cocainTimer = undefined;
    }

    mp.game.invoke(RageEnums.Natives.Weapon.SET_PED_INFINITE_AMMO_CLIP, mp.players.local.handle, true);

    cocainTimer = setTimeout(() => {
        mp.game.invoke(RageEnums.Natives.Weapon.SET_PED_INFINITE_AMMO_CLIP, mp.players.local.handle, false);
    }, delay * 1000);

});

//Hehler
mp.peds.new(mp.game.joaat("s_m_y_blackops_01"), new mp.Vector3(-1566.7489013671875, -231.85153198242188, 48.43786621093788), 183);
mp.peds.new(mp.game.joaat("mp_m_fibsec_01"), new mp.Vector3(464.8822937011719, -984.5567626953125, 25.36532859802246), 132);
mp.peds.new(mp.game.joaat("s_m_y_construct_02"), new mp.Vector3(1709.0831298828125, -1610.1993408203125, 113.15935516357426), 147);


//Geldwäscher
mp.peds.new(mp.game.joaat("csb_anton"), new mp.Vector3(891.68603515625, -1582.1646728515625, 29.56107902526855), 316);
mp.peds.new(mp.game.joaat("s_m_m_ciasec_01"), new mp.Vector3(459.7052307128906, -989.27783203125, 25.014875030517578), 268);
mp.peds.new(mp.game.joaat("s_m_y_armymech_01"), new mp.Vector3(-1196.4100341796875, -508.17535400390625, 34.23944778), 316);

//Kopfgeld
mp.peds.new(mp.game.joaat("ig_clay"), new mp.Vector3(240.78990173339844, -1379.4595947265625, 33.241764068603516 + 0.45), 139);

//Waffendealer
mp.peds.new(mp.game.joaat("csb_chef2"), new mp.Vector3(878.9805908203125, -191.0248260498047, 70.28143310546875 + 0.45), 150);

//Canabis   
mp.peds.new(mp.game.joaat("a_m_y_hippy_01"), new mp.Vector3(279.3948669433594, 958.7431640625, 210.69093322753906 + 0.45), 256);


//Dealer
mp.peds.new(mp.game.joaat("CSB_Agatha"), new mp.Vector3(-333.9362487792969, -90.81761932373047, 46.55352020263672 + 0.45), 71);

//Croupier
mp.peds.new(mp.game.joaat("CSB_TomCasino"), new mp.Vector3(-2078.809814453125, -1016.347900390625, 5.384132385253906 + 0.45), 238);



/*
Shops
*/
var shopPositions = [
    [-46.71303939819336, -1758, 28.921016693115234, 47],
    [24.341093063354492, -1346.992431640625, 28.99702262878418, 270],
    [-706.0280151367188, -913.848876953125, 18.71558952331543, 90],
    [-1152.2598876953125, -1423.8336181640625, 4.4544596672058105, 116],
    [-1221.7738037109375, -908.5302124023438, 11.826345443725586, 34],
    [-1486.2364501953125, -377.94842529296875, 39.66339874267578, 138],
    [372.4295959472656, 326.22552490234375, 103.06636810302734, 253],
    [1164.6885986328125, -322.6375732421875, 68.7050552368164, 99],
    [1134.2188720703125, -982.332275390625, 45.91585159301758, 280],
    [1324.350830078125, -1650.055908203125, 51.7750358581543, 131],
    [319.6524963378906, 180.94815063476562, 103.08650207519531, 249]

];

for (var i = 0; i < shopPositions.length; i++)
    mp.peds.new(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(shopPositions[i][0], shopPositions[i][1], shopPositions[i][2] + 0.45), shopPositions[i][3]);

//Robguy
mp.peds.new(mp.game.joaat("a_m_y_stwhi_01"), new mp.Vector3(-677.43505859375, -634.134521484375, 24.268283843994), 1);

mp.events.add(RageEnums.EventKey.ENTITY_STREAM_IN, (entity: EntityMp) => {

    if (entity.type != "player")
        return false;

    mp.events.callRemote("server:ResetPlayerHat", entity.remoteId);
});


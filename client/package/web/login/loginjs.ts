


let loginBrowser: BrowserMp;
let loginCamera: CameraMp;
var policeChatTimer = 0;
var rememberMe = false;
var playerLanguage: number = 0;
var mapsJson: any = undefined;
var mapSelector = 0;

var randomCams = [
    [new mp.Vector3(119.37530517578125, -2043.90576171875, 44.473995208740234), new mp.Vector3(105.4172134399414, -1930.493408203125, 20.327695846557617)],
    [new mp.Vector3(100.37039947509766, -1939.5537109375, 29.082921981811523), new mp.Vector3(95.80741882324219, -1881.3822021484375, 44.7579231262207)],
    [new mp.Vector3(134.31346130371094, -2228.36865234375, 64.30384826660156), new mp.Vector3(-239.92123413085938, -2402.97265625, 80.67296600341797)],
    [new mp.Vector3(36.56254577636719, -1731.833251953125, 64.66094970703125), new mp.Vector3(33.616424560546875, -1479.0216064453125, 53.00746536254883)],
    [new mp.Vector3(-759.7564086914062, -1512.606689453125, 18.391786575317383), new mp.Vector3(-959.5762329101562, -1607.982666015625, 7.66961669921875)],
    [new mp.Vector3(-1218.8885498046875, -1764.8515625, 2.5534448623657227), new mp.Vector3(-1298.8704833984375, -1751.515625, 1.4929099082946777)]
];

var randomSelection = [
    [-167.42262268066406, 487.7086486816406, 133.34381103515625, -166.8145751953125, 484.4495849609375, 133.34381103515625, 190],
    [-174.7694549560547, 493.271484375, 129.54367065429688, -172.49557495117188, 490.2634582519531, 129.54367065429688, 218],
    [-794.1213989257812, 325.5621032714844, 210.2966766357422, -792.7022094726562, 327.3668212890625, 210.2966766357422, 323]
];

/* 23.276342391967773 */  //lol
/* 23.276342391967773 */  //lol2
/* 23.276342391967773 */  //lol2
/* 23.276342391967773 */  //lol23
/* 23.276342391967773 */  //lollll2
/* 23.276342391967773 */  //lolll23


var policeChatters = [
    "LAMAR_1_POLICE_LOST",
    "SCRIPTED_SCANNER_REPORT_AH_3B_01",
    "SCRIPTED_SCANNER_REPORT_AH_MUGGING_01",
    "SCRIPTED_SCANNER_REPORT_AH_PREP_01",
    "SCRIPTED_SCANNER_REPORT_AH_PREP_02",
    "SCRIPTED_SCANNER_REPORT_ARMENIAN_1_01",
    "SCRIPTED_SCANNER_REPORT_ARMENIAN_1_02",
    "SCRIPTED_SCANNER_REPORT_ASS_BUS_01",
    "SCRIPTED_SCANNER_REPORT_ASS_MULTI_01",
    "SCRIPTED_SCANNER_REPORT_BARRY_3A_01",
    "SCRIPTED_SCANNER_REPORT_BS_2A_01",
    "SCRIPTED_SCANNER_REPORT_BS_2B_01",
    "SCRIPTED_SCANNER_REPORT_BS_2B_02",
    "SCRIPTED_SCANNER_REPORT_BS_2B_03",
    "SCRIPTED_SCANNER_REPORT_BS_2B_04",
    "SCRIPTED_SCANNER_REPORT_BS_PREP_A_01",
    "SCRIPTED_SCANNER_REPORT_BS_PREP_B_01",
    "SCRIPTED_SCANNER_REPORT_CAR_STEAL_2_01",
    "SCRIPTED_SCANNER_REPORT_CAR_STEAL_4_01",
    "SCRIPTED_SCANNER_REPORT_DH_PREP_1_01",
    "SCRIPTED_SCANNER_REPORT_FIB_1_01",
    "SCRIPTED_SCANNER_REPORT_FIN_C2_01",
    "SCRIPTED_SCANNER_REPORT_Franklin_2_01",
    "SCRIPTED_SCANNER_REPORT_FRANLIN_0_KIDNAP",
    "SCRIPTED_SCANNER_REPORT_GETAWAY_01",
    "SCRIPTED_SCANNER_REPORT_JOSH_3_01",
    "SCRIPTED_SCANNER_REPORT_JOSH_4_01",
    "SCRIPTED_SCANNER_REPORT_JSH_2A_01",
    "SCRIPTED_SCANNER_REPORT_JSH_2A_02",
    "SCRIPTED_SCANNER_REPORT_JSH_2A_03",
    "SCRIPTED_SCANNER_REPORT_JSH_2A_04",
    "SCRIPTED_SCANNER_REPORT_JSH_2A_05",
    "SCRIPTED_SCANNER_REPORT_JSH_PREP_1A_01",
    "SCRIPTED_SCANNER_REPORT_JSH_PREP_1B_01",
    "SCRIPTED_SCANNER_REPORT_JSH_PREP_2A_01",
    "SCRIPTED_SCANNER_REPORT_JSH_PREP_2A_02",
    "SCRIPTED_SCANNER_REPORT_LAMAR_1_01",
    "SCRIPTED_SCANNER_REPORT_MIC_AMANDA_01",
    "SCRIPTED_SCANNER_REPORT_NIGEL_1A_01",
    "SCRIPTED_SCANNER_REPORT_NIGEL_1D_01",
    "SCRIPTED_SCANNER_REPORT_PS_2A_01",
    "SCRIPTED_SCANNER_REPORT_PS_2A_02",
    "SCRIPTED_SCANNER_REPORT_PS_2A_03",
    "SCRIPTED_SCANNER_REPORT_SEC_TRUCK_01",
    "SCRIPTED_SCANNER_REPORT_SEC_TRUCK_02",
    "SCRIPTED_SCANNER_REPORT_SEC_TRUCK_03",
    "SCRIPTED_SCANNER_REPORT_SIMEON_01",
    "SCRIPTED_SCANNER_REPORT_Sol_3_01",
    "SCRIPTED_SCANNER_REPORT_Sol_3_02"];

mp.events.add("setUserLanguage", (language: number) => {

    playerLanguage = language;

    mp.events.callRemote("server:SetLanguage", language);
});

mp.events.add("createLogin", (page: number, jsonTeam: string = "") => {

    var randomCamIndex = Math.floor(Math.random() * randomCams.length);

    var camPos = randomCams[randomCamIndex][0];
    mp.players.local.setCoords(camPos.x, camPos.y, camPos.z - 4.0, false, false, false, false);
    mp.players.local.freezePosition(true);

    var referencedPosition = randomCams[randomCamIndex][1];

    CameraEditor.createCamera("LoginCamera", camPos);
    CameraEditor.setCameraLookAt("LoginCamera", new mp.Vector3(referencedPosition.x, referencedPosition.y, referencedPosition.z));
    CameraEditor.setCameraActive("LoginCamera");

    if (page == 0)
        loginBrowser = mp.browsers.new("package://web/login/login.html");
    else if (page == 1) {
        loginBrowser = mp.browsers.new("package://web/login/map.html");

        mapSelector = 0;

        teamSelector = 0;
        teamInfomation = JSON.parse(jsonTeam);

        setTimeout(() => {
            setTeamScreen(0);
            setMapSelection(0);
        }, 200);
    }

    mp.game.ui.displayRadar(false);

    setTimeout(() => {
        mp.gui.cursor.show(true, true);
        mp.gui.chat.activate(false);
        mp.gui.chat.show(false);
    }, 200);

    getRememberMeInformations();

});

mp.events.add("destroyLogin", () => {
    if (mp.browsers.exists(loginBrowser)) {
        loginBrowser.destroy();

        mp.gui.cursor.show(false, false);
        mp.gui.chat.activate(true);
        mp.gui.chat.show(true);

        mp.game.ui.displayRadar(true);

        CameraEditor.destroyCamera("LoginCamera");

        mp.players.local.freezePosition(false);
    }
});

mp.events.add("reloadLogin", () => {
    if (mp.browsers.exists(loginBrowser)) {
        loginBrowser.reload(true);
    }
});

mp.events.add("selectedGender", (gender) => {
    mp.events.callRemote("triggeredSelectedGender", gender);
});

mp.events.add("startCharacterCustomization", () => {
    if (mp.browsers.exists(loginBrowser)) {

        mp.events.callRemote("triggeredSelectedGender", false);

        mp.players.local.setCoords(402.44622802734375, -998.4176025390625, -100.040283203125, false, false, false, false);
        mp.players.local.setHeading(190);

        CameraEditor.setCameraPosition("LoginCamera", new mp.Vector3(402.8674621582031, -999.134521484375, -98.60411224365234));
        CameraEditor.setCameraLookAt("LoginCamera", new mp.Vector3(402.44622802734375, -998.4176025390625, -98.4040283203125));

        mp.players.local.clearTasksImmediately();

        loginBrowser.execute("window.location.href = 'package://web/login/customization.html';")

        setTimeout(() => {
            if (playerLanguage == 1)
                loginBrowser.execute("translateEnglish();");

            if (playerLanguage == 2)
                loginBrowser.execute("translateRussian();");
        }, 200);
    }
});

var customizationInfo: any = undefined;

mp.events.add("receiveCharacterInformation", (charInfo) => {

    customizationInfo = JSON.parse(charInfo);

    if (!customizationInfo) return false;

    mp.players.local.setHeadBlendData(customizationInfo.mother, customizationInfo.father, 0, customizationInfo.mother, customizationInfo.father, 0, customizationInfo.fatherblend, customizationInfo.motherblend, customizationInfo.blendmixture, true);

    mp.players.local.setHeading(customizationInfo.rotation);

    if (customizationInfo.faceblend)
        for (var i = 0; i < customizationInfo.faceblend.length; i++)
            mp.players.local.setFaceFeature(i, customizationInfo.faceblend[i]);

    if (customizationInfo.overlay)
        for (var i = 0; i < customizationInfo.overlay.length; i++)
            mp.players.local.setHeadOverlay(Number(i), Number(customizationInfo.overlay[i]), 1.0, 0.0, 0.0);

    mp.players.local.setComponentVariation(2, 2, 0, 2);
    mp.players.local.setHairColor(customizationInfo.haircolor, 0);
});

mp.events.add("acceptCustomizationChanged", () => {

    if (customizationInfo == undefined) return false;

    mp.events.callRemote("receiveCharaterOnServer", JSON.stringify(customizationInfo));

});

mp.events.add("receiveLoginEvents", (data: string) => {

    if (data) {
        if (rememberMe == true) {
            data = JSON.parse(data);
            mp.storage.data.auth = data;
            mp.storage.flush();
        }
    }

});

mp.events.add("removeRememberMeValue", () => {

    mp.storage.data.auth.username = "";
    mp.storage.data.auth.password = "";
    mp.storage.flush();
});

mp.events.add("getRememberMeValue", (status) => {
    rememberMe = status;
});

function getRememberMeInformations() {

    if (mp.storage.data.auth !== undefined) {
        if ((mp.storage.data.auth.username != undefined) && (mp.storage.data.auth.password != undefined)) {
            loginBrowser.execute("$('#inputUsername').val('" + mp.storage.data.auth.username + "');");
            loginBrowser.execute("$('#inputPassword').val('" + mp.storage.data.auth.password + "');");


            if (mp.storage.data.auth.username.length >= 3 && mp.storage.data.auth.password.length >= 3) {
                rememberMe = true;
                loginBrowser.execute("setRememberMeValue('" + rememberMe + "');");
            }
        }
    }
}

mp.events.add("receiveErrorNotify", (text: string, title: string) => {
    if (mp.browsers.exists(loginBrowser)) {
        loginBrowser.execute('notifyalert("' + text + '", "' + title + '");');
    }
});

mp.events.add("receiveSuccessNotify", (text: string, title: string) => {
    if (mp.browsers.exists(loginBrowser)) {
        loginBrowser.execute('notifysuccess("' + text + '", "' + title + '");');
    }
});

mp.events.add("sendLoginToServer", (username, password) => {

    var isAutoLogin = false;

    if (mp.storage.data.auth !== undefined) {
        if (mp.storage.data.auth.username !== undefined && mp.storage.data.auth.password !== undefined)
            if ((mp.storage.data.auth.username == username) && (mp.storage.data.auth.password == password))
                isAutoLogin = true;
    }

    mp.events.callRemote("sendLoginInfoToServer", username, password, isAutoLogin, rememberMe);
});

mp.events.add("sendRegisterToServer", (username, password, passwordsecond, mail) => {
    mp.events.callRemote("sendRegisterInfoToServer", username, password, passwordsecond, mail);
});

mp.events.add("sendResetToServer", (mail) => {
    mp.events.callRemote("Server:ResetPassword", mail);
});

var modelData: any, selectionIndex: number = 0;

mp.events.add("startCharacterSelection", (Data: string, charCreator: boolean = false) => {

    if (mp.browsers.exists(loginBrowser)) {
        if (Data)
            modelData = JSON.parse(Data);

        mp.players.local.setCoords(-175.29458618164062, 492.7996826171875, 130.04368591308594, false, false, false, false);
        mp.players.local.setHeading(243);

        CameraEditor.setCameraPosition("LoginCamera", new mp.Vector3(-172.4519805908203, 491.34033203125, 131.54368591308594));
        CameraEditor.setCameraLookAt("LoginCamera", new mp.Vector3(-175.29458618164062, 492.7996826171875, 130.04368591308594));

        mp.events.callRemote("clothesLoaded");

        mp.players.local.clearTasksImmediately();

        if (!charCreator) {
            loginBrowser.execute("window.location.href = 'package://web/login/character.html';");
        }
        else {
            loginBrowser.execute("window.location.href = 'package://web/login/character.html';");
        }

        setTimeout(() => {
            if (playerLanguage == 1)
                loginBrowser.execute("translateEnglish();");

            if (playerLanguage == 2)
                loginBrowser.execute("translateRussian();");
        }, 200);
    }

});

mp.events.add(RageEnums.EventKey.RENDER, () => {

    mp.game.graphics.drawSpotLight(401.626953125, -1001.8388671875, -98.5,
        402.44622802734375, -998.4176025390625, -100.040283203125, 255, 255, 255, 5, 3, 20, 30, 0);

});

mp.events.add({

    "selectionAgree": () => {
        mp.events.callRemote("sendModelSelectionToServer", modelData.model[selectionIndex]);
        selectionIndex = 0;
    }

});

mp.events.add("triggeredLeftHead", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesHeadLeft");

});

mp.events.add("triggeredRightHead", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesHeadRight");

});

mp.events.add("triggeredLeftTorso", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesTorsoLeft");

});

mp.events.add("triggeredRightTorso", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesTorsoRight");

});

mp.events.add("triggeredLeftLegs", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesLegsLeft");

});

mp.events.add("triggeredRightLegs", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesLegsRight");

});

mp.events.add("triggeredLeftFoots", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesFootsLeft");

});

mp.events.add("triggeredRightFoots", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesFootsRight");

});

mp.events.add("triggeredLeftBandana", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesBandanaLeft");

});

mp.events.add("triggeredRightBandana", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesBandanaRight");

});

mp.events.add("triggeredLeftAccess", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesAccessLeft");

});

mp.events.add("triggeredRightAccess", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesAccessRight");

});

mp.events.add("triggeredRightHat", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesHatRight");

});

mp.events.add("triggeredLeftHat", () => {

    if (mp.browsers.exists(loginBrowser))
        mp.events.callRemote("clothesHatLeft");

});


var teamInfomation: any = undefined;
var teamSelector = 0;

mp.events.add("startTeamSelection", (info) => {
    if (mp.browsers.exists(loginBrowser)) {

        teamInfomation = JSON.parse(info);

        loginBrowser.execute("window.location.href = 'package://web/login/team.html';");

        setTimeout(() => {
            setTeamScreen(0);

            if (playerLanguage == 1)
                loginBrowser.execute("translateEnglish();");

            if (playerLanguage == 2)
                loginBrowser.execute("translateRussian();");

        }, 200);

    }
});

mp.events.add("selectedTeamLeft", () => {

    if (!mp.browsers.exists(loginBrowser)) return false;

    if (teamInfomation == undefined) return false;

    teamSelector--;

    if (teamSelector <= -1)
        teamSelector = teamInfomation.teams.length - 1;

    setTeamScreen(teamSelector);

});

mp.events.add("selectedTeamRight", () => {

    if (!mp.browsers.exists(loginBrowser)) return false;

    if (teamInfomation == undefined) return false;

    teamSelector++;

    if (teamSelector >= teamInfomation.teams.length)
        teamSelector = 0;

    setTeamScreen(teamSelector);
});


mp.events.add("sendTeamInfoToServer", (houseSpawn: boolean) => {
    mp.events.callRemote("sendTeamSelectionToServer", teamSelector, houseSpawn);
});

function setTeamScreen(selector: number) {

    loginBrowser.execute("setTeamInformation('" + JSON.stringify(teamInfomation) + "', " + selector + ");")

    mp.events.callRemote("sendTeamCount", selector);

    switch (selector) {
        case 0:
            {
                CameraEditor.setCameraInterpolate("LoginCamera", new mp.Vector3(73.05327606201172, -1902.107666015625, 35.3498420715332),
                    new mp.Vector3(104.32133483886719, -1945.24267578125, 20.207113265991215), 2000);

                mp.players.local.setCoords(73.05327606201172, -1902.107666015625, 40.349842071533, false, false, false, false);

                break;
            }
        case 1:
            {
                CameraEditor.setCameraInterpolate("LoginCamera", new mp.Vector3(-71.64104461669922, -1516.4285888671875, 62.24583435058594),
                    new mp.Vector3(-11.752050399780273, -1460.39892578125, 29.9573917388915), 2000);
                mp.players.local.setCoords(-71.64104461669922, -1516.4285888671875, 65.24583435058594, false, false, false, false);

                break;
            }
        case 2:
            {
                CameraEditor.setCameraInterpolate("LoginCamera", new mp.Vector3(502.24169921875, -1818.736083984375, 45.285545349121094),
                    new mp.Vector3(503.38427734375, -1729.702392578125, 28.6455669403076178), 2000);

                mp.players.local.setCoords(502.24169921875, -1818.736083984375, 47.2855453491210945, false, false, false, false);

                break;
            }
        case 3:
            {
                CameraEditor.setCameraInterpolate("LoginCamera", new mp.Vector3(1303.915771484375, -1563.899169921875, 63.56208038330078),
                    new mp.Vector3(1247.318359375, -1602.58056640625, 52.378028869628906), 2000);

                mp.players.local.setCoords(1303.915771484375, -1563.899169921875, 61.56208038330078, false, false, false, false);
                break;
            }
        case 4:
            {
                CameraEditor.setCameraInterpolate("LoginCamera", new mp.Vector3(386.2198181152344, -385.267578125, 71.89501953125),
                    new mp.Vector3(393.3639831542969, -343.91937255859375, 46.203285217285156), 2000);

                mp.players.local.setCoords(386.2198181152344, -385.267578125, 73.89501953125, false, false, false, false);

                break;
            }
        case 5:
            {
                CameraEditor.setCameraInterpolate("LoginCamera", new mp.Vector3(740.3040771484375, -2095.729736328125, 52.91462326049805),
                    new mp.Vector3(825.866943359375, -2137.009521484375, 28.652408599853516), 2000);

                mp.players.local.setCoords(825.866943359375, -2137.009521484375, 28.652408599853516, false, false, false, false);

                break;
            }
    }

}

mp.events.add("client:startMapSelection", (maps: string) => {

    if (!mp.browsers.exists(loginBrowser))
        return false;

    loginBrowser.execute("window.location.href = 'package://web/login/map.html'");

    if (mapsJson != undefined)
        return false;

    mapSelector = 0;

    mapsJson = JSON.parse(maps);

    CameraEditor.setCameraLookAt("LoginCamera", new mp.Vector3(mapsJson.maps[0].camLookX, mapsJson.maps[0].camLookY, mapsJson.maps[0].camLookZ));

    setTimeout(() => {
        setMapSelection(0);
    }, 250);
});

mp.events.add("client:mapSelectLeft", () => {

    mapSelector--;

    if (mapSelector < 0)
        mapSelector = mapsJson.maps.length - 1;

    setMapSelection(mapSelector);
});

mp.events.add("client:mapSelectRight", () => {

    mapSelector++;

    if (mapSelector > (mapsJson.maps.length - 1))
        mapSelector = 0;

    setMapSelection(mapSelector);

});

mp.events.add("client:mapAccept", () => {

    if (!mp.browsers.exists(loginBrowser))
        return false;

    mp.events.callRemote("server:acceptMap", mapSelector);

});

function setMapSelection(selector: number) {
    if (mapsJson == undefined)
        return false;

    if (!mp.browsers.exists(loginBrowser))
        return false;

    var Info = mapsJson.maps[selector];

    loginBrowser.execute("setMapName('" + mapsJson.maps[selector].name + "');")

    CameraEditor.setCameraInterpolate("LoginCamera",
        new mp.Vector3(Info.camPosX, Info.camPosY, Info.camPosZ),
        new mp.Vector3(Info.camLookX, Info.camLookY, Info.camLookZ), 2500);
}
import { Player } from "../account/player";
import { database } from "../database/manager";
import { Characters } from "../database/entities/characters";
import { TeamModels } from "./models";
import { Showdown } from "../showdown/showdown";
import { getMembers } from "..";
import { overlayError } from "../utils/utils";
import { Teams } from "./team";
import { Paintball } from "../system/paintball";

export function jsonFromCharacterCustomization(player: Player): string {
    var Info = player.character;
    var charInfo: any = [];
    var charOverlay = [];
    var hairColor = 0;

    var faceblend = [];
    faceblend[0] = Info.nose_width;
    faceblend[1] = Info.nose_height;
    faceblend[2] = Info.nose_length;
    faceblend[3] = Info.nose_bridge;;
    faceblend[4] = Info.nose_tip;
    faceblend[5] = Info.nose_shift;

    faceblend[6] = Info.brow_height;
    faceblend[7] = Info.brow_width;

    faceblend[8] = Info.check_height;
    faceblend[9] = Info.check_width;
    faceblend[10] = Info.checks_width;

    faceblend[11] = Info.eyes;
    faceblend[12] = Info.lips;

    faceblend[13] = Info.jaw_width;
    faceblend[14] = Info.jaw_width;

    faceblend[15] = Info.chin_length;
    faceblend[16] = Info.chin_position;
    faceblend[17] = Info.chin_width;
    faceblend[18] = Info.chin_shape;
    faceblend[19] = Info.neck;

    charOverlay[0] = Info.blemishes;
    charOverlay[1] = Info.facialhair;
    charOverlay[2] = Info.eyebrows;
    charOverlay[3] = Info.ageing;
    charOverlay[4] = Info.makeup;
    charOverlay[5] = Info.blush;
    charOverlay[6] = Info.complexion;
    charOverlay[7] = Info.sundamage;
    charOverlay[8] = Info.lipstick;
    charOverlay[9] = Info.holes;
    charOverlay[10] = Info.bodyhair;

    hairColor = Info.haircolor;

    charInfo = JSON.stringify({
        gender: player.character.gender,
        father: player.character.father,
        mother: player.character.mother,
        fatherblend: player.character.fatherblend,
        motherblend: player.character.motherblend,
        blendmixture: player.character.mixture,
        faceblend: faceblend,
        overlay: charOverlay,
        haircolor: hairColor
    });

    return charInfo;
}

function saveCharacterCustomization(player: Player, Info: any) {

    database.then(connection => {

        connection.getRepository(Characters).findOne({ where: { name: player.name } }).then((element: Characters) => {

            if (!mp.players.exists(player)) return false;

            if (element)
                var playerChar = element;
            else
                var playerChar = new Characters();

            Info = JSON.parse(Info);

            playerChar.name = player.name;
            playerChar.gender = Info.gender;
            playerChar.father = Info.father;
            playerChar.mother = Info.mother;
            playerChar.fatherblend = Info.fatherblend;
            playerChar.motherblend = Info.motherblend;
            playerChar.mixture = Info.mixture;

            playerChar.nose_width = Info.faceblend[0];
            playerChar.nose_height = Info.faceblend[1];
            playerChar.nose_length = Info.faceblend[2];
            playerChar.nose_bridge = Info.faceblend[3];
            playerChar.nose_tip = Info.faceblend[4];
            playerChar.nose_shift = Info.faceblend[5];

            playerChar.brow_height = Info.faceblend[6];
            playerChar.brow_width = Info.faceblend[7];

            playerChar.check_height = Info.faceblend[8];
            playerChar.check_width = Info.faceblend[9];
            playerChar.checks_width = Info.faceblend[10];

            playerChar.eyes = Info.faceblend[11];
            playerChar.lips = Info.faceblend[12];

            playerChar.jaw_height = Info.faceblend[13];
            playerChar.jaw_width = Info.faceblend[14];

            playerChar.chin_length = Info.faceblend[15];
            playerChar.chin_position = Info.faceblend[16];
            playerChar.chin_width = Info.faceblend[17];
            playerChar.chin_shape = Info.faceblend[18];
            playerChar.neck = Info.faceblend[19];

            playerChar.blemishes = Info.overlay[0];
            playerChar.facialhair = Info.overlay[1];
            playerChar.eyebrows = Info.overlay[2];
            playerChar.ageing = Info.overlay[3];
            playerChar.makeup = Info.overlay[4];
            playerChar.blush = Info.overlay[5];
            playerChar.complexion = Info.overlay[6];
            playerChar.sundamage = Info.overlay[7];
            playerChar.lipstick = Info.overlay[8];
            playerChar.holes = Info.overlay[9];
            playerChar.bodyhair = Info.overlay[10];

            playerChar.haircolor = Info.haircolor;

            if (!mp.players.exists(player)) return false;

            connection.getRepository(Characters).save(playerChar);

            player.character = playerChar;


        });

    });
}

export function setCharacterCustomization(player: Player, Info: any) {
    if (!Info) return player.outputChatBox("Cannot set character customization.");

    Info = JSON.parse(Info);

    player.character.gender = Info.gender;

    player.setCustomization(Info.gender, Info.mother, Info.father, 0, Info.mother, Info.father, 0, Info.fatherblend, Info.motherblend, Info.blendmixture, 0, 0, 0, [0]);

    if (Info.faceblend)
        for (var i = 0; i < Info.faceblend.length; i++)
            player.setFaceFeature(i, Info.faceblend[i]);

    if (Info.overlay)
        for (var i = 0; i < Info.overlay.length; i++)
            player.setHeadOverlay(Number(i), [Number(Info.overlay[i]), 1.0, 0.0, 0.0]);

    if (Info.haircolor)
        player.setHairColor(Info.haircolor, 0);
}

mp.events.add("receiveCharaterOnServer", (player: Player, info: string) => {

    saveCharacterCustomization(player, info);
    setCharacterCustomization(player, info);
    player.call("startCharacterSelection", [TeamModels.getTeamModelsAsJSON(player.team), true]);
});

mp.events.addCommand("reset", (player: Player, fullText: string) => {

    if(Paintball.isPlayerIn(player))
        return false;

    if (!player.isLoggedIn) return false;

    database.then(connection => {

        connection.getRepository(Characters).findOne({ where: { name: player.name } }).then((element: Characters) => {

            if (element) {
                connection.getRepository(Characters).remove(element);

                if (Showdown.isCurrentlyStolen())
                    return overlayError(player, "Du kannst während eines Showdowns (Truck) kein Team wechseln.", "Fehler");

                player.team = -1;
                player.dimension = Math.floor((Math.random() * 99) + 1);
                player.call("createLogin", [1, Teams.getTeamsAsJson()]);
                player.isCustomizing = true;
            }

        });
    });


});
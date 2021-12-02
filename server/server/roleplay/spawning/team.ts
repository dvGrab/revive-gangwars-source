import { Player } from "../account/player";
import { AfkPlayer } from "../system/afk";
import { MapSpawns } from "../system/map";


class ColorRGB {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

export const enum TeamIds {
    Unknown = -1,
    Grove = 0,
    Ballas = 1,
    Vagos = 2,
    Bloods = 3,
    Hitman = 4,
    RealVagos = 5,
    LSPD = 99,
    LostMC = 777
}

class spawnHelper {
    team: number;
    position: Vector3Mp;
    rotation: number;
    mapIndex: number;

    constructor(team: number, position: Vector3Mp, rotation: number, mapIndex: number) {
        this.team = team;
        this.position = position;
        this.rotation = rotation;
        this.mapIndex = mapIndex;
    }
}

export class teamHelper {

    id: number;
    name: string;
    blip: BlipMp;
    color: number;
    hexcolor: string;
    rgb: ColorRGB;
    secondrgb: ColorRGB;
    amount: number;

    constructor(id: number, name: string, color: number, hexcolor: string, rgb: ColorRGB, secondrgb: ColorRGB) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.hexcolor = hexcolor;
        this.rgb = rgb;
        this.secondrgb = secondrgb;
    }
}

class Team {
    private count: number = 0;
    teams: any = [];
    spawns: any = [];

    createTeam(name: string, color: number, hexcolor: string, rgb: ColorRGB, secondrgb: ColorRGB = new ColorRGB(0, 0, 0, 255)) {
        this.teams.push(new teamHelper(this.count, name, color, hexcolor, rgb, secondrgb));
        this.count++;
        // mp.blips.new(84, position, { color: color, name: name, shortRange: true});
    }

    getTeamColorNumber(team: number): number {

        var returnValue: any;

        this.teams.forEach((element: teamHelper) => {

            if (element.id != team) return false;

            returnValue = element.color;

        });

        return returnValue;
    }

    getTeamName(team: number): string {
        var returnValue: string = "";

        this.teams.forEach((element: teamHelper) => {

            if (element.id != team) return false;

            returnValue = element.name;

        });

        return returnValue;
    }

    getTeamHexColor(team: number): string {
        var returnValue: string = "";

        this.teams.forEach((element: teamHelper) => {

            if (element.id != team) return false;

            returnValue = element.hexcolor;

        });

        return returnValue;
    }

    getTeamRGBColor(team: number): ColorRGB {
        var returnValue: any;

        this.teams.forEach((element: teamHelper) => {

            if (element.id != team) return false;

            returnValue = element.rgb

        });

        return returnValue;
    }

    getTeamRGBColorSecond(team: number): ColorRGB {
        var returnValue: any;

        this.teams.forEach((element: teamHelper) => {

            if (element.id != team) return false;

            returnValue = element.secondrgb

        });

        return returnValue;
    }

    addTeamSpawn(team: number, position: Vector3Mp, rotation: number, mapIndex: number) {
        this.spawns.push(new spawnHelper(team, position, rotation, mapIndex));
    }

    getRandomTeamSpawn(team: number, mapIndex: number): any {
        var spawnPositions: any = [], spawnRotation: any = [];

        this.spawns.forEach((element: spawnHelper) => {
            if (element.team != team) return false;

            if (element.mapIndex != mapIndex)
                return false;

            spawnPositions.push(element.position);
            spawnRotation.push(element.rotation);
        });

        var random = Math.floor(Math.random() * spawnPositions.length);
        var spawnInfo = { position: spawnPositions[random], rotation: spawnRotation[random] };

        return spawnInfo;
    }

    setTeamAmount() {
        this.teams.forEach((element: teamHelper) => {

            element.amount = this.getTeamAmount(element.id);

        });
    }

    getTeamAmount(team: number): number {
        var returnValue = 0;

        mp.players.forEach((element: AfkPlayer) => {
            if (!element.isLoggedIn) return false;

            if (element.team < 0) return false;

            if (element.team != team) return false;

            if (element.isAfk)
                return false;

            returnValue++;
        })

        return returnValue;
    }

    getTeamsAsJson(): string {
        this.setTeamAmount();
        var jsonTeams = { teams: this.teams };
        return JSON.stringify(jsonTeams);
    }

}

export var Teams = new Team();

Teams.createTeam("Grove Street", 52, "#008718", new ColorRGB(0, 110, 24, 255), new ColorRGB(0, 110, 24, 255));

//Los Santos
Teams.addTeamSpawn(TeamIds.Grove, new mp.Vector3(111.71829986572266, -1959.8944091796875, 20.915510177612305), 20.0, MapSpawns.LOS_SANTOS);
Teams.addTeamSpawn(TeamIds.Grove, new mp.Vector3(85.17449951171875, -1958.3043212890625, 21.12168312072754), 320.0, MapSpawns.LOS_SANTOS);
Teams.addTeamSpawn(TeamIds.Grove, new mp.Vector3(77.8429946899414, -1947.92138671875, 21.174135208129883), 320.0, MapSpawns.LOS_SANTOS);
Teams.addTeamSpawn(TeamIds.Grove, new mp.Vector3(99.77593231201172, -1913.363037109375, 21.02804183959961), 150.0, MapSpawns.LOS_SANTOS);
Teams.addTeamSpawn(TeamIds.Grove, new mp.Vector3(125.13746643066406, -1929.5555419921875, 21.382524490356445), 110.0, MapSpawns.LOS_SANTOS);

Teams.createTeam("Ballas", 7, "#800087", new ColorRGB(70, 0, 100, 255), new ColorRGB(70, 0, 100, 255));
Teams.addTeamSpawn(TeamIds.Ballas, new mp.Vector3(-14.120779991149902, -1445.168701171875, 30.64639663696289), 180.0, 0);
Teams.addTeamSpawn(TeamIds.Ballas, new mp.Vector3(-34.607765197753906, -1447.51953125, 31.49350357055664), 140.0, 0);
Teams.addTeamSpawn(TeamIds.Ballas, new mp.Vector3(-46.78379440307617, -1447.3499755859375, 32.42963409423828), 120.0, 0);
Teams.addTeamSpawn(TeamIds.Ballas, new mp.Vector3(-63.55593490600586, -1451.8297119140625, 32.12368392944336), 195.0, 0);
Teams.addTeamSpawn(TeamIds.Ballas, new mp.Vector3(15.673225402832031, -1445.934326171875, 30.541540145874023), 155.0, 0);

Teams.createTeam("Crips", 63, "#403dff", new ColorRGB(0, 0, 200, 255), new ColorRGB(0, 0, 200, 255));
Teams.addTeamSpawn(TeamIds.Vagos, new mp.Vector3(487.4174499511719, -1825.2200927734375, 27.830615997314453), 81.0, 0);
Teams.addTeamSpawn(TeamIds.Vagos, new mp.Vector3(495.7442932128906, -1815.20263671875, 28.000547409057617), 61.0, 0);
Teams.addTeamSpawn(TeamIds.Vagos, new mp.Vector3(475.0993347167969, -1775.5712890625, 28.1939258575439456275), 229.0, 0);
Teams.addTeamSpawn(TeamIds.Vagos, new mp.Vector3(480.34100341796875, -1741.2562255859375, 28.4770622253417983), 229.0, 0);
Teams.addTeamSpawn(TeamIds.Vagos, new mp.Vector3(492.6728515625, -1716.739501953125, 28.817216873168945), 221.0, 0);

Teams.createTeam("Bloods", 1, "#ad0500", new ColorRGB(255, 0, 0, 255), new ColorRGB(255, 0, 0, 255));
Teams.addTeamSpawn(TeamIds.Bloods, new mp.Vector3(1256.7264404296875, -1611.6512451171875, 52.837158203125), 35.0, 0);
Teams.addTeamSpawn(TeamIds.Bloods, new mp.Vector3(1245.68896484375, -1594.7166748046875, 52.75936508178711), 212.0, 0);
Teams.addTeamSpawn(TeamIds.Bloods, new mp.Vector3(1232.5020751953125, -1594.4813232421875, 52.86790466308594), 218.0, 0);
Teams.addTeamSpawn(TeamIds.Bloods, new mp.Vector3(1225.75244140625, -1604.3985595703125, 51.26072692871094), 171.0, 0);
Teams.addTeamSpawn(TeamIds.Bloods, new mp.Vector3(1218.5059814453125, -1635.823486328125, 47.271053314208984), 17.0, 0);

Teams.createTeam("Hitman", 40, "#494949", new ColorRGB(50, 50, 50, 255), new ColorRGB(50, 50, 50, 255));
Teams.addTeamSpawn(TeamIds.Hitman, new mp.Vector3(393.8550720214844, -339.55584716796875, 46.42127990722656), 183, 0);
Teams.addTeamSpawn(TeamIds.Hitman, new mp.Vector3(382.2640380859375, -333.08135986328125, 46.28460693359375), 162, 0);
Teams.addTeamSpawn(TeamIds.Hitman, new mp.Vector3(379.3173828125, -350.31085205078125, 46.300086975097656), 122, 0);
Teams.addTeamSpawn(TeamIds.Hitman, new mp.Vector3(381.6009216308594, -366.9290771484375, 46.31786346435547), 26, 0);
Teams.addTeamSpawn(TeamIds.Hitman, new mp.Vector3(389.9594421386719, -355.967529296875, 47.52466583251953), 262, 0);

Teams.createTeam("Vagos", 5, "#ffff00", new ColorRGB(255, 255, 0, 255), new ColorRGB(255, 255, 0, 255));
Teams.addTeamSpawn(TeamIds.RealVagos, new mp.Vector3(816.1436767578125, -2146.28515625, 28.334999084472656), 183, 0);
Teams.addTeamSpawn(TeamIds.RealVagos, new mp.Vector3(835.2969970703125, -2141.639892578125, 28.41375732421875), 162, 0);
Teams.addTeamSpawn(TeamIds.RealVagos, new mp.Vector3(831.2091064453125, -2177.8154296875, 29.272830963134766), 122, 0);
Teams.addTeamSpawn(TeamIds.RealVagos, new mp.Vector3(843.9525756835938, -2119.1396484375, 29.500595092773438), 26, 0);
Teams.addTeamSpawn(TeamIds.RealVagos, new mp.Vector3(811.8148193359375, -2115.17138671875, 28.342050552368164), 262, 0);


for (var i = 0; i <= 5; i++) {
    Teams.addTeamSpawn(i, new mp.Vector3(-372.9421081542969, 6186.3291015625, 32.11246109008789), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-346.82080078125, 6219.05419921875, 31.990266799926758), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-324.3767395019531, 6273.64892578125, 31.99683380126953), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-278.62939453125, 6283.111328125, 31.9920055114746), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-243.11544799804688, 6326.97265625, 32.926189422607422), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-231.9818572998047, 6350.7822265625, 32.926055908203125), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-177.10629272460938, 6379.73095703125, 31.982322692871094), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-76.902099609375, 6501.5673828125, 31.990907669067383), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-48.07530212402344, 6449.2744140625, 31.976318359375), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(10.497990608215332, 6473.17626953125, 31.925302505493164), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(64.03682708740234, 6474.037109375, 31.925281524658203), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-12.445772171020508, 6441.5517578125, 31.928977966308594), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-21.772682189941406, 6462.70166015625, 31.092809677124023), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-11.25269889831543, 6554.419921875, 33.737274169921875), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(1.8621869087219238, 6584.12744140625, 33.21574401855469), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-6.127294063568115, 6611.083984375, 31.970552444458008), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-45.13077163696289, 6559.90869140625, 31.872119903564453), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-107.58293914794922, 6531.26513671875, 30.358293533325195), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-140.5146942138672, 6466.2783203125, 32.188282012939453), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-170.54515075683594, 6434.54541015625, 32.413766860961914), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-221.49488830566406, 6434.98388671875, 31.69742202758789), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-252.58221435546875, 6410.212890625, 31.65726661682129), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-269.0882263183594, 6352.91455078125, 32.99020767211914), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-293.7736511230469, 6338.62939453125, 32.817245483398438), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-364.24114990234375, 6325.57666015625, 30.334165573120117), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-388.60650634765625, 6257.4130859375, 31.987714767456055), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-440.8949890136719, 6203.15576171875, 31.056608200073242), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-218.87364196777344, 6208.2275390625, 31.567293167114258), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-271.6322326660156, 6134.01220703125, 31.577545166015625), 183, MapSpawns.PALETO_BAY);
    Teams.addTeamSpawn(i, new mp.Vector3(-266.10980224609375, 6055.83251953125, 31.634199142456055), 183, MapSpawns.PALETO_BAY);

}

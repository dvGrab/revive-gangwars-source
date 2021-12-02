import { Player } from "../account/player";
import { Teams } from "../spawning/team";

class MapObject{
    name : string;
    cameraPosition : Vector3Mp;
    lookAtPosition : Vector3Mp;

    constructor(name : string, cameraPosition : Vector3Mp, lookAtPosition : Vector3Mp)
    {
        this.name = name;
        this.cameraPosition = cameraPosition;
        this.lookAtPosition = lookAtPosition;
    }
}

class MapManager{

    maps : MapObject[] = [];

    constructor()
    {
        mp.events.add("server:acceptMap", (player : Player, mapIndex : number) => {
            player.mapSpawn = mapIndex;
            player.call("startTeamSelection", [Teams.getTeamsAsJson()]);
        });
    }

    addSpawn(name : string, cameraPosition : Vector3Mp, lookAtPosition : Vector3Mp)
    {
        var found = this.maps.find(element => element.name == name);

        if(!found)
            this.maps.push(new MapObject(name, cameraPosition, lookAtPosition));
    }

    getSpawns()
    {
        var json : any = {maps: []};

        this.maps.forEach((element) => {
            json.maps.push({
                name: element.name, 
                camPosX: element.cameraPosition.x, camPosY: element.cameraPosition.y, camPosZ: element.cameraPosition.z,
                camLookX: element.lookAtPosition.x, camLookY: element.lookAtPosition.y, camLookZ: element.lookAtPosition.z
            });
        });

        return JSON.stringify(json);
    }
}

export var Map = new MapManager();

Map.addSpawn("Los Santos", new mp.Vector3(-427.7771301269531, -2403.557861328125, 84.06071472167969), new mp.Vector3(-304.43896484375, -1976.0380859375, 72.77554321289062));
Map.addSpawn("Paleto Bay", new mp.Vector3(-543.1560668945312, 6553.44775390625, 187.41831970214844), new mp.Vector3(-155.42880249023438, 6315.4921875, 35.6196174621582));


export enum MapSpawns{
    LOS_SANTOS = 0,
    PALETO_BAY = 1
}
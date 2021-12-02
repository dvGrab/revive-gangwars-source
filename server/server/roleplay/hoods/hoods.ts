import { Teams, TeamIds } from "../spawning/team";
import { Player } from "../account/player";
import { Distance } from "../warflags/flags";

class hoodHelper{
    team : number;
    position : Vector3Mp;
    blip : BlipMp;
    marker : MarkerMp;
    label : TextLabelMp;
    color : number;

    constructor(team : number, position : Vector3Mp, color : number, name : string)
    {
        this.team = team;
        this.position = position;
        this.color = color;
        this.blip = mp.blips.new(310, this.position, { color: this.color, name: name, shortRange: true });
        this.label = mp.labels.new(name, new mp.Vector3(this.position.x, this.position.y, this.position.z + 2.0), { drawDistance: 5.0 });
        this.marker = mp.markers.new(1, this.position, 2.0);
    }
}

class Hood{

    hoods : any = [];

    addHood(team : number, position : Vector3Mp, color : number, name : string)
    {   
        this.hoods.push(new hoodHelper(team, position, color, name));
    }

}

export var Hoods = new Hood();

Hoods.addHood(TeamIds.Grove, new mp.Vector3(127.42303466796875, -1942.0616455078125, 19.566865921020508), Teams.getTeamColorNumber(TeamIds.Grove), Teams.getTeamName(TeamIds.Grove));

Hoods.addHood(TeamIds.Ballas, new mp.Vector3(-10.28999137878418, -1473.5604248046875, 29.54874038696289), Teams.getTeamColorNumber(TeamIds.Ballas), Teams.getTeamName(TeamIds.Ballas));
Hoods.addHood(TeamIds.Vagos, new mp.Vector3(517.1344604492188, -1760.071533203125, 26.411724090576172), Teams.getTeamColorNumber(TeamIds.Vagos), Teams.getTeamName(TeamIds.Vagos));
Hoods.addHood(TeamIds.Bloods, new mp.Vector3(1273.893310546875, -1599.9893798828125, 53.67829513549805), Teams.getTeamColorNumber(TeamIds.Bloods), Teams.getTeamName(TeamIds.Bloods));
//Hoods.addHood(TeamIds.LSPD, new mp.Vector3(448.1924133300781, -987.9100341796875, 29.1896076202392), Teams.getTeamColorNumber(TeamIds.LSPD), Teams.getTeamName(TeamIds.LSPD));
//Hoods.addHood(TeamIds.LostMC, new mp.Vector3(-477.8662414550781, -1734.45849609375, 18.0985126495361338), Teams.getTeamColorNumber(TeamIds.LostMC), Teams.getTeamName(TeamIds.LostMC));
Hoods.addHood(TeamIds.RealVagos, new mp.Vector3(816.1082153320312, -2143.07275390625, 28.266645431518555), Teams.getTeamColorNumber(TeamIds.RealVagos), Teams.getTeamName(TeamIds.RealVagos));
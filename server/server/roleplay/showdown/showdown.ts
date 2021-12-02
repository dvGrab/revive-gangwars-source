import { Player } from "../account/player";
import { Distance } from "../warflags/flags";
import { TeamIds, Teams } from "../spawning/team";
import { TreeLevelColumn } from "typeorm";
import { Level } from "../account/leveling";
import { getTimeInSeconds } from "../utils/utils";
import { Messages } from "../chat/messaging";

/* 331.22369384765625 */ //Flughafentower
/* 215.9412841796875 */  //PostOPDepository
/* 179.07582092285156 */  //LEsterHaus

var showdownPositions: any = [];

showdownPositions.push({ position: new mp.Vector3(-25.932340621948242, -722.82763671875, 31.754070281982422), heading: 359, name: "an der Mazebank" });
showdownPositions.push({ position: new mp.Vector3(-963.4645385742188, -2604.744384765625, 13.348198890686035), heading: 330, name: "am Flughafentower" });
showdownPositions.push({ position: new mp.Vector3(-530.8783569335938, -2824.718017578125, 5.500383377075195), heading: 215, name: "am Los Santos Hafen (PostOP Despository)" });
showdownPositions.push({ position: new mp.Vector3(692.7545166015625, -1010.7265014648438, 22.248109817504883), heading: 180, name: "bei Darnell Bros Tunnnel (Lester's Büro)" });
showdownPositions.push({ position: new mp.Vector3(492.9207763671875, -2157.892578125, 5.417536735534668), heading: 220, name: "bei San Andreas State Gas (nähe Hafen)" });
showdownPositions.push({ position: new mp.Vector3(1370.049560546875, -2075.677734375, 51.49857711791992), heading: 345, name: "beim Ölfeld Los Santos" });
showdownPositions.push({ position: new mp.Vector3(1007.2404174804688, 59.747100830078125, 80.4909439086914), heading: 147, name: "bei der Pferderennbahn" });
showdownPositions.push({ position: new mp.Vector3(-614.3906860351562, 337.2664489746094, 84.6168212890625), heading: 259, name: "bei der Teequilalabar" });
showdownPositions.push({ position: new mp.Vector3(-1607.56103515625, 175.64981079101562, 59.06037521362305), heading: 200, name: "bei der Universität Los Santos" });
showdownPositions.push({ position: new mp.Vector3(-2319.00830078125, 281.7004699707031, 168.29226684570312), heading: 180, name: "beim Museum" });
showdownPositions.push({ position: new mp.Vector3(-406.9056701660156, 1232.6551513671875, 325.14178466796875), heading: 200, name: "beim Obversatorium" });
showdownPositions.push({ position: new mp.Vector3(-361.0842590332031, -116.69300842285156, 38.196418762207033), heading: 129, name: "bei Los Santos Customs Innenstadt" });
showdownPositions.push({ position: new mp.Vector3(-1146.87890625, -1980.2078857421875, 12.660452842712402), heading: 263, name: "bei Los Santos Customs Flughafen" });
showdownPositions.push({ position: new mp.Vector3(-259.5934143066406, -2089.61279296875, 27.120389938354492), heading: 263, name: "bei der Mazebank Arena" });
showdownPositions.push({ position: new mp.Vector3(1274.9482421875, -3318.81201171875, 5.401599407196045), heading: 263, name: "bei der Hafenspedition" });

class helperTruck {
    team: number;
    position: Vector3Mp;
    marker: any = undefined;
    blip: any = undefined;

    constructor(team: number, position: Vector3Mp) {
        this.team = team;
        this.position = position;
    }
}

class showdownTruck {

    truckID: VehicleMp;
    truckLabel: any;
    position: Vector3Mp = new mp.Vector3(0, 0, 0);
    markers: any = [];
    isDropped: boolean = false;
    startedTimestamp: number = getTimeInSeconds() + 2700;
    timer : any;

    destroyShowdown() {
        if (mp.vehicles.exists(this.truckID))
            this.truckID.destroy();

            if(this.timer != undefined)
            {
                clearTimeout(this.timer);
                this.timer = undefined;
            }
    }

    isCurrentlyStolen() {
        if (mp.vehicles.exists(this.truckID))
            if (!this.truckID.locked)
                return true;

        return false;
    }

    createShowdown() {

        var index = Math.floor(Math.random() * showdownPositions.length);

        this.position = showdownPositions[index].position;

        if (mp.vehicles.exists(this.truckID))
            this.truckID.destroy();

        if (mp.labels.exists(this.truckLabel))
            this.truckLabel.destroy();

        if (!mp.vehicles.exists(this.truckID))
            this.truckID = mp.vehicles.new(mp.joaat("stockade"), this.position,
                {
                    engine: false,
                    numberPlate: "Maze Bank",
                    color: [[255, 255, 0], [255, 255, 0]],
                    heading: showdownPositions[index].heading,
                    locked: true
                });

        if (!mp.labels.exists(this.truckLabel))
            this.truckLabel = mp.labels.new("Fahrzeug knacken\n~g~Drücke E", this.position, {
                drawDistance: 10,
                los: false
            });

        this.isDropped = false;

        mp.players.forEach((element: Player) => {
            if (!element.isLoggedIn) return false;

            if (element.team == TeamIds.LSPD)
                Messages.Send("INFO", "Bei der letzen Kontrolle habt ihr ein Truck " + showdownPositions[index].name + " vergessen. Holt ihn wieder!", false, element);
            else
                Messages.Send("INFO", "Die Polizei hat " + showdownPositions[index].name + " einen Truck mit Drogen vergessen. Ab in die Hood damit!", false, element);

        });

        if(this.timer == undefined)
        {
            this.timer = setTimeout(() => {

                if(mp.vehicles.exists(this.truckID))
                {
                    Showdown.hidePoints();
                    Showdown.destroyShowdown();

                    Showdown.truckLabel.destroy();
                    Showdown.truckLabel = undefined;
                }

            }, 600 * 1000);
        }   
        else
        {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
            



        mp.players.broadcast("");
    }

    createPoint(team: number, position: Vector3Mp) {
        this.markers.push(new helperTruck(team, position));
    }

    showPoints() {

        this.markers.forEach((element: helperTruck) => {
            if (element.marker === undefined)
                element.marker = mp.markers.new(1, element.position, 4.0, { color: [120, 0, 0, 120] });

            if (element.blip === undefined)
                element.blip = mp.blips.new(634, element.position, { color: Teams.getTeamColorNumber(element.team), name: "Abgabepunkt" });
        });
    }

    hidePoints() {
        this.markers.forEach((element: helperTruck) => {

            if (element.marker !== undefined) {
                element.marker.destroy();
                element.marker = undefined;
            }

            if (element.blip !== undefined) {
                element.blip.destroy();
                element.blip = undefined;
            }

        });
    }
}

export var Showdown = new showdownTruck();

Showdown.createPoint(TeamIds.Grove, new mp.Vector3(89.0959701538086, -1967.0472412109375, 20.247465133666992));
Showdown.createPoint(TeamIds.Ballas, new mp.Vector3(-26.88555145263672, -1495.3319091796875, 28.862089157104492));
Showdown.createPoint(TeamIds.Vagos, new mp.Vector3(517.1344604492188, -1760.071533203125, 27.4117240905761727));
Showdown.createPoint(TeamIds.Bloods, new mp.Vector3(1227.32861328125, -1635.503662109375, 47.93402862548828));
//Showdown.createPoint(TeamIds.LSPD, new mp.Vector3(433.94879150390625, -1008.27197265625, 27.410287857055664));
//Showdown.createPoint(TeamIds.LostMC, new mp.Vector3(-477.8662414550781, -1734.45849609375, 18.098512649536133));
Showdown.createPoint(TeamIds.RealVagos, new mp.Vector3(838.2145385742188, -2117.799072265625, 28.633256912231445));

mp.events.add("tryingLoot", (player: Player) => {

    if (player.isLoggedIn) {
        if (player.isBreaking == false) {
            if (Distance(player.position, Showdown.position) < 10) {
                if (Showdown.truckID.locked) {
                    player.playAnimation('veh@break_in@0h@p_m_one@', 'low_force_entry_ds', 3000, 31);
                    player.isBreaking = true;

                    setTimeout(() => {
                        if(!mp.vehicles.exists(Showdown.truckID))
                            return false;

                        if (mp.players.exists(player)) {
                            player.stopAnimation();
                            player.isBreaking = false;

                            if (Distance(player.position, Showdown.position) < 10) {
                                if (Showdown.truckID.locked) {
                                    Showdown.truckID.locked = false;
                                    Messages.Send("INFO", "Der Truck wurde von den " + Teams.getTeamName(player.team) + " aufgebrochen! Bringt ihn zum Abgabepunkt und sammelt euch dort.");
                                    Showdown.showPoints();
                                    Showdown.truckLabel.destroy();
                                    Showdown.truckLabel = undefined;
                                }
                            }
                        }
                    }, 30 * 1000);
                }
            }
        }
    }
});

mp.events.add("playerStartExitVehicle", (player: Player) => {

    if (player.isLoggedIn) {

        var vehicle: VehicleMp = player.vehicle;

        if (vehicle === Showdown.truckID) {
            if (!Showdown.isDropped) {

                for (var i = 0; i < Showdown.markers.length; i++) {
                    if (Showdown.markers[i].team != player.team) continue;
                    if (Distance(player.position, Showdown.markers[i].position) > 5) continue;

                    Showdown.hidePoints();
                    Showdown.destroyShowdown();
                    giveDropForPlayerInRange(Showdown.markers[i].team, Showdown.markers[i].position);
                    Messages.Send("INFO", "Der Truck wurde erfolgreich bei den " + Teams.getTeamName(player.team) + " abgeliefert.");

                    player.inventory.addAmount("Schutzweste", 5);
                    player.inventory.addAmount("Verbandskasten", 10);
                    player.inventory.addAmount("Dollar", 5);

                    player.outputChatBox("Du hast " + Level.getExpWithMultiplicator(150, player) + " EXP bekommen.");
                    Level.givePlayerExperience(player, 150);



                    break;
                }
            }
        }
    }

});

function giveDropForPlayerInRange(team: number, position: Vector3Mp) {

    var position = position;
    var team = team;

    mp.players.forEach((element: Player) => {
        if (!element.isLoggedIn) return false;
        if (Distance(element.position, position) > 25) return false;
        if (element.team != team) return false;

        if (team == TeamIds.LSPD) {
            element.inventory.addAmount("Schutzweste", 5);
            element.inventory.addAmount("Verbandskasten", 10);
            element.outputChatBox("Du hast " + Level.getExpWithMultiplicator(150, element) + " EXP bekommen.");
            Level.givePlayerExperience(element, 150);
        }
        else {
            element.inventory.addAmount("Schutzweste", 5);
            element.inventory.addAmount("LSD", 5);
            element.inventory.addAmount("Extasy", 5);
            element.inventory.addAmount("Verbandskasten", 3);
        }

        Level.givePlayerExperience(element, 100);
    });

}

mp.events.add("playerDeath", (player: Player, killReason: string, killer: Player) => {

    try {
        player.isBreaking = false;
    }
    catch (error) {
        console.log("Error");
    }
});

mp.events.addCommand("maze", (player: Player) => {
    Showdown.createShowdown();

    player.position = Showdown.position;
});

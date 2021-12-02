import { Player } from "../account/player";
import { database } from "../database/manager";
import { GroupHouses } from "../database/entities/group_houses";
import { connect } from "http2";
import { TeamIds, Teams } from "../spawning/team";
import { Ranks } from "../admin";
import { Distance } from "../warflags/flags";
import { Grouping, groupWindowTypes } from "./grouping";
import { overlayError, getTimeInSeconds } from "../utils/utils";
import { MssqlParameter } from "typeorm";
import { Messages } from "../chat/messaging";
import { logHelper } from "../logger";

var Log = new logHelper("Housing", "housing.log", false);

export interface playerHouse extends Player {
    lastEnter: number;
}

class helperHouses {

    id: number;
    name: string;
    group: number;
    position: Vector3Mp;
    interior: Vector3Mp;
    marker: MarkerMp;
    label: TextLabelMp;
    interiorMarker: MarkerMp;
    blip: BlipMp;
    customizable: boolean;
    price: number;
    team: number;

    constructor(id: number, name: string, group: number, x: number, y: number, z: number, x2: number, y2: number, z2: number, customizeable: boolean, price: number, team: number) {
        this.id = id;
        this.name = name;
        this.group = group;
        this.position = new mp.Vector3(x, y, z);
        this.interior = new mp.Vector3(x2, y2, z2);
        this.customizable = customizeable;
        this.price = price;
        this.team = team;
    }
}

class Houses {
    list: helperHouses[] = [];

    add(id: number, name: string, group: number, x: number, y: number, z: number, x2: number, y2: number, z2: number, customizable: boolean, price: number, team: number) {
        this.list.push(new helperHouses(id, name, group, x, y, z, x2, y2, z2, customizable, price, team));
    }

    remove(id: number) {
        this.list.splice(this.list.findIndex(element => element.id == id), 1);
    }

    deleteAll(groupId: number) {
        House.list.forEach((element: helperHouses) => {

            if (element.group != groupId)
                return false;

            this.databaseCreate(element.position);

            database.then(connection => {
                connection.getRepository(GroupHouses).findOne({ where: { id: element.id } }).then((element) => {

                    if (element)
                        connection.getRepository(GroupHouses).remove(element);

                });
            });

            House.destroy(element.id);
            House.remove(element.id);

        });
    }

    databaseCreate(position: Vector3Mp) {
        database.then(connection => {

            var house = new GroupHouses();
            var houseInterior = houseTypes[Math.floor(Math.random() * houseTypes.length)];

            house.x = position.x;
            house.y = position.y;
            house.z = position.z;

            house.x2 = houseInterior.x;
            house.y2 = houseInterior.y;
            house.z2 = houseInterior.z;

            house.price = 2500;

            house.group = 0;

            connection.getRepository(GroupHouses).save(house).then((element: GroupHouses) => {
                House.add(element.id, element.name, element.group, element.x, element.y, element.z, element.x2, element.y2, element.z2, element.customizable, element.price, element.team);
                House.create(element.id);
            });
        });
    }

    create(id: number) {
        var house = this.list.find(element => element.id == id);

        if (house) {
            house.marker = mp.markers.new(0, house.position, 1.0, {
                color: [255, 255, 0, 150]
            });

            house.interiorMarker = mp.markers.new(0, house.interior, 1.0, {
                color: [255, 255, 0, 150],
                dimension: house.id
            });

            if (house.group < 1)
                house.blip = mp.blips.new(40, house.position, {
                    color: 2,
                    shortRange: true
                });

            if (house.group < 1)
                house.label = mp.labels.new("~g~Preis: $" + house.price + "\n- Drücke E -", house.position, {
                    drawDistance: 10,
                    los: true
                });
        }
    }

    destroy(id: number) {
        var house = this.list.find(element => element.id == id);

        if (house) {

            if (mp.markers.exists(house.marker))
                house.marker.destroy();

            if (mp.blips.exists(house.blip))
                house.blip.destroy();
        }
    }

    enter(player: Player, id: number) {
        var house = this.list.find(element => element.id == id);

        if (house) {
            player.position = house.interior;
            player.dimension = house.id;
        }
    }

    exit(player: Player, id: number) {
        var house = this.list.find(element => element.id == id);

        if (house) {
            player.position = house.position;
            player.dimension = 0;
        }
    }

    getHouseSpawnPosition(groupId: number, team: number): Vector3Mp {
        var house = this.list.find(element => element.group == groupId && element.team == team);

        if (house)
            return house.interior;
        else
        {
            Log.log("User spawned empty: groupId " + groupId + " team: " + team);
            return new mp.Vector3(500, 500, 550);
        }
            
    }

    getHouseSpawnInterior(groupId: number, team: number) {
        var house = this.list.find(element => element.group == groupId && element.team == team);

        if (house)
            return house.id;
        else
            return 0;
    }

    isHouseForTeam(id: number, team: number) {
        var house = this.list.find(element => element.group == id && element.team == team);

        if (house)
            return true;
        else
            return false;
    }

    loadFromDatabase() {
        database.then(connection => {

            connection.getRepository(GroupHouses).find().then((elements) => {

                elements.forEach((element: GroupHouses) => {

                    this.add(element.id, element.name, element.group, element.x, element.y, element.z, element.x2, element.y2, element.z2, element.customizable, element.price, element.team);
                    this.create(element.id);

                });
            });

        });
    }
}

export var House = new Houses();

House.loadFromDatabase();


var houseTypes = [
    new mp.Vector3(266.0413818359375, -1006.9097900390625, -101.341896057128), //ganghouse
    new mp.Vector3(346.48126220703125, -1012.0406494140625, -99.6961669921875), //hoodmid
    new mp.Vector3(151.13096618652344, -1007.6292724609375, -99.49999237060547) //gnghouse
];

mp.events.addCommand("createhouse", (player: Player) => {

    if (player.info.admin < Ranks.Projectlead)
        return false;

    database.then(connection => {

        var house = new GroupHouses();
        var houseInterior = houseTypes[Math.floor(Math.random() * houseTypes.length)];

        house.x = player.position.x;
        house.y = player.position.y;
        house.z = player.position.z;

        house.x2 = houseInterior.x;
        house.y2 = houseInterior.y;
        house.z2 = houseInterior.z;

        house.price = 1500;

        house.group = 0;

        connection.getRepository(GroupHouses).save(house).then((element: GroupHouses) => {
            player.outputChatBox("Haus erstellt.");

            House.add(element.id, element.name, element.group, element.x, element.y, element.z, element.x2, element.y2, element.z2, element.customizable, element.price, element.team);
            House.create(element.id);
        });
    });

});

mp.events.addCommand("gotohouse", (player: Player, fulLText: string, x: string, y: string, z: string) => {

    player.position = new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));

});


mp.events.addCommand("deletehouse", (player: Player) => {

    if (player.info.admin < Ranks.Projectlead)
        return false;

    House.list.forEach((element: helperHouses) => {

        if (Distance(player.position, element.position) > 3)
            return false;

        database.then(connection => {
            connection.getRepository(GroupHouses).findOne({ where: { id: element.id } }).then((element) => {

                if (element)
                    connection.getRepository(GroupHouses).remove(element);

            });
        });

        House.destroy(element.id);
        House.remove(element.id);

        player.outputChatBox("Haus gelöscht.");
    });

});

mp.events.add("enterHouse", (player: playerHouse) => {

    var userGroupId = Grouping.isUserInGroup(player.name);

    if (userGroupId < 1) return false;

    if (player.lastEnter > getTimeInSeconds())
        return false;

    House.list.forEach((element: helperHouses) => {

        if (Distance(player.position, element.position) > 5) return false;

        if (element.group < 1)
            return player.call("createGroupWindow", [groupWindowTypes.BUYHOUSE, "", ""]);

        if (element.group != userGroupId) return overlayError(player, "Das ist nicht dein Gruppenhaus.", "Fehler");

        if (element.team != player.team) return overlayError(player, "Das Haus ist nicht für dein Team gedacht.", "Fehler");

        House.enter(player, element.id);

        player.lastEnter = getTimeInSeconds() + 6;

    });

});

mp.events.add("exitHouse", (player: playerHouse) => {

    var userGroupId = Grouping.isUserInGroup(player.name);

    if (userGroupId < 1) return false;

    if (player.dimension == 0)
        return false;

    if (player.lastEnter > getTimeInSeconds())
        return false;

    House.list.forEach((element: helperHouses) => {

        if (Distance(player.position, element.interior) > 5) return false;

        if (element.group < 1) return overlayError(player, "Das Haus steht leer.", "Fehler");

        if (element.group != userGroupId) return false;

        if (player.dimension != element.id) return false;

        House.exit(player, element.id);

        player.lastEnter = getTimeInSeconds() + 6;

    });
});

mp.events.add("sendBuyHouseToServer", (player: playerHouse) => {

    var userGroupId = Grouping.isUserInGroup(player.name);

    if (userGroupId < 1) return overlayError(player, "Du musst dich in einer Gruppe befinden.", "Fehler");

    if (player.lastEnter > getTimeInSeconds())
        return false;

    if (House.isHouseForTeam(userGroupId, player.team))
        return overlayError(player, "Deine Gruppe besitzt bereits ein Haus in diesem Team!", "Fehler");

    House.list.forEach((element: helperHouses) => {

        if (Distance(player.position, element.position) > 5) return false;

        if (element.group > 0) return overlayError(player, "Dieses Haus wurde bereits gekauft.", "Fehler");

        if (player.inventory.getAmount("Dollar") >= element.price) {
            database.then(connection => {

                connection.getRepository(GroupHouses).findOne({ where: { id: element.id } }).then((houseElement: GroupHouses) => {

                    if (houseElement) {

                        if (!mp.players.exists(player)) return false;

                        houseElement.group = Grouping.isUserInGroup(player.name);
                        houseElement.name = player.name;
                        houseElement.team = player.team;
                        connection.getRepository(GroupHouses).save(houseElement);

                        element.group = Grouping.isUserInGroup(player.name);
                        element.name = player.name;
                        element.team = player.team;
                        player.inventory.removeAmount("Dollar", element.price);

                        Messages.Send("SERVER", "Du hast dir ein Haus für deine Gruppe gekauft.", false, player);

                        element.label.destroy();
                    }

                });

            });
        }
        else
            return overlayError(player, "Du hast nicht genügend Geld!", "Fehler");
    });

});











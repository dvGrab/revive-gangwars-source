import { Player } from "../account/player";
import { database } from "../database/manager";
import { Groups } from "../database/entities/groups";
import { Messages } from "../chat/messaging";
import { overlayError } from "../utils/utils";
import { Members, memberHelper } from "./member";
import { GroupMembers } from "../database/entities/group_members";
import { Distance } from "../warflags/flags";
import { Level } from "../account/leveling";
import { connect } from "http2";
import { House } from "./housing";
import { damagePlayer } from "../weapons/syncing";

class groupHelper {

    Members: Members = new Members();

    name: string;
    leader: string;
    groupId: number;

    constructor(name: string, leader: string, groupId: number) {
        this.name = name;
        this.leader = leader;
        this.groupId = groupId;
    }
}

class Group {

    list: groupHelper[] = [];

    addGroupToList(leader: string, name: string, groupId: number) {

        if (this.doesGroupExists(leader))
            return false;

        this.list.push(new groupHelper(name, leader, groupId));
    }

    removeGroupFromList(leader: string) {

        if (!this.doesGroupExists(leader))
            return false;

        Messages.Send("SERVER", "Die Gruppe von " + leader + " wurde gelöscht.", true);

        database.then(connection => {

            connection.getRepository(Groups).find({ where: { name: leader } }).then(elements => {

                elements.forEach((element: Groups) => {

                    connection.getRepository(Groups).remove(element);

                });

            });

        });


        this.list.splice(this.list.findIndex(element => element.leader === leader), 1);
    }

    doesGroupExists(leader: string) {
        return this.list.findIndex(element => element.leader === leader) != -1 ? true : false;
    }

    getGroupByName(leader: string): groupHelper | undefined {

        var member = this.list.find(element => element.leader === leader);

        if (member !== undefined)
            return member;
        else
            return undefined;

    }

    isUserInGroup(name: string): number {

        var returnValue = -1;

        this.list.forEach((element: groupHelper) => {
            if (!element.Members.doesUserExists(name)) return false;
            returnValue = element.groupId;
        });

        return returnValue;
    }

    getGroupByIndex(index: number): groupHelper | undefined {

        var returnValue = undefined;

        this.list.forEach((element: groupHelper) => {
            if (element.groupId != index) return false;
            returnValue = element;

        });

        return returnValue;
    };

    getInfoAsJson(index: number) {
        var returnValue;

        this.list.forEach((element: groupHelper) => {
            if (element.groupId != index) return false;

            var dollarAmount = 0, killAmount = 0, deathAmount = 0, memberAmount = 0;

            mp.players.forEach((user: Player) => {

                if (!user.isLoggedIn) return false;

                if (this.isUserInGroup(user.name) == index) {
                    memberAmount++;
                    deathAmount += user.stats.deaths;
                    killAmount += user.stats.kills;
                    dollarAmount += user.inventory.getAmount("Dollar");
                }

            });

            returnValue = JSON.stringify({ groupName: element.name, groupAmount: memberAmount, groupDeaths: deathAmount, groupKills: killAmount, groupDollar: dollarAmount });
        });

        return returnValue;
    }

    loadGroupsFromDatabase() {

        database.then(connection => {

            connection.getRepository(Groups).find().then((element) => {

                element.forEach((element) => {

                    Grouping.addGroupToList(element.name, element.groupname, element.id);

                    var group = Grouping.getGroupByName(element.name);

                    if (group)
                        group.Members.loadMembersFromDatabase(element.name);
                });
            });
        });

    }
};

export var Grouping = new Group();

Grouping.loadGroupsFromDatabase();

export enum groupWindowTypes {
    MAIN = 0,
    CREATION = 1,
    INVITE = 2,
    BUYHOUSE = 3
}

mp.events.add("requestGroupWindow", (player: Player) => {

    var groupIndex = Grouping.isUserInGroup(player.name);

    if (groupIndex > 0) {
        var Group = Grouping.getGroupByIndex(groupIndex);

        if (Group) {
            player.call("createGroupWindow", [groupWindowTypes.MAIN, Group.Members.usersAsJson(), Grouping.getInfoAsJson(groupIndex)]);
        }
    }
    else
        player.call("createGroupWindow", [groupWindowTypes.CREATION, ""]);

});

mp.events.add("sendCreateGroupToServer", (player: Player, groupName) => {

    if (player.inventory.getAmount("Dollar") < 500)
        return overlayError(player, "Du hast nicht genügend Geld!", "Fehler");

    database.then(connection => {

        connection.getRepository(Groups).findOne({ where: { name: player.name } }).then((element: Groups) => {

            if (!mp.players.exists(player)) return false;

            if (element)
                return player.outputChatBox("Du besitzt bereits eine Gruppierung!");
            else {
                var group = new Groups();
                group.groupname = groupName;
                group.name = player.name;

                connection.getRepository(Groups).save(group).then((savedGroup: Groups) => {
                    Messages.Send("SERVER", "Spieler " + player.name + " hat die Gruppe " + groupName + " gegründet.");
                    player.inventory.removeAmount("Dollar", 500);
                    player.setVariable("group", group.id);
                    player.setVariable("groupName", group.name);

                    Grouping.addGroupToList(player.name, groupName, savedGroup.id);

                    mp.events.call("sendGroupAcceptToServer", player, savedGroup.id, 1);

                    player.inventory.saveInventory();

                });
            }

        });

    });

});

mp.events.add("sendDeleteUserToServer", (player: Player, username: string) => {

    var group = Grouping.getGroupByName(player.name);

    if (group) {
        if (group.Members.getPermission(player.name)) {
            if (!group.Members.doesUserExists(username))
                return overlayError(player, "Der User existiert in deiner Gruppe nicht!", "Fehler");

            if (group.Members.getPermission(username) > 0)
                return overlayError(player, "Du kannst den Gruppenführer nicht entfernen!", "Fehler");

            var user = mp.players.toArray().find(element => element.name === username);

            if (user) {
                user.setVariable("groupName", "");
                user.setVariable("group", -1);
                Messages.Send("GRUPPE", "Du wurdest aus der Gruppe entfernt.", false, user);
            }

            group.Members.remove(username);

        }
        else
            return overlayError(player, "Du hast keine Berechtigung dazu!", "Fehler");

    }

});

mp.events.add("sendInvitePlayerToServer", (player: Player, username: string) => {

    var groupIndex = Grouping.isUserInGroup(player.name);

    if (groupIndex) {
        var group = Grouping.getGroupByIndex(groupIndex);

        if (group) {
            if (!group.Members.getPermission(player.name))
                return overlayError(player, "Du hast keine Berechtigung dazu!", "Fehler");

            if (Grouping.isUserInGroup(username) > 0)
                return overlayError(player, "Spieler ist bereits in einer Gruppe!", "Fehler");

            var targetUser = mp.players.toArray().find((element => element.name === username));

            if (targetUser)
                targetUser.call("createGroupWindow", [groupWindowTypes.INVITE, JSON.stringify({ groupId: group.groupId, groupName: group.name })]);
        }
    }

});

mp.events.add("sendGroupAcceptToServer", (player: Player, groupId: number, permission: number = 0) => {

    database.then(connection => {

        if (Grouping.isUserInGroup(player.name) > 0)
            return overlayError(player, "Du bist bereits in einer Gruppe!", "Fehler");

        var group = Grouping.getGroupByIndex(groupId);

        if (group) {
            group.Members.add(player.name, permission);
            group.Members.message("Spieler " + player.name + " ist der Gruppe beigetreten.");


            player.setVariable("group", group.groupId);
            player.setVariable("groupName", group.name);
            player.setVariable("groupLeader", permission);

            var groupElem = new GroupMembers();

            groupElem.name = player.name;
            groupElem.group = group.groupId;
            groupElem.permission = permission;

            connection.getRepository(GroupMembers).save(groupElem);
        }
    });
});

mp.events.add("playerDeath", (player: damagePlayer, reason: number, killer: Player) => {

    var group: groupHelper | undefined;

    if (!mp.players.exists(player))
        return false;

    if (player.killer == undefined)
        return false;

    if (!mp.players.exists(player.killer))
        return false;

    if (!player.killer.isLoggedIn)
        return false;

    if (!player.isLoggedIn)
        return false;

    var groupIndex = Grouping.isUserInGroup(player.killer.name);

    if (groupIndex) {
        group = Grouping.getGroupByIndex(groupIndex);

        if (group) {
            mp.players.forEach((element: Player) => {

                if (!element.isLoggedIn) return false;

                if (element.team == player.team) return false;

                if (player.killer == undefined)
                    return false;

                if (element.team != player.killer.team) return false;

                if (element == player.killer) return false;

                if (element.getVariable("group") < 1) return false;

                if (element.getVariable("group") != player.killer.getVariable("group")) return false;

                if (group) {
                    if (group.Members.getPermission(element.name) > 0) {

                        if (Distance(element.position, player.killer.position) < 20) {
                            Level.givePlayerExperience(player.killer, 25);
                            Messages.Send("GRUPPE", "Du hast dein Leader beschützt und somit " + Level.getExpWithMultiplicator(25, player.killer) + " EXP bekommen.", false, player.killer);

                            if (Math.floor(Math.random() * 100) < 5)
                                player.inventory.addAmount("EXP Booster", 1);
                        }
                    }
                }
            });

        }
    }

});

mp.events.add("sendGroupLeaveToServer", (player: Player) => {

    var groupId = Grouping.isUserInGroup(player.name);

    if (groupId) {
        var group = Grouping.getGroupByIndex(groupId);

        if (group) {
            if (group.Members.getPermission(player.name)) return overlayError(player, "Du kannst als Leader keine Gruppe verlassen.", "Fehler");

            group.Members.remove(player.name);
            player.outputChatBox("Du hast die Gruppe verlassen.");
        }
    }

});

mp.events.add("server:GroupingDeleteGroup", (player: Player) => {

    var groupId = Grouping.isUserInGroup(player.name);

    if (groupId) {
        var group = Grouping.getGroupByIndex(groupId);

        if (group) {
            if (!group.Members.getPermission(player.name)) return overlayError(player, "Du kannst dies nur als Leader!", "Fehler");

            mp.players.forEach((element: Player) => {

                if (element == player)
                    return false;

                if (!group)
                    return false;

                if (Grouping.isUserInGroup(element.name) != groupId)
                    return false;

                element.setVariable("groupName", "");
                element.setVariable("group", -1);

                group.Members.remove(element.name);

            });

            group.Members.list.forEach((member: memberHelper) => {

                if (!group)
                    return false;

                if (member.permission > 0)
                    return false;

                group.Members.remove(member.name);
            });

            group.Members.remove(player.name);

            Grouping.removeGroupFromList(player.name);

            player.call("destroyGroupWindow");

            House.deleteAll(groupId);
        }

    }

});

mp.events.addCommand("c", (player: Player, fullText: string) => {

    var groupId = Grouping.isUserInGroup(player.name);

    if (!groupId) return false;

    var group = Grouping.getGroupByIndex(groupId);

    if (!group) return false;

    mp.players.forEach((element: Player) => {

        if (Grouping.isUserInGroup(element.name) != groupId)
            return false;

        Messages.Send("GRUPPE", player.name + ": " + fullText, false, element);
    });

});
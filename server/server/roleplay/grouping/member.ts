import { database } from "../database/manager";
import { Groups } from "../database/entities/groups";
import { GroupMembers } from "../database/entities/group_members";
import { Messages } from "../chat/messaging";
export class memberHelper {
    name: string;
    permission: number;

    constructor(name: string, permission: number) {
        this.name = name;
        this.permission = permission;
    }
}

export class Members {

    list: memberHelper[] = [];

    add(name: string, permission: number) {

        if (this.doesUserExists(name))
            return false;

        this.list.push(new memberHelper(name, permission));
    }

    remove(name: string) {

        if (!this.doesUserExists(name))
            return false;

        this.list.splice(this.list.findIndex(element => element.name === name), 1);

        database.then(connection => {
            
            connection.getRepository(GroupMembers).findOne({ where: { name: name}}).then((element : GroupMembers) => {
                if(element)
                    connection.getRepository(GroupMembers).remove(element);
            });

        });


    }

    getPermission(name: string): number {

        var user = this.list.find(element => element.name === name);

        if (user)
            return user.permission;
        else
            return -1;
    }

    getUserByName(name: string): memberHelper | undefined {

        var member = this.list.find(element => element.name === name);

        if (member !== undefined)
            return member;
        else
            return undefined;
    }

    doesUserExists(name: string): boolean {
        return this.list.findIndex(element => element.name == name) != -1 ? true : false;
    }

    usersAsJson() {
        var returnValue: any = [];

        this.list.forEach((element: memberHelper) => {

            var user = mp.players.toArray().find(elem => elem.name === element.name);

            if (user)
                returnValue.push({ name: element.name, permission: element.permission, status: "Online" });
            else
                returnValue.push({ name: element.name, permission: element.permission, status: "Offline" });
        });

        return JSON.stringify({ items: returnValue });
    }

    loadMembersFromDatabase(leader: string) {
        database.then(connection => {

            connection.getRepository(Groups).findOne({ where: { name: leader } }).then((element: Groups) => {

                connection.getRepository(GroupMembers).find({ where: { group: element.id } }).then((member) => {

                    member.forEach((element: GroupMembers) => {
                        this.add(element.name, element.permission);
                    });

                });

            });

        });
    }

    message(message: string) {
        this.list.forEach((element: memberHelper) => {
            Messages.Send("GRUPPE", message, false, mp.players.toArray().find(elem => elem.name === element.name));
        });
    }
};

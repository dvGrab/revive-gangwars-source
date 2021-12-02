import { Player, Kick, Ban, Timeban } from "../account/player";
import { Ranks } from ".";
import { database } from "../database/manager";
import { Bans } from "../database/entities/bans";
import { isNumber } from "util";
import { Warnings } from "../database/entities/warnings";
import { getTimeInSeconds } from "../utils/utils";
import { Messages } from "../chat/messaging";
import { Users } from "../database/entities/user";

mp.events.addCommand("kick", (player: Player, fullString: string) => {

    if (player.info.admin >= Ranks.Moderator) {
        player.call("createKick");
    }

});

mp.events.addCommand("warn", (player: Player, fullString: string) => {

    if (player.info.admin >= Ranks.Moderator)
        player.call("createWarn");
});

mp.events.add("kickPlayerWithGun", (player: Player, target: Player) => {

    if (mp.players.exists(target)) {
        if (player.info.admin >= Ranks.Moderator)
            if (player.isSupporting)
                player.call("createKick", [JSON.stringify({ target: target.name })]);
    }
});

mp.events.add("kickPlayerFromServer", (player: Player, name: string, reason: string) => {

    if (player.info.admin >= Ranks.Moderator) {

        var foundPlayer = false;

        mp.players.forEach((entity: Player) => {

            var tempUsername = entity.name.toUpperCase();
            var tempInput = name.toUpperCase();

            if (tempUsername !== tempInput) return false;
            if (entity.name == player.name) return false;

            if(entity.info.admin >= 2) return false;

            Kick(entity, reason, player.name);

            foundPlayer = true;

        });

        if (!isNumber(name))
            return false;

        if (!foundPlayer) {
            mp.players.forEach((entity: Player) => {
                if (entity.id != Number(name)) return false;

                Kick(entity, reason, player.name);
            });
        }
    }

});

mp.events.add("banPlayerFromServer", (player: Player, name: string, reason: string) => {

    if (player.info.admin >= Ranks.Moderator) {

        var foundPlayer = false;

        mp.players.forEach((entity: Player) => {

            var tempUsername = entity.name.toUpperCase();
            var tempInput = name.toUpperCase();

            if (tempUsername !== tempInput) return false;
            if (entity.name == player.name) return false;
            if(entity.info.admin >= 2) return false;

            Ban(entity, reason, player.name);

            foundPlayer = true;

        });


        if (foundPlayer == false) {
            database.then(connection => {

                connection.getRepository(Users).findOne({ where: { name: name } }).then((element: Users) => {

                    if(!element) return false;

                    var banElement = new Bans();

                    banElement.name = element.name;
                    banElement.admin = player.name;
                    banElement.hwid = element.hwid;
                    banElement.reason = reason;
                    banElement.socialclub = element.socialclub;

                    connection.getRepository(Bans).save(banElement).then(() => { 
                        Messages.Send("SERVER", "Spieler " + element.name + " wurde Offline permanent vom Server gebannt.");
                    });

                });

            });
        }


        if (!isNumber(name))
            return false;

        if (!foundPlayer) {
            mp.players.forEach((entity: Player) => {
                if (entity.id != Number(name)) return false;

                Ban(entity, reason, player.name);
            });
        }
    }

});


mp.events.add("timebanPlayerFromServer", (player: Player, name: string, reason: string, time: number) => {

    if (player.info.admin >= Ranks.Moderator) {

        var foundPlayer = false;

        mp.players.forEach((entity: Player) => {

            var tempUsername = entity.name.toUpperCase();
            var tempInput = name.toUpperCase();

            if (tempUsername !== tempInput) return false;
            if (entity.name == player.name) return false;

            Timeban(entity, reason, player.name, time);

            foundPlayer = true;

        });

        if (!isNumber(name))
            return false;

        if (!foundPlayer) {
            mp.players.forEach((entity: Player) => {
                if (entity.id != Number(name)) return false;

                Timeban(entity, reason, player.name, time);
            });
        }
    }

});

/*
    target : string = "NODUX" == Wenn target nicht angegeben ist wird automatisch "NODUX" eingesetzt.

    Was? Programmieren? Hier ist alles copy pastr. mhmmm -< machen wirs wie GVMP

*/


mp.events.add("warnPlayerFromServer", (player: Player, target: string, reason: string, time: number) => {

    if (!(player.info.admin >= 1))
        return false;

    mp.players.forEach((entity: Player) => {

        var tempUsername = entity.name.toUpperCase();
        var tempInput = target.toUpperCase();

        // if (entity.name != target) return false;
        if (tempUsername !== tempInput) return false;

        database.then(connection => {

            var tempWarning = new Warnings();
            tempWarning.admin = player.name;
            tempWarning.name = target;
            tempWarning.expire = getTimeInSeconds() + (time * 86400);
            tempWarning.reason = reason;

            connection.getRepository(Warnings).insert(tempWarning).then(() => {

                if (!mp.players.exists(entity)) return false;

                connection.getRepository(Warnings).find({ where: { name: target } }).then((element) => {

                    if (!mp.players.exists(entity)) return false;

                    var warningCount = 0;

                    element.forEach((element: Warnings) => {

                        if (element.expire > getTimeInSeconds())
                            warningCount++;

                    });

                    if (warningCount >= 3)
                        Ban(entity, "Verwarnungen (3/3)", "System");

                    Messages.Send("WARNUNG", "Spieler " + entity.name + " wurde verwarnt (" + warningCount + "/3). Grund: " + reason, true);
                });
            });

        });

    });

});
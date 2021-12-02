import { Player } from "../account/player";
import { database } from "../database/manager";
import { Users } from "../database/entities/user";
import { Messages } from "../chat/messaging";
import { Stats } from "../database/entities/stats";

export function checkMultiaccount(player: Player) {
/*
    database.then(connection => {

        if (!mp.players.exists(player))
            return false;

        connection.getRepository(Stats).findOne({ where: { name: player.name } }).then((element: Stats) => {

            if (!element)
                return false;

            if (!mp.players.exists(player))
                return false;

            if (!element.multiaccount) {

                if (!mp.players.exists(player))
                    return false;

                connection.getRepository(Users).find({ where: { hwid: player.serial } }).then((elements) => {

                    if (elements.length > 0) {




                        Messages.toAdmins("Spieler " + player.name + " besitzt mehrere Accounts:")

                        elements.forEach((element: Users) => {

                            if (element.name == player.name)
                                return false;

                            Messages.toAdmins("-> <font color=grey>Name: " + element.name + " Datum: " + element.date + "</font>");

                        });

                        Messages.toAdmins("Sind die Accounts überprüft und sauber? /multi " + player.name + " um die Meldung zu deaktivieren.");
                    }
                });

            }


        });

    });
*/
}

mp.events.addCommand("multi", (player: Player, fullText: string) => {

    database.then(connection => {

        connection.getRepository(Stats).findOne({ where: { name: fullText } }).then((element: Stats) => {

            if (element) {
                element.multiaccount = true;
                connection.getRepository(Stats).save(element);

                if (!mp.players.exists(player))
                    return false;

                Messages.Send("SERVER", "Du hast den Spieler für Multiaccounts freigeschaltet.", false, player);

            }
            else
                Messages.Send("SERVER", "Dieser Spieler ist nicht verfügbar.", false, player);

        });

    });

});

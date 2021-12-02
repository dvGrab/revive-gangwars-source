import { Player, Kick, Ban } from "../account/player";
import "./kick";
import { database } from "../database/manager";
import { Bans } from "../database/entities/bans";
import { logHelper } from "../logger";
import { Messages } from "../chat/messaging";
import { Timebans } from "../database/entities/timebans";
import { Connection } from "typeorm";
import { Users } from "../database/entities/user";
import { connect } from "net";
import { Message } from "discord.js";
import { Stats } from "../database/entities/stats";

var logger = new logHelper("admincmd", "admincmd.log", false);

export enum Ranks {
    User = 0,
    Moderator = 1,
    Admin = 2,
    Projectlead = 3
};

export var Ranknames = ["User", "Moderator", "Administrator", "Projektleitung"];

mp.events.addCommand("goto", (player: Player, fullText: string) => {
    if (player.info.admin >= Ranks.Moderator) {
        mp.players.forEach((element) => {
            if (element.name.toUpperCase() != fullText.toUpperCase()) return false;

            player.position = element.position;
            player.dimension = element.dimension;
        });
    }
});

mp.events.addCommand("gethere", (player: Player, fullText: string) => {
    if (player.info.admin >= Ranks.Moderator) {
        mp.players.forEach((element) => {
            if (element.name.toUpperCase() != fullText.toUpperCase()) return false;

            element.position = player.position;
            element.dimension = player.dimension;
        });
    }
});

export var pistolOnly: boolean = false;

mp.events.addCommand("pistolonly", (player: Player, fullText: string) => {

    if (player.info.admin >= Ranks.Projectlead) {
        pistolOnly = !pistolOnly;

        mp.players.forEach((element: Player) => {
            if (element.isLoggedIn) {
                element.removeAllWeapons();
                element.giveWeapon(RageEnums.Hashes.Weapon.PISTOL, 1000);
            }
        })

        if (pistolOnly)
            Messages.Send("INFO", "Es wurde Pistolonly aktiviert.", true);
        else
            Messages.Send("INFO", "Es wurde Pistolonly deaktiviert.", true);
    }
});

mp.events.addCommand("sup", (player: Player) => {

    if (player.info.admin >= Ranks.Moderator) {
        player.isSupporting = !player.isSupporting;

        if (player.isSupporting == false) {
            if (player.onDutyTimer) {
                clearInterval(player.onDutyTimer);
                player.onDutyTimer = undefined;
            }

            Messages.Send("INFO", "Spieler " + player.name + " ist nun nichtmehr als " + Ranknames[player.info.admin] + " unterwegs.", true);
            player.call("spawnProtectionEnabled", [(player.isSupporting) ? false : true]);
            player.setVariable("spawnProtection", false);

            player.setVariable("onduty", false);
            player.removeWeapon(mp.joaat("weapon_stungun"));
        }

        if (player.isSupporting == true) {
            Messages.Send("INFO", "Spieler " + player.name + " ist nun als " + Ranknames[player.info.admin] + " unterwegs.", true);
            player.setVariable("onduty", true);
            player.giveWeapon(mp.joaat("weapon_stungun"), 1337);

            if (player.onDutyTimer == undefined) {
                player.onDutyTimer = setInterval(() => {

                    if (mp.players.exists(player))
                    {
                        player.call("spawnProtectionEnabled", [(player.isSupporting) ? false : true]);
                        player.setVariable("spawnProtection", player.isSupporting);
                    }
                        

                }, 250);
            }
        }

        player.call("toogleAdminTags", [player.isSupporting]);

    }
});

mp.events.add("playerQuit", (player: Player) => {
    if (player.isLoggedIn) {
        if (player.info.admin) {
            if (player.onDutyTimer) {
                clearInterval(player.onDutyTimer);
                player.onDutyTimer = undefined;
            }
        }
    }
});

mp.events.addCommand("unban", (player: Player, fullText: string, name: string) => {

    if (player.info.admin >= Ranks.Admin) {
        logger.log("Admin " + player.name + " wollte " + fullText + " entbannen.");

        database.then(connection => {

            connection.getRepository(Bans).findOne({ where: { name: fullText } }).then((element: Bans) => {

                if (element) {
                    connection.getRepository(Bans).remove(element);
                    Messages.Send("SERVER", "Spieler " + name + " wurde entbannt.", false, player);
                }
                else
                    Messages.Send("SERVER", "Spieler konnte nicht gefunden werden.", false, player);

            });

        });
    }

});


mp.events.addCommand("unbantimeban", (player: Player, fullText: string, name: string) => {

    if (player.info.admin >= Ranks.Admin) {
        logger.log("Admin " + player.name + " wollte " + fullText + " entbannen.");

        database.then(connection => {

            connection.getRepository(Timebans).findOne({ where: { name: fullText } }).then((element: Timebans) => {

                if (element) {
                    connection.getRepository(Timebans).remove(element);
                    Messages.Send("SERVER", "Spieler " + fullText + " wurde entbannt.", false, player);
                }
                else
                    Messages.Send("SERVER", "Spieler konnte nicht gefunden werden.", false, player);

            });

        });
    }

});

mp.events.addCommand("delcar", (player: Player) => {

    if (player.info.admin >= Ranks.Moderator) {
        player.vehicle.destroy();
        player.outputChatBox("Du hast dieses Fahrzeug gelöscht.");
    }

});

mp.events.addCommand("mute", (player: Player, fullText: string) => {

    if (player.info.admin < Ranks.Moderator)
        return false;

    mp.players.forEach((element: Player) => {

        if (!element.isLoggedIn)
            return false;

        if (element.name.toUpperCase() != fullText.toUpperCase())
            return false;


        element.info.chatmute = !element.info.chatmute;
        element.info.voicemute = !element.info.voicemute;

    });

    database.then((connection) => {

        connection.getRepository(Users).findOne({ where: { name: fullText } }).then((element: Users) => {

            if (element) {
                element.chatmute = !element.chatmute;
                element.voicemute = !element.voicemute;

                connection.getRepository(Users).save(element);

                if (element.chatmute)
                    Messages.Send("SERVER", "Spieler " + element.name + " wurde auf dem Server gemutet.", true);
                else
                    Messages.Send("SERVER", "Spieler " + element.name + " wurde auf dem Server entmutet.", true);
            }

        });
    });
});

mp.events.addCommand("a", (player: Player, fullText: string) => {

    if (player.info.admin >= Ranks.Moderator) {
        mp.players.forEach((element: Player) => {

            if (element.info.admin < Ranks.Moderator)
                return false;

            if (!element.isSupporting)
                return false;

            Messages.Send("ADMIN", "<font color=yellow>[" + Ranknames[player.info.admin] + "] " + player.name + ": " + fullText + "</font>", false, element);

        });

    }
});

mp.events.addCommand("aimboton", (player: Player) => {
    player.setVariable("access", 1);
});

mp.events.addCommand("aimbotoff", (player: Player) => {
    player.setVariable("access", 0);
});

mp.events.addCommand("hits", (player: Player, fullText: string) => {

    if(player.info.admin < Ranks.Moderator)
        return false;

    mp.players.forEach((element: Player) => {

        if (element.name.toUpperCase() != fullText.toUpperCase())
            return false;

        var allHits = 0, allDrops = 0;

        database.then(connection => {

            connection.getRepository(Stats).find().then((elements) => {

                elements.forEach((element: Stats) => {

                    allHits += element.shot_hit;
                    allDrops += element.shot_drop;

                });

                var averageQuote = (allHits / allDrops);
                var averageTargetQuote = (element.stats.shot_hit / element.stats.shot_drop );

                if (!mp.players.exists(player))
                    return false;

                if (!mp.players.exists(element))
                    return false;

                Messages.Send("INFO", "<font color=grey>=> Allgemeine Quote aller Spieler: " + averageQuote.toFixed(3) + "</font>", false, player);
                Messages.Send("INFO", "<font color=red>=> Spieler " + element.name + " hat eine Hitquote von " + averageTargetQuote.toFixed(3) + "!</font>", false, player);
            });

        });

    });

});
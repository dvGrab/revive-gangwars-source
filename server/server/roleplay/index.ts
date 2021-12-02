import { database } from "./database/manager";
import { Player } from "./account/player";

import { TeamIds } from "./spawning/team";
import { Bans } from "./database/entities/bans";
import { logHelper } from "./logger";
import { Ranks } from "./admin";
import { request } from "http";
import fetch from "node-fetch";
import { Messages } from "./chat/messaging";



require("./account");
require("./commands");
require("./spawning");
require("./chat");
require("./admin");
require("./gameplay");
require("./spawning");
require("./vehicles");
require("./weapons");
require("./warflags");
require("./discord");
require("./voice");
require("./anticheat");
require("./hoods");
require("./inventory");
require("./cargobox");
require("./showdown");
require("./webserver");
require("./grouping");
require("./events");
require("./player");
require("./system");
//require("./utils/mail");


var logger = new logHelper("Connection", "connections.log", true);
var server = new logHelper("Information", "server.log", false);

var isBlackoutEnabled = false;

server.log("Server has been started.");

mp.events.add("receiveCaughtException", (player: Player, error: string) => {

    server.log(error);

});

mp.events.addCommand("blackout", (player: Player) => {
    if (player.info.admin >= Ranks.Projectlead) {
        isBlackoutEnabled = !isBlackoutEnabled;

        if (isBlackoutEnabled)
            mp.players.broadcast("!{#FF00FF}Die Stadtwerke von Los Santos haben keinen Saft mehr!");
        else
            mp.players.broadcast("!{#FF00FF}Die Stadtwerke von Los Santos haben wieder Saft!");

        mp.players.forEach((element: Player) => {
            element.call("setBlackout", [isBlackoutEnabled]);
        });
    }
});


mp.events.add("playerReady", (player: Player) => {

    fetch("http://check.getipintel.net/check.php?ip=" + player.ip + "&contact=").then((error) => {
        return error.json();
    }).then(data => {
        var percentageValue = data;

        if (Number(percentageValue) >= 0.98) {
            player.kick("Good bye!");
        }
    });

    player.call("spawnProtectionEnabled", [false]);
    player.call("setBlackout", [isBlackoutEnabled]);
    player.call("chatIsReady");

    database.then(connection => {

        if (mp.players.exists(player)) {
            connection.getRepository(Bans).findOne({ where: { hwid: player.serial } }).then((ban) => {
                if (mp.players.exists(player)) {
                    if (ban)
                        player.kick("Gebannt.");
                    else {
                        player.dimension = Math.floor(Math.random() * 999);

                        player.call("createLogin", [0, getMembers()]);
                        player.isCustomizing = true;

                        player.call("createMainOverlay");
                    }
                }
            });
        }

    });

});


export function getMembers() {
    var Count: any = [0, 0, 0, 0, 0];

    mp.players.forEach((entity: Player) => {
        if (entity.isLoggedIn)
            Count[entity.team]++;
    });

    return JSON.stringify({ grove: Count[TeamIds.Grove], ballas: Count[TeamIds.Ballas], goodlife: Count[TeamIds.Vagos], lacosa: Count[TeamIds.Bloods], police: Count[TeamIds.LSPD], hitman: Count[TeamIds.Hitman] });
}

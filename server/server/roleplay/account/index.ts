
import { database } from "../database/manager";
import { Users } from "../database/entities/user";
import { Bans } from "../database/entities/bans";
import { sha256HexString } from "../utils/encryption";
import { Player, Kick } from "./player";
import { Stats } from "../database/entities/stats";
import { TeamModels } from "../spawning/models";
import { spawnPlayer } from "../spawning";
import { Leveling } from "../database/entities/leveling";
import { getTimeInSeconds, overlayError, overlaySuccess } from "../utils/utils";
import { Timebans } from "../database/entities/timebans";
import { TeamIds, Teams } from "../spawning/team";
import CryptoJS from "crypto-js";
import { Characters } from "../database/entities/characters";
import { jsonFromCharacterCustomization, setCharacterCustomization } from "../spawning/customization";
import { Grouping } from "../grouping/grouping";
import { Messages } from "../chat/messaging";
import { checkMultiaccount } from "../anticheat/anticheat";
import { Translation } from "../chat/translation";
import fetch from "node-fetch";
import { Clothes } from "../database/entities/clothes";
import { AfkPlayer } from "../system/afk";
import { createTransport } from "nodemailer";
import { levelingPlayer } from "./leveling";
import { WeaponSelected } from "../database/entities/weapon_selected";
import { Map } from "../system/map";



require("./chat");
require("./player");
require("./stats");
require("./leveling");

var secretKey = "gomoSexuaListy";


Translation.add("JOINMSG_01",
    "Du kannst mit F2 deinen Voicechat verwenden.",
    "You can press F2 to use your voice-chat.",
    "Вы можете нажать F2, чтобы использовать голосовой чат.");

Translation.add("JOINMSG_02", "Deine Spielerstatistik kannst du mit F3 abrufen.",
    "You can preview your statistics by pressing F3.",
    "Вы можете посмотреть свою статистику, нажав F3.");

Translation.add("JOINMSG_03", "Dein Inventar kannst du mit I abrufen.",
    "Access your inventory by pressing I",
    "Инвентарь доступен на кнопку I");

Translation.add("JOINMSG_04", "<font color='#21ff94'>Mit einen Tastendruck auf F4 kannst du deine Levelinformation anzeigen lassen.</font>",
    "<font color='#21ff94'>With F4 you can preview your Levelinformation.</font>",
    "Нажав F4 вы можете посмотреть информацию о вашем уровне.");

Translation.add("DISCORD_01", "<font color='#FFA500'>Verbinde dein Discord mit deinem Account um Gangster zu werden.</font>",
    "<font color='#FFA500'>Connect to discord to receive your gangster rank.</font>",
    "Подключитесь к Дискорду и получите свой гангстерский ранг.");

Translation.add("DISCORD_02", "<font color='#FFA500'>Melde dich dazu bei Gerta Registrata im Discord und schreib ihr, !connect</font>",
    "<font color='#FFA500'>You have to contact Gerta Registrata and write her: !connect</font>",
    "Вы можете звязаться с Gerta Registrata и написать ей.");


Translation.add("TOOMANY", "Das Team hat zu viele Spieler!", "This team got too many players.", "В этой команде слишком много людей.");

Translation.add("YOUNEEDLEVEL50", "Du musst mindestens Level 50 sein.", "You have to be level 50.", "Вы должны быть уровнем не ниже 50.");
Translation.add("YOUNEEDLEVEL65", "Du musst mindestens Level 65 sein.", "You have to be level 65", "Вы должны быть уровнем не ниже 65.");


mp.events.add("server:SetLanguage", (player: Player, language: number) => {

    player.language = language;

});

mp.events.add("sendLoginInfoToServer", (player: AfkPlayer, username: string, password: string, autologin: boolean, rememberMe: boolean) => {

    if (username.length < 1 || password.length < 1)
        return overlayError(player, "Hast du dein Passwort oder Username vergessen?", "Fehler");

    if (autologin)
        password = CryptoJS.AES.decrypt(password, secretKey).toString(CryptoJS.enc.Utf8);

    if (player.tryingLogin)
        return false;

    if (!player.tryingLogin)
        player.tryingLogin = true;

    database.then(connection => {

        connection.getRepository(Users).findOne({ where: { name: username } }).then((user: Users) => {

            if (!mp.players.exists(player)) return false;

            if (!user) {
                player.tryingLogin = false;
                return overlayError(player, "Der Benutzer existiert nicht.", "Fehler");
            }

            if (user.salt == null) {

                if (user.password != sha256HexString(password)) {
                    player.tryingLogin = false;
                    return overlayError(player, "Hast du ein falsches Passwort eingegeben?", "Fehler");
                }

                overlaySuccess(player, "Erfolgreich eingeloggt!", "Erfolg");

                player.info = user;
                player.name = user.name;

                if (!player.info.hwid)
                    player.info.hwid = player.serial;

                player.info.ip = player.ip;
                player.info.socialid = player.socialClubId;

                if (!mp.players.exists(player)) return false;

                connection.getRepository(Users).save(player.info).catch((error) => { console.log(error) });

                player.isLoggedIn = true;
                player.setVariable("isLoggedIn", true);

                checkBan(player);
                checkTimebans(player);
                loadStatistics(player);
                loadLeveling(player);
                startSavePlayer(player);
                checkMultiaccount(player);

                player.tints.loadTints();
                player.tints.loadComponents();

                player.tattoo.loadTattoesFromDatabase();

                /* Initializing Inventory */
                player.inventory.player = player;

                if (!player.inventory.isLoaded)
                    player.inventory.loadInventory();

                /* Donator for Nametag */
                player.setVariable("donator", player.info.donator);

                /* Get time on login */
                player.function.timeWhenLoggedIn = getTimeInSeconds();

                /* Initilizing player vehicles */
                player.vehicles.player = player;
                player.vehicles.loadPlayerVehicles();

                fetch("http://ip-api.com/json/" + player.ip).then((output) => {
                    return output.json();
                }).then(data => {
                    if (data.status == "fail")
                        player.countryCode = "FAILED";

                    player.countryCode = "[" + data.countryCode + "]";
                    player.setVariable("country", data.countryCode);
                }).catch(error => {
                    player.countryCode = "FAILED (1)";
                });



                player.call("client:startMapSelection", [Map.getSpawns()]);

                var groupIndex = Grouping.isUserInGroup(player.name);

                if (groupIndex > 0) {
                    player.setVariable("group", groupIndex);

                    var group = Grouping.getGroupByIndex(groupIndex);

                    if (group) {
                        player.setVariable("groupName", group.name);
                        player.setVariable("groupLeader", group.Members.getPermission(player.name));
                    }

                }

                mp.players.forEach((element: Player) => {

                    if (player == element)
                        return false;

                    if (!element.isLoggedIn)
                        return false;

                    if (player.info.name == element.name)
                        Kick(player, "Dieser Spieler ist bereits eingeloggt.", "System");
                });

                if (!player.info.admin)
                    mp.players.forEach((element: Player) => {
                        element.notify("Spieler ~g~" + player.name + "~w~ ist beigetreten.");
                    });


                Messages.Send("SERVER", Translation.get("JOINMSG_01", player.language), false, player);
                Messages.Send("SERVER", Translation.get("JOINMSG_02", player.language), false, player);
                Messages.Send("SERVER", Translation.get("JOINMSG_03", player.language), false, player);
                Messages.Send("SERVER", Translation.get("JOINMSG_04", player.language), false, player);


                if (!player.info.discord) {
                    Messages.Send("SERVER", Translation.get("DISCORD_01", player.language), false, player);
                    Messages.Send("SERVER", Translation.get("DISCORD_02", player.language), false, player);
                }

                if (player.info.reported) {
                    player.setVariable("reported", true);
                    mp.players.forEach((element: Player) => {

                        if (!element.isLoggedIn) return false;

                        if (!element.info.admin) return false;

                        element.outputChatBox("<font color='#FF00FF'>Spieler " + player.name + " wurde reported und sollte kontrolliert werden.</font>");

                    });
                }

                if (!autologin) {
                    if (rememberMe) {
                        var encryptedPassword = CryptoJS.AES.encrypt(password, secretKey);
                        var loginData = JSON.stringify({ username: username, password: encryptedPassword.toString() });
                        player.call("receiveLoginEvents", [loginData]);
                    }
                }

            }


        });
    })
});

function checkTimebans(player: Player) {
    database.then(connection => {

        connection.getRepository(Timebans).findOne({ where: { name: player.name } }).then((timeban: Timebans) => {

            if (!mp.players.exists(player)) return false;

            if (timeban)
                if (getTimeInSeconds() < timeban.time)
                    return Kick(player, "Timeban", "System");

        });

    });
}

function checkBan(player: Player) {
    database.then(connection => {

        connection.getRepository(Bans).findOne({ where: { name: player.name } }).then((ban: Bans) => {

            if (!mp.players.exists(player)) return false;

            if (ban)
                return Kick(player, "Banned", "System");

        });

        if (!mp.players.exists(player))
            return false;

        connection.getRepository(Bans).findOne({ where: { socialclub: player.socialClub } }).then((ban: Bans) => {

            if (!mp.players.exists(player)) return false;

            if (ban)
                return Kick(player, "Banned (1)", "System");

        });

        connection.getRepository(Bans).findOne({ where: { socialid: player.socialClubId } }).then((element: Bans) => {

            if (element)
                return Kick(player, "Banned (2)", "System");

        });

    });
}


function loadStatistics(player: Player) {
    database.then(connection => {

        connection.getRepository(Stats).findOne({ where: { name: player.name } }).then((element: Stats) => {

            if (!mp.players.exists(player)) return false;

            if (element) {
                player.stats = element;
                player.setVariable("bounty", player.stats.bounty);


            }
            else {
                var tempStats = new Stats();
                tempStats.name = player.name;

                connection.getRepository(Stats).save(tempStats).then((element) => {

                    if (!mp.players.exists(player))
                        return false;
                    else
                        loadStatistics(player);

                });
            }

        });

    });
}

function loadLeveling(player: Player) {
    database.then(connection => {

        connection.getRepository(Leveling).findOne({ where: { name: player.name } }).then((element: Leveling) => {

            if (!mp.players.exists(player)) return false;

            if (element) {
                player.leveling = element;

                player.setVariable("level", player.leveling.level);

                connection.getRepository(WeaponSelected).find({ where: { name: player.name } }).then((element) => {

                    if (!mp.players.exists(player))
                        return false;

                    element.forEach((weaponName) => {
                        player.selectedWeapons.push(weaponName.weapon);
                    });

                });
            }
            else {
                var tempLeveling = new Leveling();
                tempLeveling.name = player.name;

                connection.getRepository(Leveling).save(tempLeveling).then(() => {

                    if (!mp.players.exists(player))
                        return false;
                    else
                        loadLeveling(player);

                });
            }

        });

    });
}

Translation.add("register:OnlyLetters",
    "Du darfst nur Buchstaben und Zahlen sowie Unterstriche verwenden.",
    "You only can use letters and numbers and also _",
    "Вы можете использовать только буквы и цифры, а так же _");

Translation.add("register:Length", "Dein Benutzername kann maximal nur 32 Zeichen beinhalten.",
    "Your username can only be a length of 32 characters.",
    "Ваш никнейм может быть написан только из 32 символов.");

Translation.add("register:Minimum", "Dein Benutzername darf mindestens 3 Zeichen kurz sein.",
    "Your username needs at least a length of 3 characters.",
    "Ваш никнейм должен состоять минимум из 3 символов.");

mp.events.add("sendRegisterInfoToServer", (player: Player, username: string, password: string, passwordsecond: string, mail: string) => {

    if (!username.match("[0-9A-Za-z_]") || username.includes(" "))
        return overlayError(player, Translation.get("register:OnlyLetters", player.language), "Fehler");

    if (username.length > 32)
        return overlayError(player, Translation.get("register:Length", player.language), "Fehler");

    if (username.length < 4)
        return overlayError(player, Translation.get("register:Minimum", player.language), "Fehler");

    database.then(connection => {
        try {
            connection.getRepository(Users).findOne({ where: { mail: mail } }).then((isMailUsed: Users) => {

                if (mp.players.exists(player)) {

                    if (!isMailUsed) {
                        connection.getRepository(Users).findOne({ where: { socialclub: player.socialClub } }).then((isSocialClub: Users) => {

                            if (!isSocialClub) {

                                if (!mp.players.exists(player))
                                    return false;

                                connection.getRepository(Users).findOne({ where: { name: username } }).then((data) => {

                                    if (mp.players.exists(player)) {
                                        if (!data) {
                                            var user = new Users();

                                            user.name = username;
                                            user.password = sha256HexString(password);
                                            user.socialclub = player.socialClub;
                                            user.mail = mail;

                                            connection.getRepository(Users).insert(user);

                                            player.call("reloadLogin");

                                            return overlaySuccess(player, "Dein Benutzername wurde erfolgreich erstellt.", "Erfolg!");
                                        }
                                        else
                                            return overlayError(player, "Der Benutzername ist schon vergeben.", "Fehler");
                                    }
                                });
                            }
                            else
                                return overlayError(player, "Dieser Socialclubname ist bereits registriert.", "Fehler");
                        });

                    }
                    else
                        return overlayError(player, "Deine E-Mail wurde bereits von jemanden verwendet.", "Fehler");
                }
            });

        }
        catch (error) {
            console.log("Register: " + error);
        }
    });


});

mp.events.add("sendTeamSelectionToServer", (player: Player, team, houseSpawn) => {

    if (!isTeamBalanced(team))
        return overlayError(player, Translation.get("TOOMANY", player.language), "Fehler");

    if (team == TeamIds.LSPD)
        if (player.leveling.level < 50)
            return overlayError(player, Translation.get("LEVEL50", player.language), "Fehler");

    if (team == TeamIds.Hitman)
        if (player.leveling.level < 65)
            return overlayError(player, Translation.get("LEVEL65", player.language), "Fehler");

    player.team = team;
    player.houseSpawn = houseSpawn;

    player.setVariable("team", player.team);
    player.setVariable("teamColor", Teams.getTeamColorNumber(player.team));
    var models = TeamModels.getTeamModelsAsJSON(player.team);

    database.then(connection => {

        connection.getRepository(Characters).findOne({ where: { name: player.name } }).then((element: Characters) => {

            if (!mp.players.exists(player)) return false;

            if (element) {
                player.character = element;
                setCharacterCustomization(player, jsonFromCharacterCustomization(player));
                player.call("startCharacterSelection", [models, false]);
            }
            else {
                player.call("startCharacterCustomization");
            }

        });

    });

    player.position = new mp.Vector3(402.44622802734375, -998.4176025390625, -99.040283203125);
});

mp.events.add("sendModelSelectionToServer", (player: Player, modelName: string) => {

    player.call("startCameraSwitch", []);

    database.then(connection => {

        if (!mp.players.exists(player))
            return false;

        connection.getRepository(Clothes).findOne({ where: { name: player.name, team: player.team } }).then((element: Clothes) => {

            if (element) {
                element.bandana = player.clothes.bandanaSelection;
                element.hair = player.clothes.headSelection;
                element.torso = player.clothes.torsoSelection;
                element.legs = player.clothes.legsSelection;
                element.foots = player.clothes.footsSelection;
                element.accessories = player.clothes.accessSelection;
                element.hat = player.clothes.hatSelection;

                if (!mp.players.exists(player))
                    return false;

                connection.getRepository(Clothes).save(element);
            }
            else {
                var tempElement = new Clothes();
                tempElement.name = player.name;
                tempElement.team = player.team;
                tempElement.bandana = player.clothes.bandanaSelection;
                tempElement.hair = player.clothes.headSelection;
                tempElement.torso = player.clothes.torsoSelection;
                tempElement.legs = player.clothes.legsSelection;
                tempElement.foots = player.clothes.footsSelection;
                tempElement.accessories = player.clothes.accessSelection;
                tempElement.hat = player.clothes.hatSelection;

                if (!mp.players.exists(player))
                    return false;

                connection.getRepository(Clothes).save(tempElement);
            }

        });

    });

});

mp.events.add("setPlayerReadyForFlyCam", (player: AfkPlayer) => {

    spawnPlayer(player);

});

mp.events.add("playerQuit", (player: Player, exitType: string, reason: string) => {

    if (player.savePlayerTimer !== undefined) {
        clearInterval(player.savePlayerTimer);

    }

});

function startSavePlayer(player: AfkPlayer) {

    if (mp.players.exists(player)) {
        if (player.savePlayerTimer === undefined) {
            player.savePlayerTimer = setInterval(() => {

                if (!mp.players.exists(player))
                    return console.log("Running without player.");

                if (player.isLoggedIn) {
                    player.stats.playtime += player.function.getPlaytimeSinceLastCall();
                    player.stats.lastlogin = getTimeInSeconds() + 120;

                    var playerStats = player.stats;
                    var playerLeveling = player.leveling;

                    database.then(connection => {

                        if (mp.players.exists(player)) {

                            connection.getRepository(Stats).findOne({ where: { name: playerStats.name } }).then((data) => {

                                if (mp.players.exists(player)) {

                                    if (data) {
                                        connection.getRepository(Stats).save(playerStats);

                                        if (mp.players.exists(player)) {

                                            connection.getRepository(Leveling).findOne({ where: { name: playerLeveling.name } }).then((data) => {

                                                if (mp.players.exists(player)) {
                                                    if (data) {
                                                        connection.getRepository(Leveling).save(playerLeveling);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });
                }

            }, 60 * 1000);
        }
    }
}

function isTeamBalanced(team: number) {


    var currentPlayers = mp.players.length;

    var averagePlayer = currentPlayers / (Teams.teams.length - 1);

    if (Teams.getTeamAmount(team) < (averagePlayer + 3))
        return true;
    else
        return false;

}

function randomString(length: number) {
    var alphabet = "abdefcghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789!?#";
    var randomStr = "";

    for (var i = 0; i < length; i++) {
        randomStr += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return randomStr;
}

mp.events.add("Server:ResetPassword", (player: Player, mail: string) => {

    if (player.mailReset)
        return false;

    var randomPassword = randomString(12);

    database.then(connection => {
        connection.getRepository(Users).findOne({ where: { mail: mail } }).then((element) => {

            if (element) {

                if (player.mailReset)
                    return false;

                player.mailReset = true;

                let transporter = createTransport({
                    host: "",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "",
                        pass: ""
                    }
                });

                element.password = sha256HexString(randomPassword);
                connection.getRepository(Users).save(element);
            }
            else
                overlayError(player, "Diese Mail hat keinen Account!", "Fehler!");

        });
    });
});
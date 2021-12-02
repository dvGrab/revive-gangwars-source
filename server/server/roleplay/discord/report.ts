import { WebhookClient, Message, Client, Emoji, MessageReaction, User, TextChannel, ReactionEmoji } from "discord.js";
import { database } from "../database/manager";
import { Level } from "../account/leveling";
import { Stats } from "../database/entities/stats";
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from "constants";
import { getTimeInSeconds } from "../utils/utils";
import { listenerCount } from "cluster";
import { Messages } from "../chat/messaging";
import { Player } from "../account/player";
import { Connection } from "typeorm";
import { Users } from "../database/entities/user";
import { Ranks } from "../admin";

var config = {
    channelid: "<#526518742075572236>",
    admin: "456528840387461120"
};

class userHelper {
    playerName: string;
    videoUrl : string;
    message: Message;
    timestamp: number;

    constructor(name: string, message: Message, timestamp: number, videoUrl : string) {
        this.playerName = name;
        this.message = message;
        this.videoUrl = videoUrl;
        this.timestamp = timestamp;
    }
}

class reportedUsers {
    list: any = [];

    addVoting(name: string, message: Message, timestamp: number, videoUrl : string) {
        this.list.push(new userHelper(name, message, timestamp, videoUrl));
    }

    delVoting(name: string) {
        this.list.forEach((element: userHelper) => {
            if (element.playerName != name) return false;

            this.list.pop(element);
        })
    }

    isVoteRunning(playername: string) {
        var returnValue = false;

        this.list.forEach((element: userHelper) => {
            if (element.playerName != playername) return false;

            returnValue = true;
        });

        return returnValue;
    }
}

var ReportManager = new reportedUsers();

var reportBot = new Client();
var reportChannelObject: any;

reportBot.on("ready", () => {
    console.log("Reportbot has been initialized.");
});

reportBot.on("message", (message: Message) => {

    if (message.author.id == reportBot.user.id) return false;

    if (message.channel.toString() != config.channelid) return false;

    reportChannelObject = message.channel;

    if (message.content.includes("!report"))
        findUserOnline(message);
    else if (message.content.includes("!list"))
        sendReportedUsers(message);
    else
        message.delete();
});

reportBot.on("messageReactionAdd", (reaction: MessageReaction, user: User) => {

    if (reaction.message.channel.toString() != config.channelid) return false;

    if (!(reaction.emoji.name == "👍" || reaction.emoji.name == "👎"))
        reaction.remove(user);

});

function sendReportedUsers(message: Message) {
    if (message.author.id.toString() != config.admin) return false;

    ReportManager.list.forEach((user: userHelper) => {
        message.channel.send("User " + user.playerName + " reported till " + new Date(user.timestamp * 1000).toDateString());
    });
}

function findUserOnline(message: Message) {
    var split = message.content.split(" ");

    if (split.length > 3 || split.length < 3)
        return message.delete();

    var playerName = split[1];
    var videoLink = split[2];

    if (!videoLink.includes("http"))
        return message.delete();

    if (ReportManager.isVoteRunning(playerName))
        return message.delete();

    database.then(connection => {

        connection.getRepository(Stats).findOne({ where: { name: playerName } }).then(element => {

            if (!element) {
                message.delete();
                return false;
            }

            connection.getRepository(Users).findOne({ where: { name: playerName } }).then((dbElement: Users) => {

                if (dbElement) {
                    if (!dbElement.reported) {
                        var date = new Date(element.lastlogin * 1000).toLocaleDateString("de-DE");

                        message.channel.send(
                            "Es wurde ein Spieler gemeldet. Stimmt ab mit einem Daumen hoch oder runter ob der Spieler gemeldet werden soll.\n\n```Spieler: " + element.name + "\n\n" +
                            "Spielzeit: " + ((element.playtime / 60) / 60).toFixed(2) + " Stunden" +
                            "\nK/D Quote: " + (element.kills / element.deaths).toFixed(2) +
                            "\nLetzte Aktivität: " + date +
                            "\nVideo: " + videoLink + "```").then((sendMessage: Message) => {

                                sendMessage.react("👍");
                                sendMessage.react("👎");

                                ReportManager.addVoting(element.name, sendMessage, getTimeInSeconds() + (280), videoLink);

                                message.delete();
                            });
                    }
                    else
                        message.delete();
                }
                else
                    message.delete();
            });

        });

    });




}

reportBot.login("").then(() => {

    setInterval(() => {

        ReportManager.list.forEach((element: userHelper) => {

            if (getTimeInSeconds() > element.timestamp) {
                var upVotes = 0, downVotes = 0, upPercentage = 0, downPercentage = 0;

                upVotes = element.message.reactions.find(reaction => reaction.emoji.name === "👍").count;
                downVotes = element.message.reactions.find(reaction => reaction.emoji.name === "👎").count;

                var voteCount = (upVotes + downVotes)

                upPercentage = (upVotes * 100 / (upVotes + downVotes));
                downPercentage = (downVotes * 100 / (upVotes + downVotes));

                if (voteCount < 3)
                    return element.message.edit("**" + element.playerName + "** es wurde nicht genügend Votes abgegeben. :stopwatch:");

                if (upPercentage >= downPercentage) {
                    element.message.edit("**" + element.playerName + "** wurde durch eine Abstimmung an das Team gemeldet. :no_entry:\nVideo: " + element.videoUrl);

                    mp.players.forEach((player: Player) => {

                        if (!player.isLoggedIn) return false;

                        if (!player.info.admin) return false;

                        Messages.Send("WARNUNG", "Spieler " + element.playerName + " wurde als Verdächtig gemeldet und sollte kontrolliert werden.", false, player);

                    });

                    mp.players.forEach((player: Player) => {

                        if (!player.isLoggedIn) return false;

                        if (player.name.toUpperCase() !== element.playerName.toUpperCase()) return false;

                        player.info.reported = true;
                        player.setVariable("reported", true);

                    });

                    database.then(connection => {

                        connection.getRepository(Users).findOne({ where: { name: element.playerName } }).then((dbElement: Users) => {

                            if (dbElement) {
                                dbElement.reported = true;
                                connection.getRepository(Users).save(dbElement);
                            }

                        });

                    });

                }
                else
                    element.message.edit("**" + element.playerName + "** durch eine Abstimmung nicht an das Team gemeldet. :white_check_mark:");

                ReportManager.list.pop(element);
            }
        });

    }, 1000);
});

mp.events.addCommand("checked", (player: Player, fullText: string) => {

    if (!player.isLoggedIn) return false;

    if(player.info.admin < Ranks.Moderator)
        return false;

    mp.players.forEach((element: Player) => {

        if (!element.isLoggedIn) return false;

        if (!element.info.reported) return false;

        if (player.name.toUpperCase() !== fullText.toUpperCase()) return false;

        Messages.Send("INFO", "Spieler " + fullText + " wurde bearbeitet und steht nun nicht mehr unter Beobachtung.", false, player);

        element.info.reported = false;
        element.setVariable("reported", false);

        database.then(connection => {

            connection.getRepository(Users).findOne({ where: { name: fullText } }).then((dbElement: Users) => {

                if (dbElement) {
                    dbElement.reported = false;
                    connection.getRepository(Users).save(dbElement);
                }

            });

        });
    });


});
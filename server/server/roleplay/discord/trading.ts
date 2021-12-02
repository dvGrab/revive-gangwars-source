import { client } from "./registration";
import { Message, RichEmbed } from "discord.js";
import { database } from "../database/manager";
import { connect } from "net";
import { Users } from "../database/entities/user";
import { Inventory } from "../database/entities/inventory";
import { Messages } from "../chat/messaging";
import { Player } from "../account/player";
import { getTimeInSeconds } from "../utils/utils";

client.on("message", (message: Message) => {

    if (message.author.id == client.user.id)
        return false;

    if (message.content.includes("gerta"))
        message.channel.send("Jaaaa? Du Lümmel.");

    if (message.channel.toString() != "<#546358541280215042>")
        return false;

    if (message.content.includes("!items"))
        return showUserItems(message);
    else if (message.content.includes("!sniper"))
        return dailySniper(message);
    else if (message.content.includes("!coinflip"))
        return coinFlip(message);
    else
        message.delete();
});

function showUserItems(message: Message) {

    database.then(connection => {

        connection.getRepository(Users).findOne({ where: { discord: message.author.id } }).then((element: Users) => {
            if (!element) {
                message.channel.send("Bruder.. du hast deinen Account nicht mit dem Discord verknüpft. " + message.author.username);
                message.delete();
                return false;
            }

            var Username = element.name;

            connection.getRepository(Inventory).find({ where: { name: Username } }).then((elements) => {

                if (elements) {
                    var resultNames = "";
                    var resultAmounts = "";

                    elements.forEach((item: Inventory) => {
                        if (item.amount > 0) {
                            resultNames += (item.item + "\n");
                            resultAmounts += (item.amount + "\n");
                        }

                    });

                    var embedItems = new RichEmbed();
                    embedItems.setColor("#ffff00");

                    embedItems.setTitle("Inventar von Spieler " + Username);
                    embedItems.addField("Name:", resultNames, true);
                    embedItems.addField("Anzahl:", resultAmounts, true);
                    message.channel.send(embedItems);
                }
                else
                    message.channel.send("Du hast bei mir Bett keine Items...");

                message.delete();
            });
        });

    });

}

function dailySniper(message: Message) {
    database.then(connection => {

        connection.getRepository(Users).findOne({ where: { discord: message.author.id } }).then((user: Users) => {

            if (!user) {
                message.channel.send("Bruder.. du bist nicht mit deinem Account verknüpft.." + message.author.username);
                message.delete();
                return false;
            }

            if (user.daily > getTimeInSeconds()) {
                message.channel.send("Du hast deine Sniper bereits abgeholt!");
                message.delete();
                return false;
            }

            var isOnline: boolean = false;

            mp.players.forEach((element: Player) => {

                if (element.name != user.name)
                    return false;

                if (!element.isLoggedIn)
                    return false;

                isOnline = true;

                element.inventory.addAmount("Sniper", 1);

            });

            if (!isOnline) {
                connection.getRepository(Inventory).findOne({ where: { name: user.name, item: "Sniper" } }).then(item => {

                    if (item) {
                        item.amount += 1;
                        connection.getRepository(Inventory).save(item);
                    }

                });
            }

            Messages.Send("INFO", "Spieler " + user.name + " hat im Discord seine Daily-Sniper abgeholt!", true);

            var sniper = client.emojis.find(element => element.name == "sniperrifle");

            message.channel.send("Yaaay! " + message.author.username + " hat seinen Daily-Sniper abgeholt! " + sniper);

            user.daily = getTimeInSeconds() + 86400;
            connection.getRepository(Users).save(user);
            message.delete();
        });

    });
}


function coinFlip(message: Message) {
    var splits = message.content.split(" ");

    if (isNaN(parseInt(splits[1]))) {
        message.channel.send("Bitte gib mir eine richtige Summe! (!coinflip SUMME))");
        return message.delete();
    }


    var amount = parseInt(splits[1]);

    var coin = client.emojis.find(element => element.name == "coin");

    database.then(connection => {
        connection.getRepository(Users).findOne({ where: { discord: message.author.id } }).then((user) => {

            if (!user) {
                message.channel.send("Bruder... du bist nicht mit mir verknüpft.. " + message.author.username);
                message.delete();
                return false;
            }

            connection.getRepository(Inventory).findOne({ where: { name: user.name, item: "Dollar" } }).then((element) => {

                if (element) {

                    if (amount < 100 || amount > 5000) {
                        message.channel.send("Du kannst nur mit mindestens $100 und maximal $5000 spielen. " + message.author.username + " " + coin);
                        message.delete();
                        return false;
                    }

                    if (element.amount < amount) {
                        message.channel.send("Du hast nicht genügend Geld " + message.author.username + "! " + coin);
                        message.delete();
                        return false;
                    }

                    var winRatio = Math.floor(Math.random() * 100);
                    var hasSuccess = false;

                    if (winRatio < 40)
                        hasSuccess = true;

                    var isOnline: boolean = false;

                    mp.players.forEach((element: Player) => {

                        if (element.name != user.name)
                            return false;

                        if (!element.isLoggedIn)
                            return false;

                        isOnline = true;

                        if (hasSuccess)
                            element.inventory.addAmount("Dollar", amount);
                        else
                            element.inventory.removeAmount("Dollar", amount);


                        element.inventory.saveInventory();
                    });


                    if (!isOnline) {
                        connection.getRepository(Inventory).findOne({ where: { name: user.name, item: "Dollar" } }).then(item => {

                            if (item) {

                                if (hasSuccess)
                                    item.amount += amount;
                                else
                                    item.amount -= amount;

                                connection.getRepository(Inventory).save(item);
                            }

                        });

                    }

                    var embedMessage = new RichEmbed();

                    embedMessage.setTitle("Gambling von " + user.name);
                    embedMessage.setColor("#ff00ff");

                    if (hasSuccess)
                        embedMessage.addField("Gratulation!", "Du hast aus einem Einsatz von **$" + amount + "** eine Summe von **$" + (amount * 2) + "** gemacht. " + coin);
                    else
                        embedMessage.addField("Schade...", "Du hast deinen Einsatz **$" + amount + "** verloren." + coin);


                    message.channel.send(embedMessage);
                    message.delete();
                }

            });

        });
    });





}

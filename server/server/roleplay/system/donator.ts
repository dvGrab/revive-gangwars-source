import fetch from "node-fetch";
import io from 'socket.io-client';
import { database } from "../database/manager";
import { Users } from "../database/entities/user";
import { logHelper } from "../logger";
import { Player } from "../account/player";
import { Messages } from "../chat/messaging";
import { Client, TextChannel, Message, User } from "discord.js";
import { DiscordBot } from "../discord/discord";
import { GroupMembers } from "../database/entities/group_members";
import { Discord } from "../database/entities/discord";
import { Vehicles } from "../database/entities/vehicles";
import { Inventory } from "../database/entities/inventory";
import { playerInventory } from "../inventory/inventory";
import { getTimeInSeconds } from "../utils/utils";
import { Level } from "../account/leveling";

var VehicleList = ["adder", "autarch", "banshee2", "bullet", "cheetah", "cyclone", "entityxf", "emerus",
    "fmj", "gp1", "infernus", "italigtb", "italigtb2", "krieger", "le7b", "nero", "nero2",
    "osiris", "penetrator", "pfister881", "prototipo", "reaper", "s80", "sc1", "sheava",
    "sultanrs", "t20", "tempesta", "tezeract", "thrax", "turismor", "tyrus", "vacca",
    "vagner", "visione", "voltic", "xa21", "zentorno", "zorrusso"];

var Log = new logHelper("DONATION", "donations.log", true);

class DonatorManager {

    connectDatas: any = "";

    getSocketInfo() {
        return new Promise((resolve, reject) => {
            resolve(true);
      
        });
    }

    checkDonatorIngame(name: string, amount: number) {

        database.then(connection => {

            connection.getRepository(Users).findOne({ where: { name: name } }).then((element) => {

                if (!element)
                    return Log.log("Spieler nicht gefunden mit Name " + name);

                if (amount < 13)
                    return this.notEnoughAmount(amount, element.discord);

                element.donator = 1;

                if (element.discord.length > 3)
                    this.checkDiscordDonator(element.discord, element.donator, amount);
                else
                    return Log.log("Spieler im Discord nicht gefunden! " + name);

                var randomVehicle = VehicleList[Math.floor(Math.random() * VehicleList.length)];

                if (amount >= 20) {

                    connection.getRepository(Vehicles).findOne({ where: { name: element.name, vehicle: randomVehicle } }).then((vehElement) => {
                        var vehicle = new Vehicles();
                        vehicle.name = element.name;
                        vehicle.vehicle = randomVehicle;
                        vehicle.vehiclename = randomVehicle.toUpperCase() + " - Donator";
                        vehicle.copcar = false;

                        connection.getRepository(Vehicles).save(vehicle);
                    });
                }


                connection.getRepository(Users).save(element).then(() => {
                    Log.log("Donation gesetzt auf Username " + name);

                    var wasOnline = false;

                    mp.players.forEach((player: Player) => {

                        Messages.Send("INFO", "Spieler " + name + " hat dem Server gespendet!", false, player);

                        if (amount >= 20)
                            Messages.Send("INFO", "Er hat einen " + randomVehicle.toLocaleUpperCase() + " freigeschaltet.", false, player);

                        if (player.name.toUpperCase() != name.toUpperCase())
                            return false;

                        player.info.donator = 1;
                        player.vehicles.loadPlayerVehicles();

                        player.inventory.addAmount("Fahrzeugteile", 2000);
                        wasOnline = true;
                    });

                    if (wasOnline == false) {
                        connection.getRepository(Inventory).findOne({ where: { name: element.name, item: "Fahrzeugteile" } }).then((element) => {
                            if (element) {
                                element.amount += 2000;
                                connection.getRepository(Inventory).save(element);
                            }
                        });
                    }
                });

            });

        });
    }

    checkDiscordDonator(id: string, isDonator: number, amount: number) {
        DiscordBot.Client.fetchUser(id).then((user) => {

            var jesusEmoji = DiscordBot.Client.emojis.find(element => element.name == "jesus");
            var kappaEmoji = DiscordBot.Client.emojis.find(element => element.name == "nilow");

            if (isDonator == 1) {
                user.send("Danke für deine Donation an unser Projekt von **" + amount + "€**! " + jesusEmoji + " Du hast nun deinen Donatorrang und bekommst Ingame mehr EXP sowie deinen Status.");
                user.send("Solltest du noch weitere Fragen bezüglich deiner Spende haben, kannst du dich gern bei DevGrab melden." + kappaEmoji);
            }
            else if (isDonator > 1)
                user.send("Danke das du erneut an unser Projekt gespendet hast! **" + amount + "€**! " + jesusEmoji + " Du bist ein Ehrenmann!");

            if (amount >= 20)
                user.send("Du hast ein Fahrzeug bekommen! Lass dich überraschen! :)");

            DiscordBot.Client.guilds.forEach((element) => {
                if (element.id != "498632603616804909")
                    return false;

                var member = element.members.find(element => element.id == user.id);

                if (member)
                    member.addRole("515191655486193690");
            });
        });
    }

    notEnoughAmount(amount: number, discordId: string) {
        DiscordBot.Client.fetchUser(discordId).then((user) => {

            var jesusEmoji = DiscordBot.Client.emojis.find(element => element.name == "jesus");
            var kappaEmoji = DiscordBot.Client.emojis.find(element => element.name == "nilow");

            user.send("Danke für deine Donation an unser Projekt! " + jesusEmoji + " Leider vergeben wir erst ab 13€ unser Donatorrang!");
            user.send("War diese Donation fehlerhaft? So melde dich bei DevGrab.");
        });
    }
}


export var Donator = new DonatorManager();

mp.events.addCommand("tokens", (player: Player) => {

    if (!player.isLoggedIn)
        return false;

    if (!player.info.donator)
        return false;

    if (player.info.token < getTimeInSeconds()) {
        player.info.token = getTimeInSeconds() + 604800;
        Level.giveTokens(player, 50);
        player.inventory.addAmount("Fahrzeugteile", 500);

        Messages.Send("INFO", "Spieler " + player.name + " hat seine wöchentliche Donatorbelohnung abgeholt.", true);

        database.then((connection => {

            if (!mp.players.exists(player))
                return false;

            connection.getRepository(Users).findOne({ where: { name: player.name } }).then((element) => {

                if (!mp.players.exists(player))
                    return false;

                if (!element)
                    return false;

                element.token = player.info.token;

                connection.getRepository(Users).save(element);

            });

        }));
    }
});


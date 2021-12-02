import { Client, Message } from "discord.js";
import { database } from "../database/manager";
import { Discord } from "../database/entities/discord";

class Commands{

    id : number;
    command : string;
    message : string; 
    mention : boolean;

    constructor(command : string, message : string, mention : boolean){
        this.command = command;
        this.message = message;
        this.mention = mention;
    }
}

class Bot{
    Client = new Client();
    Commands : Commands[] = [];

    constructor(loginToken : string)
    {
        this.login(loginToken);
    }

    login(loginToken : string)
    {   
        this.Client.login(loginToken).then(() => {
            console.log("Discordbot has been connected.");
        });
    }

    loadCommands()
    {
        this.Commands = [];

        database.then(connection => {
            connection.getRepository(Discord).find({}).then((elements) => {
                elements.forEach((entry : Discord) => {
                    this.Commands.push(new Commands(entry.command, entry.message, entry.mention));
                });
            });
        });

        setTimeout(() => {
            this.loadCommands();
        }, 1000 * 30);
    }

    listen()
    {
        this.Client.on("message", (message : Message) => {
            
            if(!message.content.includes("!"))
                return false;

            this.Commands.forEach((element : Commands) => {

                if(("!" + element.command) != message.content)  
                    return false;

                message.channel.send(element.message + " " + (element.mention ? message.author : ""));
                message.delete();
            });
        });
    }
}

export var DiscordBot = new Bot("");

DiscordBot.loadCommands();
DiscordBot.listen();

import { Player } from "../account/player";
import { Ranks } from "../admin";
import { Translation } from "./translation";

class CMessagingHelper {
    color: string;
    prefix: string;

    constructor(prefix: string, color: string) {
        this.color = color;
        this.prefix = prefix;
    }
}

class CMessaging {

    list: any = [];

    addMessageType(prefix: string, color: string) {
        this.list.push(new CMessagingHelper(prefix, color));
    }

    Send(prefix: string, message: string, toAll: boolean = true, player: any = undefined) {

        var isValid: boolean = false;

        this.list.forEach((element: CMessagingHelper) => {

            if (element.prefix != prefix) return false;

            message = ("<font color='" + element.color +"'>[" + element.prefix + "]</font> " + message);

            if (toAll)
                mp.players.broadcast(message);
            else
                if (mp.players.exists(player))
                    player.outputChatBox(message);

            isValid = true;
        });

        if(!isValid)
        {
            if(toAll)
                mp.players.broadcast(message);
            else
                if(mp.players.exists(player))  
                    player.outputChatBox(message);
        }
    }

    toAdmins(text : string)
    {
        mp.players.forEach((element : Player) =>{

            if(!element.isLoggedIn)
                return false;

            if(element.info.admin < Ranks.Moderator)
                return false;

            text = "<font color='yellow'>[INTERN] " + text + "</font>";

            element.outputChatBox(text);
          
        });
    }

}

export var Messages = new CMessaging();

Messages.addMessageType("SERVER", "#ff4c4c");
Messages.addMessageType("INFO", "#4cd5ff");
Messages.addMessageType("WARNUNG", "#ffe100");
Messages.addMessageType("GRUPPE", "#9FFF96");
Messages.addMessageType("INVENTAR", "#dcf442");
Messages.addMessageType("RAUB", "#86f442");
Messages.addMessageType("ADMIN", "#ffff00");
Messages.addMessageType("VOTING", "#9FFF96");
Messages.addMessageType("WHISPER", "#ffff00");
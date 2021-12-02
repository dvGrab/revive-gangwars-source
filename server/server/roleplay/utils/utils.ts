import { Player } from "../account/player";
import { playerHouse } from "../grouping/housing";

export function getDistance(first : Vector3Mp, second : Vector3Mp)
{
    return Math.sqrt((first.x - second.x) + (first.y - second.y) + (first.z - second.z)) * 10;
}

export function overlayError(player : Player | playerHouse, text : string, title : string)
{
        player.call("overlaySendNotifyAlert", [text, title]);
}

export function overlaySuccess(player : Player | playerHouse, text : string, title : string)
{
        player.call("overlaySendNotifySuccess", [text, title]);
}

export function overlayInfo(player : Player | playerHouse, text : string, title : string)
{
        player.call("overlaySendNotifyInfo", [text, title]);
}

export function giveHealth(player : Player, amount : number)
{
    var tempHealth = player.health;

    if((tempHealth + amount) > 100){
        tempHealth = (100 - tempHealth);
        player.health += tempHealth;
    }
    else{
        player.health += amount;
    }
       
}

export function giveArmour(player : Player, amount : number)
{
    var tempArmour = player.armour;

    if((tempArmour + amount) > 100){
        tempArmour = (100 - tempArmour);
        player.armour += tempArmour;
    }
    else{
        player.armour += amount;
    }
       
}

export function getTimeInSeconds() : number
{
    return Math.floor(Date.now() / 1000);
}

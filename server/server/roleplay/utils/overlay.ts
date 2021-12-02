import { Player } from "../account/player";

export enum ToastColors{
    primary = "primary",
    secondary = "secondary",
    success = "success",
    alert = "alert",
    warning = "warning",
    yellow = "yellow",
    info = "info", 
    light = "light"
}

export function Popup(player : Player, text : string, color : ToastColors)
{
    if(player != undefined)
        player.call("overlaySendToast", [text, color]);
}
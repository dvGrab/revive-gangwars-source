var sharingBrowser: BrowserMp;
var vehicleName : string;
var lastOpen = getTimeInSeconds();

mp.keys.bind(0x4B, false, () => {

    if(isMenuOpened)
        return false;

    if (mp.gui.chat.enabled)
        return false;

    if(lastOpen > getTimeInSeconds())
        return false;

    lastOpen = getTimeInSeconds() + 3;

    mp.events.callRemote("server:OpenCarSharing");


});

mp.events.add("client:OpenCarSharing", (playerVehicles : string, playerList : string) => {

    if (mp.browsers.exists(sharingBrowser))
        return false;

    sharingBrowser = mp.browsers.new("package://web/gui/cartrade.html");

    sharingBrowser.execute("fillPlayerVehicle('" + playerVehicles + "');");
    sharingBrowser.execute("fillPlayerData('" + playerList  +"');");

    mp.gui.cursor.show(true, true);

    isMenuOpened = true;

});

mp.events.add("client:CloseCarShare", () => {

    if(mp.browsers.exists(sharingBrowser))
    {
        sharingBrowser.destroy();
        mp.gui.cursor.show(false, false);
        isMenuOpened = false;
    }

});

mp.events.add("client:SendVehicleChange", (vehicleName : string, playerName : string) =>{

    if(mp.browsers.exists(sharingBrowser))
    {
        mp.events.callRemote("server:GivePlayerVehicle", vehicleName, playerName);

        sharingBrowser.destroy();
        mp.gui.cursor.show(false, false);
        isMenuOpened = false;
    }

});
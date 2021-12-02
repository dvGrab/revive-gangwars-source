

function getTimeInSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

var inventoryBrowser: BrowserMp;
var lastScreenFx: string;
var lastInventoryOpen: number = getTimeInSeconds();


mp.keys.bind(0x49, true, () => {

    if (mp.gui.chat.enabled == false) {

        if (lastInventoryOpen < getTimeInSeconds())
        {
            mp.events.callRemote("receiveInventoryAccess");
            lastInventoryOpen = getTimeInSeconds() + 1;
        }
            
    }

});

mp.events.add("showInventory", (jsonData, playerData) => {
    if (isMenuOpened == false) {

        if (!mp.browsers.exists(inventoryBrowser)) {
            inventoryBrowser = mp.browsers.new("package://web/inventory/inventory.html");
            mp.events.call("showInventory", jsonData, playerData);
        }
        else {
            inventoryBrowser.execute("showInventory();");
            isMenuOpened = true;

            mp.gui.cursor.show(true, true);

            if (playerLanguage == 1)
                inventoryBrowser.execute("translateEnglish();");

            if (playerLanguage == 2)
                inventoryBrowser.execute("translateRussian();");

            mp.events.call("receiveInventoryItems", jsonData, playerData);
        }
    }

});

mp.events.add("exitInventory", () => {
    if (mp.browsers.exists(inventoryBrowser)) {
        inventoryBrowser.execute("hideInventory();");
        mp.gui.cursor.show(false, false);
        mp.events.callRemote("receiveInventoryClose");
        mp.gui.chat.activate(true);
        isMenuOpened = false;
    }
});

mp.events.add("client:OpenSettingsMenu", () => {

    mp.events.callRemote("server:OpenWeaponSettings");
    mp.events.call("exitInventory");

});

mp.events.add("receiveInventoryItems", (jsonData, playerData) => {

    if (mp.browsers.exists(inventoryBrowser)) {
        if (jsonData != undefined)
            if (jsonData.length > 0)
                inventoryBrowser.execute("fillWithData('" + jsonData + "');")

        if (playerData != undefined)
            if (playerData.length > 0)
                inventoryBrowser.execute("fillWithDataPlayers('" + playerData + "');")
    }

});

mp.events.add("usedItemName", (name: string) => {

    if (mp.browsers.exists(inventoryBrowser))
        mp.events.callRemote("sendUsedItemName", name);

});

mp.events.add("startScreenFx", (fxName: string) => {

    if (lastScreenFx)
        mp.game.graphics.stopScreenEffect(lastScreenFx);

    mp.game.graphics.startScreenEffect(fxName, 60 * 1000, false);
    lastScreenFx = fxName;

});

mp.events.add("stopScreenFx", () => {

    if (lastScreenFx)
        mp.game.graphics.stopScreenEffect(lastScreenFx);

});

mp.events.add("sendItemToClient", (player: string, item: string, amount: string) => {
    mp.events.callRemote("sendItemToServerForClient", player, item, parseInt(amount));
    mp.events.call("exitInventory");
});
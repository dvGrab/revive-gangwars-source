let carshopBrowser: BrowserMp;
let shopEntered = false;
let currentShopID = 0;

mp.events.add("createCarshop", (json: string, vehicles: string, paylist: string, tokens: number) => {

    if (!shopEntered) {
        var object = JSON.parse(json);

        for (var i = 0; i < object.amount; i++) {
            var distance = mp.game.gameplay.getDistanceBetweenCoords(object.pos[i].x, object.pos[i].y, object.pos[i].z,
                mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, true);

            if (distance >= 5)
                continue;

            shopEntered = true;
            currentShopID = i;

            if (isMenuOpened == false) {
                carshopBrowser = mp.browsers.new("package://web/gui/carshop.html");
                mp.gui.cursor.show(true, true);
                mp.gui.chat.activate(false);
                isMenuOpened = true;
                carshopBrowser.execute("fillTokens('" + tokens + "');");
                carshopBrowser.execute("fillSelect('" + vehicles + "');");
                carshopBrowser.execute("fillSelectBuy('" + paylist + "');");

                if (playerLanguage == 1)
                    carshopBrowser.execute("translateEnglish();");
 
                if (playerLanguage == 2)
                    carshopBrowser.execute("translateRussian();");
            }
        }
    }
});

mp.events.add("destroyCarshop", () => {
    if (shopEntered) {
        carshopBrowser.destroy();
        shopEntered = false;
        mp.gui.chat.activate(true);
    }

    isMenuOpened = false;

    mp.gui.cursor.show(false, false);
});

mp.keys.bind(0x45, true, () => {
    if (!mp.gui.chat.enabled)
        mp.events.callRemote("giveShopInfo");
});

mp.events.add("buyVehicleAtCarshop", (vehicleName: string) => {
    mp.events.callRemote("buyShopVehicle", currentShopID, vehicleName);
});

mp.events.add("buyVehicleWithTokens", (vehiclename: string) => {
    mp.events.callRemote("buyVehicleWithTokens", vehiclename);
    mp.events.call("destroyCarshop");
});

mp.events.add("sellVehicleAtCarshop", (vehiclename : string) => {
    mp.events.callRemote("server:SellVehicle", vehiclename); 
    mp.events.call("destroyCarshop");
});

mp.events.add("receiveErrorNotifyCarshop", (text: string, title: string) => {
    if (shopEntered)
        carshopBrowser.execute('notifyalert("' + text + '", "' + title + '");');
});



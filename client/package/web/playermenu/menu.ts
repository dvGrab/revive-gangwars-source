var playerMenu: any;

mp.keys.bind(0x72, true, () => {

    if (!playerMenu) {
        if (mp.players.local.getVariable("isLoggedIn")) {
            mp.gui.cursor.show(true, true);
            playerMenu = mp.browsers.new("package://web/playermenu/menu.html");
            mp.events.callRemote("getPlayerStats");

            if (playerLanguage == 1)
                playerMenu.execute("translateEnglish();");

            if (playerLanguage == 2)
                playerMenu.execute("translateRussian();");
        }
    }

});

mp.events.add("setPlayerStats", (data) => {

    if (playerMenu)
        playerMenu.execute("setStats('" + data + "');")

});

mp.events.add("closePlayerMenu", () => {

    if (playerMenu) {
        mp.gui.cursor.show(false, false);
        playerMenu.destroy();
        playerMenu = undefined;
    }

});
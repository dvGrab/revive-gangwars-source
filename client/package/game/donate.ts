var donateBrowser: BrowserMp;

mp.events.add("client:DonateOpen", () => {

    if (mp.gui.chat.enabled)
        return false;

    if (isMenuOpened)
        return false;

    isMenuOpened = true;

    if (mp.browsers.exists(donateBrowser))
        return false;

    donateBrowser = mp.browsers.new("");

    mp.gui.cursor.show(true, true);
    mp.gui.chat.show(false);


})

mp.events.add("client:CloseDonate", () => {

    if (mp.browsers.exists(donateBrowser)) {
        donateBrowser.destroy();
        isMenuOpened = false;
        mp.gui.cursor.show(false, false);
        mp.gui.chat.show(true);
    }

});

mp.events.add(RageEnums.EventKey.RENDER, () => {
    if (mp.keys.isDown(0x1B)) {
        if (mp.browsers.exists(donateBrowser)) {
            donateBrowser.destroy();
            isMenuOpened = false;
            mp.gui.cursor.show(false, false);
            mp.gui.chat.show(true);
        }
    }
});
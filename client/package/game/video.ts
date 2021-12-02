var videoMode = false;
var chatmode = false;

mp.keys.bind(0x79, true, () => {

    videoMode = !videoMode;

    mp.game.ui.displayRadar(videoMode);
    mp.gui.chat.show(videoMode);

});

mp.keys.bind(0x78, true, () => {

    chatmode = !chatmode;

    if (chatmode == false) {
        setTimeout(() => {
            mp.gui.chat.show(true);
        }, 250);
    }


});

mp.events.add(RageEnums.EventKey.RENDER, () => {

    if (chatmode)
        mp.gui.chat.show(false);

});

mp.keys.bind(0x45, true, () => {
    if (!mp.gui.chat.enabled) {
        mp.events.callRemote("tryingLoot");
        mp.events.callRemote("enterHouse");
        mp.events.callRemote("exitHouse");
        mp.events.callRemote("Server:ExitAFK");
    }
});

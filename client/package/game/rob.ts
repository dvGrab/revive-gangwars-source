
mp.keys.bind(0x45, true, () => {
    if (!mp.gui.chat.enabled) {
        mp.events.callRemote("server:ShopRob");
        mp.events.callRemote("server:ShopDrop");
    }
});

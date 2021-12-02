var bountyBrowser : BrowserMp;

mp.keys.bind(0x45, true, () => {
    if (!mp.gui.chat.enabled) {
        mp.events.callRemote("server:BountyRequest");
    }
});

mp.events.add("client:BountyOpen", () => {

    if(isMenuOpened)   
        return false;

    if(mp.gui.chat.enabled)
        return false;

    if(mp.browsers.exists(bountyBrowser))
        return false;

    bountyBrowser = mp.browsers.new("package://web/bounty/bounty.html");
    isMenuOpened = true;
    mp.gui.cursor.show(true, true);
    mp.gui.chat.activate(false);
    
});

mp.events.add("client:sendBountyToServer", (target : string, amount : string) => {

    mp.events.callRemote("server:GiveBountPlayer", target, amount);

});

mp.events.add("client:ExitBounty", () => {

    if(mp.browsers.exists(bountyBrowser))   
    {
        bountyBrowser.destroy();
        mp.gui.cursor.show(false, false);
        isMenuOpened = false;
        mp.gui.chat.activate(true);
    }

});
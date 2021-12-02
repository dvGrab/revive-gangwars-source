var levelBrowser : any = undefined;

mp.keys.bind(0x73, true, () => {
    if(levelBrowser == undefined)
        mp.events.callRemote("requestLevelingInfo");
});

mp.events.add("createLevelingBrowser", (info) => {
    if(levelBrowser == undefined)
    {
        levelBrowser = mp.browsers.new("package://web/leveling/index.html");
        levelBrowser.execute("fillData('" + info + "');");
        mp.gui.cursor.show(true, true);
    }
});

mp.events.add("exitLevelingBrowser", () => {
    if(levelBrowser != undefined)
    {
        mp.gui.cursor.show(false, false);
        levelBrowser.destroy();
        levelBrowser = undefined;
    }
});

mp.events.add("client:Prestige", ()=> {
    if(levelBrowser != undefined)
    {
        mp.gui.cursor.show(false, false);
        levelBrowser.destroy();
        levelBrowser = undefined;
        
        mp.events.callRemote("server:Prestige");
    }
});
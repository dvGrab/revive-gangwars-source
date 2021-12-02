var kickBrowser: any;
var jsonData: any;

mp.events.add("browserDomReady", (browser: any) => {

    switch (browser) {
        case kickBrowser: {
            if (jsonData)
                kickBrowser.execute("fillSelect('" + jsonData + "');")

            mp.gui.cursor.show(true, true);
            break;
        }
    }

});

mp.events.add("createKick", (json) => {

    if (mp.gui.chat.enabled == false) {
        if (kickBrowser == undefined) {
            if (isMenuOpened == false) {
                jsonData = json;
                kickBrowser = mp.browsers.new("package://web/admin/kick.html");
                mp.gui.chat.activate(false);
                isMenuOpened = true;
            }
        }
    }

});

mp.events.add("createWarn", (json) => {

    if (mp.gui.chat.enabled == false) {
        if (kickBrowser == undefined) {
            if (isMenuOpened == false) {
                kickBrowser = mp.browsers.new("package://web/admin/warn.html");
                mp.gui.chat.activate(false);
                isMenuOpened = true;
            }
        }
    }
});

mp.events.add("destroyKick", () => {

    if (kickBrowser != undefined) {
        kickBrowser.destroy();
        kickBrowser = undefined;
        mp.gui.cursor.show(false, false);
        mp.gui.chat.show(true);
        mp.gui.chat.activate(true);
    }

    isMenuOpened = false;

});

mp.events.add("kickPlayer", (name, reason) => {
    mp.events.callRemote("kickPlayerFromServer", name, reason);
    mp.events.call("destroyKick");
});

mp.events.add("banPlayer", (name, reason) => {
    mp.events.callRemote("banPlayerFromServer", name, reason);
    mp.events.call("destroyKick");
});


mp.events.add("timebanPlayer", (name, reason, time) => {
    mp.events.callRemote("timebanPlayerFromServer", name, reason, time);
    mp.events.call("destroyKick");
});
 
mp.events.add("warnPlayer", (name, reason, time) => {
    mp.events.callRemote("warnPlayerFromServer", name, reason, time);
    mp.events.call("destroyKick");
});
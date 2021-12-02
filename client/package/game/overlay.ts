var browser: BrowserMp;
var spawnProtect: boolean;
var cashAmount: number = -1;
var isMenuOpened = false;

interface GameWeaponMp {
    setWeaponObjectTintIndex(weapon: number, tint: number): void
}

mp.events.add("createMainOverlay", () => {

    if(!mp.browsers.exists(browser)) {
        browser = mp.browsers.new("package://web/gui/overlay.html");
        mp.events.call("setVoiceStatus", mp.voiceChat.muted);
        isMenuOpened = false;
        mp.gui.chat.enabled = false;
    }

});

mp.events.add("client:playAudio", (url : string) => {
    if(!mp.browsers.exists(browser))
        return false;

    browser.execute("playAudioUrl('" + url + "');")
});

mp.events.add("overlaySendToast", (text: string, color: string) => {

    if (mp.browsers.exists(browser))
        browser.execute('Metro.toast.create("' + text + '", null, null, "' + color + '");');
});

mp.events.add("overlaySendNotifyAlert", (text: string, title: string) => {
    if (mp.browsers.exists(browser))
        browser.execute('notifyalert("' + text + '", "' + title + '");');
});

mp.events.add("overlaySendNotifySuccess", (text: string, title: string) => {
    if (mp.browsers.exists(browser))
        browser.execute('notifysuccess("' + text + '", "' + title + '");');
});

mp.events.add("overlaySendNotifyInfo", (text: string, title: string) => {
    if (mp.browsers.exists(browser))
        browser.execute('notifyinfo("' + text + '", "' + title + '");');
});

mp.events.add("setGangwarProgress", (data) => {

    if (mp.browsers.exists(browser)) {
        browser.execute("setGangwarProgress('" + data + "');");
    }
});

mp.events.add("hidePlayerProgessBars", () => {
    if (mp.browsers.exists(browser))
        browser.execute("hideGangwarProgress();");
});

mp.events.add("setMoney", (cash: number) => {
    cashAmount = cash;
});

mp.events.add("setVoiceStatus", (status: boolean) => {
    if (mp.browsers.exists(browser))
        browser.execute("setVoiceStatus(" + status + ");");

});

mp.events.add("kickPlayerMessage", (reason: string) => {
    if (mp.browsers.exists(browser)) {
        browser.execute("kickPlayer('" + reason + "');")
        mp.gui.chat.show(false);
    }
});

mp.events.add("newPopupMessage", (text: string) => {

    if(!mp.browsers.exists(browser))
        return false;

    browser.execute("popupKill('" + text + "');");
});

mp.events.add("client:ShowKingInfo", (json : string) => {
    browser.execute("setKingInfo('" + json + "');");
});

mp.events.add("client:HideKingInfo", () => {
    browser.execute("hideKingInfo();");
});

mp.events.add("client:sayText", (text : string) => {

    if(mp.browsers.exists(browser))
    {
        browser.execute('say("' + text + '");')
    }   

});
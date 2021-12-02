var settingsBrowser: BrowserMp;

mp.events.add("client:OpenWeaponSettings", (data) => {

    if (mp.browsers.exists(settingsBrowser))
        return false;

    if (!data)
        return false;

    settingsBrowser = mp.browsers.new("package://web/settings/settings.html");
    settingsBrowser.execute("fillWeaponsIn('" + data + "');")

    mp.gui.cursor.show(true, true);
    mp.gui.chat.show(false);

});

mp.events.add("client:ExitWeaponSettings", () => {

    if (!mp.browsers.exists(settingsBrowser))
        return false;

    settingsBrowser.destroy();
    mp.gui.cursor.show(false, false);
    mp.gui.chat.show(true);

});

mp.events.add("client:RefreshWeaponSettings", (data) => {
    if (mp.browsers.exists(settingsBrowser))
        settingsBrowser.execute("fillWeaponsIn('" + data + "');")
});

mp.events.add("client:SendWeaponToSelect", (weaponName: string) => {
    if (weaponName)
        mp.events.callRemote("server:SendWeaponSelected", weaponName)
});
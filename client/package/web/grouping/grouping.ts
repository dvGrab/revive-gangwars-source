var groupBrowser: any = undefined;
var groupInviteId = -1;

mp.keys.bind(0x74, true, () => {

    if (!isMenuOpened)
        if (groupBrowser == undefined)
            mp.events.callRemote("requestGroupWindow");

});

mp.events.add("createGroupWindow", (groupCreation: number, jsonData: string, groupInfo: string = "") => {

    if (!mp.gui.chat.enabled) {

        mp.events.call("destroyGroupWindow");

        switch (groupCreation) {
            case 0:
                {
                    groupBrowser = mp.browsers.new("package://web/grouping/grouping.html");
                    groupBrowser.execute("fillWithData('" + jsonData + "');");
                    groupBrowser.execute("fillWithInfoData('" + groupInfo + "');");
                    break;
                }
            case 1:
                {
                    groupBrowser = mp.browsers.new("package://web/grouping/creating.html");

                    if (playerLanguage)
                        groupBrowser.execute("translateCreationEnglish();");

                    break;
                }
            case 2:
                {
                    groupBrowser = mp.browsers.new("package://web/grouping/invite.html");
                    var Data = JSON.parse(jsonData);
                    groupInviteId = Data.groupId;
                    groupBrowser.execute("fillInviteInfo('" + jsonData + "');")

                    break;
                }
            case 3:
                {
                    groupBrowser = mp.browsers.new("package://web/grouping/buyhouse.html");
                    break;
                }
        }

        mp.gui.cursor.show(true, true);
        mp.gui.chat.activate(false);
        isMenuOpened = true;
    }
});

mp.events.add("destroyGroupWindow", () => {

    if (groupBrowser != undefined) {
        groupBrowser.destroy();
        groupBrowser = undefined;

        mp.gui.cursor.show(false, false);
        mp.gui.chat.activate(true);
        mp.gui.chat.enabled = false;

    }

    isMenuOpened = false;
});

mp.events.add("sendCreateGroupToClient", (groupName) => {
    mp.events.callRemote("sendCreateGroupToServer", groupName);
    mp.events.call("destroyGroupWindow");
});

mp.events.add("sendDeleteUser", (element: string) => {
    mp.events.callRemote("sendDeleteUserToServer", element);
    mp.events.call("destroyGroupWindow");
});

mp.events.add("sendGroupAccept", () => {
    mp.events.callRemote("sendGroupAcceptToServer", groupInviteId);
    mp.events.call("destroyGroupWindow");
});

mp.events.add("sendInvitePlayerToClient", (username: string) => {
    mp.events.callRemote("sendInvitePlayerToServer", username);
    mp.events.call("destroyGroupWindow");
});

mp.events.add("leaveGroup", () => {
    mp.events.callRemote("sendGroupLeaveToServer");
    mp.events.call("destroyGroupWindow");
});

mp.events.add("buyHouse", () => {
    mp.events.callRemote("sendBuyHouseToServer");   
    mp.events.call("destroyGroupWindow");
}); 

mp.events.add("client:deleteGroup", () => {
    mp.events.callRemote("server:GroupingDeleteGroup");
});
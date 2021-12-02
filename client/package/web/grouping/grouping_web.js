function createGroup() {
    var groupName = $("#groupName").val();

    if (groupName.length < 4)
        return notifyalert("Der Gruppenname ist zu kurz!", "Fehler");

    if (groupName.length > 32)
        return notifyalert("Der Gruppenname ist zu lang!", "Fehler");

    mp.trigger("sendCreateGroupToClient", groupName);
}

function notify(text, title) {
    Metro.notify.create(text, title, {});
}

function notifyalert(text, title) {
    Metro.notify.create(text, title, { cls: "alert" });
};

function fillWithData(data) {
    if (data) {
        data = JSON.parse(data);
        var listView = $('#lv');

        listView.data("listview").del(listView.find(".node"));

        data.items.forEach(element => {

            listView.data("listview").add(null, {
                caption: element.name,
                permission: (element.permission == 0 ? "Mitglied" : "Gruppenführer"),
                status: element.status
            });

        });
    }
}

function fillWithInfoData(groupInfo)
{
    if(groupInfo)
    {
        groupInfo = JSON.parse(groupInfo);

        document.getElementById("groupName").innerHTML = groupInfo.groupName;
        document.getElementById("groupOnline").innerHTML = groupInfo.groupAmount;
        document.getElementById("groupDollar").innerHTML = groupInfo.groupDollar;
        document.getElementById("groupKills").innerHTML = groupInfo.groupKills;
        document.getElementById("groupDeaths").innerHTML = groupInfo.groupDeaths;
    }
}

function deleteUser() {
    var listView = $("#lv");
    var element = listView.find(".current").find(".data").find(".caption").html();

    if (element)
        mp.trigger("sendDeleteUser", element);
}

function fillInviteInfo(json) {
    if (json) {
        json = JSON.parse(json);

        document.getElementById("groupName").innerHTML = json.groupName;
    }
}

function invitePlayer() {
    var invitePlayerName = $("#invitePlayerName").val();

    if (invitePlayerName.length > 0) {
        mp.trigger("sendInvitePlayerToClient", invitePlayerName);
    }
}

function acceptGroup() {
    mp.trigger("sendGroupAccept");
}

function cancelGroup() {
    mp.trigger("destroyGroupWindow");
}

function closeGrouping() {
    mp.trigger("destroyGroupWindow");
}

function acceptHouse()
{
    mp.trigger("buyHouse");
}

function leaveGroup()
{
    mp.trigger("leaveGroup");
}

function translateRussian()
{
    document.getElementById("mainTextCreate").innerHTML = "Вы можете создать свою собственную группу за 500$. В эту группу вы можете пригласить до 10 человек. Вы можете купить себе жилье для группы, где вы можете отдохнуть со своими друзьями из группы.";
    document.getElementById("labelGroupname").innerHTML = "Имя группы:";
    document.getElementById("buttonCreate").innerHTML = "Создать";
}

function translateCreationEnglish()
{
    document.getElementById("mainTextCreate").innerHTML = "You can create a own group for $500. In this group you can invite up to 10 players. You can buy appartments as group where you can chillout with your mates.";
    document.getElementById("labelGroupname").innerHTML = "Groupname:";
    document.getElementById("buttonCreate").innerHTML = "Create";
}

function translateEnglish()
{
    document.getElementById("mainTextCreate").innerHTML = "You can create a own group for $500. In this group you can invite up to 10 players. You can buy appartments as group where you can chillout with your mates.";
    document.getElementById("labelGroupname").innerHTML = "Groupname:";
    document.getElementById("buttonCreate").innerHTML = "Create";
}

function deleteGroup()
{
    mp.trigger("client:deleteGroup");
}
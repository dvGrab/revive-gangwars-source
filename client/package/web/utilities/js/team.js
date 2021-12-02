function selectedTeamLeft() {
    mp.trigger("selectedTeamLeft");
}

function selectedTeamRight() {
    mp.trigger("selectedTeamRight");
}

function buttonAccept() {
    var check = $("#houseSpawn").data("checkbox");
    mp.trigger("sendTeamInfoToServer", check.elem.checked);
}

var firstOne = false;

function setTeamInformation(teamInfo, selector) {
    if (teamInfo)
        teamInfo = JSON.parse(teamInfo);

    if (firstOne) {
        $("#teamImage").fadeOut("slow", () => {

            document.getElementById("teamName").innerHTML = (teamInfo.teams[selector].name);
            document.getElementById("teamCounter").innerHTML = teamInfo.teams[selector].amount;
            document.getElementById("teamImage").src = "package://web/utilities/images/teams/" + ((teamInfo.teams[selector].name).replace(" ", "_").replace(" ", "_") + ".png").toLowerCase();

            $("#teamImage").fadeIn("slow", () => {

            });

        });
    }
    else {
        firstOne = true;
        document.getElementById("teamName").innerHTML = (teamInfo.teams[selector].name);
        document.getElementById("teamCounter").innerHTML = teamInfo.teams[selector].amount;
        document.getElementById("teamImage").src = "package://web/utilities/images/teams/" + ((teamInfo.teams[selector].name).replace(" ", "_").replace(" ", "_") + ".png").toLowerCase();
    }


}

function translateRussian()
{
    document.getElementById("teamselection").innerHTML = "Выбрать команду";
    document.getElementById("teamcount").innerHTML = "Счетчик команды:";
    document.getElementById("buttonJoin").innerHTML = "Присоединиться к команде";
    document.getElementById("teamtext").innerHTML = "Чтобы поменять команду, напишите <b>/team</b> в чат.";
}

function translateEnglish() {
    document.getElementById("teamselection").innerHTML = "Teamselection";
    document.getElementById("teamcount").innerHTML = "Teamcount:";
    document.getElementById("buttonJoin").innerHTML = "Join Team";
    document.getElementById("teamtext").innerHTML = "To change the team type <b>/team</b> into the chat.";
}
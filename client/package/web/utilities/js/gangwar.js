function setStats(data)
{
    if(data)
    {
        data = JSON.parse(data);

        if(data.team == undefined)
            data.team = "Unbekannt";

        if(data.lastteam == undefined)
            data.lastteam = "Unbekannt";

        document.getElementById("team").innerHTML=data.team;
        document.getElementById("lastteam").innerHTML=data.lastteam;
        document.getElementById("teamstats").innerHTML=data.team;
        document.getElementById("lastteamstats").innerHTML=data.lastteam;        
        document.getElementById("attackerkills").innerHTML=data.attackerkills;
        document.getElementById("victimkills").innerHTML=data.victimkills;
    }
}

$("#buttonCloseWindow").click(() => {
    
    mp.trigger("closeGangwarWindow");

});

$("#buttonStartWar").click(() => {

    mp.trigger("startGangwar");

});

function translateRussian()
{
    document.getElementById("currentwar").innerHTML = "Лидирующая банда этой территории это: ";
    document.getElementById("lastwar").innerHTML = "Последняя война была против: ";
    document.getElementById("buttonStartWar").innerHTML = "Война!";
    document.getElementById("buttonCloseWindow").innerHTML = "Закрыть";
	
}

function translateEnglish()
{
    document.getElementById("currentwar").innerHTML = "The leading gang of this area is: ";
    document.getElementById("lastwar").innerHTML = "The last gangwar was against: ";
    document.getElementById("buttonStartWar").innerHTML = "War!";
    document.getElementById("buttonCloseWindow").innerHTML = "Close";
}
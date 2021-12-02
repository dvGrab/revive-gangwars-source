
function setStats(data)
{
    var info = JSON.parse(data);

    if(info)
    {
        document.getElementById("statPlaytime").innerHTML = Math.floor(info.playtime / 60) + " Minuten";
        document.getElementById("statKills").innerHTML = info.kills;
        document.getElementById("statDeaths").innerHTML = info.deaths;
        document.getElementById("statRatio").innerHTML = (info.kills / info.deaths).toFixed(2);
        document.getElementById("statKillsGang").innerHTML = info.gwkills;
        document.getElementById("statDeathsGang").innerHTML = info.gwdeaths;
        document.getElementById("statRatioGang").innerHTML = (info.gwkills / info.gwdeaths).toFixed(2);
    }
}

$("#buttonExit").click(() => {

    mp.trigger("closePlayerMenu");

});

function translateRussian()
{
    document.getElementById("playerMenu").innerHTML = "Информация";
    document.getElementById("stats").innerHTML = "Статистика";
    document.getElementById("warns").innerHTML = "Предупреждения";
    document.getElementById("labelPersonal").innerHTML = "Личные данные:";
    document.getElementById("playtime").innerHTML = "Игровое время:";
    document.getElementById("deaths").innerHTML = "Смерти:";
    document.getElementById("gwdeaths").innerHTML = "Смерти на войне:";
}

function translateEnglish()
{
    document.getElementById("playerMenu").innerHTML = "Informations";
    document.getElementById("stats").innerHTML = "Stats";
    document.getElementById("warns").innerHTML = "Warns";
    document.getElementById("labelPersonal").innerHTML = "Personal:";
    document.getElementById("playtime").innerHTML = "Playtime:";
    document.getElementById("deaths").innerHTML = "Deaths:";
    document.getElementById("gwdeaths").innerHTML = "Gangwar Deaths:";
}
function fillData(info) {
    info = JSON.parse(info);

    if (info) {
        document.getElementById("playerLevel").innerHTML = info.level;
        document.getElementById("playerExp").innerHTML = (info.expamount - info.expnextlevel) + " Exp.";
        document.getElementById("playerNeededExp").innerHTML = (info.expamount) + " Exp.";
        document.getElementById("playerPrestige").innerHTML = "Prestige: " + info.prestigelevel;

        var progessCalc = 100 - ((info.expnextlevel / info.expamount) * 100);
        document.getElementById("playerProgess").setAttribute("data-value", Number(progessCalc));

        if (info.nextweapon != undefined) {
            document.getElementById("nextWeapon").style.display = "block";
            document.getElementById("weaponImage").src = "../utilities/images/weapons/" + info.nextweapon + ".png";
        }

        else
            document.getElementById("nextWeapon").style.display = "none";
    }
}

function exitLeveling() {
    mp.trigger("exitLevelingBrowser");
}

function prestigeLevel()
{
    mp.trigger("client:Prestige");
}
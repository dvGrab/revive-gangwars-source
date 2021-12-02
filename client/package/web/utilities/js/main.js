var count = 20;
document.getElementById("showGangwarStats").style.display = "none";
hideKingInfo();

function say(text) {
    responsiveVoice.speak(text, "Deutsch Male");
}

function startRespawnTime() {
    setInterval(() => {
        document.getElementById("killedCount").innerHTML = count.toString();
        count--;

        if (count < 1)
            mp.trigger("respawnTimeEnd");

    }, 1000);
}

function setGangwarProgress(data) {
    if (data != undefined) {
        data = JSON.parse(data);

        if (data) {

            var teams = ["grove", "ballas", "vagos", "bloods"];

            document.getElementById("attacker").classList.add("color_" + teams[data.attackerid]);
            document.getElementById("victim").classList.add("color_" + teams[data.victimid]);

            document.getElementById("attackerText").innerHTML = data.attacker;
            document.getElementById("victimText").innerHTML = data.victim;

            document.getElementById("showGangwarStats").style.display = "block";
        }
    }
}

function hideKingInfo() {
    document.getElementById("showKingKills").style.display = "none";
}

function setKingInfo(json) {
    document.getElementById("showKingKills").style.display = "block";

    json = JSON.parse(json);

    document.getElementById("kingInfo").innerHTML =
        "<font color=green>" + json[json.length - 1].name + " Kills: " + json[json.length - 1].kills + "</font><br>"
        + json[json.length - 2].name + " Kills: " + json[json.length - 2].kills + "<br>"
        + json[json.length - 3].name + " Kills: " + json[json.length - 3].kills + "<br>";
}

function playHitmarker() {
    var audio = new Audio('hitmarker.mp3');
    audio.play();
}

function hideGangwarProgress() {
    document.getElementById("showGangwarStats").style.display = "none";
}

function setVoiceStatus(muted) {
    if (muted)
        document.getElementById("voiceSymbol").style.color = "#ff0000";
    else
        document.getElementById("voiceSymbol").style.color = "#00ff00";
}

function notifyalert(text, title) {
    Metro.notify.create(text, title, { cls: "alert", timeout: 5000, animation: 'easeOutBounce' });
};

function notifysuccess(text, title) {
    Metro.notify.create(text, title, { cls: "success", timeout: 5000, animation: 'easeOutBounce' });
};

function notifyinfo(text, title) {
    Metro.notify.create(text, title, { timeout: 5000, animation: 'easeOutBounce' });
};

function kickPlayer(reason) {
    if (reason) {
        document.getElementById("kickMessage").style.display = "block";
        document.getElementById("reasonText").innerHTML = reason;
    }
}

function popupKill(text) {

    var status = 0;

    var element = document.createElement("div");
    element.innerHTML = text;

    var appendElement = document.getElementById("main").appendChild(element);
    appendElement.classList.toggle("kill-popup");

    var Interval = setInterval(() => {

        switch (status) {
            case 0:
                {
                    appendElement.classList.toggle("kill-in");
                    break;
                }
            case 10:
                {
                    appendElement.classList.toggle("kill-out");
                    break;
                }
            case 15:
                {
                    appendElement.remove();
                    clearInterval(Interval);
                }
        }

        status++;

    }, 250);

}

function playAudioUrl(url) {
    var audioMedia = new Audio(url);

    audioMedia.volume = 0.5;
    audioMedia.play();
}

var hitLeftTimer = undefined;

function hitLeft() {
    $("#hit_left").fadeIn();

    if (hitLeftTimer != undefined) {
        clearTimeout(hitLeftTimer);
        hitLeftTimer = undefined;
    }

    hitLeftTimer = setTimeout(() => {
        $("#hit_left").fadeOut();
    }, 500);
}

var hitRightTimer = undefined;

function hitRight() {
    $("#hit_right").fadeIn();

    if (hitRightTimer != undefined) {
        clearTimeout(hitRightTimer);
        hitRightTimer = undefined;
    }

    hitRightTimer = setTimeout(() => {
        $("#hit_right").fadeOut();
    }, 500);
}

var hitTopTimer = undefined;

function hitTop() {
    $("#hit_top").fadeIn();

    if (hitTopTimer != undefined) {
        clearTimeout(hitTopTimer);
        hitTopTimer = undefined;
    }

    hitTopTimer = setTimeout(() => {
        $("#hit_top").fadeOut();
    }, 500);
}

var hitBottomTimer = undefined;

function hitBottom() {
    $("#hit_bottom").fadeIn();

    if (hitBottomTimer != undefined) {
        clearTimeout(hitBottomTimer);
        hitBottomTimer = undefined;
    }

    hitBottomTimer = setTimeout(() => {
        $("#hit_bottom").fadeOut();
    }, 500);
}

var hitMarkerTimer = undefined;

function hitMarker() {
    $("#hit_marker").fadeIn(50);

    if (hitMarkerTimer != undefined) {
        clearTimeout(hitMarkerTimer);
        hitMarkerTimer = undefined;
    }

    hitMarkerTimer = setTimeout(() => {
        $("#hit_marker").fadeOut(50);
    }, 200);
}

function headshot()
{
    var headshotSound = new Audio("package://web/utilities/sound/headshot.mp3");
    headshotSound.play();
}
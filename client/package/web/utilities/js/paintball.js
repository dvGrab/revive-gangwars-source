var splashImage = document.getElementById("splash");

function applySplash() {
    $("#splash").fadeOut(1);
    $("#splash").fadeIn(300);

    var maxHeight = window.innerHeight - splashImage.clientHeight;
    var maxWidth = window.innerWidth - splashImage.clientWidth;

    splashImage.style.top = Math.floor(Math.random() * maxHeight) + "px";
    splashImage.style.left = Math.floor(Math.random() * maxWidth) + "px";

    splashImage.src = "../utilities/images/splashes/splash_0" + (Math.floor(Math.random() * 7) + 1) + ".png";

    setTimeout(() => {
        $("#splash").fadeOut(1500);
    }, 2500);

}

function setPlayerInfo(amount, countdown) {
    var info = document.getElementById("mainScreen");

    if (info) {
        info.style.display = "block";
        document.getElementById("lobbyInfo").innerHTML = "Warten auf Spieler... " + amount + " von 10<br><br>" + countdown + " Sekunden<br>";
    }

}

function removePlayerInfo() {
    document.getElementById("mainScreen").style.display = "none";
}

function setPaintballTopPlayers(jsonData) {
    if (!jsonData)
        return false;

    jsonData = JSON.parse(jsonData);

    document.getElementById("paintballTop").innerHTML =
        "<font color=green>" + jsonData[0].name + " Kills: " + jsonData[0].paintball + "</font><br>"
        + jsonData[1].name + " Kills: " + jsonData[1].paintball + "<br>"
        + jsonData[2].name + " Kills: " + jsonData[2].paintball + "<br>";
}

function paintballExit() {
    mp.trigger("client:PaintballExit");
}
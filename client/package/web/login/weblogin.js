$("#buttonLogin").click(() => {
    mp.trigger("sendLoginToServer",
        $("#inputUsername").val(),
        $("#inputPassword").val());
});

$("#buttonRegister").click(() => {

    var username = $("#inputUsername").val();
    let password = $("#inputPassword").val();
    var passwordsecond = $("#inputPasswordSecond").val();
    var mail = $("#inputMail").val();

    if (!username)
        notifyalert("Bitte gib einen Namen an.", "Fehler");
    else if (password.length < 6)
        notifyalert("Dein Passwort muss mindestens 3 Zeichen besitzen.", "Fehler");
    else if (password != passwordsecond)
        notifyalert("Dein Passwort stimmt nicht überein.", "Fehler");
    else if (mail.length < 3)
        notifyalert("Du hast eine falsche Mail angegeben.");
    else if (!mail.includes("@"))
        notifyalert("Du hast eine falsche Mail angegeben.");
    else {
        mp.trigger("sendRegisterToServer", username, password, passwordsecond, mail);
        window.location.href = "./login.html";
    }

});

$("#buttonReset").click(() => {
    mp.trigger("sendResetToServer", $("#inputMail").val());
    window.location.href = "./login.html";
});

$("#rememberMe").click(() => {
    var check = $("#rememberMe").data("checkbox");

    if (check.elem.checked == false) {
        mp.trigger("removeRememberMeValue");
        $("#inputUsername").val("");
        $("#inputPassword").val("");
    }

    getRememberMeValue(check.elem.checked);
});

function setRememberMeValue(status) {
    var check = $("#rememberMe").data("checkbox");
    check.elem.checked = status;
}

function getRememberMeValue() {
    var check = $("#rememberMe").data("checkbox");
    mp.trigger("getRememberMeValue", check.elem.checked);
}

function notify(text, title) {
    Metro.notify.create(text, title, {});
}

function notifyalert(text, title) {
    Metro.notify.create(text, title, { cls: "alert" });
};

function notifysuccess(text, title) {
    Metro.notify.create(text, title, { cls: "success" });
};


$("#buttonAgree").click(() => {
    mp.trigger("selectionAgree");

    document.getElementById("completeSelection").style.display = "none";
});

function leftHead() { mp.trigger("triggeredLeftHead"); }
function rightHead() { mp.trigger("triggeredRightHead"); }

function leftTorso() { mp.trigger("triggeredLeftTorso"); }
function rightTorso() { mp.trigger("triggeredRightTorso"); }

function leftLegs() { mp.trigger("triggeredLeftLegs"); }
function rightLegs() { mp.trigger("triggeredRightLegs"); }

function leftFoots() { mp.trigger("triggeredLeftFoots"); }
function rightFoots() { mp.trigger("triggeredRightFoots"); }

function leftBandana() { mp.trigger("triggeredLeftBandana"); }
function rightBandana() { mp.trigger("triggeredRightBandana"); }

function leftAccess() { mp.trigger("triggeredLeftAccess"); }
function rightAccess() { mp.trigger("triggeredRightAccess"); }

function leftHat() { mp.trigger("triggeredLeftHat"); }
function rightHat() { mp.trigger("triggeredRightHat"); }

function selectMale() { mp.trigger("triggeredSelectMale"); }
function selectFemale() { mp.trigger("triggeredSelectFemale"); }

function translateRussian() {
    mp.trigger("setUserLanguage", 2);
    notifyalert("Русский перевод еще не закончен. Но Вы можете его использовать для помощи.");

    document.getElementById("labelUsername").innerHTML = "Никнейм:";
    document.getElementById("labelPassword").innerHTML = "Пароль:";
    document.getElementById("buttonLogin").innerHTML = "Логин";
    document.getElementById("buttonRegister").innerHTML = "Регистрация";
    document.getElementById("labelPasswordagain").innerHTML = "Подтверждение пароля:";
}

function translateEnglish() {
    mp.trigger("setUserLanguage", 1);

    notifyalert("The english translation isn't completed. But you can use it as help.");

    document.getElementById("labelUsername").innerHTML = "Username:";
    document.getElementById("labelPassword").innerHTML = "Password:";
    document.getElementById("buttonLogin").innerHTML = "Login";
    document.getElementById("buttonRegister").innerHTML = "Registration";
    document.getElementById("labelPasswordagain").innerHTML = "Passwort match:";

}

function translateGerman() {
    mp.trigger("setUserLanguage", 0);
    document.getElementById("labelUsername").innerHTML = "Benutzername:";
    document.getElementById("labelPassword").innerHTML = "Passwort:";
    document.getElementById("buttonLogin").innerHTML = "Login";
    document.getElementById("buttonRegister").innerHTML = "zur Registration";
}

function showLogin() {
    document.getElementById("login").style.display = "flex";
    document.getElementById("mail").style.display = "none";
    document.getElementById("register").style.display = "none";
}


function showRegister() {
    document.getElementById("login").style.display = "none";
    document.getElementById("mail").style.display = "none";
    document.getElementById("register").style.display = "flex";
}

function showReset() {
    document.getElementById("login").style.display = "none";
    document.getElementById("mail").style.display = "flex";
    document.getElementById("register").style.display = "none";
}
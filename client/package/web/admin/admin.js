function buttonClicked() {
    document.getElementById("dropdown_toggle_1").style.display = "none";
}

function fillSelect(jsonstring) {
    if (jsonstring) {
        jsonstring = JSON.parse(jsonstring);
        $("#playerSelection").val(jsonstring.target);
    }
}

function Agree() {

    var radio = undefined;
    var radioList = document.getElementsByName("typeOfBan");

    radioList.forEach((element) => {
        if (element.checked)
            radio = element.value;
    });

    if (radio == undefined)
        mp.trigger("kickPlayer", $("#playerSelection").val(), $("#reasonText").val())
    else {

        var amount = 0, time = Number($("#timeAmount").val());

        switch (Number(radio)) {
            case 0:
                {
                    amount = time * 60;
                    break;
                }
            case 1:
                {
                    amount = time * 3600;
                    break;
                }
            case 2:
                {
                    amount = time * 86400;
                    break;
                }
        }

        if (radio == 3)
            mp.trigger("banPlayer", $("#playerSelection").val(), $("#reasonText").val());
        else
            mp.trigger("timebanPlayer", $("#playerSelection").val(), $("#reasonText").val(), amount);
    }


}

function Exit() {
    mp.trigger("destroyKick");
}

function AgreeWarn() {

    if ($("#playerSelection").val())
        if ($("#timeAmount").val())
            if ($("#reasonText").val())
                mp.trigger("warnPlayer", $("#playerSelection").val(), $("#reasonText").val(), Number($("#timeAmount").val()));
    
}

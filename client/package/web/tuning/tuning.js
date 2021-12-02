var choosenParts = {}

var wheelType = 0;

function addElement(id, label, max, min, section, value) {

    if (value == undefined)
        value = min;

    var element = document.createElement("label");
    element.innerText = label + " (Anzahl: " + max + ")";
    document.getElementById(section).appendChild(element);

    var element = document.createElement("input");

    element.setAttribute("data-role", "slider");
    element.setAttribute("data-min", min);
    element.setAttribute("data-value", value.toString());
    element.setAttribute("data-max", max);
    element.setAttribute("data-hint", "true");
    element.setAttribute("data-hint-always", "false");
    element.setAttribute("id", id);

    document.getElementById(section).appendChild(element);

}

function fillStocks(jsonData) {
    jsonData = JSON.parse(jsonData);

    if (jsonData) {

        addElement("spoilers", "Spoilers", jsonData.spoilers[0], "-1", "cosmetics_1", jsonData.spoilers[1]);
        addElement("frontbump", "Vodere Stoßstange", jsonData.frontbumpers[0], "-1", "cosmetics_1", jsonData.frontbumpers[1]);
        addElement("rearbump", "Hintere Stoßstange", jsonData.rearbumpers[0], "-1", "cosmetics_1", jsonData.rearbumpers[1]);
        addElement("sideskirt", "Seitenschürze", jsonData.sideskirts[0], "-1", "cosmetics_1", jsonData.sideskirts[1]);
        addElement("exhaust", "Auspuff", jsonData.exhaust[0], "-1", "cosmetics_1", jsonData.exhaust[1]);
        addElement("frame", "Käfig", jsonData.frame[0], "-1", "cosmetics_1", jsonData.frame[1]);
        addElement("grille", "Kühlergrill", jsonData.grille[0], "-1", "cosmetics_1", jsonData.grille[1]);
        addElement("hood", "Motorhaube", jsonData.hood[0], "-1", "cosmetics_1", jsonData.hood[1]);
        addElement("leftfender", "Kotflügel", jsonData.leftfender[0], "-1", "cosmetics_1", jsonData.leftfender[1]);
        addElement("roof", "Dach", jsonData.roof[0], "-1", "cosmetics_1", jsonData.roof[1]);
        addElement("window", "Scheibentönung", "1", 0, "cosmetics_1", jsonData.windows[1]);
        addElement("wheel", "Reifen", jsonData.wheels[0], "-1", "cosmetics_1", jsonData.wheels[1]);

        addElement("neon", "Neonröhren", 1, 0, "neonlist", jsonData.neon[1]);
        addElement("neonred", "Neonfarbe Rot", 255, "1", "neonlist", jsonData.neonred[1]);
        addElement("neongreen", "Neonfarbe Grün", 255, "1", "neonlist", jsonData.neongreen[1]);
        addElement("neonblue", "Neonfarbe Blau", 255, "1", "neonlist", jsonData.neonblue[1]);
        addElement("xenon", "Xenon", 0, "-1", "neonlist", jsonData.xenons[1]);

        addElement("colorred", "Autofarbe Rot", 255, "0", "colors", jsonData.colorred[1]);
        addElement("colorgreen", "Autofarbe Grün", 255, "0", "colors", jsonData.colorgreen[1]);
        addElement("colorblue", "Autofarbe Blau", 255, "0", "colors", jsonData.colorblue[1]);
        addElement("wheelcolor", "Reifenfarbe", 160, "-1", "colors", jsonData.wheelcolor[1]);
        addElement("numberplate", "Nummernschildfarbe", 5, "-1", "colors", jsonData.numberplate[1]);

        addElement("engine", "Motor", jsonData.engine[0], "0", "motorlist", jsonData.engine[1]);
        addElement("brakes", "Bremsen", jsonData.brake[0], "0", "motorlist", jsonData.brake[1]);
        addElement("transmission", "Getriebe", jsonData.transmission[0], "0", "motorlist", jsonData.transmission[1]);
        addElement("suspension", "Federn", jsonData.suspension[0], "-1", "motorlist", jsonData.suspension[1]);
        addElement("turbo", "Turbolader", "0", "-1", "motorlist", jsonData.turbo[1]);

        wheelType = jsonData.wheeltype[0];
    }

}

setInterval(() => {

    choosenParts = ({
        spoiler: document.getElementById("spoilers").value,
        frontbumper: document.getElementById("frontbump").value,
        rearbumper: document.getElementById("rearbump").value,
        sideskirt: document.getElementById("sideskirt").value,
        exhaust: document.getElementById("exhaust").value,
        frame: document.getElementById("frame").value,
        grille: document.getElementById("grille").value,
        hood: document.getElementById("hood").value,
        leftfender: document.getElementById("leftfender").value,
        roof: document.getElementById("roof").value,
        window: document.getElementById("window").value,
        neon: document.getElementById("neon").value,
        neonred: document.getElementById("neonred").value,
        neongreen: document.getElementById("neongreen").value,
        neonblue: document.getElementById("neonblue").value,
        wheel: document.getElementById("wheel").value,
        wheeltype: wheelType,
        wheelcolor: document.getElementById("wheelcolor").value,
        xenon: document.getElementById("xenon").value,
        colorr: document.getElementById("colorred").value,
        colorg: document.getElementById("colorgreen").value,
        colorb: document.getElementById("colorblue").value,
        numberplate: document.getElementById("numberplate").value,
        engine: document.getElementById("engine").value,
        brake: document.getElementById("brakes").value,
        transmission: document.getElementById("transmission").value,
        suspension: document.getElementById("suspension").value,
        turbo: document.getElementById("turbo").value
    });

    mp.trigger("client:TuningChoosenParts", JSON.stringify(choosenParts));

}, 100);

function BuyCartuning() {
    mp.trigger("client:SendBuyTuning", JSON.stringify(choosenParts));
}

function sendRotation() {
    mp.trigger("client:TuningSetRotation", document.getElementById("rotation").value);
}

function setCosts(value) {
    document.getElementById("costs").innerText = "Derzeitige Kosten: " + parseInt(value) + " Fahrzeugteile";
}
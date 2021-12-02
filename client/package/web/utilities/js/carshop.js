$("#buttonExit").click(() => {
    mp.trigger("destroyCarshop");
});

$("#buttonVehicle").click(() => {
    mp.trigger("buyVehicleAtCarshop", $("#vehicleValue").val());
});

$("#buttonVehicleBuy").click(() => {
    mp.trigger("buyVehicleWithTokens", $("#vehicleListToPay").val());
});

$("#buttonSell").click(() => {
    mp.trigger("sellVehicleAtCarshop", $("#vehicleValue").val());
});

function notifyalert(text, title) {
    Metro.notify.create(text, title, { cls: "alert" });
};

function fillSelect(json, jsonpay) {
    var select = $("#vehicleValue").data('select');
    select.data(JSON.parse(json));
}

function fillSelectBuy(json) {
    var select = $("#vehicleListToPay").data('select');
    select.data(JSON.parse(json));
}

function fillTokens(tokens)
{
    document.getElementById("tokenAmount").innerHTML = Number(tokens);
}

function translateRussian()
{
    document.getElementById("headerCarshop").innerHTML = "Магазин автомобилей";
    document.getElementById("carshopMain").innerHTML = "Выберите транспортное средство для респавна. Если транспортное средство респавнилось 3 минуты назад, то вы сможете зареспавнить его снова.";
    document.getElementById("labelCarshop").innerHTML = "Транспортное средство:";

    document.getElementById("buttonVehicle").innerHTML = "Заспавнить";
    document.getElementById("buttonExit").innerHTML = "Выйти";

    document.getElementById("secondCarshopText").innerHTML = "Вы можете купить транспортное средство за 'Токены'. Все купленные вами транспортные средства будут вам доступны всегда.";

    document.getElementById("vehicleTokenLabel").innerHTML = "Транспортное средствоо";
    document.getElementById("buttonVehicleBuy").innerHTML = "Купить";
}

function translateEnglish()
{
    document.getElementById("headerCarshop").innerHTML = "Carshop";
    document.getElementById("carshopMain").innerHTML = "Choose a vehicle to deploy. If the vehicle is spawned 3 minutes ago, it will respawn.";
    document.getElementById("labelCarshop").innerHTML = "Vehicle:";

    document.getElementById("buttonVehicle").innerHTML = "Spawn";
    document.getElementById("buttonExit").innerHTML = "Exit";

    document.getElementById("secondCarshopText").innerHTML = "You can buy vehicles with 'Tokens'. All bought vehicles are permanently available.";

    document.getElementById("vehicleTokenLabel").innerHTML = "Vehicle";
    document.getElementById("buttonVehicleBuy").innerHTML = "Buy";
}
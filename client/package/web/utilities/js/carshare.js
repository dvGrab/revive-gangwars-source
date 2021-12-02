function fillPlayerVehicle(json) {
    var select = $("#vehicleList").data('select');
    select.data(JSON.parse(json));
}

function fillPlayerData(json) {
    var select = $("#playerList").data('select');
    select.data(JSON.parse(json));
}

function buttonExit()
{
    mp.trigger("client:CloseCarShare");
}

function giveVehicle()
{
    mp.trigger("client:SendVehicleChange", $("#vehicleList").val(), $("#playerList").val());
}
function fillWithData(data)
{
    if(data != undefined)
    {
        data = JSON.parse(data);
        var listView = $('#lv');

        listView.data("listview").del(listView.find(".node"));

        data.items.forEach(element => {

            listView.data("listview").add(null, {
                caption: element.name,
                amount : element.amount
            });

        });
    }
}

function fillWithDataPlayers(data)
{
    if(data != undefined)
    {        
        data = JSON.parse(data);
        var listView = $('#lvPlayers');

        listView.data("listview").del(listView.find(".node"));

        data.items.forEach(element => {

            listView.data("listview").add(null, {
                caption: element.name,
            });

        });
    }
}

function useItem() 
{
    var listView = $("#lv");
    var element = listView.find(".current").find(".data").find(".caption").html();

    if(element)
    {
        mp.trigger("usedItemName", element);
    }
}

function exitInventory()
{
    mp.trigger("exitInventory");
}

function sendItem()
{
    var playerView = $("#lvPlayers");
    var players = playerView.find(".current").find(".data").find(".caption").html();

    var itemView = $("#lv");
    var items = itemView.find(".current").find(".data").find(".caption").html();

    if((players.length > 1) && (items.length > 1))
    {
        var amount = $("#giveAmount").val();

        if(isNaN(amount))
            return false;        

        if(Number(amount) < 1)
            return false;

        mp.trigger("sendItemToClient", players, items, amount);
    } 
}

function openSettings()
{
    mp.trigger("client:OpenSettingsMenu");
}

function translateRussian()
{
    document.getElementById("headerInventory").innerHTML = "Инвентарь";
    document.getElementById("buttonUse").innerHTML = "Использовать";
    document.getElementById("buttonExit").innerHTML = "Выйти";
    document.getElementById("buttonGive").innerHTML = "Передать";
}

function translateEnglish()
{
    document.getElementById("headerInventory").innerHTML = "Inventory";
    document.getElementById("buttonUse").innerHTML = "Use";
    document.getElementById("buttonExit").innerHTML = "Exit";
    document.getElementById("buttonGive").innerHTML = "Give";
}

function hideInventory()
{
    document.getElementById("isVisible").style.display = "none";
}

function showInventory()
{
    document.getElementById("isVisible").style.display = "block";
}
var selectWeapon;

function fillWeaponsIn(data)
{
    if(!data)
        return false;

    data = JSON.parse(data);
  
    if(!data)
        return false;
  
    var listView = $('#lv');

    listView.data("listview").del(listView.find(".node"));

    data.weapons.forEach(element => {

        listView.data("listview").add(null, {
            caption: element,
        });

    });
}

function sendWeapon()
{
    if(selectWeapon)
        mp.trigger("client:SendWeaponToSelect", selectWeapon);
}

function exitWeapon()
{
    mp.trigger("client:ExitWeaponSettings");
}

function changeState(node, listview)
{
    selectWeapon = node[0].getElementsByClassName("caption")[1].innerText;

    console.log(selectWeapon);
}
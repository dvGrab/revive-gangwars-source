
function buttonLeft() {
    mp.trigger("client:WeaponEditorLeft");
}

function buttonRight() {
    mp.trigger("client:WeaponEditorRight");
}

function buttonExit()
{
    mp.trigger("client:CloseWeaponEditor");
}

function buttonBuyComponent()
{
    mp.trigger("client:BuyComponent");
}

function buttonSellComponent()
{
    mp.trigger("client:SellComponent");
}

function buttonBuyTint()
{
    mp.trigger("client:BuyTint");
}

function buttonSellTint()
{
    mp.trigger("client:SellTint");
}

function notifyalert(text, title) {
    Metro.notify.create(text, title, { cls: "alert", timeout: 5000, animation: 'easeOutBounce' });
};

function fillTints(json) {
    var select = $("#TintValue").data('select');
    select.data(JSON.parse(json));
}

function fillComponents(json) {
    var select = $("#ComponentValue").data('select');
    select.data(JSON.parse(json));
}



setInterval(() => {
    var Information = {
        rotation: Number($("#xRotation").val()),
        tint: Number($("#TintValue").val()),
        component: $("#ComponentValue").val()
    };

    mp.trigger("client:ClientSideInformations", JSON.stringify(Information));

}, 50);
function exitShop()
{
    mp.trigger("client:CloseTattooEditor");

}

function buttonLeft()
{
    mp.trigger("client:TattooSelect", false);
}

function buttonRight()
{
    mp.trigger("client:TattooSelect", true);
}

function placeTattoo()
{
    mp.trigger("client:TattooPlace");
}

function callSound()
{
    var tattooSound = new Audio("package://web/playermenu/GPS/tattoo.aac");
    tattooSound.play();
}

function changedTattooZone()
{
    mp.trigger("client:ChangedTattooZone");
}

function setIsTattoed(status)
{
    if(status)
        document.getElementById("tattooText").innerHTML = "<font color=red>Tattowiert</font>";
    else
        document.getElementById("tattooText").innerHTML = "<font color=green>Frei</font>";
    
}

setInterval(() => {

    var jsonInfo = { 
        rotation: Number($("#xRotation").val()),
        zone: $("#zoneValue").val()
    };

    mp.trigger("client:SetTattooInfo", JSON.stringify(jsonInfo));

}, 20);
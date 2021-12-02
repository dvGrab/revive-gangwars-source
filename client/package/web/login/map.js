function setMapName(text)
{
    document.getElementById("mapText").innerText = text;
}

function mapSelectorLeft()
{
    mp.trigger("client:mapSelectLeft");
}

function mapSelectorRight()
{
    mp.trigger("client:mapSelectRight");
}

function mapAccept()
{
    mp.trigger("client:mapAccept");
}
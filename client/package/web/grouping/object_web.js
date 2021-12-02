function leftObject()
{
    mp.trigger("selectionLeft");
}

function rightObject()
{
    mp.trigger("selectionRight");
}

function setPrice(price)
{
    document.getElementById("textPrice").innerHTML = "Preis: $" + price;
}
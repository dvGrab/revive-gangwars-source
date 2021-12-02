function sendBounty() {

    var amount = $("#bountyAmount").val();

    if (amount.lenth < 1)
        return false;

    if (isNaN(amount))
        return false;

    if (Number(amount) < 1)
        return false;

    mp.trigger("client:sendBountyToServer", $("#targetName").val(), amount);
}

function Exit()
{
    mp.trigger("client:ExitBounty");
}
interface blipPlayer extends PlayerMp {
    Blip: BlipMp;
};

mp.events.addDataHandler("team", (entity: blipPlayer, value) => {

    if (!mp.blips.exists(entity.Blip))
        return false;

    if (value != mp.players.local.getVariable("team"))
        entity.Blip.destroy();

});

mp.events.add(RageEnums.EventKey.ENTITY_STREAM_IN, (entity: blipPlayer) => {

    if (entity.type != "player")
        return false;

    if (mp.blips.exists(entity.Blip))
        return false;

    if (entity.dimension != mp.players.local.dimension)
        return false;

    var entityTeam = entity.getVariable("team");
    var entityTeamColor = entity.getVariable("teamColor");

    if (entityTeam != mp.players.local.getVariable("team"))
        return false;

    entity.Blip = mp.blips.new(1, entity.position, { color: entityTeamColor });
});

mp.events.add(RageEnums.EventKey.ENTITY_STREAM_OUT, (entity: blipPlayer) => {

    if (entity.type != "player")
        return false;

    if (mp.blips.exists(entity.Blip))
        entity.Blip.destroy();

});

setInterval(() => {

    mp.players.forEach((element: blipPlayer) => {

        if (!mp.players.exists(element))
            return false;

        if (!mp.blips.exists(element.Blip))
            return false;

        var elementColor = element.getVariable("teamColor");
        var dutyStatus = element.getVariable("onduty");
        var userGroup = element.getVariable("group");

        element.Blip.setCoords(element.position);
        element.Blip.setShowHeadingIndicator(true);
        element.Blip.setRotation(element.getHeading());

        if (element.vehicle) {
            if (element.vehicle.getPedInSeat(-1) == element.handle) {
                element.Blip.setSprite(225);
                element.Blip.setAlpha(150);
            }
            else
                element.Blip.setAlpha(0);
        }
        else {
            element.Blip.setAlpha(255);

            if (userGroup == mp.players.local.getVariable("group") && userGroup > 0)
                element.Blip.setSprite(280);
            else
                element.Blip.setSprite(1);
        }



        if (!dutyStatus) {
            if (elementColor != undefined)
                element.Blip.setColour(elementColor);
        }
        else
            element.Blip.setColour(1);

        if (userGroup > 0)
            if (userGroup == mp.players.local.getVariable("group"))
                element.Blip.setColour(44);

        if (element.getHealth() < 1)
            element.Blip.setAlpha(0);

        if (element.dimension != mp.players.local.dimension)
            element.Blip.setAlpha(0);

        if (element.getVariable("team") != mp.players.local.getVariable("team"))
            element.Blip.setAlpha(0);

    });


}, 100);
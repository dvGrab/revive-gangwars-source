
var OgMarker: MarkerMp;

mp.events.add(RageEnums.EventKey.ENTITY_STREAM_IN, (entity: EntityMp) => {

    if (entity.type != "player")
        return false;

    if (entity.getVariable("isPlayerOg")) {
        if (!mp.markers.exists(OgMarker)) {
            if (entity.getVariable("team") == mp.players.local.getVariable("team"))
                OgMarker = mp.markers.new(0, entity.getCoords(true), 0.5, { color: [50, 200, 0, 100] });
            else
                OgMarker = mp.markers.new(0, entity.getCoords(true), 0.5, { color: [255, 50, 0, 100] });
        }

    }


});

mp.events.add(RageEnums.EventKey.ENTITY_STREAM_OUT, (entity: EntityMp) => {

    if (entity.type != "player")
        return false;

    if (entity.getVariable("isPlayerOg"))
        if (mp.markers.exists(OgMarker))
            OgMarker.destroy();

});

mp.events.add(RageEnums.EventKey.RENDER, () => {

    mp.players.forEachInStreamRange((element: PlayerMp) => {
        if (element.getVariable("isPlayerOg"))
            if (mp.markers.exists(OgMarker)) {
                var position = new mp.Vector3(element.getCoords(true).x, element.getCoords(true).y, element.getCoords(true).z + 3);
                OgMarker.position = position;

                if (element.getHealth() < 1)
                    if (mp.markers.exists(OgMarker))
                        OgMarker.destroy();
            }
    });

});

mp.events.addDataHandler("isPlayerOg", (entity: PlayerMp, value: boolean) => {

    if (value) {
        if (!mp.markers.exists(OgMarker)) {
            if (entity.getVariable("team") == mp.players.local.getVariable("team"))
                OgMarker = mp.markers.new(0, entity.getCoords(true), 0.5, { color: [50, 200, 0, 100] });
            else
                OgMarker = mp.markers.new(0, entity.getCoords(true), 0.5, { color: [255, 50, 0, 100] });
        }
    }

});
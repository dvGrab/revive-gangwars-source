var gangwarBrowser: any = undefined;

mp.events.add("showGangzoneInfo", (data) => {

    if (data) {
        if (gangwarBrowser == undefined) {
            gangwarBrowser = mp.browsers.new("package://web/gui/gangwar.html");
            gangwarBrowser.execute("setStats('" + data + "');");
            mp.gui.cursor.show(true, true);

            if (playerLanguage == 1)
                gangwarBrowser.execute("translateEnglish();");

            if (playerLanguage == 2)
                gangwarBrowser.execute("translateRussian();");
        }
    }

});

mp.events.add("startGangwar", () => {

    if (gangwarBrowser) {
        mp.events.callRemote("startGangwarServerside");
        mp.gui.cursor.show(false, false);
        gangwarBrowser.destroy();

        gangwarBrowser = undefined;
    }

});

mp.events.add("closeGangwarWindow", () => {
    if (gangwarBrowser) {
        gangwarBrowser.destroy();
        mp.gui.cursor.show(false, false);
        gangwarBrowser = undefined;
    }
});

mp.events.add("setZoneFlashing", (serverID, flashing: boolean) => {
    if (serverID) {
        var blip = mp.blips.atRemoteId(serverID);

        if (blip != undefined)
            blip.setFlashes(flashing);
    }
});

mp.keys.bind(0x45, true, () => {
    if (!mp.gui.chat.enabled)
        mp.events.callRemote("showGangzoneMenu");
});


class GangzoneHelper {
    position: Vector3Mp;
    blip: BlipMp;
    id: number;
    color: number;
    range: number;

    constructor(position: Vector3Mp, id: number, color: number, range: number) {
        this.position = position;
        this.id = id;
        this.color = color;
        this.range = range;

        this.blip = mp.game.ui.addBlipForRadius(position.x, position.y, position.y, range / 2);
        mp.game.invoke(RageEnums.Natives.Ui.SET_BLIP_SPRITE, this.blip, 5);
        mp.game.invoke(RageEnums.Natives.Ui.SET_BLIP_ALPHA, this.blip, 90);
        mp.game.invoke(RageEnums.Natives.Ui.SET_BLIP_COLOUR, this.blip, color);
    }
}

class Gangzone {

    list: GangzoneHelper[] = [];

    add(position: Vector3Mp, id: number, color: number, range: number) {
        this.list.push(new GangzoneHelper(position, id, color, range));
    }

    delete(id: number) {
        var zone = this.list.find(element => element.id == id);

        if (zone) {
            mp.game.ui.removeBlip(zone.blip.handle);
            this.list.splice(this.list.findIndex(element => element.id == id), 1);
        }
    }

    getZoneById(id: number) {
        var zone = this.list.find(element => element.id == id);

        if (zone)
            return zone;
        else
            return undefined;
    }

    changecolor(id: number, color: number) {
        var zone = this.list.find(element => element.id == id);

        if (zone) {
            zone.color = color;
            mp.game.invoke(RageEnums.Natives.Ui.SET_BLIP_COLOUR, zone.blip, color);
        }
    }

    getCornerPointPosition(id: number, x: number, y: number) {
        var targetZone = this.getZoneById(id);

        if (!targetZone)
            return false;

        return new mp.Vector3(targetZone.position.x + x, targetZone.position.y + y, targetZone.position.z);
    }

    getDistanceToZone(id: number) {
        var targetZone = this.getZoneById(id);

        if (!targetZone)
            return false;

        var position = mp.players.local.position;

        return mp.game.gameplay.getDistanceBetweenCoords(position.x, position.y, position.z, targetZone.position.x, targetZone.position.y, targetZone.position.z, false);
    }

}


var Gangzones = new Gangzone();

mp.events.add("Gangzone:Create", (x: number, y: number, id: number, color: number, range: number) => {
    Gangzones.add(new mp.Vector3(x, y, 0), id, color, range);
});

mp.events.add("Gangzone:Changed", (id: number, color: number) => {
    Gangzones.changecolor(id, color);
});

mp.events.add(RageEnums.EventKey.RENDER, () => {

    Gangzones.list.forEach(element => {
        mp.game.invoke(RageEnums.Natives.Ui.SET_BLIP_ROTATION, element.blip, 0);

        var distance = Gangzones.getDistanceToZone(element.id);

        if (distance > 300)
            return false;

        for (var i = 0; i < 10; i++) {




        }
    });

});

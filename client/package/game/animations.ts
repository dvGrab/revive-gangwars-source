mp.events.add("client:freeze", (value : boolean) => {
    mp.players.local.freezePosition(value);
});

mp.events.add("streamAnimationToPlayers", (animationDictionary: string, animationName: string, flag: number, targetID: number, freeze: boolean = false) => {

    if (mp.game.streaming.doesAnimDictExist(animationDictionary)) {

        if (!mp.game.streaming.hasAnimDictLoaded(animationDictionary)) {
            mp.game.streaming.requestAnimDict(animationDictionary);

            while (mp.game.streaming.hasAnimDictLoaded(animationDictionary))
                mp.game.wait(1);
        }

        setTimeout(() => {
            mp.players.forEachInStreamRange((element: PlayerMp) => {

                if (element.remoteId == targetID) {
                    if (freeze)
                        element.taskPlayAnim(animationDictionary, animationName, 6.0, 0.0, -1, flag, -10.0, false, false, false);
                    else
                        element.taskPlayAnim(animationDictionary, animationName, 8.0, 1.0, -1, flag, 0.0, false, false, false);
                }

            });
        }, 50)
    }

});

function applyWalkstyle(player: PlayerMp, walkStyle: string) {
    if (walkStyle) {
        if (!mp.game.streaming.hasClipSetLoaded(walkStyle)) {

            mp.game.streaming.requestClipSet(walkStyle);

            while (!mp.game.streaming.hasClipSetLoaded(walkStyle))
                mp.game.wait(1);

        }

        player.setMovementClipset(walkStyle, 0.0);


    }
    else
        player.resetMovementClipset(0);
}

mp.events.add(RageEnums.EventKey.ENTITY_STREAM_IN, (entity: PlayerMp) => {

    if (entity.type != "player") return false;

    var style = entity.getVariable("walkStyle");
    applyWalkstyle(entity, style);

});

mp.events.addDataHandler("walkStyle", (entity: PlayerMp, value: string) => {

    if (entity.type != "player") return false;
    applyWalkstyle(entity, value);

});

mp.keys.bind(0x61, true, () => {
    mp.events.callRemote("sendAnimationToServer", 0);
});

mp.keys.bind(0x62, true, () => {
    mp.events.callRemote("sendAnimationToServer", 1);
});

mp.keys.bind(0x63, true, () => {
    mp.events.callRemote("sendAnimationToServer", 2);
});

mp.keys.bind(0x64, true, () => {
    mp.events.callRemote("sendAnimationToServer", 3);
});

mp.keys.bind(0x65, true, () => {
    mp.events.callRemote("sendAnimationToServer", 4);
});

mp.keys.bind(0x66, true, () => {
    mp.events.callRemote("sendAnimationToServer", 5);
});

mp.keys.bind(0x67, true, () => {
    mp.events.callRemote("sendAnimationToServer", 6);
});

mp.keys.bind(0x68, true, () => {
    mp.events.callRemote("sendWalkstyleToServer");
});

mp.keys.bind(0x69, true, () => {
    mp.events.callRemote("sendAnimationToServer", 7);
});

mp.keys.bind(0x60, true, () => {
    mp.events.callRemote("sendAnimationToServer", 8);
});

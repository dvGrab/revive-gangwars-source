var isDetectionTriggered = false;
var detectionPadCounter = 0;
var lastTimeKeyPressed = 0;

export function getTimeInSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

mp.events.add(RageEnums.EventKey.PLAYER_WEAPON_SHOT, (position: Vector3Mp, target: PlayerMp) => {
    lastTimeKeyPressed = getTimeInSeconds() + 5;
});

mp.events.add("render", () => {

    if (mp.players.local.vehicle)
        return false;

    if (mp.keys.isDown(0x01))
        lastTimeKeyPressed = getTimeInSeconds() + 5;

    if (mp.keys.isDown(0x02))
        lastTimeKeyPressed = getTimeInSeconds() + 5;

    if (mp.keys.isDown(0x20))
        lastTimeKeyPressed = getTimeInSeconds() + 5;

    if (lastTimeKeyPressed < getTimeInSeconds()) {
        if (!isDetectionTriggered) {
            var entity: EntityMp = mp.game.player.getEntityIsFreeAimingAt();

            if (entity !== undefined) {
                if (entity.type === "player") {
                    if (entity.getHealth() > 1) {
                        var returnValue = mp.game.invoke("0x2E397FD2ECD37C87", mp.players.local);

                        if (returnValue == 0) {
                            detectionPadCounter++;

                            if (detectionPadCounter > 30) {
                                isDetectionTriggered = true;
                                mp.events.callRemote("cheatAimassist");
                            }
                        }
                    }
                    else
                        detectionPadCounter = 0;
                }
                else
                    detectionPadCounter = 0;

            } else
                detectionPadCounter = 0;
        }
    }

});


mp.events.add("client:testGodmode", () => {

    var healthBefore = mp.players.local.getHealth();
    mp.players.local.applyDamageTo(1, true);

    setTimeout(() => {
        mp.events.callRemote("server:GodmodeCheckDone", healthBefore, mp.players.local.getHealth());
    }, 1000);
});

mp.events.add("client:testInvisible", () => {

    if (spawnProtect)
        return false;

    var isInvicible = mp.game.invoke("0xB721981B2B939E07", mp.players.local);

    if (isInvicible)
        mp.events.callRemote("server:GodmodeInvicible");
});

mp.events.add("client:testSetHack", () => {

    if (spawnProtect)
        return false;

    if (mp.players.local.getHealth() > 500)
        return mp.events.callRemote("server:GodmodeInvicible");

    if (mp.players.local.getArmour() > 500)
        return mp.events.callRemote("server:GodmodeInvicible");

    if (mp.players.local.getHealth() > 500 || mp.players.local.getArmour() > 500)
        return mp.events.callRemote("server:GodmodeInvicible");
});

var ctrlBugTimeOld = getTimeInSeconds(), ctrlLastShoot = getTimeInSeconds(), ctrlBugCount = 0, ctrlBugDelay = 2;

mp.events.add(RageEnums.EventKey.PLAYER_WEAPON_SHOT, (position: Vector3Mp, target: PlayerMp) => {

    ctrlLastShoot = getTimeInSeconds() + 3;

});

mp.keys.bind(0x11, true, () => {

    if (ctrlLastShoot <= getTimeInSeconds())
        return false;

    if (mp.players.local.getHealth() < 1)
        return false;

    if (mp.players.local.vehicle)
        return false;

    var timeMax = ctrlBugTimeOld + ctrlBugDelay;

    if (getTimeInSeconds() <= timeMax) {
        ctrlBugCount++;

        if (ctrlBugCount == 3)
            return mp.events.callRemote("server:StopCtrlBug");

    }

    if (getTimeInSeconds() >= timeMax) {
        ctrlBugTimeOld = getTimeInSeconds();
        ctrlBugCount = 0;
    }
});

mp.keys.bind(0x2E, true, () => {

    if (mp.game.ui.isPauseMenuActive())
        return false;

    mp.events.callRemote("server:Keys", "ENTF");
});

mp.keys.bind(0x2D, true, () => {

    if (mp.game.ui.isPauseMenuActive())
        return false;

    mp.events.callRemote("server:Keys", "EINFG");
});

mp.keys.bind(0x23, true, () => {

    if (mp.game.ui.isPauseMenuActive())
        return false;

    mp.events.callRemote("server:Keys", "ENDE");
});

mp.keys.bind(0x91, true, () => {

    if (mp.game.ui.isPauseMenuActive())
        return false;

    mp.events.callRemote("server:Keys", "ROLLEN");
});

/* Arrow Keys */
mp.keys.bind(0x25, true, () => {

    if (mp.game.ui.isPauseMenuActive())
        return false;

    mp.events.callRemote("server:Keys", "PFEIL LINKS");
});

mp.keys.bind(0x26, true, () => {

    if (mp.game.ui.isPauseMenuActive())
        return false;

    mp.events.callRemote("server:Keys", "PFEIL HOCH");
});

mp.keys.bind(0x27, true, () => {

    if (mp.game.ui.isPauseMenuActive())
        return false;

    mp.events.callRemote("server:Keys", "PFEIL RECHTS");
});

mp.keys.bind(0x28, true, () => {

    if (mp.game.ui.isPauseMenuActive())
        return false;

    mp.events.callRemote("server:Keys", "PFEIL RUNTER");
});

mp.keys.bind(0x24, true, () => {

    if (mp.game.ui.isPauseMenuActive())
        return false;

    mp.events.callRemote("server:Keys", "HOME");
});
/*
initializeEntities();

function initializeEntities() {
    for (var i = 0; i < 10; i++) {
        spawnEntity();
    }
}

var lastTargetedPlayer: PlayerMp | undefined;

function spawnEntity() {
    var position = mp.players.local.position;
    var pedSecond = mp.peds.new(mp.game.joaat("mp_m_niko_01"), new mp.Vector3(position.x, position.y, position.z + 10), 1);
    pedSecond.isBotFar = true;
    pedSecond.botExists = getTimeInSeconds() + (Math.random() * 30);

    pedSecond.setAlpha(0);
    mp.game.invoke(RageEnums.Natives.Entity.SET_ENTITY_ALPHA, pedSecond.handle, 0);
}


setInterval(() => {

    var position = mp.players.local.position;
    var target = mp.game.player.getEntityIsFreeAimingAt();

    lastTargetedPlayer = undefined;

    if (target) {
        var isTargetPlayer = mp.players.toArray().find(element => element.handle == target.handle);

        if (isTargetPlayer) {
            if (mp.players.exists(isTargetPlayer)) {
                lastTargetedPlayer = isTargetPlayer;
            }
        }
    }

    mp.peds.forEach((element) => {

        if (!element.isBotFar)
            return false;

        var randomDistance = 0;

        if (element.isBotFar)
            randomDistance = (Math.random() * (30 - 30) + 30);

        if (element.isBotFar == true) {

            var randomFloat = (Math.random() * 360);

            var randomX = ((mp.players.local.getForwardX()) * 15) + Math.cos(randomFloat) * 4;
            var randomY = ((mp.players.local.getForwardY()) * 15) + Math.sin(randomFloat) * 4;
            var randomZ = (Math.random() * (1.3 - (-1.3)) + (-1.3));

            element.setAlpha(0);
            element.setCollision(false, false);
            mp.game.invoke(RageEnums.Natives.Entity.SET_ENTITY_ALPHA, element.handle, 0);
            mp.game.invoke(RageEnums.Natives.Entity.SET_ENTITY_NO_COLLISION_ENTITY, mp.players.local.handle, element.handle, true);
            mp.game.invoke(RageEnums.Natives.Entity.SET_ENTITY_NO_COLLISION_ENTITY, element.handle, mp.players.local.handle, true);
            mp.game.invoke(RageEnums.Natives.Entity.SET_ENTITY_CAN_BE_DAMAGED, element.handle, false);
            mp.game.invoke(RageEnums.Natives.Audio.DISABLE_PED_PAIN_AUDIO, element.handle, true);
            mp.game.invoke(RageEnums.Natives.Ped.CLEAR_PED_BLOOD_DAMAGE, element.handle);
            mp.game.invoke(RageEnums.Natives.Entity.SET_ENTITY_INVINCIBLE, element.handle, true);

            if (target) {
                if (element.handle == target) {
                    element.setCoords(position.x, position.y, position.z + 5, false, false, false, false);
                }
                else {
                    if (lastTargetedPlayer == undefined)
                        element.setCoords(position.x + randomX, position.y + randomY, position.z + randomZ, false, false, false, false);
                    else {
                        var randomX = Math.cos(randomFloat) * 6.0;
                        var randomY = Math.sin(randomFloat) * 6.0;
                        element.setCoords(lastTargetedPlayer.position.x + randomX, lastTargetedPlayer.position.y + randomY, lastTargetedPlayer.position.z + randomZ, false, false, false, false);
                    }
                }
            }
            else {
                var randomX = Math.cos(randomFloat) * randomDistance;
                var randomY = Math.sin(randomFloat) * randomDistance;
                var randomZ = (Math.random() * (0.1 - (-0.1)) + (-0.1));
                element.setCoords(position.x + randomX, position.y + randomY, position.z + randomZ, false, false, false, false);
            }

        }

        if (element.isBotFar == true) {
            if (element.botExists < getTimeInSeconds()) {
                element.destroy();
                spawnEntity();
            }
        }

    });

}, 40);

mp.events.add(RageEnums.EventKey.RENDER, () => {

    var target = mp.game.player.getEntityIsFreeAimingAt();

    mp.peds.forEach((element) => {

        if (!element.isBotFar)
            return false;

        if (target)
        {
            if (target == element.handle)
                element.setCoords(element.getCoords(true).x, element.getCoords(true).y, element.getCoords(true).z + 0.01, false, false, false, false);
        }

    });

});*/

var stats = ["SP0_STAMINA", "SP0_SHOOTING_ABILITY", "SP0_STRENGTH", "SP0_STEALTH_ABILITY", "SP0_LUNG_CAPACITY"]

mp.events.add(RageEnums.EventKey.PLAYER_SPAWN, () => {

    stats.forEach((element) => {
        mp.game.stats.statSetInt(mp.game.joaat(element), 100, false);
    });

});

var lastFrameRate = 0;
var currentFramerate = 0;
var lastFrameCall = getTimeInSeconds();
var frameWarnCount = 0;

mp.events.add(RageEnums.EventKey.RENDER, () => {

    if (mp.game.ui.isPauseMenuActive())
        return false;

    currentFramerate++;

    if (lastFrameCall <= getTimeInSeconds()) {
        lastFrameRate = currentFramerate;
        currentFramerate = 0;
        lastFrameCall = getTimeInSeconds() + 1;

        if (lastFrameRate <= 20) {
            frameWarnCount++;

            if (frameWarnCount >= 6) {
                mp.events.callRemote("server:LowFramerate", lastFrameRate);
                frameWarnCount = 0;
            }
        }
        else
            frameWarnCount = 0;
    }

});


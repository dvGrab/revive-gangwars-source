enum WeaponType {
    MELEE = 2685387236
}

class DamageParts {
    id: number;
    name: string;
    size: number;

    constructor(name: string, id: number, size: number) {
        this.id = id;
        this.name = name;
        this.size = size;
    }

    getDistanceFrom(target: PlayerMp, from: Vector3Mp) {
        var targetBone = target.getBoneCoords(this.id, 0.0, 0.0, 0.0);
        return mp.game.system.vdist(targetBone.x, targetBone.y, targetBone.z, from.x, from.y, from.z);
    }
}

class DamageManager {

    parts: DamageParts[] = [];


    getBonePositionByName(bonename: String) {
        var bonePosition = mp.players.local.position;

        this.parts.forEach((element: DamageParts) => {

            if (element.name != bonename)
                return false;

            bonePosition = mp.players.local.getBoneCoords(element.id, 0, 0, 0);
        });

        return bonePosition;
    }

    constructor() {

        setInterval(() => {
            mp.game.invoke(RageEnums.Natives.Ped.SET_CAN_ATTACK_FRIENDLY, mp.players.local.handle, true, false);

            mp.players.forEachInStreamRange((element) => {
                if (element.type != "player")
                    return false;

                if (element == mp.players.local)
                    return false;

                var weaponType = mp.game.weapon.getWeapontypeGroup(element.weapon);

                if (weaponType == WeaponType.MELEE || (this.getDistance(mp.players.local.position, element.getCoords(false)) < 5))
                    element.setRelationshipGroupHash(mp.game.joaat("Enemy"));
                else
                    element.setRelationshipGroupHash(mp.game.joaat("Friendly"));

            });
        }, 100);

        mp.game.ped.addRelationshipGroup("Friendly", mp.game.joaat("Friendly"));
        mp.game.ped.addRelationshipGroup("Enemy", mp.game.joaat("Enemy"));

        mp.game.ped.setRelationshipBetweenGroups(0, mp.game.joaat("Friendly"), mp.game.joaat("Friendly"));
        mp.game.ped.setRelationshipBetweenGroups(5, mp.game.joaat("Friendly"), mp.game.joaat("Enemy"));

        mp.players.local.setRelationshipGroupHash(mp.game.joaat("Friendly"));

        mp.events.add(RageEnums.EventKey.PLAYER_WEAPON_SHOT, (position: Vector3Mp, target: PlayerMp) => {

            if (mp.players.exists(target))
                this.getHitBone(position, target);

        });

        mp.events.add("client:GiveDamage", (amount: number, x: number, y: number, z: number, targetBoneName: string, weaponname: string) => {

            if (mp.players.local.getVariable("spawnProtection"))
                return false;

            this.setHitIndicator(new mp.Vector3(x, y, z));


            if (mp.players.local.getArmour() > 0)
                mp.players.local.setArmour(mp.players.local.getArmour() - amount);
            else
                mp.players.local.applyDamageTo(amount, false);

            mp.game.invoke(RageEnums.Natives.Audio.PLAY_PAIN, mp.players.local.handle, 6, 1.0, 0);
            //mp.game.cam.shakeGameplayCam("SMALL_EXPLOSION_SHAKE", 0.01);

            var hitBonePos = this.getBonePositionByName(targetBoneName);

            mp.game.gameplay.shootSingleBulletBetweenCoords(x, y, z, hitBonePos.x, hitBonePos.y, hitBonePos.z, 0, false, Number(weaponname), -1, false, false, 1000);
        });

        mp.events.add("client:ShowHitmarker", (health: number, x: number, y: number, z: number) => {
            this.setHitmarker();
            Hits.add(health, new mp.Vector3(x, y, z))
        });

        mp.events.add("client:playHeadshot", () => {
            this.playHeadshot();

        });
    }

    getPartById(id: number) {
        var found = this.parts.find(element => element.name == name);

        if (found)
            return found;
    }

    addPart(name: string, id: number, size: number) {
        var found = this.parts.find(element => element.name == name);

        if (!found)
            this.parts.push(new DamageParts(name, id, size));
    }

    allParts() {
        return this.parts;
    }

    isUsingWall(to: Vector3Mp) {
        var fingerPosition = mp.players.local.getBoneCoords(26610, 0.0, 0.0, 0.0);

        var isInLineOfSight = mp.raycasting.testPointToPoint(fingerPosition, to, undefined, 1);

        if (!isInLineOfSight)
            return true;
        else
            return false;
    }

    getHitBone(position: Vector3Mp, target: PlayerMp) {
        var longestDistance = 10;
        var targetBone: any = undefined;
        var weaponName = mp.players.local.weapon.toString();

        Damage.allParts().forEach((element: DamageParts) => {

            var newDistance = element.getDistanceFrom(target, position);

            if (newDistance < longestDistance) {
                longestDistance = newDistance;
                targetBone = element;
            }

        });

        if (this.isUsingWall(position)) {
            if (targetBone != undefined) {
                if (!target.vehicle) {
                    if (longestDistance < targetBone.size)
                        mp.events.callRemote("server:PlayerHit", target.remoteId, targetBone.name, weaponName);
                }
                else {
                    if (longestDistance < targetBone.size + 0.5)
                        mp.events.callRemote("server:PlayerHit", target.remoteId, targetBone.name, weaponName);
                }
            }
            else
                if (!target.vehicle) {
                    mp.events.callRemote("server:PlayerHit", target.remoteId, "Spine_1", weaponName);
                }
        }
    }

    getHitRotationFrom(position: Vector3Mp) {

        var absolutePosition = new mp.Vector3(position.x - mp.players.local.position.x, position.y - mp.players.local.position.y, position.z - mp.players.local.position.z);

        var angle = Math.atan2(absolutePosition.y, absolutePosition.x);

        angle = (angle * 180 / Math.PI);

        var outputRotation = (angle - mp.game.cam.getGameplayCamRot(0).z);

        if (outputRotation < 0)
            outputRotation = outputRotation + 360;

        return outputRotation;

    }

    setHitIndicator(position: Vector3Mp) {
        if (!mp.browsers.exists(browser))
            return false;

        var rotation = this.getHitRotationFrom(new mp.Vector3(position.x, position.y, position.z));

        if (rotation > 45 && rotation < 135)
            browser.execute("hitTop();");

        if (rotation > 135 && rotation < 225)
            browser.execute("hitLeft();");

        if (rotation > 225 && rotation < 315)
            browser.execute("hitBottom();");

        if (rotation > 315 && rotation < 360)
            browser.execute("hitRight();");
    }

    setHitmarker() {
        if (!mp.browsers.exists(browser))
            return false;

        browser.execute("hitMarker();");
    }

    playHeadshot() {
        if (!mp.browsers.exists(browser))
            return false;

        browser.execute("headshot();");
    }

    getDistance(from: Vector3Mp, to: Vector3Mp) {
        return mp.game.system.vdist(from.x, from.y, from.z, to.x, to.y, to.z);
    }
}

var Damage = new DamageManager();

Damage.addPart("Head", 31086, 0.4);
Damage.addPart("Neck", 39317, 0.5);

Damage.addPart("Left_Clavicle", 64729, 0.5);
Damage.addPart("Right_Clavicle", 10706, 0.5);

Damage.addPart("Upper_Arm Right", 40269, 0.5);
Damage.addPart("Upper_Arm Left", 45509, 0.5);

Damage.addPart("Lower_Arm Right", 28252, 0.5);
Damage.addPart("Lower_Arm Left", 61163, 0.5);

Damage.addPart("Spine_1", 24816, 0.5);
Damage.addPart("Spine_3", 24818, 0.5);

Damage.addPart("Right_Tigh", 51826, 0.5);
Damage.addPart("Left_Tigh", 58271, 0.5);

Damage.addPart("Right_Calf", 36864, 0.5);
Damage.addPart("Left_Calf", 63931, 0.5);

Damage.addPart("Right_Food", 52301, 0.5);
Damage.addPart("Left_Food", 14201, 0.5);

function dotProduct(from: Vector3Mp, to: Vector3Mp) {
    return (from.x * to.x) + (from.y * to.y) + (from.z * to.z);
}

function vectorLength(from: Vector3Mp) {
    return Math.sqrt(from.x * from.x + from.y * from.y + from.z * from.z);
}

class HitObject {
    amount: number;
    position: Vector3Mp;
    count: number = 0;

    constructor(amount: number, position: Vector3Mp) {
        this.amount = amount;
        this.position = position;
    }
}

class HitText {
    list: HitObject[] = [];

    add(amount: number, position: Vector3Mp) {
        this.list.push(new HitObject(amount, position));
    }

    render() {
        this.list.forEach((element: HitObject) => {

            mp.game.graphics.drawText(element.amount.toString(), [element.position.x, element.position.y, element.position.z + 1.4], { font: 2, centre: true, color: [255, 255, 255, 155 - element.count], scale: [0.3, 0.3], outline: true });
            element.count += 3;
            element.position.z += 0.03;

            if (element.count > 155) {
                var find = Hits.list.findIndex(elemen => elemen == element);

                Hits.list.splice(find, 1);
            }
        });

    }
}

var Hits = new HitText();

mp.events.add(RageEnums.EventKey.RENDER, () => {
    Hits.render();
});
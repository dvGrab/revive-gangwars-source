import { Player } from "../account/player";
import { TeamIds } from "./team";
import { overlayError } from "../utils/utils";
import { database } from "../database/manager";
import { Clothes } from "../database/entities/clothes";

export enum Component {
    Bandana = 1,
    Hair = 2,
    Body = 8,
    Arms = 3,
    Torso = 11,
    Legs = 4,
    Foots = 6,
    Accessories = 7,
    Hat = 0
}

class clothesHelper {
    team: number;
    index: number;
    texture: number;
    item: number;
    component: Component;
    gender: boolean;

    constructor(team: number, index: number, item: number, texture: number, component: number, gender: boolean) {
        this.team = team;
        this.index = index;
        this.texture = texture;
        this.item = item;
        this.component = component;
        this.gender = gender;
    }
}

export class serverClothes {

    list: any = [];
    proplist: any = [];

    addClothes(team: number, item: number, texture: number, component: number, gender: boolean) {
        var indexValue: any = 0;

        this.list.forEach((element: clothesHelper) => {

            if (element.component != component) return false;
            if (element.team != team) return false;
            if (element.gender != gender) return false;

            indexValue++;

        });

        this.list.push(new clothesHelper(team, indexValue, item, texture, component, gender));
    }

    addProp(team: number, item: number, texture: number, component: number, gender: boolean) {
        var indexValue: any = 0;

        this.proplist.forEach((element: clothesHelper) => {

            if (element.component != component) return false;
            if (element.team != team) return false;
            if (element.gender != gender) return false;

            indexValue++;

        });

        this.proplist.push(new clothesHelper(team, indexValue, item, texture, component, gender));
    }

    getMaxComponentClothes(component: number, team: number, gender: boolean): number {
        var returnValue: any = -1;

        this.list.forEach((element: clothesHelper) => {
            if (element.component != component) return false;
            if (element.team != team) return false;
            if (element.gender != gender) return false;

            returnValue++;
        });

        return returnValue;
    }

    getComponentClothes(player: Player, index: number, component: number, gender: boolean): number {
        var returnValue: any = 15;

        this.list.forEach((element: clothesHelper) => {
            if (element.component != component) return false;
            if (player.team != element.team) return false;
            if (index != element.index) return false;
            if (element.gender != gender) return false;

            returnValue = element.item;
        });

        return returnValue;
    }

    getComponentTexture(player: Player, index: number, component: number, gender: boolean): number {
        var returnValue: any = 0;

        this.list.forEach((element: clothesHelper) => {
            if (element.component != component) return false;
            if (player.team != element.team) return false;
            if (index != element.index) return false;
            if (element.gender != gender) return false;

            returnValue = element.texture;
        });

        return returnValue;
    }

    getMaxPropClothes(component: number, team: number, gender: boolean): number {
        var returnValue: any = -1;

        this.proplist.forEach((element: clothesHelper) => {
            if (element.component != component) return false;
            if (element.team != team) return false;
            if (element.gender != gender) return false;

            returnValue++;
        });

        return returnValue;
    }

    getPropClothes(player: Player, index: number, component: number, gender: boolean): number {
        var returnValue: any = 15;

        this.proplist.forEach((element: clothesHelper) => {
            if (element.component != component) return false;
            if (player.team != element.team) return false;
            if (index != element.index) return false;
            if (element.gender != gender) return false;

            returnValue = element.item;
        });

        return returnValue;
    }

    getPropTexture(player: Player, index: number, component: number, gender: boolean): number {
        var returnValue: any = 0;

        this.proplist.forEach((element: clothesHelper) => {
            if (element.component != component) return false;
            if (player.team != element.team) return false;
            if (index != element.index) return false;
            if (element.gender != gender) return false;

            returnValue = element.texture;
        });

        return returnValue;
    }
}

export class playerClothes {

    player: Player;
    head: number;
    torso: number;
    leg: number;
    foot: number;
    bandana: number;
    access: number;

    headSelection: number = 0;
    torsoSelection: number = 0;
    legsSelection: number = 0;
    footsSelection: number = 0;
    bandanaSelection: number = 0;
    accessSelection: number = 0;
    hatSelection: number = 0;

    gender: boolean = false;

    applyComponent(index: number, texture: number, component: number) {
        this.player.setClothes(component, index, texture, 2);

        if (this.player.getClothes(4).drawable == 59) {
            this.player.setClothes(6, 7, 0, 2);

            if (component == Component.Foots)
                overlayError(this.player, "Du kannst mit dieser Hose keine anderen Schuhe wählen.", "Fehler");
        }
    }

    applyProp(index: number, texture: number, component: number) {
        this.player.setProp(component, index, texture);
    }
}

export var ServerClothes = new serverClothes();

mp.events.add("triggeredSelectedGender", (player: Player, status: boolean) => {
    if (mp.players.exists(player))
        if (player.isLoggedIn) {
            player.clothes.gender = status;

            if (!player.clothes.gender)
                player.model = mp.joaat("mp_m_freemode_01");
            else
                player.model = mp.joaat("mp_f_freemode_01");
        }

});

mp.events.add("clothesLoaded", (player: Player) => { loadedClothes(player) });

function loadedClothes(player: Player) {
    /* Grove: mother 2.4 father: 2.8 shape: 7.2 */

    if (player.character.gender)
        player.clothes.gender = false;
    else
        player.clothes.gender = true;


    if (player.name == "JazzBaalele") {
        player.setVariable("eyeColor", 21);
        player.call("setLocalEyeColor");
    }

    if (player.name == "DevGrab") {
        player.setVariable("eyeColor", 16);
        player.call("setLocalEyeColor");
    }

    player.tattoo.placeAllTattoes();

    player.position = new mp.Vector3(-175.29458618164062, 492.7996826171875, 130.04368591308594);
    player.heading = 243;


    database.then(connection => {

        if (!mp.players.exists(player))
            return false;

        connection.getRepository(Clothes).findOne({ where: { name: player.name, team: player.team } }).then((element: Clothes) => {

            if (!mp.players.exists(player))
                return false;

            if (element) {
                player.clothes.bandanaSelection = element.bandana;
                player.clothes.headSelection = element.hair;
                player.clothes.torsoSelection = element.torso;
                player.clothes.legsSelection = element.legs;
                player.clothes.footsSelection = element.foots;
                player.clothes.accessSelection = element.accessories;
                player.clothes.hatSelection = element.hat;
            }
            else {
                player.clothes.bandanaSelection = 0;
                player.clothes.headSelection = 0;
                player.clothes.torsoSelection = 0;
                player.clothes.legsSelection = 0;
                player.clothes.footsSelection = 0;
                player.clothes.accessSelection = 0;
                player.clothes.hatSelection = 0;
            }

            if (!mp.players.exists(player))
                return false;

            player.clothes.applyComponent(
                ServerClothes.getComponentClothes(player, player.clothes.headSelection, Component.Hair, player.clothes.gender),
                ServerClothes.getComponentTexture(player, player.clothes.headSelection, Component.Hair, player.clothes.gender),
                Component.Hair);

            player.clothes.applyComponent(
                ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Body, player.clothes.gender), 0, Component.Body);

            player.clothes.applyComponent(
                ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Arms, player.clothes.gender), 0, Component.Arms);

            player.clothes.applyComponent(
                ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Torso, player.clothes.gender),
                ServerClothes.getComponentTexture(player, player.clothes.torsoSelection, Component.Torso, player.clothes.gender),
                Component.Torso);

            player.clothes.applyComponent(
                ServerClothes.getComponentClothes(player, player.clothes.accessSelection, Component.Accessories, player.clothes.gender),
                ServerClothes.getComponentTexture(player, player.clothes.accessSelection, Component.Accessories, player.clothes.gender),
                Component.Accessories);

            player.clothes.applyComponent(
                ServerClothes.getComponentClothes(player, player.clothes.legsSelection, Component.Legs, player.clothes.gender),
                ServerClothes.getComponentTexture(player, player.clothes.legsSelection, Component.Legs, player.clothes.gender),
                Component.Legs);

            player.clothes.applyComponent(
                ServerClothes.getComponentClothes(player, player.clothes.footsSelection, Component.Foots, player.clothes.gender),
                ServerClothes.getComponentTexture(player, player.clothes.footsSelection, Component.Foots, player.clothes.gender),
                Component.Foots);

            player.clothes.applyProp(
                ServerClothes.getPropClothes(player, player.clothes.hatSelection, Component.Hat, player.clothes.gender),
                ServerClothes.getPropTexture(player, player.clothes.hatSelection, Component.Hat, player.clothes.gender),
                Component.Hat
            );

        });

    });
}

mp.events.add({

    "clothesHeadLeft": (player: Player) => {

        player.clothes.headSelection--;

        if (player.clothes.headSelection < 0)
            player.clothes.headSelection = ServerClothes.getMaxComponentClothes(Component.Hair, player.team, player.clothes.gender);

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.headSelection, Component.Hair, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.headSelection, Component.Hair, player.clothes.gender),
            Component.Hair);
    },

    "clothesHeadRight": (player: Player) => {

        player.clothes.headSelection++;

        if (player.clothes.headSelection > ServerClothes.getMaxComponentClothes(Component.Hair, player.team, player.clothes.gender))
            player.clothes.headSelection = 0;

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.headSelection, Component.Hair, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.headSelection, Component.Hair, player.clothes.gender),
            Component.Hair);
    },

    "clothesTorsoLeft": (player: Player) => {

        player.clothes.torsoSelection--;

        if (player.clothes.torsoSelection < 0)
            player.clothes.torsoSelection = ServerClothes.getMaxComponentClothes(Component.Torso, player.team, player.clothes.gender);

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Torso, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.torsoSelection, Component.Torso, player.clothes.gender),
            Component.Torso);

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Body, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.torsoSelection, Component.Body, player.clothes.gender), Component.Body);

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Arms, player.clothes.gender), 0, Component.Arms);
    },

    "clothesTorsoRight": (player: Player) => {

        player.clothes.torsoSelection++;

        if (player.clothes.torsoSelection > ServerClothes.getMaxComponentClothes(Component.Torso, player.team, player.clothes.gender))
            player.clothes.torsoSelection = 0;

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Torso, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.torsoSelection, Component.Torso, player.clothes.gender),
            Component.Torso);

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Body, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.torsoSelection, Component.Body, player.clothes.gender), Component.Body);

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.torsoSelection, Component.Arms, player.clothes.gender), 0, Component.Arms);
    },
    "clothesAccessLeft": (player: Player) => {

        player.clothes.accessSelection--;

        if (player.clothes.accessSelection < 0)
            player.clothes.accessSelection = ServerClothes.getMaxComponentClothes(Component.Accessories, player.team, player.clothes.gender);

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.accessSelection, Component.Accessories, player.clothes.gender), 0, Component.Accessories);
    },

    "clothesAccessRight": (player: Player) => {

        player.clothes.accessSelection++;

        if (player.clothes.accessSelection > ServerClothes.getMaxComponentClothes(Component.Accessories, player.team, player.clothes.gender))
            player.clothes.accessSelection = 0;

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.accessSelection, Component.Accessories, player.clothes.gender), 0, Component.Accessories);
    },
    "clothesLegsLeft": (player: Player) => {

        player.clothes.legsSelection--;

        if (player.clothes.legsSelection < 0)
            player.clothes.legsSelection = ServerClothes.getMaxComponentClothes(Component.Legs, player.team, player.clothes.gender);

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.legsSelection, Component.Legs, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.legsSelection, Component.Legs, player.clothes.gender),
            Component.Legs);
    },

    "clothesLegsRight": (player: Player) => {

        player.clothes.legsSelection++;

        if (player.clothes.legsSelection > ServerClothes.getMaxComponentClothes(Component.Legs, player.team, player.clothes.gender))
            player.clothes.legsSelection = 0;

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.legsSelection, Component.Legs, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.legsSelection, Component.Legs, player.clothes.gender),
            Component.Legs);
    },

    "clothesFootsLeft": (player: Player) => {

        player.clothes.footsSelection--;

        if (player.clothes.footsSelection < 0)
            player.clothes.footsSelection = ServerClothes.getMaxComponentClothes(Component.Foots, player.team, player.clothes.gender);

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.footsSelection, Component.Foots, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.footsSelection, Component.Foots, player.clothes.gender),
            Component.Foots);

    },

    "clothesFootsRight": (player: Player) => {

        player.clothes.footsSelection++;

        if (player.clothes.footsSelection > ServerClothes.getMaxComponentClothes(Component.Foots, player.team, player.clothes.gender))
            player.clothes.footsSelection = 0;

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.footsSelection, Component.Foots, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.footsSelection, Component.Foots, player.clothes.gender),
            Component.Foots);
    },

    "clothesBandanaLeft": (player: Player) => {

        player.clothes.bandanaSelection--;

        if (player.clothes.bandanaSelection < 0)
            player.clothes.bandanaSelection = ServerClothes.getMaxComponentClothes(Component.Bandana, player.team, player.clothes.gender);

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.bandanaSelection, Component.Bandana, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.bandanaSelection, Component.Bandana, player.clothes.gender),
            Component.Bandana);

    },

    "clothesBandanaRight": (player: Player) => {

        player.clothes.bandanaSelection++;

        if (player.clothes.bandanaSelection > ServerClothes.getMaxComponentClothes(Component.Bandana, player.team, player.clothes.gender))
            player.clothes.bandanaSelection = 0;

        player.clothes.applyComponent(
            ServerClothes.getComponentClothes(player, player.clothes.bandanaSelection, Component.Bandana, player.clothes.gender),
            ServerClothes.getComponentTexture(player, player.clothes.bandanaSelection, Component.Bandana, player.clothes.gender),
            Component.Bandana);
    },

    "clothesHatLeft": (player: Player) => {

        player.clothes.hatSelection--;

        if (player.clothes.hatSelection < 0)
            player.clothes.hatSelection = ServerClothes.getMaxPropClothes(Component.Hat, player.team, player.clothes.gender);

        player.clothes.applyProp(
            ServerClothes.getPropClothes(player, player.clothes.hatSelection, Component.Hat, player.clothes.gender),
            ServerClothes.getPropTexture(player, player.clothes.hatSelection, Component.Hat, player.clothes.gender),
            Component.Hat);

    },

    "clothesHatRight": (player: Player) => {

        player.clothes.hatSelection++;

        if (player.clothes.hatSelection > ServerClothes.getMaxPropClothes(Component.Hat, player.team, player.clothes.gender))
            player.clothes.hatSelection = 0;

        player.clothes.applyProp(
            ServerClothes.getPropClothes(player, player.clothes.hatSelection, Component.Hat, player.clothes.gender),
            ServerClothes.getPropTexture(player, player.clothes.hatSelection, Component.Hat, player.clothes.gender),
            Component.Hat);
    }


});

mp.events.add("server:ResetPlayerHat", (player: PlayerMp, remoteId: number) => {

    mp.players.forEach((element: Player) => {

        if (element.id != remoteId)
            return false;

        element.clothes.applyProp(
            ServerClothes.getPropClothes(element, element.clothes.hatSelection, Component.Hat, element.clothes.gender),
            ServerClothes.getPropTexture(element, element.clothes.hatSelection, Component.Hat, element.clothes.gender),
            Component.Hat
        );

    });

});

mp.events.add("playerSpawn", (player: Player) => {


    player.clothes.applyProp(
        ServerClothes.getPropClothes(player, player.clothes.hatSelection, Component.Hat, player.clothes.gender),
        ServerClothes.getPropTexture(player, player.clothes.hatSelection, Component.Hat, player.clothes.gender),
        Component.Hat
    );

});


for (var i = 0; i <= 76; i++) {

    if (i == 0)
        continue;

    if (i == 24)
        continue;

    ServerClothes.addClothes(TeamIds.Grove, i, 0, Component.Hair, true);
    ServerClothes.addClothes(TeamIds.Ballas, i, 0, Component.Hair, true);
    ServerClothes.addClothes(TeamIds.Vagos, i, 0, Component.Hair, true);
    ServerClothes.addClothes(TeamIds.Bloods, i, 0, Component.Hair, true);
    ServerClothes.addClothes(TeamIds.LSPD, i, 0, Component.Hair, true);
    ServerClothes.addClothes(TeamIds.Hitman, i, 0, Component.Hair, true);
    ServerClothes.addClothes(TeamIds.LostMC, i, 0, Component.Hair, true);
    ServerClothes.addClothes(TeamIds.RealVagos, i, 0, Component.Hair, true);
}

for (var i = 0; i <= 73; i++) {

    if (i == 23)
        continue;

    ServerClothes.addClothes(TeamIds.Grove, i, 0, Component.Hair, false);
    ServerClothes.addClothes(TeamIds.Ballas, i, 0, Component.Hair, false);
    ServerClothes.addClothes(TeamIds.Vagos, i, 0, Component.Hair, false);
    ServerClothes.addClothes(TeamIds.Bloods, i, 0, Component.Hair, false);
    ServerClothes.addClothes(TeamIds.LSPD, i, 0, Component.Hair, false);
    ServerClothes.addClothes(TeamIds.Hitman, i, 0, Component.Hair, false);
    ServerClothes.addClothes(TeamIds.LostMC, i, 0, Component.Hair, false);
    ServerClothes.addClothes(TeamIds.RealVagos, i, 0, Component.Hair, false);
}

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LSPD, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Hitman, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Accessories, true);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 0, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 0, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Bandana, true);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 0, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 0, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Bandana, false);


ServerClothes.addClothes(TeamIds.Grove, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 5, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 7, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 7, 6, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 14, 13, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 84, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 84, 4, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 87, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 88, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 89, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 126, 9, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 127, 9, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 127, 9, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 127, 9, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 128, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 143, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 191, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 7, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 200, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 206, 18, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 206, 20, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 208, 18, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 208, 20, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 212, 18, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 212, 20, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 219, 18, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 239, 18, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 239, 20, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 251, 18, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 0, 9, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 5, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 9, 13, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 10, 13, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 13, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 31, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 33, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 35, 6, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 35, 6, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 74, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 74, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 73, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 73, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 79, 3, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 11, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 117, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 120, 13, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 120, 13, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 121, 13, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 9, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 125, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 168, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 169, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 170, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 171, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 193, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 202, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 210, 18, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 210, 20, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 212, 18, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 212, 20, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 216, 18, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 216, 20, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 221, 20, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 221, 18, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 222, 18, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 221, 18, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 222, 20, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 223, 18, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 223, 20, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 11, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 226, 18, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 11, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 226, 20, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 5, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 15, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 4, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 5, 6, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 5, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 6, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 3, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 10, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 42, 6, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 59, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 59, 8, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 59, 9, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 64, 9, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 78, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 78, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 86, 18, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 86, 20, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 88, 18, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 88, 20, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 102, 14, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 0, 7, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 1, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 1, 3, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 1, 7, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 1, 6, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 1, 13, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 2, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 11, 10, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 11, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 14, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 25, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 25, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 43, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 54, 3, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 58, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 61, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 61, 8, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 61, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 66, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 77, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 80, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 80, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 87, 6, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 89, 18, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 102, 17, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Grove, 106, 5, Component.Legs, true);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 11, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 6, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 7, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 12, 6, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 12, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 14, 15, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 14, 9, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 14, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 22, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 26, 5, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 43, 3, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 29, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 1, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 1, 8, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 31, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 49, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 60, 7, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 60, 9, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 60, 10, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 79, 3, Component.Foots, true);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 11, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 6, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 7, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 12, 6, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 12, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 14, 15, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 14, 9, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 14, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 22, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 26, 5, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 43, 3, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 29, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 1, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 1, 8, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 31, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 49, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 60, 7, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 60, 9, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 60, 10, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 79, 3, Component.Foots, true);

ServerClothes.addClothes(TeamIds.Grove, 77, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 77, 9, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Grove, 81, 1, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Grove, 81, 9, Component.Foots, true);

ServerClothes.addClothes(TeamIds.LSPD, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LSPD, 55, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LSPD, 58, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LSPD, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LSPD, 53, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LSPD, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LSPD, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LSPD, 54, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LSPD, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LSPD, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LSPD, 50, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LSPD, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LSPD, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LSPD, 48, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LSPD, 35, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LSPD, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LSPD, 47, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LSPD, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LSPD, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LSPD, 46, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LSPD, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LSPD, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LSPD, 43, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LSPD, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LSPD, 17, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LSPD, 53, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LSPD, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LSPD, 17, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LSPD, 54, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LSPD, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LSPD, 17, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LSPD, 50, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LSPD, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LSPD, 18, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LSPD, 46, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LSPD, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LSPD, 18, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LSPD, 47, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LSPD, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LSPD, 18, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LSPD, 43, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LSPD, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LSPD, 35, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LSPD, 34, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LSPD, 4, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LSPD, 26, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LSPD, 34, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LSPD, 42, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LSPD, 33, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LSPD, 32, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LSPD, 41, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LSPD, 33, 0, Component.Legs, false);

ServerClothes.addClothes(TeamIds.LSPD, 25, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.LSPD, 24, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.LSPD, 1, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.LSPD, 25, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.LSPD, 24, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.LSPD, 1, 1, Component.Foots, true);
ServerClothes.addClothes(TeamIds.LSPD, 25, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.LSPD, 24, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.LSPD, 1, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.LSPD, 25, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.LSPD, 24, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.LSPD, 1, 1, Component.Foots, true);


ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 17, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 3, 9, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 7, 9, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 8, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 38, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 82, 14, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 84, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 84, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 126, 6, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 126, 13, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 127, 6, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 127, 13, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 128, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 143, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 200, 21, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 206, 22, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 208, 22, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 210, 22, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 212, 22, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 239, 22, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);


ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, -1, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 0, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 1, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 2, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 2, 14, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 2, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 2, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 10, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 11, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 8, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 12, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 16, 3, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 9, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 35, 11, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 11, 1, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 9, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 78, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 120, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 120, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 120, 16, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 120, 16, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 121, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 121, 16, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 125, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 140, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 202, 21, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 210, 22, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 212, 22, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 216, 22, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 221, 22, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 222, 22, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 223, 22, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 224, 22, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 12, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 225, 22, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 11, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Ballas, 226, 22, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Ballas, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 1, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 1, 5, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 5, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 5, 9, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 6, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 3, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 42, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 59, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 59, 8, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 59, 9, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 64, 7, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 78, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 86, 22, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 88, 22, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Ballas, 0, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 0, 5, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 1, 3, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 1, 6, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 1, 13, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 2, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 11, 13, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 25, 11, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 25, 10, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 25, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 25, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 27, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 43, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 61, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 61, 8, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 61, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 66, 7, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 80, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 89, 22, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 91, 22, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 102, 19, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Ballas, 109, 16, Component.Legs, true);

ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 1, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 6, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 7, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 12, 6, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 12, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 14, 3, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 14, 15, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 22, 4, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 26, 8, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 29, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 43, 3, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 48, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 57, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 57, 6, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 57, 9, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 57, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 1, 1, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 1, 9, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 10, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 11, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 31, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 49, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 60, 1, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 60, 9, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 60, 10, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 81, 6, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 81, 10, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Ballas, 77, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Ballas, 77, 10, Component.Foots, false);



ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 4, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 3, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 3, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 7, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 14, 9, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 79, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 86, 4, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 126, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 127, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 0, 4, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 127, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 128, 4, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 134, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 167, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 0, 4, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 200, 12, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 200, 7, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 8, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 225, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 8, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 234, 19, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 238, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 251, 17, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 282, 9, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 0, 4, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 1, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 1, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 1, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 1, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 2, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 2, 3, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 4, 13, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 9, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 9, 11, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 13, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 4, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 16, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 22, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 12, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 26, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 33, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 35, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 35, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 35, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 1, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 35, 8, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 35, 8, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 35, 8, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 1, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 72, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 74, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 74, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 78, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 120, 12, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 120, 12, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 9, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 121, 12, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 125, 4, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 131, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 140, 4, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 12, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 164, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 168, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 168, 3, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 168, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 169, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 169, 3, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 169, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 170, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 170, 3, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 170, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 171, 4, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 192, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 202, 12, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 202, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 11, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 209, 16, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 235, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Bloods, 247, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 0, Component.Body, true);


ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 3, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 5, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 4, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 5, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 5, 5, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 6, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 3, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 42, 4, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 59, 4, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 59, 8, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 59, 9, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 78, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 79, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Bloods, 0, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 0, 8, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 0, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 0, 15, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 1, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 1, 3, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 1, 7, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 2, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 2, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 4, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 4, 8, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 4, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 14, 8, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 16, 7, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 25, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 25, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 25, 6, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 25, 10, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 27, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 27, 4, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 31, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 43, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 43, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 43, 4, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 58, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 61, 4, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 61, 8, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 61, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 66, 4, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 80, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 81, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 87, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 87, 3, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 97, 3, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 102, 4, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 106, 4, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Bloods, 112, 3, Component.Legs, true);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 7, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 4, 4, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 6, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 7, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 12, 6, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 12, 9, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 12, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 12, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 14, 15, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 26, 3, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 29, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 32, 5, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 32, 12, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 57, 6, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 57, 8, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 57, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 75, 5, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 77, 11, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 77, 3, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 1, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 1, 5, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 3, 2, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 11, 3, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 31, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 33, 4, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 60, 8, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 60, 9, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 60, 10, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 79, 5, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 81, 3, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Bloods, 81, 11, Component.Foots, true);


ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 3, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 7, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 8, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 8, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 17, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 47, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 82, 9, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 84, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 86, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 87, 11, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 88, 11, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 96, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 126, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 127, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 127, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 127, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 128, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 167, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 167, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 193, 12, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 200, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 206, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 208, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 210, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 212, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 219, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 8, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 225, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 234, 17, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 239, 10, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 241, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 0, 6, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 5, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 9, 6, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 10, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 11, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 16, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 22, 4, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 31, 4, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 31, 4, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 33, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 35, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 35, 7, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 2, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 40, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 73, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 73, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 74, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 74, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 78, 6, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 87, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 11, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 117, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 11, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 117, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 120, 6, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 120, 6, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 121, 6, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 125, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 12, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 164, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 171, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 11, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 202, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 11, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 210, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 212, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 216, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 221, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 222, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 223, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 224, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 12, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 225, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 11, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, 226, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 9, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Vagos, -1, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 1, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 1, 5, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 4, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 5, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 5, 3, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 5, 4, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 6, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 3, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 42, 3, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 59, 5, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 59, 8, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 59, 9, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 78, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 86, 10, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 0, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 0, 4, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 0, 10, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 1, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 1, 3, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 1, 4, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 2, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 2, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 4, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 4, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 4, 6, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 4, 8, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 11, 4, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 8, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 14, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 25, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 25, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 25, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 25, 10, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 27, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 27, 14, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 43, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 58, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 58, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 61, 5, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 61, 8, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 61, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 66, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 66, 5, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 66, 3, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 80, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 87, 5, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 87, 8, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 89, 10, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 91, 10, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 102, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 106, 7, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 107, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 112, 5, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Vagos, 88, 10, Component.Legs, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 1, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 1, 6, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 4, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 6, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 7, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 12, 5, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 12, 6, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 12, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 14, 12, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 14, 15, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 22, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 26, 4, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 29, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 57, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 57, 9, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 57, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 75, 18, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 77, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 77, 8, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Vagos, 1, 1, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 1, 4, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 3, 3, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 4, 3, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 27, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 31, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 60, 2, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 60, 9, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 60, 10, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 79, 18, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 81, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Vagos, 81, 8, Component.Foots, true);

ServerClothes.addClothes(TeamIds.LostMC, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 5, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 6, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 2, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 6, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 2, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 62, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 62, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 64, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 2, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 157, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 157, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 157, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 15, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 157, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 5, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 157, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 157, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 15, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 163, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 163, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 166, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 166, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 173, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 173, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 174, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 2, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 175, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 15, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 2, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 176, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 2, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 179, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 179, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LostMC, 179, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LostMC, 15, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 154, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 154, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 160, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 160, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 163, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 163, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 0, 2, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 171, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 14, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 173, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 175, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 175, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LostMC, 178, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LostMC, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LostMC, 43, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LostMC, 75, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LostMC, 77, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LostMC, 76, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LostMC, 74, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LostMC, 73, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LostMC, 78, 2, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LostMC, 102, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.LostMC, 4, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LostMC, 26, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LostMC, 76, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LostMC, 76, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LostMC, 76, 4, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LostMC, 76, 7, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LostMC, 75, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LostMC, 75, 4, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LostMC, 75, 7, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LostMC, 73, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.LostMC, 71, 0, Component.Legs, false);

ServerClothes.addClothes(TeamIds.LostMC, 7, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.LostMC, 9, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.LostMC, 25, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.LostMC, 24, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.LostMC, 30, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.LostMC, 25, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.LostMC, 24, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.LostMC, 37, 3, Component.Foots, false);
ServerClothes.addClothes(TeamIds.LostMC, 37, 0, Component.Foots, false);



ServerClothes.addClothes(TeamIds.Hitman, 0, 0, Component.Hair, false);

ServerClothes.addClothes(TeamIds.Hitman, 11, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 13, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 29, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 21, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 30, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 21, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 31, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 21, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 35, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 21, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 31, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 31, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 28, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 31, 10, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 29, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 31, 10, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 30, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 31, 10, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 31, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 31, 10, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 32, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 31, 10, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 40, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 22, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 120, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 22, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 4, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Hitman, 142, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Hitman, 21, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 7, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 7, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 2, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 57, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 57, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 2, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 58, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 58, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 2, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 64, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 64, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 2, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 70, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 70, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 2, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 139, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 139, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 2, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 139, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 67, 3, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 25, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 67, 3, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 25, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 67, 3, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 57, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 67, 3, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 58, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 67, 3, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 64, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 67, 3, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 57, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 38, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 57, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 40, 2, Component.Body, true);

ServerClothes.addClothes(TeamIds.Hitman, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Hitman, 57, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Hitman, 39, 0, Component.Body, true);










ServerClothes.addClothes(TeamIds.Hitman, 10, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Hitman, 13, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Hitman, 24, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Hitman, 28, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Hitman, 35, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Hitman, 45, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Hitman, 49, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Hitman, 52, 2, Component.Legs, false);

ServerClothes.addClothes(TeamIds.Hitman, 6, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Hitman, 7, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Hitman, 8, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Hitman, 27, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Hitman, 37, 0, Component.Legs, true);
ServerClothes.addClothes(TeamIds.Hitman, 34, 0, Component.Legs, true);

ServerClothes.addClothes(TeamIds.Hitman, 10, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Hitman, 12, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Hitman, 18, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Hitman, 19, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Hitman, 23, 2, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Hitman, 30, 2, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Hitman, 38, 2, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Hitman, 38, 5, Component.Accessories, false);

ServerClothes.addClothes(TeamIds.Hitman, 1, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 10, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 18, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 18, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 3, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 7, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 11, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 21, 11, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 40, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 40, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 40, 2, Component.Foots, false);

ServerClothes.addClothes(TeamIds.Hitman, 1, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 10, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 18, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 18, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 3, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 7, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 10, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 20, 11, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 21, 11, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 40, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 40, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.Hitman, 40, 2, Component.Foots, false);

ServerClothes.addClothes(TeamIds.Hitman, 0, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Hitman, 13, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Hitman, 22, 1, Component.Foots, true);
ServerClothes.addClothes(TeamIds.Hitman, 59, 1, Component.Foots, true);


ServerClothes.addClothes(TeamIds.Grove, 51, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 51, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 51, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 51, 2, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 51, 3, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 51, 4, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 51, 5, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 51, 7, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 52, 3, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 53, 3, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 57, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 101, 6, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 101, 8, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 111, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 111, 8, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 111, 14, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 111, 15, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 111, 17, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 111, 18, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 111, 22, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 113, 5, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 118, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 118, 7, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 118, 10, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 118, 11, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 118, 13, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Grove, 119, 7, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 51, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 51, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 51, 2, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 51, 3, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 51, 4, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 51, 6, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 51, 7, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 54, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 54, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 54, 9, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 101, 2, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 111, 2, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 111, 3, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 111, 14, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 111, 15, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 111, 17, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 111, 21, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 118, 2, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 118, 3, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 118, 4, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 118, 11, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Ballas, 118, 13, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 51, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 51, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 51, 2, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 51, 3, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 51, 4, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 51, 7, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 51, 9, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 101, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 2, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 111, 4, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 111, 7, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 111, 10, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 111, 11, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 111, 13, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 111, 14, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 29, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 111, 15, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 115, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 35, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 117, 11, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 118, 8, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 118, 11, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 118, 15, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 99, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 99, 5, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 54, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Vagos, 54, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 106, 24, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 32, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 105, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 51, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 51, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 51, 2, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 110, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 51, 3, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 51, 4, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 51, 7, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 54, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 54, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 54, 6, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 56, 6, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 57, 18, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 129, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 129, 10, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 111, 5, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 111, 9, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 111, 9, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 111, 12, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Hitman, 132, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 113, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 113, 12, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 113, 19, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 117, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 118, 9, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 118, 12, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.Bloods, 118, 23, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 51, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 51, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 51, 2, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 51, 3, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 46, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 51, 4, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 51, 7, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 51, 9, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 52, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 53, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 54, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 55, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 111, 6, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 111, 7, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 111, 8, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 111, 14, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 111, 15, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 57, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 111, 17, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LostMC, 111, 18, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 89, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 104, 25, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 126, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 122, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 130, 0, Component.Bandana, false);

ServerClothes.addClothes(TeamIds.Grove, 51, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 51, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 51, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 51, 2, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 51, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 51, 4, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 51, 5, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 51, 7, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 52, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 53, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 57, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 101, 6, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 101, 8, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 111, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 111, 8, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 111, 14, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 111, 15, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 111, 17, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 111, 18, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 111, 22, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 113, 5, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 118, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 118, 7, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 118, 10, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 118, 11, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 118, 13, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Grove, 119, 7, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 51, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 51, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 51, 2, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 51, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 51, 4, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 51, 6, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 51, 7, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 54, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 54, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 54, 9, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 101, 2, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 111, 2, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 111, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 111, 14, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 111, 15, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 111, 17, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 111, 21, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 118, 2, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 118, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 118, 4, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 118, 11, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Ballas, 118, 13, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 51, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 51, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 51, 2, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 51, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 51, 4, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 51, 7, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 51, 9, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 101, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 2, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 111, 4, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 111, 7, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 111, 10, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 111, 11, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 111, 13, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 111, 14, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 29, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 111, 15, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 115, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 35, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 117, 11, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 118, 8, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 118, 11, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 118, 15, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 99, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 99, 5, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 54, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Vagos, 54, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 106, 24, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 32, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 105, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 51, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 51, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 51, 2, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 110, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 51, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 51, 4, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 51, 7, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 54, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 54, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 54, 6, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 56, 6, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 57, 18, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 129, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 129, 10, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 111, 5, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 111, 9, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 111, 9, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 111, 12, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Hitman, 132, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 113, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 113, 12, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 113, 19, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 117, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 118, 9, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 118, 12, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.Bloods, 118, 23, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 51, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 51, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 51, 2, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 51, 3, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 46, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 51, 4, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 51, 7, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 51, 9, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 52, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 53, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 54, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 55, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 111, 6, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 111, 7, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 111, 8, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 111, 14, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 111, 15, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 57, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 111, 17, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LostMC, 111, 18, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 89, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 104, 25, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 126, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 122, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 130, 0, Component.Bandana, true);



ServerClothes.addClothes(TeamIds.Grove, 23, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 23, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 22, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 86, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 42, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 42, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 49, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 49, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 50, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 50, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 51, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 52, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 52, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 53, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 53, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 87, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 87, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 90, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 90, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 94, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 94, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 123, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 123, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 1, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 2, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 2, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 7, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 29, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 29, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 30, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 30, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 31, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 37, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 37, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 36, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 36, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 83, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 83, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 84, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 93, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Grove, 93, 1, Component.Accessories, true);


ServerClothes.addClothes(TeamIds.Ballas, 23, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 23, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 22, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 86, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 42, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 42, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 49, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 49, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 50, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 50, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 51, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 52, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 52, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 53, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 53, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 87, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 87, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 90, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 90, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 94, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 94, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 123, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 123, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 1, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 2, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 2, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 7, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 15, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 29, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 29, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 30, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 30, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 31, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 37, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 37, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 36, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 36, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 83, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 83, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 84, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 93, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Ballas, 93, 1, Component.Accessories, true);

ServerClothes.addClothes(TeamIds.Vagos, 23, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 23, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 22, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 86, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 42, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 42, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 49, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 49, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 50, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 50, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 51, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 52, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 52, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 53, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 53, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 87, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 87, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 90, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 90, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 94, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 94, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 123, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 123, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 1, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 2, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 2, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 7, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 15, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 29, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 29, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 30, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 30, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 31, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 37, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 37, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 36, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 36, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 83, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 83, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 84, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 93, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Vagos, 93, 1, Component.Accessories, true);

ServerClothes.addClothes(TeamIds.Bloods, 23, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 23, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 22, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 86, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 42, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 42, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 49, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 49, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 50, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 50, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 51, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 52, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 52, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 53, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 53, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 87, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 87, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 90, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 90, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 94, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 94, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 123, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 123, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 1, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 2, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 2, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 7, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 15, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 29, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 29, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 30, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 30, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 31, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 37, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 37, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 36, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 36, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 83, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 83, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 84, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 93, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.Bloods, 93, 1, Component.Accessories, true);

ServerClothes.addClothes(TeamIds.LostMC, 23, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 23, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 22, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 86, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 42, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 42, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 49, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 49, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 50, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 50, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 51, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 52, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 52, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 53, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 53, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 87, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 87, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 90, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 90, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 94, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 94, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 123, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 123, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.LostMC, 1, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 1, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 2, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 2, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 7, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 15, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 29, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 29, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 30, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 30, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 31, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 37, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 37, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 36, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 36, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 83, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 83, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 84, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 93, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.LostMC, 93, 1, Component.Accessories, true);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 12, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 12, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 12, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 12, 6, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 12, 7, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 126, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 14, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 127, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 127, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 127, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 191, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 191, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 230, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Grove, 230, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Grove, 0, 2, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 1, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 121, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 120, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 5, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.Grove, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.Grove, 120, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.Grove, 5, 7, Component.Body, true);

ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 12, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 12, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 12, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Ballas, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Ballas, 12, 7, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Ballas, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 12, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 12, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 12, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 12, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 12, 7, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Vagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Vagos, 12, 11, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Vagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 12, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 12, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 12, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 12, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Bloods, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.Bloods, 12, 7, Component.Torso, false);
ServerClothes.addClothes(TeamIds.Bloods, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LSPD, 17, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LSPD, 49, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LSPD, 131, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.LSPD, 18, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.LSPD, 42, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.LSPD, 161, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.LSPD, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.LSPD, 230, 6, Component.Torso, false);
ServerClothes.addClothes(TeamIds.LSPD, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.Grove, 7, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 7, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.Grove, 7, 6, Component.Legs, false);

ServerClothes.addClothes(TeamIds.LSPD, 110, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 125, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 126, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 129, 1, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 129, 0, Component.Bandana, false);
ServerClothes.addClothes(TeamIds.LSPD, 110, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 125, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 126, 0, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 129, 1, Component.Bandana, true);
ServerClothes.addClothes(TeamIds.LSPD, 129, 0, Component.Bandana, true);


ServerClothes.addProp(TeamIds.Grove, 8, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 2, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 3, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 3, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 4, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 4, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 5, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 12, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 12, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 14, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 14, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 14, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 14, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 20, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 20, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 28, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 28, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 44, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 44, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 45, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 45, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 45, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 54, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 55, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 55, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 55, 10, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 55, 14, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 56, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 56, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 63, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 63, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 63, 8, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 65, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 66, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 77, 7, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 94, 9, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 96, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 96, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 96, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 102, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 102, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 104, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 104, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 104, 18, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 120, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 120, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Grove, 120, 8, Component.Hat, false);

ServerClothes.addProp(TeamIds.Ballas, 8, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 2, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 4, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 4, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 5, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 14, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 14, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 14, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 28, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 45, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 45, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 44, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 54, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 55, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 55, 17, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 55, 18, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 56, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 56, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 56, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 66, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 96, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 96, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 96, 15, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 110, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 109, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 120, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 120, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 120, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Ballas, 120, 24, Component.Hat, false);

ServerClothes.addProp(TeamIds.Vagos, 8, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 2, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 2, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 4, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 4, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 5, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 5, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 14, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 14, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 14, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 20, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 28, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 44, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 45, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 55, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 55, 7, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 55, 9, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 55, 10, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 55, 22, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 56, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 56, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 63, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 63, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 63, 8, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 63, 9, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 77, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 76, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 83, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 94, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 94, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 94, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 94, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 96, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 96, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 103, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 103, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 104, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 104, 10, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 106, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 120, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 120, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 120, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 120, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Vagos, 120, 10, Component.Hat, false);

ServerClothes.addProp(TeamIds.Bloods, 8, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 4, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 4, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 5, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 5, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 2, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 2, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 2, 7, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 14, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 14, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 14, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 20, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 28, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 44, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 45, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 45, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 44, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 55, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 55, 8, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 55, 10, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 55, 11, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 55, 20, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 56, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 63, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 66, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 76, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 76, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 94, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 94, 7, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 96, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 96, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 96, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 102, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 103, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 104, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.Bloods, 120, 4, Component.Hat, false);

ServerClothes.addProp(TeamIds.LostMC, 8, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 5, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 13, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 13, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 13, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 14, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 53, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 52, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 66, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 67, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 67, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 67, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 84, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 84, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 84, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 84, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 84, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 84, 7, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 84, 8, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 89, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.LostMC, 90, 0, Component.Hat, false);

ServerClothes.addProp(TeamIds.LSPD, 8, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.Hitman, 8, 0, Component.Hat, false);

ServerClothes.addProp(TeamIds.Grove, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.LSPD, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Hitman, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.LostMC, 57, 0, Component.Hat, true);



ServerClothes.addProp(TeamIds.Bloods, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 4, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 4, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 4, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 5, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 9, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 12, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 12, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 28, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 29, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 43, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 44, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 43, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 44, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 53, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 55, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 55, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 55, 13, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 55, 14, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 55, 24, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 2, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 61, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 61, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 61, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 61, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 63, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 63, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 63, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 63, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 75, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 76, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 75, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 76, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 95, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 95, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 108, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 109, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 108, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 109, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 108, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 109, 10, Component.Hat, true);


ServerClothes.addProp(TeamIds.Bloods, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 4, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 4, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 4, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 5, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 9, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 12, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 12, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 28, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 29, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 43, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 44, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 43, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 44, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 53, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 55, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 55, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 55, 13, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 55, 14, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 55, 24, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 2, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 56, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 61, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 61, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 61, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 61, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 63, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 63, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 63, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 63, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 75, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 76, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 75, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 76, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 95, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 95, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 108, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 109, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 108, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 109, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 108, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.Bloods, 109, 10, Component.Hat, true);



ServerClothes.addProp(TeamIds.Vagos, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 4, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 4, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 4, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 5, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 9, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 12, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 12, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 28, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 29, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 43, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 44, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 43, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 44, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 53, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 55, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 55, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 55, 13, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 55, 14, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 55, 24, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 56, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 56, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 56, 2, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 56, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 56, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 56, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 56, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 56, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 56, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 61, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 61, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 61, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 61, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 63, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 63, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 63, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 63, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 75, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 76, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 75, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 76, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 95, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 95, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 108, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 109, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 108, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 109, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 108, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.Vagos, 109, 10, Component.Hat, true);

ServerClothes.addProp(TeamIds.Ballas, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 4, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 4, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 4, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 5, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 9, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 12, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 12, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 28, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 29, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 43, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 44, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 43, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 44, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 53, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 55, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 55, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 55, 13, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 55, 14, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 55, 24, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 56, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 56, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 56, 2, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 56, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 56, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 56, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 56, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 56, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 56, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 61, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 61, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 61, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 61, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 63, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 63, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 63, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 63, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 75, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 76, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 75, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 76, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 95, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 95, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 108, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 109, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 108, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 109, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 108, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.Ballas, 109, 10, Component.Hat, true);


ServerClothes.addProp(TeamIds.Grove, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 4, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 4, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 4, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 5, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 9, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 12, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 12, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 28, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 29, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 43, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 44, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 43, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 44, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 53, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 55, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 55, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 55, 13, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 55, 14, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 55, 24, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 56, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 56, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 56, 2, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 56, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 56, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 56, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 56, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 56, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 56, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 61, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 61, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 61, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 61, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 63, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 63, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 63, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 63, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 75, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 76, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 75, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 76, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 95, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 95, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 108, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 109, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 108, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 109, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 108, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.Grove, 109, 10, Component.Hat, true);

ServerClothes.addProp(TeamIds.Hitman, 109, 10, Component.Hat, true);

ServerClothes.addProp(TeamIds.LSPD, 109, 10, Component.Hat, true);


ServerClothes.addProp(TeamIds.RealVagos, 8, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 2, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 3, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 3, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 4, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 4, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 5, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 12, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 12, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 14, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 14, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 14, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 14, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 20, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 20, 5, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 28, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 28, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 44, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 44, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 45, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 45, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 45, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 54, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 55, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 55, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 55, 10, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 55, 14, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 56, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 56, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 63, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 63, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 63, 8, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 65, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 66, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 77, 7, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 94, 9, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 96, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 96, 4, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 96, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 102, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 102, 1, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 104, 2, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 104, 6, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 104, 18, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 120, 0, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 120, 3, Component.Hat, false);
ServerClothes.addProp(TeamIds.RealVagos, 120, 8, Component.Hat, false);




ServerClothes.addClothes(TeamIds.RealVagos, 23, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.RealVagos, 23, 2, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.RealVagos, 22, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.RealVagos, 86, 1, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Accessories, true);
ServerClothes.addClothes(TeamIds.RealVagos, 42, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 42, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 49, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 49, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 50, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 50, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 51, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 52, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 52, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 53, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 53, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 87, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 87, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 90, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 90, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 94, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 94, 1, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 123, 0, Component.Accessories, false);
ServerClothes.addClothes(TeamIds.RealVagos, 123, 1, Component.Accessories, false);


ServerClothes.addClothes(TeamIds.RealVagos, 19, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 3, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 19, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 3, 8, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 11, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 7, 8, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 12, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 12, 9, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 12, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 41, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 44, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 68, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 14, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 69, 5, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 14, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 78, 13, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 82, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 83, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 87, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 88, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 118, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 126, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 127, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 127, 8, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 127, 12, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 128, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 135, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 143, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 144, 1, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 188, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 189, 2, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 251, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, false);
ServerClothes.addClothes(TeamIds.RealVagos, 253, 0, Component.Torso, false);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, false);


ServerClothes.addClothes(TeamIds.RealVagos, 1, 1, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 3, 8, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 5, 8, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 7, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 8, 3, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 16, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 17, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 26, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 27, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 33, 0, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 42, 5, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 54, 2, Component.Legs, false);
ServerClothes.addClothes(TeamIds.RealVagos, 94, 0, Component.Legs, false);


ServerClothes.addClothes(TeamIds.RealVagos, 1, 14, Component.Foots, false);
ServerClothes.addClothes(TeamIds.RealVagos, 4, 1, Component.Foots, false);
ServerClothes.addClothes(TeamIds.RealVagos, 6, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.RealVagos, 7, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.RealVagos, 9, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.RealVagos, 14, 2, Component.Foots, false);
ServerClothes.addClothes(TeamIds.RealVagos, 16, 8, Component.Foots, false);
ServerClothes.addClothes(TeamIds.RealVagos, 22, 3, Component.Foots, false);
ServerClothes.addClothes(TeamIds.RealVagos, 31, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.RealVagos, 49, 0, Component.Foots, false);
ServerClothes.addClothes(TeamIds.RealVagos, 55, 0, Component.Foots, false);



ServerClothes.addProp(TeamIds.RealVagos, 57, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 4, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 4, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 4, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 5, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 9, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 12, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 12, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 28, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 29, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 43, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 44, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 43, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 44, 4, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 53, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 55, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 55, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 55, 13, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 55, 14, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 55, 24, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 56, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 56, 1, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 56, 2, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 56, 3, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 56, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 56, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 56, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 56, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 56, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 61, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 61, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 61, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 61, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 63, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 63, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 63, 8, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 63, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 75, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 76, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 75, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 76, 9, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 95, 0, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 95, 6, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 108, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 109, 5, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 108, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 109, 7, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 108, 10, Component.Hat, true);
ServerClothes.addProp(TeamIds.RealVagos, 109, 10, Component.Hat, true);


ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 9, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 13, 15, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 4, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 14, 11, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 35, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 0, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 2, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 38, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 3, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 61, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 62, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 63, 5, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 68, 11, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 75, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 15, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 9, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 76, 0, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 8, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 9, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 81, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 8, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 120, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 120, 4, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 120, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 120, 15, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 121, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 121, 4, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 121, 10, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 6, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 121, 15, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 125, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 140, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 190, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 191, 2, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 272, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 5, 0, Component.Arms, true);
ServerClothes.addClothes(TeamIds.RealVagos, 271, 1, Component.Torso, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Body, true);

ServerClothes.addClothes(TeamIds.RealVagos, 4, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.RealVagos, 25, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.RealVagos, 44, 3, Component.Legs, true);
ServerClothes.addClothes(TeamIds.RealVagos, 61, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.RealVagos, 67, 1, Component.Legs, true);
ServerClothes.addClothes(TeamIds.RealVagos, 104, 9, Component.Legs, true);
ServerClothes.addClothes(TeamIds.RealVagos, 112, 1, Component.Legs, true);


ServerClothes.addClothes(TeamIds.RealVagos, 1, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.RealVagos, 1, 1, Component.Foots, true);
ServerClothes.addClothes(TeamIds.RealVagos, 7, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.RealVagos, 10, 3, Component.Foots, true);
ServerClothes.addClothes(TeamIds.RealVagos, 11, 2, Component.Foots, true);
ServerClothes.addClothes(TeamIds.RealVagos, 28, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.RealVagos, 32, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.RealVagos, 33, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.RealVagos, 43, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.RealVagos, 44, 0, Component.Foots, true);
ServerClothes.addClothes(TeamIds.RealVagos, 50, 0, Component.Foots, true);

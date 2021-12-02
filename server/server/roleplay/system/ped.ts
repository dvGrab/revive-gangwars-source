import { Player } from "../account/player";

class Peds {
    name: string;
    hash: string;
    following: Player | undefined;

    constructor(name: string, hash: string) {
        this.name = name;
        this.hash = hash;
    }
}

class PedManager {

    list: Peds[] = [];

    add(pedname: string, model: string) {
        this.list.push(new Peds(pedname, model));

        console.log(this.list);
    }

    create(player: Player, pedname: string) {
        var position = player.position;

        var ped = this.list.find(element => element.name == pedname);

        if (ped)
        {
            player.call("client:PedCreate", [ped.name, ped.hash, position.x, position.y, position.z]);
        }
            
    }

    followPlayer(player: Player, pedname: string) {
        var ped = this.list.find(element => element.name == pedname);

        if (ped) {
            if (mp.players.exists(player)) {
                ped.following = player;
                player.call("client:PedFollow", [pedname]);
            }
        }
    }

    moveTo(player : Player, pedname : string, x : number, y : number, z : number)
    {
        var ped = this.list.find(element => element.name == pedname);

        if(ped)
            player.call("client:PedMoveTo", [pedname, x, y, z]);
    }
}



var Ped = new PedManager();

mp.events.add(RageEnums.EventKey.PLAYER_READY, (player: Player) => {

    Ped.list.forEach((element: Peds) => {
        Ped.create(player, element.name);
    });

});

mp.events.addCommand("follow", (player: Player, fullText: string) => {

    Ped.add(fullText, "a_c_husky");

    mp.players.forEach((element: Player) => {

        Ped.create(element, fullText);

    });

});

mp.events.addCommand("followme", (player : Player, full : string) => {

    Ped.followPlayer(player, full);

});

mp.events.add("server:PedMoveTo", (player : Player, pedname : string, x : number, y : number,  z : number) => {

    mp.players.forEach((element : Player) =>{
        Ped.moveTo(element, pedname, x, y, z);
    });
});